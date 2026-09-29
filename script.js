const SUPABASE_URL = "https://ovrqybbmrhzfsglwchoc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_COGRe74WATPeKdJ72_NrUw_fK6AlowZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);
// ---------- GET HTML ELEMENTS ----------

const startButton = document.getElementById("start-btn");

const startScreen = document.getElementById("start-screen");
const characterScreen = document.getElementById("character-screen");
const nameScreen = document.getElementById("name-screen");
const schoolScreen = document.getElementById("school-screen");
const hallwayScreen = document.getElementById("hallway-screen");
const psychoScreen = document.getElementById("psycho-screen");

const boyButton = document.getElementById("boy-btn");
const girlButton = document.getElementById("girl-btn");

const continueButton = document.getElementById("continue-btn");
const enterSchoolButton = document.getElementById("enter-school-btn");
const hallwayContinue = document.getElementById("hallway-continue");

const nameInput = document.getElementById("player-name");
const nameError = document.getElementById("name-error");

const psychoText = document.getElementById("psycho-text");
const psychoName = document.getElementById("psycho-name");
const psychoNext = document.getElementById("psycho-next");
// MEMORY CHALLENGE
const memoryScreen = document.getElementById("memory-screen");
const memoryMessage = document.getElementById("memory-message");
const memorySequence = document.getElementById("memory-sequence");
const memoryOptions = document.getElementById("memory-options");
const selectedSequence =
    document.getElementById("selected-sequence");
const memoryTimer = document.getElementById("memory-timer");
const memorySubmit = document.getElementById("memory-submit");
const memoryResultScreen =
    document.getElementById("memory-result-screen");

const resultMessage =
    document.getElementById("result-message");

const resultTime =
    document.getElementById("result-time");

const resultContinue =
    document.getElementById("result-continue");

let memoryQuestion = [];
let playerAnswer = [];
let memoryStartTime = 0;
const memoryQuestions = [
    ["🔑", "🕯️", "📕", "⏰", "🌹"],
    ["🎲", "🧸", "🔔", "📷", "🍎"],
    ["🌙", "🔑", "🎸", "📕", "🕯️"],
    ["⏰", "🌹", "🎲", "🔔", "🧸"]
];

// WORD CHALLENGE
const wordScreen = document.getElementById("word-screen");
const wordClue = document.getElementById("word-clue");
const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const wordTimer = document.getElementById("word-timer");
const wordMessage = document.getElementById("word-message");
const wordSubmit = document.getElementById("word-submit");
const wordResultScreen =
    document.getElementById("word-result-screen");

const wordResultMessage =
    document.getElementById("word-result-message");

const wordResultTime =
    document.getElementById("word-result-time");

const wordResultContinue =
    document.getElementById("word-result-continue");

let currentWordQuestion = null;
let wordStartTime = 0;
let wordCountdown = null;
const wordQuestions = [
    {
        word: "KEY",
        clue: "I can unlock a door, but I am not the door."
    },
    {
        word: "CLOCK",
        clue: "I have hands but cannot clap."
    },
    {
        word: "RAIN",
        clue: "I fall from clouds and make the ground wet."
    },
    {
        word: "CANDLE",
        clue: "I give light while slowly becoming smaller."
    },
    {
        word: "DOOR",
        clue: "You open me to enter a room."
    },
    {
        word: "LOCK",
        clue: "I keep something closed until the right key arrives."
    }    ,
    {
        word: "SHADOW",
        clue: "I follow you when there is light, but disappear in darkness."
    },
    {
        word: "MIRROR",
        clue: "I show your reflection but cannot keep it."
    },
    {
        word: "ECHO",
        clue: "I repeat your sound after you make it."
    },
    {
        word: "DREAM",
        clue: "I can create a world while your eyes are closed."
    },
    {
        word: "MEMORY",
        clue: "I allow you to remember something that happened before."
    },
    {
        word: "MASK",
        clue: "I can hide your face without changing it."
    },
    {
        word: "PHOTO",
        clue: "I capture a moment and keep it still."
    }    ,
    {
        word: "SILENCE",
        clue: "I exist when nobody is making a sound."
    },
    {
        word: "SECRET",
        clue: "I stop being private when everyone knows me."
    },
    {
        word: "FEAR",
        clue: "I can make your heart race even when the danger is unseen."
    },
    {
        word: "WHISPER",
        clue: "I am a very quiet way of speaking."
    },
    {
        word: "DARKNESS",
        clue: "I remain where there is no light."
    },
    {
        word: "FOOTSTEP",
        clue: "You may hear me after someone has already walked past."
    },
    {
        word: "TIME",
        clue: "Everyone experiences me, but nobody can stop me."
    }
];

// OBSERVATION CHALLENGE
const observationScreen =
    document.getElementById("observation-screen");

const observationMessage =
    document.getElementById("observation-message");

const observationScene =
    document.getElementById("observation-scene");

const observationQuestion =
    document.getElementById("observation-question");

const observationOptions =
    document.getElementById("observation-options");

