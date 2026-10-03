
// =====================================================
// THE LAST SECOND — script.js
//
// Story:   title -> character -> name -> school -> hallway
//          -> (Psycho intro, first time only) -> THE BOARD
// Board:   five challenges, each unlocked by the one before,
//          then the final test. Progress is saved on this device.
// =====================================================

const SUPABASE_URL = "https://ovrqybbmrhzfsglwchoc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_COGRe74WATPeKdJ72_NrUw_fK6AlowZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// ---------- SMALL HELPERS ----------

const $ = function (id) { return document.getElementById(id); };

function sleep(ms) {
    return new Promise(function (resolve) { setTimeout(resolve, ms); });
}

function randInt(n) { return Math.floor(Math.random() * n); }

function pick(list) { return list[randInt(list.length)]; }

function shuffled(list) {
    const copy = list.slice();
    for (let i = copy.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        const t = copy[i]; copy[i] = copy[j]; copy[j] = t;
    }
    return copy;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

// ---------- ELEMENTS ----------

const screens = Array.from(document.querySelectorAll("#game > section"));

const restartGameBtn = $("restart-game-btn");
const restartConfirm = $("restart-confirm");

const psychoScreen = $("psycho-screen");
const psychoText = $("psycho-text");
const psychoName = $("psycho-name");
const psychoNext = $("psycho-next");
const psychoSkip = $("psycho-skip");
const psychoActions = $("psycho-actions");

const finalMessage = $("final-message");
const finalTarget = $("final-target");
const finalTimer = $("final-timer");
const finalStart = $("final-start");
const finalStop = $("final-stop");

// ---------- SCREENS ----------

let topMode = null;   // "levels" | "menu" | null

function setTopButton(mode) {

    topMode = mode;

    if (mode === null) {
        restartGameBtn.style.display = "none";
        return;
    }

    restartGameBtn.textContent = mode === "levels" ? "LEVELS" : "MENU";
    restartGameBtn.style.display = "block";
}

function showScreen(id) {

    screens.forEach(function (screen) {
        screen.style.display = screen.id === id ? "block" : "none";
    });

    window.scrollTo(0, 0);
}

// =====================================================
// SAVED PROGRESS (this device)
// =====================================================

const SAVE_KEY = "lastSecond.save.v1";

function emptySave() {
    return {
        name: "",
        gender: "",
        introSeen: false,
        twistSeen: false,
        levels: {},        // cleared: { time, missed? }
        spent: {},         // seconds already spent on a level not yet cleared
        finalDone: false,
        finalAccuracy: null,
        scoreSaved: false
    };
}

function loadSave() {

    try {
        const raw = localStorage.getItem(SAVE_KEY);

        if (!raw) return null;

        const data = JSON.parse(raw);

        if (!data || typeof data.name !== "string" || data.name === "") {
            return null;
        }

        return Object.assign(emptySave(), data);

    } catch (error) {
        return null;
    }
}

let save = loadSave();

function persist() {

    try {
        if (save) localStorage.setItem(SAVE_KEY, JSON.stringify(save));
    } catch (error) { /* storage blocked: the game still works */ }
}

function forgetPlayer() {

    save = null;

    try { localStorage.removeItem(SAVE_KEY); } catch (error) { /* ignore */ }
}

function isCleared(n) { return !!(save && save.levels[n]); }

function isUnlocked(n) { return n === 1 || isCleared(n - 1); }

function clearedCount() {

    let count = 0;

    for (let n = 1; n <= 5; n++) {
        if (isCleared(n)) count++;
    }

    return count;
}

function allFiveCleared() { return clearedCount() === 5; }

function totalTime() {

    let sum = 0;

    for (let n = 1; n <= 5; n++) {
        if (isCleared(n)) sum += save.levels[n].time;
    }

    return sum;
}

function totalMissed() {
    return isCleared(4) ? (save.levels[4].missed || 0) : 0;
}

// what the CONTINUE button should open: 1-5, 6 = final, 0 = all done
function nextTarget() {

    for (let n = 1; n <= 5; n++) {
        if (!isCleared(n)) return n;
    }

    return save.finalDone ? 0 : 6;
}

// =====================================================
// CONFIRM BOX (reset progress, new player)
// =====================================================

let confirmAction = null;

function askConfirm(title, text, yesLabel, onYes) {

    $("confirm-title").textContent = title;
    $("confirm-text").textContent = text;
    $("restart-confirm-btn").textContent = yesLabel;

    confirmAction = onYes;

    restartConfirm.style.display = "flex";

    // The safe choice has the focus
    $("restart-cancel-btn").focus();
}

$("restart-confirm-btn").addEventListener("click", function () {

    const action = confirmAction;

    confirmAction = null;

    restartConfirm.style.display = "none";

    if (action) action();
});

$("restart-cancel-btn").addEventListener("click", function () {

    confirmAction = null;

    restartConfirm.style.display = "none";
});

// =====================================================
// TITLE, CHARACTER, NAME, SCHOOL, HALLWAY
// =====================================================

const DEFAULT_BRIEFING =
    "Someone called you intelligent. Five challenges, each with " +
    "its own clock. Your time is being recorded.";

let pendingGender = "";

function refreshStartScreen() {

    if (save) {

        $("start-btn-label").textContent = "CONTINUE";

        $("new-player-btn").hidden = false;

        $("briefing-text").textContent =
            "Welcome back, " + save.name + ". " +
            clearedCount() + " of 5 challenges cleared.";

    } else {

        $("start-btn-label").textContent = "START GAME";

        $("new-player-btn").hidden = true;

        $("briefing-text").textContent = DEFAULT_BRIEFING;
    }
}

function goTitle() {

    stopLevel();

    clearInterval(finalTimerInterval);

    showScreen("start-screen");

    setTopButton(null);

    refreshStartScreen();
}

$("start-btn").addEventListener("click", function () {

    if (save) {
        openLevels();
        return;
    }

    showScreen("character-screen");
});

$("new-player-btn").addEventListener("click", function () {

    askConfirm(
        "NEW PLAYER?",
        "This removes " + save.name + "'s saved progress from this device.",
        "YES, START OVER",
        function () {
            forgetPlayer();
            refreshStartScreen();
            showScreen("character-screen");
        }
    );
});

$("boy-btn").addEventListener("click", function () {
    pendingGender = "boy";
    showScreen("name-screen");
    $("player-name").focus();
});

$("girl-btn").addEventListener("click", function () {
    pendingGender = "girl";
    showScreen("name-screen");
    $("player-name").focus();
});

$("continue-btn").addEventListener("click", function () {

    const name = $("player-name").value.trim();

    if (name === "") {
        $("name-error").textContent = "Please enter your name.";
        return;
    }

    $("name-error").textContent = "";

    save = emptySave();
    save.name = name;
    save.gender = pendingGender || "boy";
    persist();

    showScreen("school-screen");
});

$("enter-school-btn").addEventListener("click", function () {
    showScreen("hallway-screen");
});

$("hallway-continue").addEventListener("click", function () {

    if (save && !save.introSeen) {

        showScreen("psycho-screen");

        startPsychoDialogue();

    } else {

        openLevels();
    }
});

// =====================================================
// PSYCHO DIALOGUE
// =====================================================

let dialogues = [];
let dialogueIndex = 0;
let dialogueTyping = null;
let psychoMode = "intro";   // "intro" | "twist" | "ending"

function startPsychoDialogue() {

    psychoMode = "intro";

    setTopButton(null);

    psychoName.textContent = "PSYCHO";

    dialogues = [
        "Good evening, " + (save ? save.name : "Stranger") + ".",
        "Do you know why you're here?",
        "You were chosen because someone called you intelligent.",
        "But intelligence is easy to measure.",
        "Let's see how useful it really is.",
        "There will be five challenges.",
        "Every challenge will have its own clock.",
        "Your time will be recorded.",
        "Finish all five challenges...",
        "and you will be free."
    ];

    dialogueIndex = 0;

    showDialogue(dialogues[dialogueIndex]);
}

function startTwistDialogue() {

    psychoMode = "twist";

    showScreen("psycho-screen");

    setTopButton(null);

    psychoName.textContent = "PSYCHO";

    dialogues = [
        "You made it.",
        "All five challenges.",
        "You probably thought this was the end.",
        "I told you the first person to finish would be released.",
        "That was the first lie.",
        "There was never a first place.",
        "There was never a second place.",
        "There was only one final test.",
        "And this one isn't about intelligence.",
        "It's about time.",
        "Let's see how well you can control it."
    ];

    dialogueIndex = 0;

    showDialogue(dialogues[dialogueIndex]);
}

function startLoseEnding() {

    psychoMode = "ending";

    showScreen("psycho-screen");

    setTopButton(null);

    psychoName.textContent = "PSYCHO";

    dialogues = [
        "You missed.",
        "But... I understand.",
        "You know what that feels like, don't you?",
        "Being almost good enough.",
        "Being a little too slow.",
        "They used to laugh at me for the same thing.",
        "They called me useless.",
        "Maybe that's why I chose you.",
        "Because you're like me.",
        "Maybe you were never supposed to win."
    ];

    dialogueIndex = 0;

    showDialogue(dialogues[dialogueIndex]);
}

function startWinEnding() {

    psychoMode = "ending";

    showScreen("psycho-screen");

    setTopButton(null);

    psychoName.textContent = "PSYCHO";

    dialogues = [
        "You did it.",
        "You actually hit the target.",
        "Perfect.",
        "Do you know what I hate about people like you?",
        "You make it look easy.",
        "You succeed where I failed.",
        "You remind me of everything I could never become.",
        "I don't want to watch you walk away.",
        "So congratulations.",
        "You won the game.",
        "But you don't get to leave."
    ];

    dialogueIndex = 0;

    showDialogue(dialogues[dialogueIndex]);
}

// The last line of the opening scene opens the board
function updatePsychoButton() {

    const isIntro = psychoMode === "intro";

    const isLastLine = dialogueIndex === dialogues.length - 1;

    psychoNext.textContent =
        isIntro && isLastLine ? "OPEN THE BOARD" : "CONTINUE";

    psychoActions.classList.toggle("centered", isIntro && isLastLine);

    // Nothing left to skip on the last line
    psychoSkip.style.display = isLastLine ? "none" : "";
}

function showDialogue(dialogue) {

    if (dialogueTyping !== null) {
        clearInterval(dialogueTyping);
        dialogueTyping = null;
    }

    psychoText.textContent = "";

    psychoNext.classList.remove("visible");

    updatePsychoButton();

    let index = 0;

    dialogueTyping = setInterval(function () {

        psychoText.textContent += dialogue[index];

        index++;

        if (index >= dialogue.length) {

            clearInterval(dialogueTyping);

            dialogueTyping = null;

            psychoNext.classList.add("visible");
        }

    }, 45);
}

// Show the whole current line at once
function finishDialogueTyping() {

    if (dialogueTyping === null) return false;

    clearInterval(dialogueTyping);

    dialogueTyping = null;

    psychoText.textContent = dialogues[dialogueIndex];

    psychoNext.classList.add("visible");

    return true;
}

// Jump straight to the last line of the scene
function skipDialogueScene() {

    if (dialogues.length === 0) return;

    if (dialogueTyping !== null) {
        clearInterval(dialogueTyping);
        dialogueTyping = null;
    }

    dialogueIndex = dialogues.length - 1;

    psychoText.textContent = dialogues[dialogueIndex];

    updatePsychoButton();

    psychoNext.classList.add("visible");
}

psychoSkip.addEventListener("click", skipDialogueScene);

// Tap / click the box while a line is typing to show it instantly
document.querySelector(".psycho-dialogue").addEventListener(
    "click",
    function (event) {

        if (event.target.closest("button")) return;

        finishDialogueTyping();
    }
);

psychoNext.addEventListener("click", function () {

    dialogueIndex++;

    if (dialogueIndex < dialogues.length) {

        showDialogue(dialogues[dialogueIndex]);

        return;
    }

    if (psychoMode === "ending") {

        openLeaderboard();

    } else if (psychoMode === "twist") {

        save.twistSeen = true;
        persist();

        startFinalChallenge();

    } else {

        save.introSeen = true;
        persist();

        openLevels();
    }
});

// =====================================================
// THE BOARD (level select)
// =====================================================

const LEVELS = [
    { n: 1, name: "ROBOTS", screen: "robots-screen" },
    { n: 2, name: "CARDS", screen: "cards-screen" },
    { n: 3, name: "PATTERN LOCK", screen: "lock-screen" },
    { n: 4, name: "REFLEX", screen: "grid-screen" },
    { n: 5, name: "TWO DOORS", screen: "doors-screen" }
];

const TILTS = [-2.2, 1.6, -1.2, 2, -1.8, 1];

function levelNote(text) {
    $("levels-note").textContent = text;
}

function cardHtml(label, name, state, meta) {

    const stateText =
        state === "locked" ? "LOCKED" :
        state === "cleared" ? "CLEARED" : "READY";

    return (
        '<i class="pin"></i>' +
        '<span class="level-no">' + label + '</span>' +
        '<span class="level-name">' + name + '</span>' +
        '<span class="level-state">' + stateText + '</span>' +
        '<span class="level-meta">' + meta + '</span>'
    );
}

function renderLevels() {

    const board = $("levels-board");

    board.innerHTML = "";

    LEVELS.forEach(function (level, index) {

        const state = isCleared(level.n) ? "cleared" :
            isUnlocked(level.n) ? "open" : "locked";

        let meta = "&nbsp;";

        if (state === "cleared") {

            const record = save.levels[level.n];

            meta = record.time.toFixed(2) + "s";

            if (level.n === 4) meta += " &middot; " + (record.missed || 0) + " missed";

        } else if (state === "open" && save.spent[level.n]) {

            meta = save.spent[level.n].toFixed(1) + "s so far";
        }

        const card = document.createElement("button");

        card.type = "button";
        card.className = "level-card is-" + state;
        card.dataset.level = String(level.n);
        card.style.setProperty("--tilt", TILTS[index % TILTS.length] + "deg");
        card.setAttribute("aria-disabled", state === "locked" ? "true" : "false");
        card.setAttribute("aria-label",
            "Challenge " + level.n + ", " + level.name + ", " + state);
        card.innerHTML = cardHtml("0" + level.n, level.name, state, meta);

        board.appendChild(card);
    });

    // The final test
    const finalState = save.finalDone ? "cleared" :
        allFiveCleared() ? "open" : "locked";

    const finalCard = document.createElement("button");

    finalCard.type = "button";
    finalCard.className = "level-card is-final is-" + finalState;
    finalCard.dataset.level = "6";
    finalCard.style.setProperty("--tilt", "-0.6deg");
    finalCard.setAttribute("aria-disabled", finalState === "locked" ? "true" : "false");
    finalCard.setAttribute("aria-label", "Final test, " + finalState);
    finalCard.innerHTML = cardHtml(
        "FINAL",
        "THE LAST SECOND",
        finalState,
        finalState === "cleared" && save.finalAccuracy !== null
            ? "ACCURACY " + Number(save.finalAccuracy).toFixed(2) + "s"
            : "&nbsp;"
    );

    board.appendChild(finalCard);

    // Left column
    $("levels-case").textContent = "CASE FILE \u00b7 " + save.name.toUpperCase();

    let summary =
        clearedCount() + " of 5 challenges cleared. Time so far: " +
        totalTime().toFixed(2) + "s.";

    if (isCleared(4)) summary += " Missed: " + totalMissed() + ".";

    $("levels-summary").textContent = summary;

    const target = nextTarget();

    $("levels-continue-label").textContent =
        target === 0 ? "LEADERBOARD" :
        target === 6 ? "THE FINAL TEST" :
        "CONTINUE \u00b7 CHALLENGE 0" + target;

    levelNote("");
}

function openLevels() {

    stopLevel();

    clearInterval(finalTimerInterval);

    showScreen("levels-screen");

    setTopButton("menu");

    renderLevels();
}

function openLevelCard(n) {

    if (n === 6) {

        if (!allFiveCleared()) {
            levelNote("Locked. Clear all five challenges first.");
        } else if (save.finalDone) {
            levelNote("The final test is done. Reset progress to play again.");
        } else {
            startFinalFlow();
        }

        return;
    }

    if (isCleared(n)) {
        levelNote("Challenge 0" + n + " is already cleared.");
        return;
    }

    if (!isUnlocked(n)) {
        levelNote("Locked. Clear challenge 0" + (n - 1) + " first.");
        return;
    }

    enterLevel(n);
}

$("levels-board").addEventListener("click", function (event) {

    const card = event.target.closest(".level-card");

    if (!card) return;

    openLevelCard(Number(card.dataset.level));
});

$("levels-continue").addEventListener("click", function () {

    const target = nextTarget();

    if (target === 0) {
        openLeaderboard();
    } else {
        openLevelCard(target);
    }
});

$("levels-reset").addEventListener("click", function () {

    askConfirm(
        "RESET PROGRESS?",
        "All cleared challenges and times will be erased. Your name is kept.",
        "YES, RESET",
        function () {

            save.levels = {};
            save.spent = {};
            save.finalDone = false;
            save.finalAccuracy = null;
            save.scoreSaved = false;
            save.twistSeen = false;
            persist();

            renderLevels();

            levelNote("Progress reset.");
        }
    );
});

$("levels-menu").addEventListener("click", goTitle);

restartGameBtn.addEventListener("click", function () {

    if (topMode === "levels") {
        openLevels();
    } else if (topMode === "menu") {
        goTitle();
    }
});

// =====================================================
// LEVEL ENGINE: clock, cleanup, completion
// =====================================================

let currentLevel = 0;
let runId = 0;                 // changes whenever a level is left
let activeCleanup = null;
let clockStart = null;
let liveTimer = null;

function startClock() {
    if (clockStart === null) clockStart = performance.now();
}

// Add the time of the running attempt to this level's total
function pauseClock() {

    if (clockStart === null || !save || !currentLevel) {
        clockStart = null;
        return;
    }

    const elapsed = (performance.now() - clockStart) / 1000;

    clockStart = null;

    if (currentLevel <= 5) {
        save.spent[currentLevel] =
            Number(((save.spent[currentLevel] || 0) + elapsed).toFixed(3));
        persist();
    }
}

function levelSeconds() {

    const base = save && currentLevel ? (save.spent[currentLevel] || 0) : 0;

    return base +
        (clockStart === null ? 0 : (performance.now() - clockStart) / 1000);
}

function startLive(elementId) {

    clearInterval(liveTimer);

    const element = $(elementId);

    function draw() {
        element.textContent = "TIME " + levelSeconds().toFixed(1);
    }

    draw();

    liveTimer = setInterval(draw, 100);
}

function stopLevel() {

    runId++;

    if (activeCleanup) {

        try { activeCleanup(); } catch (error) { /* ignore */ }

        activeCleanup = null;
    }

    pauseClock();

    clearInterval(liveTimer);

    currentLevel = 0;
}

function enterLevel(n) {

    stopLevel();

    currentLevel = n;

    showScreen(LEVELS[n - 1].screen);

    setTopButton("levels");

    const starters = [startRobots, startCards, startLock, startReflex, startDoors];

    starters[n - 1]();
}

function completeLevel(n, extra) {

    pauseClock();

    clearInterval(liveTimer);

    const time = Number((save.spent[n] || 0).toFixed(2));

    save.levels[n] = Object.assign({ time: time }, extra || {});

    delete save.spent[n];

    persist();

    showLevelResult(n);
}

const RESULT_MESSAGES = {
    1: "Every robot, down.",
    2: "You kept your eyes on it.",
    3: "Your hand remembered.",
    4: "Fast hands.",
    5: "You chose well."
};

let resultLevel = 0;

function showLevelResult(n) {

    resultLevel = n;

    // The clock is stopped, so leave the level but keep its results
    runId++;
    activeCleanup = null;
    currentLevel = 0;

    showScreen("level-result-screen");

    setTopButton("menu");

    const record = save.levels[n];

    $("level-result-label").textContent = "CHALLENGE 0" + n;
    $("level-result-message").textContent = RESULT_MESSAGES[n];
    $("level-result-time").textContent =
        "TIME: " + record.time.toFixed(2) + " SECONDS";
    $("level-result-extra").textContent =
        n === 4 ? "MISSED: " + (record.missed || 0) : "";

    $("level-result-next").textContent =
        n < 5 ? "START CHALLENGE 0" + (n + 1) : "THE FINAL TEST";
}

$("level-result-next").addEventListener("click", function () {

    if (resultLevel < 5) {
        enterLevel(resultLevel + 1);
    } else {
        startFinalFlow();
    }
});

$("level-result-levels").addEventListener("click", openLevels);

// 3, 2, 1 inside a container
async function runCountdown(id, container) {

    const overlay = document.createElement("div");

    overlay.className = "countdown";

    container.appendChild(overlay);

    const steps = ["3", "2", "1", "GO"];

    for (let i = 0; i < steps.length; i++) {

        overlay.textContent = steps[i];

        await sleep(i === steps.length - 1 ? 350 : 650);

        if (id !== runId) break;
    }

    overlay.remove();
}

// =====================================================
// CHALLENGE 1: ROBOTS
// Robots appear one at a time. Shoot each before it vanishes.
// Miss one and the challenge starts again (the clock keeps running).
// =====================================================

const ROBOTS_TOTAL = 12;

function spawnRobot(arena, visibleMs) {

    return new Promise(function (resolve) {

        const robot = document.createElement("button");

        robot.type = "button";
        robot.className = "robot";
        robot.setAttribute("aria-label", "Robot");
        robot.textContent = "\u{1F916}";
        robot.style.left = (10 + randInt(80)) + "%";
        robot.style.top = (14 + randInt(72)) + "%";

        let finished = false;

        const timeout = setTimeout(function () {

            if (finished) return;

            finished = true;

            robot.classList.add("escaped");

            setTimeout(function () { robot.remove(); }, 260);

            resolve(false);

        }, visibleMs);

        robot.addEventListener("click", function () {

            if (finished) return;

            finished = true;

            clearTimeout(timeout);

            robot.classList.add("shot");

            setTimeout(function () { robot.remove(); }, 240);

            resolve(true);
        });

        arena.appendChild(robot);
    });
}

async function robotsAttempt(id, arena, stat) {

    arena.innerHTML = "";

    stat.textContent = "SHOT 0 / " + ROBOTS_TOTAL;

    await runCountdown(id, arena);

    if (id !== runId) return false;

    startClock();

    for (let i = 0; i < ROBOTS_TOTAL; i++) {

        const visible = Math.max(800, 1450 - i * 55);

        const hit = await spawnRobot(arena, visible);

        if (id !== runId) return false;

        if (!hit) return false;

        stat.textContent = "SHOT " + (i + 1) + " / " + ROBOTS_TOTAL;

        await sleep(Math.max(180, 420 - i * 20));

        if (id !== runId) return false;
    }

    return true;
}

function startRobots() {

    const id = runId;

    const arena = $("robots-arena");
    const message = $("robots-message");
    const stat = $("robots-stat");

    message.textContent = "Shoot every robot before it disappears.";

    startLive("robots-time");

    activeCleanup = function () { arena.innerHTML = ""; };

    (async function loop() {

        while (id === runId) {

            const ok = await robotsAttempt(id, arena, stat);

            if (id !== runId) return;

            pauseClock();

            if (ok) {
                completeLevel(1);
                return;
            }

            message.textContent = "A ROBOT GOT AWAY. FROM THE TOP.";

            arena.classList.add("failed");

            await sleep(1600);

            arena.classList.remove("failed");

            message.textContent = "Shoot every robot before it disappears.";
        }

    })();
}

// =====================================================
// CHALLENGE 2: CARDS
// One card is shown, then shuffled with the others. Find it.
// =====================================================

const CARD_SYMBOLS = ["\u2660", "\u2665", "\u2666", "\u2663", "\u2605",
    "\u263E", "\u2600", "\u2726", "\u2691", "\u265E"];

const RED_SYMBOLS = ["\u2665", "\u2666", "\u2605"];

function buildCards(row, symbols) {

    row.innerHTML = "";

    return symbols.map(function (symbol, index) {

        const card = document.createElement("button");

        card.type = "button";
        card.className = "card" + (RED_SYMBOLS.indexOf(symbol) !== -1 ? " red" : "");
        card.dataset.id = String(index);
        card.setAttribute("aria-label", "Card");
        card.style.setProperty("--slot", String(index));
        card.innerHTML =
            '<span class="card-inner">' +
            '<span class="card-back"></span>' +
            '<span class="card-face">' + symbol + '</span>' +
            '</span>';

        row.appendChild(card);

        return card;
    });
}

async function cardsAttempt(id) {

    const row = $("cards-row");
    const message = $("cards-message");

    const symbols = shuffled(CARD_SYMBOLS).slice(0, 5);

    const cards = buildCards(row, symbols);

    const order = [0, 1, 2, 3, 4];          // order[slot] = card index

    const target = randInt(5);

    row.classList.add("locked");

    row.style.setProperty("--swap", "0.4s");

    message.textContent = "Remember this card.";

    startClock();

    await sleep(600);

    if (id !== runId) return null;

    cards[target].classList.add("flipped");

    await sleep(2600);

    if (id !== runId) return null;

    cards[target].classList.remove("flipped");

    await sleep(650);

    if (id !== runId) return null;

    message.textContent = "Watch closely...";

    for (let k = 0; k < 10; k++) {

        const ms = Math.round(430 - k * 22);

        row.style.setProperty("--swap", ms + "ms");

        const a = randInt(5);

        let b = randInt(5);

        while (b === a) b = randInt(5);

        const t = order[a]; order[a] = order[b]; order[b] = t;

        for (let slot = 0; slot < 5; slot++) {
            cards[order[slot]].style.setProperty("--slot", String(slot));
        }

        await sleep(ms + 70);

        if (id !== runId) return null;
    }

    message.textContent = "Which one was it?";

    row.classList.remove("locked");

    const chosen = await new Promise(function (resolve) {

        row.onclick = function (event) {

            const card = event.target.closest(".card");

            if (!card || row.classList.contains("locked")) return;

            row.classList.add("locked");

            resolve(Number(card.dataset.id));
        };
    });

    if (id !== runId) return null;

    cards[chosen].classList.add("flipped");

    if (chosen !== target) cards[target].classList.add("flipped", "reveal");

    pauseClock();

    await sleep(1200);

    return chosen === target;
}

function startCards() {

    const id = runId;

    const message = $("cards-message");
    const stat = $("cards-stat");

    startLive("cards-time");

    activeCleanup = function () {
        $("cards-row").onclick = null;
        $("cards-row").innerHTML = "";
    };

    (async function loop() {

        let attempt = 0;

        while (id === runId) {

            attempt++;

            stat.textContent = "ATTEMPT " + attempt;

            const ok = await cardsAttempt(id);

            if (id !== runId || ok === null) return;

            if (ok) {
                completeLevel(2);
                return;
            }

            message.textContent = "WRONG CARD. FROM THE TOP.";

            await sleep(900);
        }

    })();
}

// =====================================================
// CHALLENGE 3: PATTERN LOCK (3 x 3 dots, like a phone)
// =====================================================

const LOCK_POS = [17, 50, 83];       // dot centres, in percent
const LOCK_LENGTH = 5;
const LOCK_SECONDS = 9;

function lockMidpoint(a, b) {

    const ar = Math.floor(a / 3), ac = a % 3;
    const br = Math.floor(b / 3), bc = b % 3;

    const dr = Math.abs(ar - br);
    const dc = Math.abs(ac - bc);

    if ((dr === 0 || dr === 2) && (dc === 0 || dc === 2) && (dr + dc > 0)) {
        return ((ar + br) / 2) * 3 + (ac + bc) / 2;
    }

    return null;
}

// A random pattern where no jump passes over an unused dot,
// so the pattern is never ambiguous
function generatePattern(length) {

    while (true) {

        const sequence = [randInt(9)];

        while (sequence.length < length) {

            const last = sequence[sequence.length - 1];

            const options = [];

            for (let d = 0; d < 9; d++) {

                if (sequence.indexOf(d) !== -1) continue;

                const mid = lockMidpoint(last, d);

                if (mid !== null && sequence.indexOf(mid) === -1) continue;

                options.push(d);
            }

            if (options.length === 0) break;

            sequence.push(pick(options));
        }

        if (sequence.length === length) return sequence;
    }
}

function startLock() {

    const id = runId;

    const pad = $("lock-pad");
    const message = $("lock-message");
    const stat = $("lock-stat");
    const bar = $("lock-bar").firstElementChild;

    // build the pad
    let html = '<svg class="lock-lines" viewBox="0 0 100 100">' +
        '<polyline class="lock-line" points=""></polyline>' +
        '<line class="lock-live" x1="0" y1="0" x2="0" y2="0"></line></svg>';

    for (let i = 0; i < 9; i++) {
        html += '<span class="lock-dot" data-dot="' + i + '" style="left:' +
            LOCK_POS[i % 3] + '%;top:' + LOCK_POS[Math.floor(i / 3)] +
            '%"><b></b></span>';
    }

    pad.innerHTML = html;

    const dots = Array.from(pad.querySelectorAll(".lock-dot"));
    const polyline = pad.querySelector(".lock-line");
    const live = pad.querySelector(".lock-live");

    let expected = [];
    let path = [];
    let accepting = false;
    let dragging = false;
    let lastPoint = null;
    let finish = null;

    function center(i) {
        return { x: LOCK_POS[i % 3], y: LOCK_POS[Math.floor(i / 3)] };
    }

    function drawLine(list) {
        polyline.setAttribute("points", list.map(function (i) {
            const c = center(i);
            return c.x + "," + c.y;
        }).join(" "));
    }

    function clearDraw() {

        path = [];

        drawLine([]);

        live.setAttribute("x2", "0");
        live.setAttribute("y2", "0");
        live.setAttribute("x1", "0");
        live.setAttribute("y1", "0");

        dots.forEach(function (dot) {
            dot.classList.remove("on", "show", "good", "bad");
            dot.firstElementChild.textContent = "";
        });
    }

    function render() {

        dots.forEach(function (dot, i) {
            dot.classList.toggle("on", path.indexOf(i) !== -1);
        });

        drawLine(path);
    }

    function toPoint(event) {

        const rect = pad.getBoundingClientRect();

        return {
            x: (event.clientX - rect.left) / rect.width * 100,
            y: (event.clientY - rect.top) / rect.height * 100
        };
    }

    function dotAt(x, y) {

        for (let i = 0; i < 9; i++) {

            const c = center(i);

            if (Math.hypot(x - c.x, y - c.y) <= 12) return i;
        }

        return -1;
    }

    function addDot(d) {

        if (path.length > 0) {

            const mid = lockMidpoint(path[path.length - 1], d);

            if (mid !== null && path.indexOf(mid) === -1) path.push(mid);
        }

        path.push(d);

        render();

        if (path.length >= expected.length && finish) {
            finish(path.join(",") === expected.join(",") ? "ok" : "bad");
        }
    }

    function sample(from, to) {

        const distance = Math.hypot(to.x - from.x, to.y - from.y);

        const steps = Math.max(1, Math.ceil(distance / 3));

        for (let s = 0; s <= steps; s++) {

            if (!accepting) return;

            const x = from.x + (to.x - from.x) * s / steps;
            const y = from.y + (to.y - from.y) * s / steps;

            const d = dotAt(x, y);

            if (d !== -1 && path.indexOf(d) === -1) addDot(d);
        }
    }

    pad.onpointerdown = function (event) {

        if (!accepting) return;

        event.preventDefault();

        try { pad.setPointerCapture(event.pointerId); } catch (error) { /* ignore */ }

        dragging = true;

        lastPoint = toPoint(event);

        sample(lastPoint, lastPoint);
    };

    pad.onpointermove = function (event) {

        if (!accepting || !dragging) return;

        const point = toPoint(event);

        sample(lastPoint, point);

        lastPoint = point;

        if (path.length > 0) {

            const c = center(path[path.length - 1]);

            live.setAttribute("x1", c.x);
            live.setAttribute("y1", c.y);
            live.setAttribute("x2", point.x);
            live.setAttribute("y2", point.y);
        }
    };

    function endDrag() {

        dragging = false;

        live.setAttribute("x2", live.getAttribute("x1"));
        live.setAttribute("y2", live.getAttribute("y1"));
    }

    pad.onpointerup = endDrag;
    pad.onpointercancel = endDrag;

    $("lock-clear").onclick = function () {

        if (!accepting) return;

        path = [];

        render();
    };

    startLive("lock-time");

    let barTimer = null;

    activeCleanup = function () {

        accepting = false;

        clearTimeout(barTimer);

        pad.onpointerdown = null;
        pad.onpointermove = null;
        pad.onpointerup = null;
        pad.onpointercancel = null;

        $("lock-clear").onclick = null;

        pad.innerHTML = "";
    };

    function resetBar() {
        bar.style.transition = "none";
        bar.style.width = "100%";
    }

    async function attempt() {

        expected = generatePattern(LOCK_LENGTH);

        clearDraw();

        resetBar();

        message.textContent = "Watch the pattern.";

        startClock();

        await sleep(700);

        if (id !== runId) return null;

        // show the pattern one dot at a time
        for (let k = 0; k < expected.length; k++) {

            dots[expected[k]].classList.add("show");
            dots[expected[k]].firstElementChild.textContent = String(k + 1);

            drawLine(expected.slice(0, k + 1));

            await sleep(560);

            if (id !== runId) return null;
        }

        await sleep(1000);

        if (id !== runId) return null;

        clearDraw();

        message.textContent = "Now draw it. Go!";

        // time bar
        void bar.offsetWidth;

        bar.style.transition = "width " + LOCK_SECONDS + "s linear";
        bar.style.width = "0%";

        accepting = true;

        const result = await new Promise(function (resolve) {

            finish = resolve;

            barTimer = setTimeout(function () { resolve("timeout"); },
                LOCK_SECONDS * 1000);
        });

        clearTimeout(barTimer);

        finish = null;

        accepting = false;

        dragging = false;

        pauseClock();

        resetBar();

        if (id !== runId) return null;

        if (result === "ok") {

            dots.forEach(function (dot, i) {
                if (path.indexOf(i) !== -1) dot.classList.add("good");
            });

            await sleep(600);

            return true;
        }

        // wrong or too slow: show the right pattern
        message.textContent = result === "timeout" ? "TOO SLOW." : "NOT THAT ONE.";

        clearDraw();

        expected.forEach(function (d, k) {
            dots[d].classList.add("bad");
            dots[d].firstElementChild.textContent = String(k + 1);
        });

        drawLine(expected);

        await sleep(1500);

        return false;
    }

    (async function loop() {

        let attemptNo = 0;

        while (id === runId) {

            attemptNo++;

            stat.textContent = "ATTEMPT " + attemptNo;

            const ok = await attempt();

            if (id !== runId || ok === null) return;

            if (ok) {
                completeLevel(3);
                return;
            }
        }

    })();
}

// =====================================================
// CHALLENGE 4: REFLEX (a square glows, touch it)
// The squares glow faster and faster. Missed ones are counted.
// =====================================================

const REFLEX_ROUNDS = 20;

function startReflex() {

    const id = runId;

    const pad = $("grid-pad");
    const stat = $("grid-stat");

    pad.innerHTML = "";

    const tiles = [];

    for (let i = 0; i < 9; i++) {

        const tile = document.createElement("button");

        tile.type = "button";
        tile.className = "tile";
        tile.setAttribute("aria-label", "Square " + (i + 1));

        pad.appendChild(tile);

        tiles.push(tile);
    }

    startLive("grid-time");

    activeCleanup = function () { pad.innerHTML = ""; };

    let missed = 0;
    let glowing = -1;
    let hitResolve = null;

    pad.onclick = function (event) {

        const tile = event.target.closest(".tile");

        if (!tile) return;

        const index = tiles.indexOf(tile);

        if (index === glowing && hitResolve) {
            hitResolve(true);
        } else {
            tile.classList.remove("nope");
            void tile.offsetWidth;
            tile.classList.add("nope");
        }
    };

    function drawStat(round) {
        stat.textContent =
            "ROUND " + round + " / " + REFLEX_ROUNDS + " \u00b7 MISSED " + missed;
    }

    (async function run() {

        drawStat(0);

        await runCountdown(id, pad);

        if (id !== runId) return;

        startClock();

        let last = -1;

        for (let round = 0; round < REFLEX_ROUNDS; round++) {

            const progress = round / (REFLEX_ROUNDS - 1);

            const glowMs = Math.round(1150 - 700 * progress);
            const gapMs = Math.round(420 - 250 * progress);

            let index = randInt(9);

            while (index === last) index = randInt(9);

            last = index;

            drawStat(round + 1);

            const tile = tiles[index];

            tile.classList.add("glow");

            glowing = index;

            const hit = await new Promise(function (resolve) {

                hitResolve = resolve;

                setTimeout(function () { resolve(false); }, glowMs);
            });

            hitResolve = null;

            glowing = -1;

            if (id !== runId) return;

            tile.classList.remove("glow");

            if (hit) {
                tile.classList.add("hit");
            } else {
                missed++;
                tile.classList.add("miss");
            }

            drawStat(round + 1);

            setTimeout(function () {
                tile.classList.remove("hit", "miss");
            }, 260);

            await sleep(gapMs);

            if (id !== runId) return;
        }

        pauseClock();

        completeLevel(4, { missed: missed });

    })();
}

// =====================================================
// CHALLENGE 5: TWO DOORS
// One door leads out. The question tells you which.
// =====================================================

function otherSide(side) { return side === "left" ? "right" : "left"; }

const DOOR_PUZZLES = [

    // both signs lie
    function () {
        const exit = pick(["left", "right"]);
        const other = otherSide(exit);
        const plates = {};
        plates[exit] = "\u201CThe exit is behind the " + other + " door.\u201D";
        plates[other] = "\u201CThe exit is behind this door.\u201D";
        return { rule: "Both signs are lying.", question: "Which door leads out?",
            plates: plates, colors: null, answer: exit };
    },

    // one sign always lies, the other always tells the truth
    function () {
        const liar = pick(["left", "right"]);
        const truth = otherSide(liar);
        const plates = {};
        plates[liar] = "\u201CThe exit is behind this door.\u201D";
        plates[truth] = "\u201CThe " + liar + " sign is lying.\u201D";
        return { rule: "The " + liar + " sign always lies. The " + truth +
            " sign always tells the truth.", question: "Which door leads out?",
            plates: plates, colors: null, answer: truth };
    },

    // both signs tell the truth
    function () {
        const a = pick(["left", "right"]);
        const b = otherSide(a);
        const plates = {};
        plates[a] = "\u201CThe exit is not behind this door.\u201D";
        plates[b] = "\u201CThe exit is not behind the " + a + " door.\u201D";
        return { rule: "Both signs are telling the truth.", question: "Which door leads out?",
            plates: plates, colors: null, answer: b };
    },

    // truthful sign points at the liar's door
    function () {
        const truth = pick(["left", "right"]);
        const liar = otherSide(truth);
        const plates = {};
        plates[truth] = "\u201CThe exit is behind the " + liar + " door.\u201D";
        plates[liar] = "\u201CThe exit is behind the " + truth + " door.\u201D";
        return { rule: "The " + truth + " sign tells the truth. The " + liar + " sign lies.",
            question: "Which door leads out?", plates: plates, colors: null, answer: liar };
    },

    // multiple of 7
    function () {
        const good = 7 * (6 + randInt(8));
        const bad = good + pick([-3, -2, -1, 1, 2, 3]);
        const side = pick(["left", "right"]);
        const plates = {};
        plates[side] = String(good);
        plates[otherSide(side)] = String(bad);
        return { rule: "The doors are numbered.",
            question: "The exit door is marked with a multiple of 7.",
            plates: plates, colors: null, answer: side };
    },

    // next number in a sequence
    function () {
        const sequences = [
            { shown: "2, 6, 12, 20, ?", answer: 30 },
            { shown: "3, 6, 12, 24, ?", answer: 48 },
            { shown: "1, 4, 9, 16, ?", answer: 25 },
            { shown: "1, 1, 2, 3, 5, 8, ?", answer: 13 },
            { shown: "5, 10, 20, 40, ?", answer: 80 }
        ];
        const s = pick(sequences);
        const side = pick(["left", "right"]);
        const plates = {};
        plates[side] = String(s.answer);
        plates[otherSide(side)] = String(s.answer + pick([-4, -2, 2, 4]));
        return { rule: "The exit door carries the next number.",
            question: s.shown, plates: plates, colors: null, answer: side };
    },

    // arithmetic
    function () {
        const a = pick([13, 14, 15, 16, 17, 18, 19]);
        const b = pick([3, 4, 6, 7]);
        const side = pick(["left", "right"]);
        const plates = {};
        plates[side] = String(a * b);
        plates[otherSide(side)] = String(a * b + pick([-6, -3, 3, 6, 10]));
        return { rule: "The doors are numbered.",
            question: "The exit door is marked with " + a + " \u00d7 " + b + ".",
            plates: plates, colors: null, answer: side };
    },

    // the hallway clock
    function () {
        const side = pick(["left", "right"]);
        const plates = {};
        plates[side] = "11:48";
        plates[otherSide(side)] = pick(["11:47", "11:49", "11:38", "12:48"]);
        return { rule: "Each door has a clock.",
            question: "You stepped inside at 11:48 PM. The exit door shows that time.",
            plates: plates, colors: null, answer: side };
    },

    // colours
    function () {
        const redSide = pick(["left", "right"]);
        const plates = {};
        plates[redSide] = "RED";
        plates[otherSide(redSide)] = "BLUE";
        const colors = {};
        colors[redSide] = "red";
        colors[otherSide(redSide)] = "blue";
        return { rule: "One door is red. The other is blue.",
            question: "The exit is NOT behind the red door.",
            plates: plates, colors: colors, answer: otherSide(redSide) };
    }
];

let lastDoorPuzzle = -1;

function nextDoorPuzzle() {

    let index = randInt(DOOR_PUZZLES.length);

    while (index === lastDoorPuzzle) index = randInt(DOOR_PUZZLES.length);

    lastDoorPuzzle = index;

    return DOOR_PUZZLES[index]();
}

function startDoors() {

    const id = runId;

    const doorsBox = $("doors");
    const message = $("doors-message");
    const stat = $("doors-stat");
    const question = $("doors-question");

    startLive("doors-time");

    activeCleanup = function () {
        doorsBox.onclick = null;
        doorsBox.innerHTML = "";
        question.innerHTML = "";
    };

    async function attempt() {

        const puzzle = nextDoorPuzzle();

        question.innerHTML =
            '<span class="q-rule">' + escapeHtml(puzzle.rule) + '</span>' +
            '<span class="q-main">' + escapeHtml(puzzle.question) + '</span>';

        doorsBox.innerHTML = "";

        ["left", "right"].forEach(function (side) {

            const door = document.createElement("button");

            door.type = "button";
            door.className = "door" +
                (puzzle.colors ? " is-" + puzzle.colors[side] : "");
            door.dataset.side = side;
            door.setAttribute("aria-label", side + " door: " + puzzle.plates[side]);
            door.innerHTML =
                '<span class="door-plate">' + escapeHtml(puzzle.plates[side]) + '</span>' +
                '<span class="door-leaf"><i class="door-knob"></i></span>';

            doorsBox.appendChild(door);
        });

        message.textContent = "One door leads out.";

        startClock();

        const side = await new Promise(function (resolve) {

            doorsBox.onclick = function (event) {

                const door = event.target.closest(".door");

                if (!door || doorsBox.classList.contains("locked")) return;

                doorsBox.classList.add("locked");

                resolve(door.dataset.side);
            };
        });

        if (id !== runId) return null;

        pauseClock();

        const chosen = doorsBox.querySelector('[data-side="' + side + '"]');

        const correct = side === puzzle.answer;

        chosen.classList.add(correct ? "open" : "wrong");

        if (!correct) {
            message.textContent = "WRONG DOOR.";
            doorsBox.querySelector('[data-side="' + puzzle.answer + '"]')
                .classList.add("reveal");
        } else {
            message.textContent = "The door opens.";
        }

        await sleep(correct ? 1100 : 1600);

        doorsBox.classList.remove("locked");

        return correct;
    }

    (async function loop() {

        let attemptNo = 0;

        while (id === runId) {

            attemptNo++;

            stat.textContent = "ATTEMPT " + attemptNo;

            const ok = await attempt();

            if (id !== runId || ok === null) return;

            if (ok) {
                completeLevel(5);
                return;
            }
        }

    })();
}

// =====================================================
// FINAL CHALLENGE: stop the clock at 10.00
// =====================================================

let finalTargetTime = 10;
let finalStartTime = 0;
let finalTimerInterval = null;
let finalAccuracy = 0;

function startFinalFlow() {

    if (save.twistSeen) {
        startFinalChallenge();
    } else {
        startTwistDialogue();
    }
}

function startFinalChallenge() {

    stopLevel();

    showScreen("final-screen");

    setTopButton("levels");

    finalTargetTime = 10;

    finalTarget.textContent =
        "TARGET: " + finalTargetTime.toFixed(2) + " SECONDS";

    finalTimer.textContent = "0.00";

    finalMessage.textContent = "Stop the clock as close to the target as possible.";

    finalStart.style.display = "block";
    finalStop.style.display = "none";

    clearInterval(finalTimerInterval);
}

finalStart.addEventListener("click", function () {

    finalStart.style.display = "none";
    finalStop.style.display = "block";

    finalMessage.textContent = "STOP THE CLOCK AT THE TARGET.";

    finalStartTime = performance.now();

    finalTimerInterval = setInterval(function () {

        const elapsed = (performance.now() - finalStartTime) / 1000;

        finalTimer.textContent = elapsed.toFixed(2);

    }, 10);
});

finalStop.addEventListener("click", function () {

    clearInterval(finalTimerInterval);

    const finalTime = (performance.now() - finalStartTime) / 1000;

    finalTimer.textContent = finalTime.toFixed(2);

    finalStart.style.display = "none";
    finalStop.style.display = "none";

    setTopButton(null);

    const difference = Math.abs(finalTime - finalTargetTime);

    finalAccuracy = parseFloat(difference.toFixed(2));

    finalMessage.textContent =
        "STOPPED: " + finalTime.toFixed(2) +
        " SECONDS | ACCURACY: " + finalAccuracy.toFixed(2) + " SECONDS";

    if (difference <= 0.05) {

        save.finalDone = true;
        save.finalAccuracy = finalAccuracy;
        persist();

        saveLeaderboardScore();

        setTimeout(startWinEnding, 2500);

    } else {

        setTimeout(startLoseEnding, 2500);
    }
});

// =====================================================
// LEADERBOARD
// =====================================================

async function saveLeaderboardScore() {

    if (save.scoreSaved) return;

    const row = {
        name: save.name,
        gender: save.gender.toUpperCase(),
        total_time: Number(totalTime().toFixed(2)),
        accuracy: Number(finalAccuracy.toFixed(2)),
        missed: totalMissed()
    };

    let result = await supabaseClient.from("leaderboard").insert(row).select();

    // The table may not have a "missed" column yet: save without it
    if (result.error) {

        const withoutMissed = Object.assign({}, row);

        delete withoutMissed.missed;

        result = await supabaseClient
            .from("leaderboard").insert(withoutMissed).select();
    }

    if (result.error) {
        console.error("LEADERBOARD SAVE ERROR:", result.error);
        return;
    }

    save.scoreSaved = true;
    persist();
}

async function displayLeaderboard() {

    const entries = $("leaderboard-entries");

    entries.innerHTML =
        "<p style='text-align:center; padding:30px;'>LOADING...</p>";

    // Fewest misses first, then fastest, then most accurate
    let result = await supabaseClient
        .from("leaderboard")
        .select("name, gender, total_time, accuracy, missed")
        .order("missed", { ascending: true })
        .order("total_time", { ascending: true })
        .order("accuracy", { ascending: true })
        .limit(100);

    // No "missed" column yet: fall back to the old ranking
    if (result.error) {

        result = await supabaseClient
            .from("leaderboard")
            .select("name, gender, total_time, accuracy")
            .order("total_time", { ascending: true })
            .order("accuracy", { ascending: true })
            .limit(100);
    }

    if (result.error) {

        console.error("LEADERBOARD LOAD ERROR:", result.error);

        entries.innerHTML =
            "<p style='text-align:center; padding:30px;'>FAILED TO LOAD LEADERBOARD</p>";

        return;
    }

    entries.innerHTML = "";

    result.data.forEach(function (player, index) {

        const entry = document.createElement("div");

        entry.classList.add("leaderboard-entry");

        const missed = player.missed === undefined || player.missed === null ?
            "-" : String(player.missed);

        entry.innerHTML =
            '<span class="leaderboard-rank">' + (index + 1) + '</span>' +
            '<span>' + escapeHtml(player.name) + '</span>' +
            '<span>' + escapeHtml(player.gender) + '</span>' +
            '<span class="leaderboard-time">' +
                Number(player.total_time).toFixed(2) + 's</span>' +
            '<span class="leaderboard-missed">' + escapeHtml(missed) + '</span>' +
            '<span class="leaderboard-accuracy">' +
                Number(player.accuracy).toFixed(2) + 's</span>';

        entries.appendChild(entry);
    });
}

function openLeaderboard() {

    stopLevel();

    clearInterval(finalTimerInterval);

    showScreen("leaderboard-screen");

    setTopButton(null);

    displayLeaderboard();
}

$("leaderboard-back").addEventListener("click", goTitle);

$("start-leaderboard-btn").addEventListener("click", openLeaderboard);

// Save the running attempt's time if the page is closed mid-level
window.addEventListener("pagehide", pauseClock);

// ---------- START ----------

refreshStartScreen();

// =====================================================
// KEYBOARD: ENTER / SPACE press the main button,
// UP / DOWN move through the menus
// =====================================================

(function () {

    // The main button on each screen
    const MAIN_BUTTON = {
        "start-screen": "start-btn",
        "name-screen": "continue-btn",
        "school-screen": "enter-school-btn",
        "hallway-screen": "hallway-continue",
        "levels-screen": "levels-continue",
        "level-result-screen": "level-result-next"
    };

    // Buttons this handler controls. If one of these still has
    // focus from a mouse click, it is released first so the key
    // press is not counted twice.
    const MANAGED = [
        "psycho-next", "psycho-skip", "final-start", "final-stop"
    ].concat(Object.keys(MAIN_BUTTON).map(function (key) {
        return MAIN_BUTTON[key];
    }));

    function isShown(element) {
        return element !== null &&
            getComputedStyle(element).display !== "none";
    }

    function currentScreenElement() {

        for (let i = 0; i < screens.length; i++) {
            if (isShown(screens[i])) return screens[i];
        }

        return null;
    }

    document.addEventListener("keydown", function (event) {

        // ESC closes the confirm box
        if (event.key === "Escape" && isShown(restartConfirm)) {
            $("restart-cancel-btn").click();
            return;
        }

        if (event.ctrlKey || event.altKey || event.metaKey) return;

        // UP / DOWN: move between the menu rows
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {

            if (isShown(restartConfirm)) return;

            const screen = currentScreenElement();

            if (screen === null ||
                (screen.id !== "start-screen" && screen.id !== "levels-screen")) {
                return;
            }

            const items = Array.from(screen.querySelectorAll(".menu-item"))
                .filter(function (item) { return isShown(item) && !item.hidden; });

            if (items.length === 0) return;

            event.preventDefault();

            let index = items.indexOf(document.activeElement);

            // Nothing focused yet: the first row already looks selected
            if (index === -1) index = 0;

            index += event.key === "ArrowDown" ? 1 : -1;

            index = (index + items.length) % items.length;

            items[index].focus();

            return;
        }

        const isEnter = event.key === "Enter";
        const isSpace = event.key === " ";

        if (!isEnter && !isSpace) return;

        // Holding the key down must not press twice
        if (event.repeat) {
            if (isShown(finalStop)) event.preventDefault();
            return;
        }

        // The confirm box has its own buttons
        if (isShown(restartConfirm)) return;

        const active = document.activeElement;
        const tag = active ? active.tagName : "";

        // Typing: only ENTER in the name box continues
        if (tag === "INPUT" || tag === "TEXTAREA") {
            if (!(isEnter && active.id === "player-name")) return;
        }

        // Any other focused button (cards, doors, SOUND...) keeps
        // its normal keyboard behaviour
        if (tag === "BUTTON" && MANAGED.indexOf(active.id) === -1) return;

        const screen = currentScreenElement();

        if (screen === null) return;

        let target = null;

        if (screen.id === "psycho-screen") {

            event.preventDefault();

            if (tag === "BUTTON") active.blur();

            // First press finishes the typing, the next one continues
            if (finishDialogueTyping()) return;

            if (psychoNext.classList.contains("visible")) {
                psychoNext.click();
            }

            return;
        }

        if (screen.id === "final-screen") {

            if (isShown(finalStart)) {
                target = finalStart;
            } else if (isShown(finalStop)) {
                target = finalStop;
            }

        } else if (MAIN_BUTTON[screen.id]) {

            target = $(MAIN_BUTTON[screen.id]);
        }

        if (target === null || !isShown(target) || target.disabled) return;

        event.preventDefault();

        if (tag === "BUTTON") active.blur();

        target.click();
    });

})();
