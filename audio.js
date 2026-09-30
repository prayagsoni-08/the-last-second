/* =====================================================
   THE LAST SECOND — audio.js

   Add this AFTER script.js in index.html:
       <script src="script.js"></script>
       <script src="audio.js"></script>

   Expected files (in a "sounds" folder next to index.html):
       rain.mp3     loops on the school screen
       click.mp3    every button press
       tension.mp3  opening screens, then hallway + challenges,
                    then the Psycho ending scene and leaderboard
       final.mp3    starts when the player presses START on the
                    final challenge and stops at STOP

   Volumes were set from the loudness of your actual files.
   ===================================================== */

(function () {

    // ---------- SETTINGS ----------

    // 0 = silent, 1 = full volume
    const VOLUME = {
        rain: 0.7,          // quiet, soft file
        click: 0.35,
        tension: 0.2,       // very loud file, so it needs a low number
        final: 0.5
    };

    // Seconds of overlap when a long loop restarts.
    // Your rain and tension files fade out at the end and get quieter
    // or louder over time, so a plain loop would dip or jump.
    // 0 = normal loop.
    const CROSSFADE = {
        rain: 4,
        tension: 3,
        final: 0
    };

    // Which screens play which looping sound.
    // Tension plays on the title, character and name screens, stops for
    // the rain at the school, then returns in the hallway and keeps
    // playing (without restarting) until START is pressed on the final
    // challenge, where final.mp3 takes over. Tension comes
    // back again for the Psycho ending scene and the leaderboard.
    // Screens not listed here are silent.
    const LOOP_FOR_SCREEN = {
        // Opening screens
        "start-screen": "tension",
        "character-screen": "tension",
        "name-screen": "tension",

        "school-screen": "rain",

        "hallway-screen": "tension",
        "psycho-screen": "tension",
        "memory-screen": "tension",
        "memory-result-screen": "tension",
        "word-screen": "tension",
        "word-result-screen": "tension",
        "observation-screen": "tension",
        "observation-result-screen": "tension",
        "logic-screen": "tension",
        "logic-result-screen": "tension",
        "pattern-screen": "tension",
        "pattern-result-screen": "tension",

        // Tension keeps playing here until the player presses START.
        // final.mp3 takes over at that click (see the click handler).
        "final-screen": "tension",

        // After the final challenge: Psycho ending scene and leaderboard
        // (the Psycho scene above already covers the ending dialogue)
        "leaderboard-screen": "tension"
    };

    const FADE_MS = 800;

    // ---------- MUTE STATE (remembered between visits) ----------

    let muted = false;

    try {
        muted = localStorage.getItem("last-second-muted") === "1";
    } catch (e) { /* storage blocked: stay unmuted */ }

    // ---------- FADING ----------

    const fades = new Map();

    function fadeTo(audio, target, ms, then) {

        clearInterval(fades.get(audio));

        const start = audio.volume;
        const steps = Math.max(1, Math.round(ms / 40));
        let step = 0;

        const id = setInterval(function () {

            step++;

            audio.volume = Math.min(1, Math.max(0,
                start + (target - start) * (step / steps)));

            if (step >= steps) {
                clearInterval(id);
                if (then) then();
            }

        }, ms / steps);

        fades.set(audio, id);
    }

    // ---------- LOOPING SOUNDS ----------

    function createLoop(name) {

        const xf = CROSSFADE[name] || 0;

        function makeAudio() {
            const audio = new Audio("sounds/" + name + ".mp3");
            audio.preload = "auto";
            audio.volume = 0;
            audio.loop = (xf === 0);
            return audio;
        }

        // Crossfading loops use two copies that take turns
        const tracks = [makeAudio()];
        if (xf > 0) tracks.push(makeAudio());

        let active = 0;
        let watcher = null;

        function watchForEnd() {

            clearInterval(watcher);

            if (xf === 0) return;

            watcher = setInterval(function () {

                const current = tracks[active];

                if (!isFinite(current.duration) ||
                    current.duration <= xf * 2) return;

                if (current.currentTime >= current.duration - xf) {

                    const next = tracks[1 - active];

                    next.currentTime = 0;
                    next.play().catch(function () {});

                    fadeTo(next, VOLUME[name], xf * 1000);

                    fadeTo(current, 0, xf * 1000, function () {
                        current.pause();
                    });

                    active = 1 - active;
                }

            }, 100);
        }

        return {

            start: function () {

                if (muted) return;

                const current = tracks[active];

                current.play().catch(function () {
                    // Blocked until the first click — handled below
                });

                fadeTo(current, VOLUME[name], FADE_MS);

                watchForEnd();
            },

            stop: function () {

                clearInterval(watcher);

                tracks.forEach(function (track) {
                    fadeTo(track, 0, FADE_MS, function () {
                        track.pause();
                        track.currentTime = 0;
                    });
                });

                active = 0;
            },

            pauseNow: function () {

                clearInterval(watcher);

                tracks.forEach(function (track) {
                    clearInterval(fades.get(track));
                    track.pause();
                });
            }
        };
    }

    const loops = {
        rain: createLoop("rain"),
        tension: createLoop("tension"),
        final: createLoop("final")
    };

    // ---------- ONE-SHOT SOUNDS ----------

    function loadOnce(name) {
        const audio = new Audio("sounds/" + name + ".mp3");
        audio.preload = "auto";
        return audio;
    }

    const clickSound = loadOnce("click");

    function playOnce(audio, name) {

        if (muted) return;

        audio.volume = VOLUME[name];
        audio.currentTime = 0;
        audio.play().catch(function () {});
    }

    // ---------- WATCH THE VISIBLE SCREEN ----------

    const screens = Array.from(
        document.querySelectorAll("#game > section")
    );

    let currentScreen = null;
    let lastScreen = null;
    let currentLoop = null;
    let unlocked = false;

    function visibleScreen() {

        return screens.find(function (screen) {
            return getComputedStyle(screen).display !== "none";
        }) || null;
    }

    function loopFor(id) {
        return LOOP_FOR_SCREEN[id] || null;
    }

    function switchLoop(wanted) {

        if (wanted === currentLoop) return;

        if (currentLoop) loops[currentLoop].stop();

        currentLoop = wanted;

        if (wanted && unlocked) loops[wanted].start();
    }

    function syncAudio() {

        const screen = visibleScreen();

        // Between screens nothing is visible for a moment: ignore it
        if (!screen) return;

        const id = screen.id;

        if (id === currentScreen) return;

        lastScreen = currentScreen;
        currentScreen = id;

        switchLoop(loopFor(id));
    }

    // script.js hides the old screen and shows the new one in
    // separate steps, so wait one frame before checking
    let pending = false;

    const observer = new MutationObserver(function () {

        if (pending) return;

        pending = true;

        requestAnimationFrame(function () {
            pending = false;
            syncAudio();
        });
    });

    screens.forEach(function (screen) {
        observer.observe(screen, {
            attributes: true,
            attributeFilter: ["style"]
        });
    });

    // ---------- CLICKS + FIRST-CLICK UNLOCK ----------

    document.addEventListener("click", function (event) {

        // Browsers only allow sound after a click
        if (!unlocked) {
            unlocked = true;
            if (currentLoop) loops[currentLoop].start();
        }

        if (event.target.closest("button") &&
            event.target.id !== "mute-btn") {
            playOnce(clickSound, "click");
        }

        // START on the final challenge: swap tension for final.mp3
        if (event.target.closest("#final-start")) {
            switchLoop("final");
        }

        // STOP on the final challenge: final.mp3 stops, silence until
        // the next screen (Psycho scene) brings tension back
        if (event.target.closest("#final-stop")) {
            switchLoop(null);
        }

    }, true);

    // ---------- MUTE BUTTON ----------

    const muteBtn = document.createElement("button");

    muteBtn.id = "mute-btn";
    muteBtn.type = "button";

    muteBtn.style.cssText =
        "position:fixed; bottom:0.9rem; right:0.9rem; z-index:20;" +
        "margin:0; padding:0.4em 1em; font-size:0.9rem;" +
        "color:var(--chalk-dim); border-color:var(--board-line);" +
        "background:rgba(14,23,20,0.85);";

    function updateMuteLabel() {
        muteBtn.textContent = muted ? "SOUND OFF" : "SOUND ON";
        muteBtn.setAttribute("aria-pressed", String(muted));
    }

    muteBtn.addEventListener("click", function () {

        muted = !muted;

        try {
            localStorage.setItem("last-second-muted", muted ? "1" : "0");
        } catch (e) { /* ignore */ }

        if (muted) {
            Object.keys(loops).forEach(function (name) {
                loops[name].pauseNow();
            });
        } else if (currentLoop && unlocked) {
            loops[currentLoop].start();
        }

        updateMuteLabel();
    });

    updateMuteLabel();
    document.body.appendChild(muteBtn);

    // ---------- START ----------

    syncAudio();

})();