const observationTimer =
    document.getElementById("observation-timer");

const observationSubmit =
    document.getElementById("observation-submit");
const observationResultScreen =
    document.getElementById("observation-result-screen");

const observationResultMessage =
    document.getElementById("observation-result-message");

const observationResultTime =
    document.getElementById("observation-result-time");

const observationResultContinue =
    document.getElementById("observation-result-continue");

let currentObservationQuestion = null;
let observationAnswer = "";
let observationStartTime = 0;
let observationTimerInterval = null;

const observationQuestions = [

    {
        scene: "🕯️ 🪞 🪑 🧸 🚪",
        question: "Which object was NOT present?",
        options: ["🧸", "🪑", "🔑", "🚪"],
        answer: "🔑"
    },

    {
        scene: "🔑 🕯️ 📕 🧸 ⏰",
        question: "Which object was NOT present?",
        options: ["🔑", "📷", "🧸", "⏰"],
        answer: "📷"
    },

    {
        scene: "🌹 🪞 🔔 🧸 🎲",
        question: "Which object was NOT present?",
        options: ["🌹", "🔔", "📷", "🎲"],
        answer: "📷"
    },

    {
        scene: "🚪 🕯️ 🎸 🔑 📷",
        question: "Which object was NOT present?",
        options: ["🚪", "🎸", "🧸", "📷"],
        answer: "🧸"
    },

    {
        scene: "📕 🕯️ 🔔 🌙 🧸",
        question: "Which object was NOT present?",
        options: ["📕", "🌙", "🎲", "🔔"],
        answer: "🎲"
    },

    {
        scene: "⏰ 🔑 🌹 🪞 🎸",
        question: "Which object was NOT present?",
        options: ["⏰", "🔑", "🧸", "🎸"],
        answer: "🧸"
    },

    {
        scene: "🧸 📷 🕯️ 🚪 🌙",
        question: "Which object was NOT present?",
        options: ["📷", "🔔", "🚪", "🌙"],
        answer: "🔔"
    },

    {
        scene: "🎲 🪑 📕 🔑 🌹",
        question: "Which object was NOT present?",
        options: ["🎲", "📕", "🪞", "🌹"],
        answer: "🪞"
    },

    {
        scene: "🔔 🎸 🕯️ ⏰ 🪞",
        question: "Which object was NOT present?",
        options: ["🔔", "🎸", "📷", "🪞"],
        answer: "📷"
    },

    {
        scene: "🌙 🧸 🚪 📕 🔑",
        question: "Which object was NOT present?",
        options: ["🌙", "🧸", "🕯️", "🔑"],
        answer: "🕯️"
    },

    {
        scene: "📷 🌹 🪑 🎲 🕯️",
        question: "Which object was NOT present?",
        options: ["📷", "🌹", "⏰", "🕯️"],
        answer: "⏰"
    },

    {
        scene: "🪞 🔑 🎸 🧸 📕",
        question: "Which object was NOT present?",
        options: ["🪞", "🔑", "🎲", "📕"],
        answer: "🎲"
    },

    {
        scene: "🚪 ⏰ 🌙 🔔 🪑",
        question: "Which object was NOT present?",
        options: ["🚪", "⏰", "🧸", "🪑"],
        answer: "🧸"
    },

    {
        scene: "🎸 📷 🌹 🕯️ 🧸",
        question: "Which object was NOT present?",
        options: ["🎸", "📷", "🔑", "🧸"],
        answer: "🔑"
    },

    {
        scene: "🪑 📕 ⏰ 🪞 🎲",
        question: "Which object was NOT present?",
        options: ["🪑", "📕", "🌙", "🎲"],
        answer: "🌙"
    },

    {
        scene: "🔔 🚪 🔑 🌹 📷",
        question: "Which object was NOT present?",
        options: ["🔔", "🚪", "🧸", "📷"],
        answer: "🧸"
    },

    {
        scene: "🌙 🎲 🕯️ 🪞 🎸",
        question: "Which object was NOT present?",
        options: ["🌙", "🎲", "🔑", "🎸"],
        answer: "🔑"
    },

    {
        scene: "🧸 ⏰ 📷 📕 🚪",
        question: "Which object was NOT present?",
        options: ["🧸", "⏰", "🌹", "🚪"],
        answer: "🌹"
    },

    {
        scene: "🔑 🪑 🌙 🎸 🔔",
        question: "Which object was NOT present?",
        options: ["🔑", "🪑", "📕", "🔔"],
        answer: "📕"
    },

    {
        scene: "🌹 📷 🕯️ 🎲 🪞",
        question: "Which object was NOT present?",
        options: ["🌹", "📷", "⏰", "🪞"],
        answer: "⏰"
    }

];
// CHALLENGE 4 VARIABLES

const logicScreen =
    document.getElementById("logic-screen");

const logicMessage =
    document.getElementById("logic-message");

const logicQuestion =
    document.getElementById("logic-question");

const logicOptions =
    document.getElementById("logic-options");

const logicTimer =
    document.getElementById("logic-timer");

const logicSubmit =
    document.getElementById("logic-submit");

const logicResultScreen =
    document.getElementById("logic-result-screen");

const logicResultMessage =
    document.getElementById("logic-result-message");

const logicResultTime =
    document.getElementById("logic-result-time");

const logicResultContinue =
    document.getElementById("logic-result-continue");

let currentLogicQuestion = null;
let logicAnswer = "";
let logicStartTime = 0;
let logicTimerInterval = null;

const logicQuestions = [

    {
        question: "2   4   8   16   ?",
        options: ["20", "24", "32", "36"],
        answer: "32"
    },

    {
        question: "3   6   12   24   ?",
        options: ["36", "42", "48", "54"],
        answer: "48"
    },

    {
        question: "5   10   15   20   ?",
        options: ["22", "25", "30", "35"],
        answer: "25"
    },

    {
        question: "1   4   9   16   ?",
        options: ["20", "24", "25", "30"],
        answer: "25"
    },

    {
        question: "10   20   40   80   ?",
        options: ["100", "120", "140", "160"],
        answer: "160"
    },

    {
        question: "2   6   12   20   ?",
        options: ["24", "28", "30", "32"],
        answer: "30"
    },

    {
        question: "100   90   80   70   ?",
        options: ["50", "55", "60", "65"],
        answer: "60"
    },

    {
        question: "1   2   4   7   11   ?",
        options: ["15", "16", "17", "18"],
        answer: "16"
    },

    {
        question: "2   3   5   8   13   ?",
        options: ["18", "20", "21", "23"],
        answer: "21"
    },

    {
        question: "50   45   40   35   ?",
        options: ["25", "28", "30", "32"],
        answer: "30"
    },

    {
        question: "4   8   16   32   ?",
        options: ["48", "56", "64", "72"],
        answer: "64"
    },

    {
        question: "81   27   9   3   ?",
        options: ["0", "1", "2", "3"],
        answer: "1"
    },

    {
        question: "7   14   28   56   ?",
        options: ["84", "98", "112", "120"],
        answer: "112"
    },

    {
        question: "1   3   6   10   15   ?",
        options: ["18", "20", "21", "24"],
        answer: "21"
    },

    {
        question: "64   32   16   8   ?",
        options: ["2", "4", "6", "12"],
        answer: "4"
    },

    {
        question: "11   22   33   44   ?",
        options: ["50", "55", "66", "77"],
        answer: "55"
    },

    {
        question: "2   5   10   17   26   ?",
        options: ["35", "36", "37", "38"],
        answer: "37"
    },

    {
        question: "3   9   27   81   ?",
        options: ["162", "189", "243", "324"],
        answer: "243"
    },

    {
        question: "20   18   15   11   ?",
        options: ["6", "7", "8", "9"],
        answer: "6"
    },

    {
        question: "1   5   13   29   ?",
        options: ["45", "57", "61", "63"],
        answer: "61"
    }

];

// CHALLENGE 5 VARIABLES

const patternScreen =
    document.getElementById("pattern-screen");

const patternMessage =
    document.getElementById("pattern-message");

const patternDisplay =
    document.getElementById("pattern-display");

const patternOptions =
    document.getElementById("pattern-options");

const selectedPattern =
    document.getElementById("selected-pattern");

const patternTimer =
    document.getElementById("pattern-timer");

const patternSubmit =
    document.getElementById("pattern-submit");

const patternResultScreen =
    document.getElementById("pattern-result-screen");

const patternResultMessage =
    document.getElementById("pattern-result-message");

const patternResultTime =
    document.getElementById("pattern-result-time");

const patternResultContinue =
    document.getElementById("pattern-result-continue");

let currentPatternQuestion = null;
let patternAnswer = [];
let patternStartTime = 0;
let patternTimerInterval = null;

const patternQuestions = [

    {
        pattern: ["▲", "●", "▲", "■", "●"],
        options: ["▲", "●", "■", "◆"],
    },

    {
        pattern: ["★", "◆", "●", "★", "◆"],
        options: ["★", "◆", "●", "▲"],
    },

    {
        pattern: ["■", "●", "▲", "●", "■"],
        options: ["■", "●", "▲", "◆"],
    },

    {
        pattern: ["◆", "★", "◆", "●", "★"],
        options: ["◆", "★", "●", "■"],
    },

    {
        pattern: ["●", "▲", "■", "▲", "●"],
        options: ["●", "▲", "■", "◆"],
    },

    {
        pattern: ["★", "●", "◆", "★", "●"],
        options: ["★", "●", "◆", "■"],
    },

    {
        pattern: ["▲", "◆", "●", "◆", "▲"],
        options: ["▲", "◆", "●", "★"],
    },

    {
        pattern: ["■", "★", "●", "■", "◆"],
        options: ["■", "★", "●", "◆"],
    }

];

// FINAL CHALLENGE VARIABLES

const finalScreen =
    document.getElementById("final-screen");

const finalMessage =
    document.getElementById("final-message");

const finalTarget =
    document.getElementById("final-target");

const finalTimer =
    document.getElementById("final-timer");

const finalStart =
    document.getElementById("final-start");

const finalStop =
    document.getElementById("final-stop");

let finalTargetTime = 10;
let finalStartTime = 0;
let finalTimerInterval = null;

// LEADERBOARD VARIABLES

const leaderboardScreen =
    document.getElementById("leaderboard-screen");

const leaderboardEntries =
    document.getElementById("leaderboard-entries");

const leaderboardBack =
    document.getElementById("leaderboard-back");

// TEMPORARY LEADERBOARD DATA

let leaderboardData = [
    {
        name: "Alex",
        gender: "GIRL",
        totalTime: 47.52,
        accuracy: 0.01
    },

    {
        name: "Ryan",
        gender: "BOY",
        totalTime: 48.17,
        accuracy: 0.03
    },

    {
        name: "Sam",
        gender: "BOY",
        totalTime: 49.04,
        accuracy: 0.02
    }
];
async function displayLeaderboard() {

    leaderboardEntries.innerHTML =
        "<p style='text-align:center; padding:30px;'>LOADING...</p>";

    const { data, error } = await supabaseClient
        .from("leaderboard")
        .select("name, gender, total_time, accuracy")
        .order("total_time", { ascending: true })
        .order("accuracy", { ascending: true })
        .limit(100);

    if (error) {

        console.error(
            "LEADERBOARD LOAD ERROR:",
            error
        );

        leaderboardEntries.innerHTML =
            "<p style='text-align:center; padding:30px;'>FAILED TO LOAD LEADERBOARD</p>";

        return;
    }

    leaderboardEntries.innerHTML = "";

    data.forEach(function(player, index) {

        const entry =
            document.createElement("div");

        entry.classList.add("leaderboard-entry");

        entry.innerHTML = `
            <span class="leaderboard-rank">
                #${index + 1}
            </span>

            <span>
                ${player.name}
            </span>

            <span>
                ${player.gender}
            </span>

            <span class="leaderboard-time">
                ${Number(player.total_time).toFixed(2)}s
            </span>

            <span class="leaderboard-accuracy">
                ±${Number(player.accuracy).toFixed(2)}s
            </span>
        `;

        leaderboardEntries.appendChild(entry);

    });
}

function openLeaderboard() {

    leaderboardScreen.style.display = "block";

    displayLeaderboard();

}
leaderboardBack.addEventListener(
    "click",
    function() {

        leaderboardScreen.style.display =
            "none";

        startScreen.style.display =
            "block";

    }
);

// =========================
// PLAYER SCORE
// =========================

let memoryTime = 0;
let wordTime = 0;
let observationTime = 0;
let logicTime = 0;
let patternTime = 0;

let finalAccuracy = 0;
let totalChallengeTime = 0;

// ---------- PLAYER DATA ----------

let playerGender = "";
let playerName = "";
let dialogues = [];
let dialogueIndex = 0;


// ---------- START GAME ----------

startButton.addEventListener("click", function () {
    resetPlayerScore();

    startScreen.style.display = "none";

    characterScreen.style.display = "block";

});


// ---------- BOY ----------

boyButton.addEventListener("click", function () {

    playerGender = "boy";

    characterScreen.style.display = "none";

    nameScreen.style.display = "block";

    nameInput.focus();

});


// ---------- GIRL ----------

girlButton.addEventListener("click", function () {

    playerGender = "girl";

    characterScreen.style.display = "none";

    nameScreen.style.display = "block";

    nameInput.focus();

});


// ---------- NAME ----------

continueButton.addEventListener("click", function () {

    playerName = nameInput.value.trim();

    if (playerName === "") {

        nameError.textContent = "Please enter your name.";

        return;

    }

    nameError.textContent = "";

    nameScreen.style.display = "none";

    schoolScreen.style.display = "block";

});


// ---------- ENTER SCHOOL ----------

enterSchoolButton.addEventListener("click", function () {

    schoolScreen.style.display = "none";

    hallwayScreen.style.display = "block";

});


// ---------- HALLWAY ----------

hallwayContinue.addEventListener("click", function () {

    hallwayScreen.style.display = "none";

    psychoScreen.style.display = "block";

    startPsychoDialogue();

});


// ---------- PSYCHO DIALOGUE ----------

function startPsychoDialogue() {

    if (playerName === "") {
        playerName = "Stranger";
    }

    psychoName.textContent = "PSYCHO";

    // All Psycho dialogue
    dialogues = [

        "Good evening, " + playerName + ".",

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
function showDialogue(dialogue) {

    psychoText.textContent = "";

    psychoNext.classList.remove("visible");

    let index = 0;

    const typing = setInterval(function () {

        psychoText.textContent += dialogue[index];

        index++;

        if (index >= dialogue.length) {

            clearInterval(typing);

            psychoNext.classList.add("visible");

        }

    }, 45);
}

// ---------- NEXT DIALOGUE ----------
psychoNext.addEventListener("click", function() {

    dialogueIndex++;

    if (dialogueIndex < dialogues.length) {

        showDialogue(dialogues[dialogueIndex]);

    } else {

        psychoScreen.style.display = "none";

        if (psychoScreen.dataset.ending === "true") {

            psychoScreen.dataset.ending = "false";

            openLeaderboard();

        } else if (psychoScreen.dataset.twist === "true") {

            psychoScreen.dataset.twist = "false";

            startFinalChallenge();

        } else {

            startMemoryChallenge();

        }

    }

});

function startMemoryChallenge() {

    memoryScreen.style.display = "block";

    // Choose a random question only when the challenge starts
    const randomIndex =
        Math.floor(Math.random() * memoryQuestions.length);

    memoryQuestion = memoryQuestions[randomIndex];

    // Clear previous answer
    playerAnswer = [];
    selectedSequence.textContent = "";

    memoryMessage.textContent =
        "Remember the sequence.";

    memoryOptions.innerHTML = "";
    memorySequence.textContent =
        memoryQuestion.join(" ");

    memorySubmit.style.display = "none";

    // Challenge timer starts
    

    let countdown = 5;

    memoryTimer.textContent =
        "Memorize: " + countdown;

    const countdownTimer = setInterval(function () {

        countdown--;
        if (countdown > 0) {

    memoryTimer.textContent =
        "Memorize: " + countdown;

} else {

    clearInterval(countdownTimer);

    memorySequence.textContent = "";

    memoryMessage.textContent =
        "Recreate the sequence.";

    memoryTimer.textContent =
        "Your turn";

    // Timer starts only when the player can answer
    memoryStartTime = performance.now();

    showMemoryOptions();

    memorySubmit.style.display = "block";
}
        

    }, 1000);
}


function showMemoryOptions() {
    function updateSelectedSequence() {

    selectedSequence.textContent =
        playerAnswer.join(" ");
}

    const allSymbols = [
        "🔑", "🕯️", "📕", "⏰", "🌹",
        "🎲", "🧸", "🔔", "📷", "🍎",
        "🌙", "🎸"
    ];

    // Randomize the buttons
    allSymbols.sort(() => Math.random() - 0.5);

    allSymbols.forEach(function(symbol) {

        const button = document.createElement("button");

        button.textContent = symbol;
        button.classList.add("memory-option");

        button.addEventListener("click", function() {

    // If already selected, deselect it
    if (button.classList.contains("selected")) {

        const index = playerAnswer.indexOf(symbol);

        if (index !== -1) {
            playerAnswer.splice(index, 1);
        }

        button.classList.remove("selected");

        updateSelectedSequence();

        return;
    }

    // Select the symbol
    playerAnswer.push(symbol);

    button.classList.add("selected");

    updateSelectedSequence();

});

        memoryOptions.appendChild(button);
    });
}
memorySubmit.addEventListener("click", function() {

    // Check if player selected 5 symbols
    if (playerAnswer.length !== memoryQuestion.length) {

        memoryMessage.textContent =
            "You haven't completed the sequence.";

        return;
    }

    // Check the sequence
    let correct = true;

    for (let i = 0; i < memoryQuestion.length; i++) {

        if (playerAnswer[i] !== memoryQuestion[i]) {
            correct = false;
            break;
        }
    }

    if (correct) {

    const timeTaken =
        ((performance.now() - memoryStartTime) / 1000).toFixed(2);
    memoryTime = parseFloat(timeTaken);

    console.log(
        "Challenge 1 time:",
        timeTaken,
        "seconds"
    );

    // Hide memory challenge
    memoryScreen.style.display = "none";

    // Show result screen
    memoryResultScreen.style.display = "block";

    resultMessage.textContent =
        "Interesting... You remembered.";

    resultTime.textContent =
        "TIME: " + timeTaken + " SECONDS";

    memorySubmit.style.display = "none";

    memoryOptions.innerHTML = "";


    } else {

    memoryMessage.textContent =
        "Wrong sequence. Try again.";

    playerAnswer = [];

    // Clear the displayed answer
    selectedSequence.textContent = "";

    const buttons =
        document.querySelectorAll(".memory-option");

    buttons.forEach(function(button) {

        button.classList.remove("selected");
        button.disabled = false;

    });
 }
     });
resultContinue.addEventListener("click", function() {

    memoryResultScreen.style.display = "none";

    startWordChallenge();
});
function startWordChallenge() {

    wordScreen.style.display = "block";

    // Pick a random question
    const randomIndex =
        Math.floor(Math.random() * wordQuestions.length);

    currentWordQuestion = wordQuestions[randomIndex];

    // Display clue
    wordClue.textContent =
        currentWordQuestion.clue;

    // Display hidden word
    wordDisplay.textContent =
        currentWordQuestion.word
            .split("")
            .map(() => "_")
            .join(" ");

    // Reset everything
    wordInput.value = "";
    wordMessage.textContent = "";

    wordSubmit.disabled = false;
    wordInput.disabled = false;

    wordInput.focus();

    // Start counting time
    wordStartTime = performance.now();

    wordTimer.textContent =
        "TIME: 0.00 SECONDS";

    clearInterval(wordCountdown);

    wordCountdown = setInterval(function() {

        const elapsed =
            (performance.now() - wordStartTime) / 1000;

        wordTimer.textContent =
            "TIME: " + elapsed.toFixed(2) + " SECONDS";

    }, 100);
}
wordSubmit.addEventListener("click", function() {

    const playerAnswer =
        wordInput.value.trim().toUpperCase();

    // Don't submit an empty answer
    if (playerAnswer === "") {

        wordMessage.textContent =
            "Enter an answer first.";

        return;
    }

    // Correct answer
    if (playerAnswer === currentWordQuestion.word) {

    clearInterval(wordCountdown);

    const timeTaken =
        ((performance.now() - wordStartTime) / 1000).toFixed(2);
    wordTime = parseFloat(timeTaken);

    console.log(
        "Challenge 2 time:",
        timeTaken,
        "seconds"
    );

    wordScreen.style.display = "none";

    wordResultScreen.style.display = "block";

    wordResultMessage.textContent =
        "You found the word.";

    wordResultTime.textContent =
        "TIME: " + timeTaken + " SECONDS";

    wordSubmit.disabled = true;
    wordInput.disabled = true;


    } else {

        // Wrong answer
        wordMessage.textContent =
            "Wrong answer. Try again.";

        wordInput.value = "";

        wordInput.focus();
    }

});
wordResultContinue.addEventListener("click", function() {

    wordResultScreen.style.display = "none";

    startObservationChallenge();

});
function startObservationChallenge() {
    function createObservationScene(scene) {

    observationScene.innerHTML = "";

    const objects = scene.split(" ");

    // Possible positions around the room
    const positions = [
        { left: "10%", top: "15%" },
        { left: "38%", top: "10%" },
        { left: "68%", top: "18%" },
        { left: "20%", top: "48%" },
        { left: "60%", top: "52%" }
    ];

    // Randomize positions
    positions.sort(() => Math.random() - 0.5);

    objects.forEach(function(object, index) {

        const element =
            document.createElement("div");

        element.textContent = object;

        element.classList.add(
            "observation-object"
        );

        element.style.left =
            positions[index].left;

        element.style.top =
            positions[index].top;

        observationScene.appendChild(element);

    });

}

    observationScreen.style.display = "block";

    // Pick a random question
    const randomIndex =
        Math.floor(Math.random() * observationQuestions.length);

    currentObservationQuestion =
        observationQuestions[randomIndex];

    observationAnswer = "";

    // Reset screen
    observationQuestion.textContent = "";
    observationOptions.innerHTML = "";
    observationSubmit.style.display = "none";

    observationMessage.textContent =
        "Look carefully. You won't see it twice.";

    // Show the scene
    createObservationScene(currentObservationQuestion.scene);

    observationTimer.textContent =
        "MEMORIZE: 5";

    let countdown = 5;

    const sceneTimer = setInterval(function() {

        countdown--;

        if (countdown > 0) {

            observationTimer.textContent =
                "MEMORIZE: " + countdown;

        } else {

            clearInterval(sceneTimer);

            // Hide the scene
            observationScene.textContent = "";

            observationMessage.textContent =
                "What did you see?";

            observationTimer.textContent =
                "Your turn";

            showObservationQuestion();

        }

    }, 1000);
}
function showObservationQuestion() {

    observationQuestion.textContent =
        currentObservationQuestion.question;

    currentObservationQuestion.options.forEach(function(option) {

        const button =
            document.createElement("button");

        button.textContent = option;

        button.classList.add(
            "observation-option"
        );

        button.addEventListener("click", function() {

            // Remove previous selection
            const buttons =
                document.querySelectorAll(
                    ".observation-option"
                );

            buttons.forEach(function(btn) {
                btn.classList.remove("selected");
            });

            // Select this answer
            button.classList.add("selected");

            observationAnswer = option;

        });

        observationOptions.appendChild(button);

    });

    observationSubmit.style.display = "block";

    // Start answer timer
    observationStartTime =
        performance.now();

    observationTimerInterval =
        setInterval(function() {

            const elapsed =
                (performance.now() -
                    observationStartTime) / 1000;

            observationTimer.textContent =
                "TIME: " +
                elapsed.toFixed(2) +
                " SECONDS";

        }, 100);

}
observationSubmit.addEventListener("click", function() {

    // Make sure an option was selected
    if (observationAnswer === "") {

        observationMessage.textContent =
            "Choose an answer first.";

        return;
    }

    // Check answer first
    if (
    observationAnswer ===
    currentObservationQuestion.answer
) {

    // Stop timer
    clearInterval(observationTimerInterval);

    const timeTaken =
        ((performance.now() -
            observationStartTime) / 1000).toFixed(2);
observationTime = parseFloat(timeTaken);

    console.log(
        "Challenge 3 time:",
        timeTaken,
        "seconds"
    );

    // Hide challenge
    observationScreen.style.display = "none";

    // Show result
    observationResultScreen.style.display = "block";

    observationResultMessage.textContent =
        "You noticed what was missing.";

    observationResultTime.textContent =
        "TIME: " + timeTaken + " SECONDS";

    observationSubmit.style.display = "none";

    observationOptions.innerHTML = "";


    } else {

        // Wrong answer
        observationMessage.textContent =
            "Wrong observation. Try again.";

        observationAnswer = "";

        // Clear selected button
        const buttons =
            document.querySelectorAll(
                ".observation-option"
            );

        buttons.forEach(function(button) {

            button.classList.remove("selected");

        });

        // DO NOT stop or restart the timer.
        // It keeps running from the original start time.
    }

});
observationResultContinue.addEventListener(
    "click",
    function() {

        observationResultScreen.style.display =
            "none";

        console.log("Ready for Challenge 4");

    }
);
function startLogicChallenge() {

    logicScreen.style.display = "block";

    const randomIndex =
        Math.floor(Math.random() * logicQuestions.length);

    currentLogicQuestion =
        logicQuestions[randomIndex];

    logicAnswer = "";

    logicMessage.textContent =
        "Think carefully.";

    logicQuestion.textContent =
        currentLogicQuestion.question;

    logicOptions.innerHTML = "";

    logicSubmit.style.display = "block";

    currentLogicQuestion.options.forEach(function(option) {

        const button =
            document.createElement("button");

        button.textContent = option;

        button.classList.add("logic-option");

        button.addEventListener("click", function() {

            const buttons =
                document.querySelectorAll(".logic-option");

            buttons.forEach(function(btn) {
                btn.classList.remove("selected");
            });

            button.classList.add("selected");

            logicAnswer = option;

        });

        logicOptions.appendChild(button);

    });

    logicStartTime = performance.now();

    logicTimer.textContent =
        "TIME: 0.00 SECONDS";

    clearInterval(logicTimerInterval);

    logicTimerInterval =
        setInterval(function() {

            const elapsed =
                (performance.now() -
                    logicStartTime) / 1000;

            logicTimer.textContent =
                "TIME: " +
                elapsed.toFixed(2) +
                " SECONDS";

        }, 100);

}
logicSubmit.addEventListener("click", function() {

    if (logicAnswer === "") {

        logicMessage.textContent =
            "Choose an answer first.";

        return;
    }

    if (logicAnswer === currentLogicQuestion.answer) {

        clearInterval(logicTimerInterval);

        const timeTaken =
            ((performance.now() -
                logicStartTime) / 1000).toFixed(2);
        logicTime = parseFloat(timeTaken);

        console.log(
            "Challenge 4 time:",
            timeTaken,
            "seconds"
        );

        logicScreen.style.display = "none";

logicResultScreen.style.display = "block";

logicResultMessage.textContent =
    "You solved the pattern.";

logicResultTime.textContent =
    "TIME: " + timeTaken + " SECONDS";

logicSubmit.style.display = "none";

logicOptions.innerHTML = "";

    } else {

        logicMessage.textContent =
            "Wrong. Think again.";

        logicAnswer = "";

        const buttons =
            document.querySelectorAll(".logic-option");

        buttons.forEach(function(button) {
            button.classList.remove("selected");
        });

        // Timer keeps running.
    }

});
logicResultContinue.addEventListener(
    "click",
    function() {

        logicResultScreen.style.display = "none";

        console.log("Ready for Challenge 5");

    }
);


function startPatternChallenge() {

    patternScreen.style.display = "block";

    const randomIndex =
        Math.floor(Math.random() * patternQuestions.length);

    currentPatternQuestion =
        patternQuestions[randomIndex];

    patternAnswer = [];

    patternMessage.textContent =
        "Remember the pattern.";

    patternOptions.innerHTML = "";

    selectedPattern.textContent = "";

    patternSubmit.style.display = "none";

    patternDisplay.textContent =
        currentPatternQuestion.pattern.join(" ");

    patternTimer.textContent =
        "MEMORIZE: 5";

    let countdown = 5;

    const patternCountdown =
        setInterval(function() {

            countdown--;

            if (countdown > 0) {

                patternTimer.textContent =
                    "MEMORIZE: " + countdown;

            } else {

                clearInterval(patternCountdown);

                patternDisplay.textContent = "";

                patternMessage.textContent =
                    "Recreate the pattern.";

                patternTimer.textContent =
                    "Your turn";

                showPatternOptions();
            }

        }, 1000);

}


function showPatternOptions() {

    currentPatternQuestion.options.forEach(function(symbol) {

        const button =
            document.createElement("button");

        button.textContent = symbol;

        button.classList.add("pattern-option");

        button.addEventListener("click", function() {

            // Add the selected symbol
            patternAnswer.push(symbol);

            selectedPattern.textContent =
                patternAnswer.join(" ");

            // Show Submit after 5 selections
            if (
                patternAnswer.length ===
                currentPatternQuestion.pattern.length
            ) {

                patternSubmit.style.display =
                    "block";

            }

        });

        patternOptions.appendChild(button);

    });

    patternStartTime =
        performance.now();

    patternTimer.textContent =
        "TIME: 0.00 SECONDS";

    patternTimerInterval =
        setInterval(function() {

            const elapsed =
                (performance.now() -
                    patternStartTime) / 1000;

            patternTimer.textContent =
                "TIME: " +
                elapsed.toFixed(2) +
                " SECONDS";

        }, 100);

}
patternSubmit.addEventListener("click", function() {

    let correct = true;

    for (let i = 0; i < currentPatternQuestion.pattern.length; i++) {

        if (
            patternAnswer[i] !==
            currentPatternQuestion.pattern[i]
        ) {
            correct = false;
            break;
        }

    }

    if (correct) {

        clearInterval(patternTimerInterval);

        const timeTaken =
            ((performance.now() -
                patternStartTime) / 1000).toFixed(2);
        patternTime = parseFloat(timeTaken);

        console.log(
            "Challenge 5 time:",
            timeTaken,
            "seconds"
        );

        patternScreen.style.display = "none";

patternResultScreen.style.display = "block";

patternResultMessage.textContent =
    "You remembered the pattern.";

patternResultTime.textContent =
    "TIME: " + timeTaken + " SECONDS";

patternOptions.innerHTML = "";
patternSubmit.style.display = "none";

    } else {

        patternMessage.textContent =
            "Wrong pattern. Try again.";

        patternAnswer = [];

        selectedPattern.textContent = "";

        const buttons =
            document.querySelectorAll(".pattern-option");

        buttons.forEach(function(button) {

            button.classList.remove("selected");
            button.disabled = false;

        });

    }

});
patternResultContinue.addEventListener(
    "click",
    function() {

        patternResultScreen.style.display =
            "none";

        psychoScreen.style.display =
            "block";

        startTwistDialogue();

    }
);
function startTwistDialogue() {

    psychoScreen.dataset.twist = "true";

    psychoName.textContent = "PSYCHO";

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
function startFinalChallenge() {

    finalScreen.style.display = "block";

    finalTargetTime = 10;

    finalTarget.textContent =
        "TARGET: " +
        finalTargetTime.toFixed(2) +
        " SECONDS";

    finalTimer.textContent =
        "0.00";

    finalMessage.textContent =
        "Stop the clock as close to the target as possible.";

    finalStart.style.display = "block";
    finalStop.style.display = "none";

    clearInterval(finalTimerInterval);

}
finalStart.addEventListener("click", function() {

    finalStart.style.display = "none";
    finalStop.style.display = "block";

    finalMessage.textContent =
        "STOP THE CLOCK AT THE TARGET.";

    finalStartTime =
        performance.now();

    finalTimerInterval =
        setInterval(function() {

            const elapsed =
                (performance.now() -
                    finalStartTime) / 1000;

            finalTimer.textContent =
                elapsed.toFixed(2);

        }, 10);

});
finalStop.addEventListener("click", function() {

    clearInterval(finalTimerInterval);

    const finalTime =
        (performance.now() -
            finalStartTime) / 1000;

    finalTimer.textContent =
        finalTime.toFixed(2);

    finalStart.style.display = "none";
    finalStop.style.display = "none";

    const difference =
        Math.abs(finalTime - finalTargetTime);
    finalAccuracy = parseFloat(difference.toFixed(2));

    if (difference <= 0.05) {

    totalChallengeTime =
        memoryTime +
        wordTime +
        observationTime +
        logicTime +
        patternTime;
    saveLeaderboardScore();

    finalMessage.textContent =
        "You stopped it in time.";

    console.log(
        "5-CHALLENGE TOTAL:",
        totalChallengeTime.toFixed(2),
        "seconds"
    );
    startWinEnding();

    // rest of your existing code...


    } else {

        finalMessage.textContent =
            "Too late.";

        console.log(
            "FINAL RESULT: PSYCHO WINS",
            finalTime.toFixed(2)
        );
        startLoseEnding();

    }

});
function resetPlayerScore() {

    memoryTime = 0;
    wordTime = 0;
    observationTime = 0;
    logicTime = 0;
    patternTime = 0;

    finalAccuracy = 0;
    totalChallengeTime = 0;

}
// =========================
// FINAL ENDING DIALOGUES
// =========================

function startLoseEnding() {
    psychoScreen.dataset.ending = "true";

    psychoScreen.style.display = "block";

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
    psychoScreen.dataset.ending = "true";

    psychoScreen.style.display = "block";

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
async function saveLeaderboardScore() {

    const { data, error } = await supabaseClient
        .from("leaderboard")
        .insert({
            name: playerName,
            gender: playerGender,
            total_time: Number(totalChallengeTime.toFixed(2)),
            accuracy: Number(finalAccuracy.toFixed(2))
        })
        .select();

    if (error) {

        console.error(
            "LEADERBOARD SAVE ERROR:",
            error
        );

        return;
    }

    console.log(
        "LEADERBOARD SCORE SAVED:",
        data
    );
}