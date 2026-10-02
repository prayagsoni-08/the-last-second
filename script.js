const SUPABASE_URL = "https://ovrqybbmrhzfsglwchoc.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_COGRe74WATPeKdJ72_NrUw_fK6AlowZ";

const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);

// How long the player gets to memorize before Challenges 1, 3 and 5
// (Memory, Observation, Pattern) hide the content and ask them to recall it.
const MEMORIZE_SECONDS = 10;

// Difficulty tiers picked from as the player advances through the
// content-based challenges: Word (easiest) -> Observation -> Logic (hardest).
function pickQuestionByDifficulty(pool, difficulty) {
    const matches = pool.filter(function (q) {
        return q.difficulty === difficulty;
    });

    const source = matches.length > 0 ? matches : pool;

    return source[Math.floor(Math.random() * source.length)];
}
// ---------- GET HTML ELEMENTS ----------

const startButton = document.getElementById("start-btn");

const startScreen = document.getElementById("start-screen");
const characterScreen = document.getElementById("character-screen");
const nameScreen = document.getElementById("name-screen");
const schoolScreen = document.getElementById("school-screen");
const hallwayScreen = document.getElementById("hallway-screen");
const levelSelectScreen = document.getElementById("level-select-screen");
const psychoScreen = document.getElementById("psycho-screen");

const level1Button = document.getElementById("level-1-btn");
const level2Button = document.getElementById("level-2-btn");
const level2Screen = document.getElementById("level-2-screen");
const level2Message = document.getElementById("level2-message");
const level2Timer = document.getElementById("level2-timer");
const level2StartButton =
    document.getElementById("level2-start-btn");
const resetProgressButton = document.getElementById("reset-progress-btn");
const level1Status = document.getElementById("level-1-status");
const level2Status = document.getElementById("level-2-status");

let playerProgress = JSON.parse(
    localStorage.getItem("lastSecondProgress")
) || {
    level1Completed: false,
    level2Unlocked: false
};
function updateLevelSelect() {

    if (playerProgress.level1Completed) {
        level1Status.textContent = "COMPLETED";
        level2Status.textContent = "THE HUNT";
        level2Button.disabled = false;
    } else {
        level1Status.textContent = "THE TEST";
        level2Status.textContent = "LOCKED";
        level2Button.disabled = true;
    }

}
level1Button.addEventListener("click", function () {

    levelSelectScreen.style.display = "none";

    psychoScreen.style.display = "block";

    startPsychoDialogue();

});
level2Button.addEventListener("click", function () {

    if (!playerProgress.level2Unlocked) {
        return;
    }

    levelSelectScreen.style.display = "none";

    startLevel2();

});
resetProgressButton.addEventListener("click", function () {

    localStorage.removeItem("lastSecondProgress");

    playerProgress = {
        level1Completed: false,
        level2Unlocked: false
    };

    updateLevelSelect();

});


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
const psychoSkip = document.getElementById("psycho-skip");
const psychoActions = document.getElementById("psycho-actions");
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

// UNDO button for Challenge 1 (created here since it isn't in the HTML)
const memoryUndoBtn = document.createElement("button");
memoryUndoBtn.id = "memory-undo-btn";
memoryUndoBtn.className = "undo-btn";
memoryUndoBtn.textContent = "UNDO";
memoryUndoBtn.style.display = "none";
memorySubmit.insertAdjacentElement("afterend", memoryUndoBtn);

const resultMessage =
    document.getElementById("result-message");

const resultTime =
    document.getElementById("result-time");

const resultContinue =
    document.getElementById("result-continue");

let memoryQuestion = [];
let playerAnswer = [];
let memoryStartTime = 0;
let memoryTimerInterval = null;
// 6-symbol sequences drawn only from a 12-symbol pool:
// 🔑 🕯️ 📕 ⏰ 🌹 🎲 🧸 🔔 📷 🍎 🌙 🎸
const memoryQuestions = [
    ["🔑", "🕯️", "📕", "⏰", "🌹", "🎲"],
    ["🧸", "🔔", "📷", "🍎", "🌙", "🎸"],
    ["🌹", "🎲", "🧸", "🔔", "📷", "🍎"],
    ["🎸", "🔑", "🕯️", "📕", "⏰", "🌹"],
    ["📷", "🍎", "🌙", "🎸", "🔑", "🕯️"],
    ["📕", "⏰", "🌹", "🎲", "🧸", "🔔"],
    ["🌙", "🎸", "🔑", "🕯️", "📕", "⏰"],
    ["🎲", "🧸", "🔔", "📷", "🍎", "🌙"],
    ["🕯️", "📕", "⏰", "🌹", "🎲", "🧸"],
    ["🔔", "📷", "🍎", "🌙", "🎸", "🔑"],
    ["⏰", "🌹", "🎲", "🧸", "🔔", "📷"],
    ["🍎", "🌙", "🎸", "🔑", "🕯️", "📕"],
    ["🔑", "📷", "🎲", "🕯️", "🍎", "⏰"],
    ["🧸", "🌙", "🔔", "🎸", "📕", "🌹"],
    ["📕", "🔑", "🌹", "🍎", "🎲", "🌙"],
    ["🎸", "🧸", "⏰", "🔔", "🕯️", "📷"],
    ["🌹", "📷", "🔑", "🌙", "🧸", "📕"],
    ["🍎", "🎲", "🕯️", "🎸", "🔔", "⏰"],
    ["📷", "🌹", "🧸", "🔑", "📕", "🎸"],
    ["🌙", "⏰", "🍎", "🔔", "🎲", "🕯️"]
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
        word: "HOLE",
        clue: "The more of me you take away, the bigger I become.",
        difficulty: "easy"
    },
    {
        word: "TOMORROW",
        clue: "I am always a day away, yet I never arrive.",
        accept: ["FUTURE"],
        difficulty: "medium"
    },
    {
        word: "MAP",
        clue: "I have rivers without water, cities without people and roads without travellers.",
        accept: ["ATLAS"],
        difficulty: "medium"
    },
    {
        word: "BREATH",
        clue: "I am lighter than a feather, yet the strongest person cannot hold me for long.",
        accept: ["BREATHE"],
        difficulty: "medium"
    },
    {
        word: "KEYBOARD",
        clue: "I have many keys, yet I open no door. I have a space, yet no room.",
        difficulty: "easy"
    },
    {
        word: "NEEDLE",
        clue: "I have one eye, yet I cannot see. I pull a thread behind me.",
        difficulty: "easy"
    },
    {
        word: "SPONGE",
        clue: "I am full of holes, yet I still hold water.",
        difficulty: "easy"
    },
    {
        word: "TOWEL",
        clue: "The more I dry, the wetter I get.",
        difficulty: "easy"
    },
    {
        word: "COFFIN",
        clue: "The one who makes me does not need me. The one who buys me does not use me. The one who uses me never knows.",
        accept: ["CASKET"],
        difficulty: "hard"
    },
    {
        word: "FIRE",
        clue: "I am not alive, yet I grow. I have no lungs, yet I need air. Water kills me.",
        accept: ["FLAME"],
        difficulty: "medium"
    },
    {
        word: "ICE",
        clue: "I am made of water, but if you put me in water, I disappear.",
        difficulty: "medium"
    },
    {
        word: "STAMP",
        clue: "I travel all around the world while staying in one corner.",
        difficulty: "medium"
    },
    {
        word: "REFLECTION",
        clue: "You can see me in water, yet I never get wet.",
        accept: ["REFLECTIONS"],
        difficulty: "medium"
    },
    {
        word: "MOON",
        clue: "I wear a different face most nights, yet I never leave the sky.",
        difficulty: "easy"
    },
    {
        word: "LIGHTNING",
        clue: "You see me before you hear me, and I am gone before you can point.",
        difficulty: "medium"
    },
    {
        word: "PENCIL",
        clue: "I am dug out of the ground, locked inside wood, and used by almost everybody.",
        accept: ["PENCILS"],
        difficulty: "easy"
    },
    {
        word: "BOTTLE",
        clue: "I have a neck but no head, and a cap but no hair.",
        difficulty: "easy"
    },
    {
        word: "RIVER",
        clue: "I run but never walk. I have a mouth but never speak. I have a bed but never sleep.",
        difficulty: "medium"
    },
    {
        word: "NAME",
        clue: "I belong to you, yet other people use me far more than you do.",
        accept: ["NAMES"],
        difficulty: "medium"
    },
    {
        word: "SILENCE",
        clue: "Say my name and I am gone.",
        difficulty: "hard"
    },
    {
        word: "DARKNESS",
        clue: "The more of me there is, the less you can see.",
        accept: ["DARK"],
        difficulty: "medium"
    },
    {
        word: "TIME",
        clue: "I heal wounds and steal youth, yet nobody has ever held me.",
        difficulty: "medium"
    },
    {
        word: "MEMORY",
        clue: "I am the only proof of your past, yet I can be rewritten without you knowing.",
        accept: ["MEMORIES"],
        difficulty: "hard"
    },
    {
        word: "ANCHOR",
        clue: "I hold the heaviest ships still, yet I live at the bottom of the sea.",
        difficulty: "medium"
    },
    {
        word: "EGG",
        clue: "I have no doors, windows or hinges, yet something golden hides inside me.",
        accept: ["EGGS"],
        difficulty: "easy"
    },
    {
        word: "SMOKE",
        clue: "I rise from the fire without wings, and vanish without leaving a body.",
        difficulty: "medium"
    },
    {
        word: "WIND",
        clue: "You can hear me and feel me but never see me, and I bend the tallest trees.",
        difficulty: "medium"
    },
    {
        word: "INSOMNIA",
        clue: "I steal your sleep without ever entering your room.",
        difficulty: "hard"
    },
    {
        word: "NIGHTMARE",
        clue: "I visit you while you sleep, and the more you fear me, the more real I seem.",
        accept: ["NIGHTMARES", "DREAM"],
        difficulty: "hard"
    },
    {
        word: "SHADOW",
        clue: "I grow tallest just before the light disappears, and then I vanish completely.",
        accept: ["SHADOWS"],
        difficulty: "hard"
    },
    {
        word: "SECRET",
        clue: "I am only worth something while you keep me, and I break the moment you share me.",
        accept: ["SECRETS"],
        difficulty: "hard"
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
        scene: "🔔 🔑 🕯️ 📕 🧸 🚪 🌙",
        question: "Which object was NOT present?",
        options: ["🔔", "🌙", "🛎️", "🕯️"],
        answer: "🛎️",
        difficulty: "hard"
    },
    {
        scene: "🗝️ ⏰ 🌹 📷 🪞 🎲 🪑",
        question: "Which object was NOT present?",
        options: ["🪑", "🌹", "🗝️", "🔑"],
        answer: "🔑",
        difficulty: "hard"
    },
    {
        scene: "🕰️ 🕯️ 📗 🧸 🚪 🍏 🎸",
        question: "Which object was NOT present?",
        options: ["⏰", "📗", "🕰️", "🍏"],
        answer: "⏰",
        difficulty: "hard"
    },
    {
        scene: "🥀 🔔 📖 🔦 🧸 🎲 🪞",
        question: "Which object was NOT present?",
        options: ["🎲", "🌹", "🥀", "📖"],
        answer: "🌹",
        difficulty: "medium"
    },
    {
        scene: "🌕 🔒 📷 🕯️ 🪆 🎸 ⏳",
        question: "Which object was NOT present?",
        options: ["🌕", "🔒", "⏳", "🌙"],
        answer: "🌙",
        difficulty: "medium"
    },
    {
        scene: "📕 📘 📙 🔑 🧸 🌹 🚪",
        question: "Which object was NOT present?",
        options: ["📕", "📘", "🌹", "📗"],
        answer: "📗",
        difficulty: "hard"
    },
    {
        scene: "📸 🔔 🕯️ 🎸 🪞 🔓 🪑",
        question: "Which object was NOT present?",
        options: ["📸", "📷", "🔓", "🪑"],
        answer: "📷",
        difficulty: "hard"
    },
    {
        scene: "🪆 🔑 ⏱️ 🌙 🎲 📗 🍎",
        question: "Which object was NOT present?",
        options: ["⏱️", "🍎", "🧸", "🪆"],
        answer: "🧸",
        difficulty: "easy"
    },
    {
        scene: "🔦 🔔 📞 🧸 🌹 📕 🚪",
        question: "Which object was NOT present?",
        options: ["🌹", "📞", "☎️", "🚪"],
        answer: "☎️",
        difficulty: "hard"
    },
    {
        scene: "🍏 🕯️ 🔑 📷 🌙 🛎️ 🎸",
        question: "Which object was NOT present?",
        options: ["🍎", "🔑", "🛎️", "🍏"],
        answer: "🍎",
        difficulty: "medium"
    },
    {
        scene: "🔒 ⏰ 🌷 🪞 🧸 🎲 📻",
        question: "Which object was NOT present?",
        options: ["🔒", "🌷", "📻", "🔓"],
        answer: "🔓",
        difficulty: "medium"
    },
    {
        scene: "🖼️ 🔑 🕯️ 🪑 🔔 🌹 ⏳",
        question: "Which object was NOT present?",
        options: ["🪞", "⏳", "🕯️", "🖼️"],
        answer: "🪞",
        difficulty: "medium"
    },
    {
        scene: "🎻 🧸 📕 🔔 🌙 🔑 🕰️",
        question: "Which object was NOT present?",
        options: ["🧸", "🎸", "🕰️", "🎻"],
        answer: "🎸",
        difficulty: "medium"
    },
    {
        scene: "🌑 🔑 🪆 📷 🕯️ 📺 🍎",
        question: "Which object was NOT present?",
        options: ["🌑", "🌕", "📺", "🍎"],
        answer: "🌕",
        difficulty: "hard"
    },
    {
        scene: "🪟 🔔 🕯️ 🧸 📕 🌹 🎲",
        question: "Which object was NOT present?",
        options: ["🎲", "🪟", "🚪", "🔔"],
        answer: "🚪",
        difficulty: "medium"
    },
    {
        scene: "📖 📗 📘 📙 🕯️ 🔑 🌙",
        question: "Which object was NOT present?",
        options: ["🌙", "📘", "📖", "📕"],
        answer: "📕",
        difficulty: "hard"
    },
    {
        scene: "🔕 ⏰ 🌹 🧸 🪑 📷 🎲",
        question: "Which object was NOT present?",
        options: ["🎲", "🪑", "🔕", "🔔"],
        answer: "🔔",
        difficulty: "medium"
    },
    {
        scene: "🧵 🧩 🃏 🎲 🕯️ 🔑 📻",
        question: "Which object was NOT present?",
        options: ["✂️", "📻", "🃏", "🧵"],
        answer: "✂️",
        difficulty: "easy"
    },
    {
        scene: "📹 🔔 🌹 🪞 ⏰ 🧸 🚪",
        question: "Which object was NOT present?",
        options: ["🎥", "🚪", "📹", "🌹"],
        answer: "🎥",
        difficulty: "hard"
    },
    {
        scene: "🛋️ 🪑 🕯️ 📕 🔑 🌙 🧸",
        question: "Which object was NOT present?",
        options: ["🛏️", "🛋️", "🪑", "🧸"],
        answer: "🛏️",
        difficulty: "medium"
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
        question: "1   2   6   24   120   ?",
        options: ["600", "620", "720", "840"],
        answer: "720",
        difficulty: "medium"
    },
    {
        question: "2   6   12   20   30   ?",
        options: ["40", "42", "44", "48"],
        answer: "42",
        difficulty: "easy"
    },
    {
        question: "1   3   7   15   31   ?",
        options: ["47", "55", "62", "63"],
        answer: "63",
        difficulty: "medium"
    },
    {
        question: "3   5   9   17   33   ?",
        options: ["63", "65", "66", "69"],
        answer: "65",
        difficulty: "medium"
    },
    {
        question: "1   2   4   7   11   16   ?",
        options: ["21", "22", "23", "24"],
        answer: "22",
        difficulty: "medium"
    },
    {
        question: "0   1   1   2   4   7   13   ?",
        options: ["20", "21", "24", "26"],
        answer: "24",
        difficulty: "hard"
    },
    {
        question: "10   9   7   4   0   ?",
        options: ["-4", "-5", "-6", "-10"],
        answer: "-5",
        difficulty: "easy"
    },
    {
        question: "2   10   4   20   8   40   ?",
        options: ["16", "32", "48", "80"],
        answer: "16",
        difficulty: "hard"
    },
    {
        question: "3   6   5   10   9   18   ?",
        options: ["16", "17", "19", "36"],
        answer: "17",
        difficulty: "medium"
    },
    {
        question: "1   4   10   22   46   ?",
        options: ["82", "90", "92", "94"],
        answer: "94",
        difficulty: "hard"
    },
    {
        question: "7   9   13   21   37   ?",
        options: ["61", "65", "69", "74"],
        answer: "69",
        difficulty: "medium"
    },
    {
        question: "2   4   12   48   240   ?",
        options: ["960", "1200", "1440", "2400"],
        answer: "1440",
        difficulty: "medium"
    },
    {
        question: "2   12   36   80   150   ?",
        options: ["216", "240", "252", "256"],
        answer: "252",
        difficulty: "hard"
    },
    {
        question: "1   11   21   1211   111221   ?",
        options: ["3112", "211211", "312211", "1112221"],
        answer: "312211",
        difficulty: "hard"
    },
    {
        question: "5   10   20   40   80   ?",
        options: ["120", "140", "160", "200"],
        answer: "160",
        difficulty: "easy"
    },
    {
        question: "1   4   9   16   25   ?",
        options: ["30", "32", "36", "49"],
        answer: "36",
        difficulty: "easy"
    },
    {
        question: "2   3   5   8   13   ?",
        options: ["18", "20", "21", "24"],
        answer: "21",
        difficulty: "medium"
    },
    {
        question: "100   90   81   73   66   ?",
        options: ["58", "60", "62", "65"],
        answer: "60",
        difficulty: "medium"
    },
    {
        question: "3   9   27   81   243   ?",
        options: ["486", "600", "729", "810"],
        answer: "729",
        difficulty: "easy"
    },
    {
        question: "6   11   21   36   56   ?",
        options: ["76", "80", "81", "86"],
        answer: "81",
        difficulty: "hard"
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

// UNDO button for Challenge 5 (created here since it isn't in the HTML)
const patternUndoBtn = document.createElement("button");
patternUndoBtn.id = "pattern-undo-btn";
patternUndoBtn.className = "undo-btn";
patternUndoBtn.textContent = "UNDO";
patternUndoBtn.style.display = "none";
patternSubmit.insertAdjacentElement("afterend", patternUndoBtn);

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
        pattern: ["▲", "■", "◆", "★", "■", "▲"],
        options: ["▲", "■", "◆", "★", "●"]
    },
    {
        pattern: ["●", "▼", "♥", "●", "▼", "■"],
        options: ["●", "▼", "♥", "■", "★"]
    },
    {
        pattern: ["★", "◆", "▲", "★", "◆", "▼"],
        options: ["★", "◆", "▲", "▼", "●"]
    },
    {
        pattern: ["■", "♥", "●", "■", "♥", "▲"],
        options: ["■", "♥", "●", "▲", "◆"]
    },
    {
        pattern: ["▼", "★", "◆", "▼", "★", "■"],
        options: ["▼", "★", "◆", "■", "♥"]
    },
    {
        pattern: ["●", "▲", "♥", "●", "▲", "★"],
        options: ["●", "▲", "♥", "★", "■"]
    },
    {
        pattern: ["◆", "■", "▼", "◆", "■", "♥"],
        options: ["◆", "■", "▼", "♥", "▲"]
    },
    {
        pattern: ["▲", "★", "●", "▲", "★", "◆"],
        options: ["▲", "★", "●", "◆", "▼"]
    },
    {
        pattern: ["♥", "▼", "■", "♥", "▼", "★"],
        options: ["♥", "▼", "■", "★", "●"]
    },
    {
        pattern: ["●", "◆", "▲", "●", "◆", "♥"],
        options: ["●", "◆", "▲", "♥", "■"]
    },
    {
        pattern: ["■", "▲", "★", "■", "▲", "♥"],
        options: ["■", "▲", "★", "♥", "●"]
    },
    {
        pattern: ["◆", "●", "▼", "◆", "●", "★"],
        options: ["◆", "●", "▼", "★", "▲"]
    },
    {
        pattern: ["▼", "♥", "▲", "▼", "♥", "◆"],
        options: ["▼", "♥", "▲", "◆", "■"]
    },
    {
        pattern: ["★", "■", "●", "★", "■", "▼"],
        options: ["★", "■", "●", "▼", "♥"]
    },
    {
        pattern: ["♥", "◆", "▲", "♥", "◆", "●"],
        options: ["♥", "◆", "▲", "●", "★"]
    },
    {
        pattern: ["▲", "▼", "■", "▲", "▼", "★"],
        options: ["▲", "▼", "■", "★", "♥"]
    },
    {
        pattern: ["●", "★", "♥", "●", "★", "▲"],
        options: ["●", "★", "♥", "▲", "◆"]
    },
    {
        pattern: ["◆", "▼", "●", "◆", "▼", "■"],
        options: ["◆", "▼", "●", "■", "♥"]
    },
    {
        pattern: ["■", "♥", "▼", "■", "♥", "●"],
        options: ["■", "♥", "▼", "●", "▲"]
    },
    {
        pattern: ["▲", "◆", "★", "▲", "◆", "♥"],
        options: ["▲", "◆", "★", "♥", "●"]
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
const restartGameBtn =
    document.getElementById("restart-game-btn");

const restartConfirm =
    document.getElementById("restart-confirm");

const restartConfirmBtn =
    document.getElementById("restart-confirm-btn");

const restartCancelBtn =
    document.getElementById("restart-cancel-btn");

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

const startLeaderboardBtn =
    document.getElementById("start-leaderboard-btn");

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
function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

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
                ${index + 1}
            </span>

            <span>
                ${escapeHtml(player.name)}
            </span>

            <span>
                ${escapeHtml(player.gender)}
            </span>

            <span class="leaderboard-time">
                ${Number(player.total_time).toFixed(2)}s
            </span>

            <span class="leaderboard-accuracy">
                ${Number(player.accuracy).toFixed(2)}s
            </span>
        `;

        leaderboardEntries.appendChild(entry);

    });
}

function openLeaderboard() {

    // Hide game screens
    startScreen.style.display = "none";
    memoryScreen.style.display = "none";
    wordScreen.style.display = "none";
    observationScreen.style.display = "none";
    logicScreen.style.display = "none";
    logicResultScreen.style.display = "none";
    patternScreen.style.display = "none";
    patternResultScreen.style.display = "none";
    psychoScreen.style.display = "none";
    finalScreen.style.display = "none";

    // Hide restart button
    restartGameBtn.style.display = "none";

    // Show leaderboard
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
startLeaderboardBtn.addEventListener(
    "click",
    function() {

        startScreen.style.display = "none";

        openLeaderboard();

    }
);
const robotHuntScreen = document.getElementById("robot-hunt-screen");
const robotArena = document.getElementById("robot-arena");
const robotHuntTimer = document.getElementById("robot-hunt-timer");
const robotHuntMessage = document.getElementById("robot-hunt-message");
const robotRestartButton =
    document.getElementById("robot-restart-btn");


let robotHuntStartTime = 0;
let robotHuntTimerInterval = null;
let robotMoveTimeout = null;
let robotHuntCount = 0;
const ROBOTS_TO_HIT = 10;

// CARD CHALLENGE
const cardScreen =
    document.getElementById("card-screen");

const cardMessage =
    document.getElementById("card-message");

const cardStartButton =
    document.getElementById("card-start-btn");

const cardArena =
    document.getElementById("card-arena");

const cardTimer =
    document.getElementById("card-timer");

let cardStartTime = 0;
let cardTimerInterval = null;
let cardValues = ["♠", "♥", "♦", "♣"];
let correctCardIndex = 0;
let cardShuffleTimeout = null;

// 9-DOT PATTERN CHALLENGE

const pattern9Screen =
    document.getElementById("pattern9-screen");

const pattern9Message =
    document.getElementById("pattern9-message");

const pattern9Timer =
    document.getElementById("pattern9-timer");

const pattern9StartButton =
    document.getElementById("pattern9-start-btn");

const pattern9Dots =
    document.querySelectorAll(".pattern-dot");

let pattern9Target = [];
let pattern9Player = [];

let pattern9StartTime = 0;
let pattern9TimerInterval = null;

const PATTERN9_TIME_LIMIT = 5;

// GRID CHALLENGE

const gridScreen =
    document.getElementById("grid-screen");

const gridMessage =
    document.getElementById("grid-message");

const gridStartButton =
    document.getElementById("grid-start-btn");

const reactionGrid =
    document.getElementById("reaction-grid");

const gridTimer =
    document.getElementById("grid-timer");

const gridMisses =
    document.getElementById("grid-misses");

let gridStartTime = 0;
let gridTimerInterval = null;
let gridActiveSquare = null;
let gridMissCount = 0;
let gridRound = 0;

const GRID_TOTAL_ROUNDS = 20;

// TWO DOORS CHALLENGE

const doorScreen =
    document.getElementById("door-screen");

const doorMessage =
    document.getElementById("door-message");

const doorQuestion =
    document.getElementById("door-question");

const doorLeft =
    document.getElementById("door-left");

const doorRight =
    document.getElementById("door-right");

const doorTimer =
    document.getElementById("door-timer");

const doorStartButton =
    document.getElementById("door-start-btn");

let doorStartTime = 0;
let doorTimerInterval = null;
let correctDoor = "";
const doorQuestions = [
    {
        question: "A farmer has 17 sheep. All but 9 run away. How many are left?",
        left: "8",
        right: "9",
        answer: "RIGHT"
    },
    {
        question: "A clock takes 5 seconds to strike 6 times. How long does it take to strike 12 times?",
        left: "10 seconds",
        right: "11 seconds",
        answer: "RIGHT"
    },
    {
        question: "A number is doubled and then increased by 10. The result is 34. What was the number?",
        left: "12",
        right: "14",
        answer: "LEFT"
    },
    {
        question: "What comes next? 1, 11, 21, 1211, 111221, ...",
        left: "312211",
        right: "311221",
        answer: "LEFT"
    },
    {
        question: "A father is 4 times as old as his son. In 20 years, he will be twice as old. How old is the son now?",
        left: "10",
        right: "15",
        answer: "LEFT"
    },
    {
        question: "All Bloops are Razzies. All Razzies are Lazzies. Which must be true?",
        left: "All Bloops are Lazzies",
        right: "All Lazzies are Bloops",
        answer: "LEFT"
    },
    {
        question: "Five machines make five objects in five minutes. How long do 100 machines take to make 100 objects?",
        left: "5 minutes",
        right: "100 minutes",
        answer: "LEFT"
    },
    {
        question: "A room has four corners. A cat sits in each corner. Each cat sees three other cats. How many cats are there?",
        left: "12",
        right: "4",
        answer: "RIGHT"
    },
    {
        question: "A train travels 60 km in 45 minutes. At the same speed, how far does it travel in 2 hours?",
        left: "160 km",
        right: "150 km",
        answer: "LEFT"
    },
    {
        question: "You have 8 identical balls. One is heavier. Can you always find it using a balance scale only twice?",
        left: "Yes",
        right: "No",
        answer: "RIGHT"
    },
    {
        question: "If 3 pencils cost ₹15, how much do 8 pencils cost?",
        left: "₹40",
        right: "₹45",
        answer: "LEFT"
    },
    {
        question: "A sequence follows: 2, 6, 12, 20, 30, ?. What comes next?",
        left: "40",
        right: "42",
        answer: "RIGHT"
    },
    {
        question: "If yesterday was Monday, what day will it be 3 days after tomorrow?",
        left: "Friday",
        right: "Saturday",
        answer: "RIGHT"
    },
    {
        question: "A bat and ball cost ₹110 together. The bat costs ₹100 more than the ball. How much does the ball cost?",
        left: "₹5",
        right: "₹10",
        answer: "LEFT"
    },
    {
        question: "A number is divisible by both 3 and 4. Which number could it be?",
        left: "18",
        right: "24",
        answer: "RIGHT"
    },
    {
        question: "You have 10 candles. You blow out 3. How many candles remain?",
        left: "3",
        right: "10",
        answer: "RIGHT"
    },
    {
        question: "What comes next? 3, 8, 15, 24, 35, ?",
        left: "48",
        right: "50",
        answer: "LEFT"
    },
    {
        question: "A father and son have a combined age of 66. The father's age is the son's age reversed. What ages could they be?",
        left: "51 and 15",
        right: "42 and 24",
        answer: "LEFT"
    },
    {
        question: "If 5 workers finish a job in 12 days, how many days would 10 workers take at the same rate?",
        left: "6 days",
        right: "8 days",
        answer: "LEFT"
    },
    {
        question: "A box contains 6 red, 6 blue and 6 green balls. Without looking, what is the minimum number you must pick to guarantee two balls of the same colour?",
        left: "4",
        right: "5",
        answer: "LEFT"
    },
    {
        question: "A sequence follows: 81, 27, 9, 3, ?. What comes next?",
        left: "1",
        right: "0",
        answer: "LEFT"
    },
    {
        question: "There are 12 months. How many months have 28 days?",
        left: "1",
        right: "12",
        answer: "RIGHT"
    },
    {
        question: "A farmer has chickens and cows. There are 10 heads and 28 legs. How many cows are there?",
        left: "4",
        right: "6",
        answer: "LEFT"
    },
    {
        question: "What is the smallest positive number that is divisible by both 6 and 8?",
        left: "24",
        right: "48",
        answer: "LEFT"
    }
];
function startDoorChallenge() {

    doorScreen.style.display = "block";

    doorStartButton.style.display = "none";

    document.querySelector(".door-instructions").style.display = "none";

    doorLeft.style.display = "inline-block";
    doorRight.style.display = "inline-block";

    doorMessage.textContent =
        "Choose the correct answer.";

    doorTimer.textContent =
        "TIME: 0.00";

    // Pick a random question
    const question =
        doorQuestions[
            Math.floor(Math.random() * doorQuestions.length)
        ];

    // Save the question for this attempt
    window.currentDoorQuestion = question;

    setupDoorAnswers(question);

    doorStartTime = performance.now();

    clearInterval(doorTimerInterval);

    doorTimerInterval = setInterval(function() {

        const elapsed =
            (performance.now() - doorStartTime) / 1000;

        doorTimer.textContent =
            "TIME: " + elapsed.toFixed(2);

    }, 10);
}
function setupDoorAnswers(question) {

    // Randomly decide which physical door gets the correct answer
    const correctOnLeft = Math.random() < 0.5;

    if (correctOnLeft) {

        doorLeft.textContent = question.left;
        doorRight.textContent = question.right;

        correctDoor = "LEFT";

    } else {

        doorLeft.textContent = question.right;
        doorRight.textContent = question.left;

        correctDoor = "RIGHT";
    }

    doorQuestion.textContent =
        question.question;
}
function chooseDoor(side) {

    doorLeft.disabled = true;
    doorRight.disabled = true;

    clearInterval(doorTimerInterval);
    
    if (side === correctDoor) {
        level2DoorTime =
    (performance.now() - doorStartTime) / 1000;
        const level1Total =
        memoryTime +
        wordTime +
        observationTime +
        logicTime +
        patternTime;

    const level2Total =
        level2RobotTime +
        level2CardTime +
        level2PatternTime +
        level2DoorTime;

    totalChallengeTime =
        level1Total + level2Total;

    doorMessage.textContent =
        "LEVEL 2 COMPLETE.";

    doorQuestion.textContent =
        "YOU SURVIVED THE HUNT.";

    doorLeft.style.display = "none";
    doorRight.style.display = "none";

    console.log("LEVEL 2 COMPLETE");

    setTimeout(function() {

    const combinedAccuracy =
        level2Misses + finalAccuracy;

    saveLeaderboardScore();

    doorMessage.textContent =
        "ALL FIVE CHALLENGES COMPLETED.";

    console.log(
        "FINAL SCORE:",
        totalChallengeTime.toFixed(2),
        "seconds"
    );

    console.log(
        "FINAL ACCURACY:",
        combinedAccuracy.toFixed(2)
    );

    setTimeout(function() {
        openLeaderboard();
    }, 1500);

}, 1500);
} else {

        doorMessage.textContent =
            "WRONG DOOR. LEVEL 2 FAILED.";

        console.log("DOOR CHALLENGE FAILED");

        setTimeout(function() {
            restartLevel2();
        }, 1200);
    }
}
doorLeft.addEventListener("click", function() {
    chooseDoor("LEFT");
});

doorRight.addEventListener("click", function() {
    chooseDoor("RIGHT");
});
doorStartButton.addEventListener("click", function() {
    startDoorChallenge();
});


function createReactionGrid() {
    reactionGrid.innerHTML = "";

    for (let i = 0; i < 25; i++) {

        const square = document.createElement("button");

        square.className = "grid-square";
        square.dataset.index = i;

        square.addEventListener("click", function() {
            handleGridClick(square);
        });

        reactionGrid.appendChild(square);
    }
}
let gridMoveTimeout = null;

function showNextGridSquare() {
    const squares = document.querySelectorAll(".grid-square");

    squares.forEach(function(square) {
        square.classList.remove("active");
    });

    const randomIndex = Math.floor(Math.random() * squares.length);
    gridActiveSquare = randomIndex;

    squares[randomIndex].classList.add("active");

    const speed = Math.max(100, 500 - (gridRound * 20));

    clearTimeout(gridMoveTimeout);

    gridMoveTimeout = setTimeout(function() {
        if (gridRound < GRID_TOTAL_ROUNDS) {
            showNextGridSquare();
        }
    }, speed);
}
function handleGridClick(square) {

    const clickedIndex =
        Number(square.dataset.index);

    // Correct square
    if (clickedIndex === gridActiveSquare) {

        gridRound++;

        // Challenge complete
        if (gridRound >= GRID_TOTAL_ROUNDS) {

            clearInterval(gridTimerInterval);
            level2Misses = gridMissCount;

            document.querySelectorAll(".grid-square")
                .forEach(function(square) {
                    square.classList.remove("active");
                });

            gridMessage.textContent =
                "GRID COMPLETE.";

            console.log(
                "GRID COMPLETE | MISSES:",
                gridMissCount
            );

            setTimeout(function() {

    gridScreen.style.display = "none";

    doorScreen.style.display = "block";

    doorStartButton.style.display = "inline-block";

    doorMessage.textContent =
        "Answer the question and choose the correct door.";

    doorTimer.textContent =
        "TIME: 0.00";

}, 1200);

return;
        }

        // Wait for the current speed cycle
        return;
    }

    // Wrong square
    gridMissCount++;

gridMisses.textContent =
    "MISSES: " + gridMissCount;

if (gridMissCount > 2) {

    clearInterval(gridTimerInterval);
    clearTimeout(gridMoveTimeout);

    document.querySelectorAll(".grid-square")
        .forEach(function(square) {
            square.classList.remove("active");
        });

    gridMessage.textContent =
        "TOO MANY MISSES. LEVEL 2 FAILED.";

    console.log(
        "GRID FAILED | MISSES:",
        gridMissCount
    );

    setTimeout(function() {
        restartLevel2();
    }, 1200);
}
}
function startGridChallenge() {

    gridScreen.style.display = "block";

    gridStartButton.style.display = "none";

    document.querySelector(".grid-instructions").style.display = "none";

    gridMessage.textContent =
        "Hit the glowing square.";

    gridTimer.textContent =
        "TIME: 0.00";

    gridMissCount = 0;
    gridRound = 0;
    gridMisses.textContent = "MISSES: 0";

    createReactionGrid();

    gridStartTime = performance.now();

    clearInterval(gridTimerInterval);

    gridTimerInterval = setInterval(function() {

        const elapsed =
            (performance.now() - gridStartTime) / 1000;

        gridTimer.textContent =
            "TIME: " + elapsed.toFixed(2);

    }, 10);

    showNextGridSquare();
}
gridStartButton.addEventListener("click", function() {
    startGridChallenge();
});

function generatePattern9() {

    const allDots = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    // Shuffle the dots
    allDots.sort(function() {
        return Math.random() - 0.5;
    });

    // Use 5 dots for the pattern
    pattern9Target = allDots.slice(0, 5);

    pattern9Player = [];

    console.log("PATTERN:", pattern9Target);
}
function startPattern9Challenge() {

    pattern9Screen.style.display = "block";

    pattern9StartButton.style.display = "none";
    document.querySelector(".pattern9-instructions").style.display = "none";

    pattern9Message.textContent =
        "Memorize the pattern.";

    pattern9Timer.textContent =
        "TIME: 0.00";

    pattern9Dots.forEach(function(dot) {
        dot.classList.remove("active");
        dot.classList.remove("selected");
    });

    generatePattern9();

    showPattern9();
}
pattern9StartButton.addEventListener("click", function() {

    startPattern9Challenge();

});
function showPattern9() {

    pattern9Target.forEach(function(dotNumber, index) {

        setTimeout(function() {

            const dot =
                document.querySelector(
                    '.pattern-dot[data-dot="' +
                    dotNumber +
                    '"]'
                );

            dot.classList.add("active");

            setTimeout(function() {
                dot.classList.remove("active");
            }, 350);

        }, index * 400);

    });

    setTimeout(function() {

        pattern9Message.textContent =
            "NOW RECREATE THE PATTERN.";

        startPattern9Timer();

    }, pattern9Target.length * 400 + 500);
}
function startPattern9Timer() {

    pattern9StartTime = performance.now();

    clearInterval(pattern9TimerInterval);

    pattern9TimerInterval = setInterval(function() {

        const elapsed =
            (performance.now() - pattern9StartTime) / 1000;

        pattern9Timer.textContent =
            "TIME: " + elapsed.toFixed(2);

        if (elapsed >= PATTERN9_TIME_LIMIT) {

            clearInterval(pattern9TimerInterval);

            pattern9Message.textContent =
                "TIME'S UP. LEVEL 2 FAILED.";

            setTimeout(function() {
                restartLevel2();
            }, 1200);
        }

    }, 10);
}
pattern9Dots.forEach(function(dot) {

    dot.addEventListener("click", function() {

        if (pattern9Player.length >= pattern9Target.length) {
            return;
        }

        const dotNumber =
            Number(dot.dataset.dot);

        pattern9Player.push(dotNumber);

        dot.classList.add("selected");

        const currentIndex =
            pattern9Player.length - 1;

        // Check immediately
        if (
            dotNumber !==
            pattern9Target[currentIndex]
        ) {

            clearInterval(pattern9TimerInterval);

            pattern9Message.textContent =
                "WRONG PATTERN. LEVEL 2 FAILED.";

            pattern9Dots.forEach(function(d) {
                d.disabled = true;
            });

            setTimeout(function() {
                restartLevel2();
            }, 1200);

            return;
        }

        // Pattern completed correctly
        if (
            pattern9Player.length ===
            pattern9Target.length
        ) {

            clearInterval(pattern9TimerInterval);
            level2PatternTime =
    (performance.now() - pattern9StartTime) / 1000;

            pattern9Message.textContent =
                "PATTERN COMPLETE.";

            pattern9Dots.forEach(function(d) {
    d.disabled = true;
});

console.log(
    "PATTERN 9 COMPLETE:",
    pattern9Player
);

setTimeout(function() {
    pattern9Screen.style.display = "none";
    gridScreen.style.display = "block";
    gridStartButton.style.display = "inline-block";
    gridMessage.textContent = "Hit the glowing square.";
    gridTimer.textContent = "TIME: 0.00";
    gridMisses.textContent = "MISSES: 0";
}, 1200);
        }

    });

});

function startCardChallenge() {

    cardScreen.style.display = "block";

    cardStartButton.style.display = "none";
    document.querySelector(".card-instructions").style.display = "none";
    cardArena.innerHTML = "";

    cardMessage.textContent =
        "Memorize the card.";

    cardTimer.textContent =
        "TIME: 0.00";

    createCards();

}
cardStartButton.addEventListener("click", function() {

    cardStartButton.style.display = "none";

    startCardChallenge();

});
function createCards() {

    cardArena.innerHTML = "";

    const targetValue =
        cardValues[Math.floor(Math.random() * cardValues.length)];

    correctCardIndex =
        cardValues.indexOf(targetValue);

    // Create all 4 cards
    cardValues.forEach(function(value, index) {

        const card = document.createElement("button");

        card.className = "playing-card";
        card.dataset.value = value;
        card.dataset.index = index;
        card.disabled = true;

        card.innerHTML = `
            <span class="card-front">${value}</span>
            <span class="card-back">?</span>
        `;

        cardArena.appendChild(card);
    });

    const cards =
        Array.from(document.querySelectorAll(".playing-card"));

    // Hide all cards initially
    cards.forEach(function(card) {
        card.style.display = "none";
    });

    // Show ONLY the target card
    const targetCard = cards[correctCardIndex];

    targetCard.style.display = "block";
    targetCard.style.left = "225px";
    targetCard.classList.add("flipped");

    cardMessage.textContent =
        "MEMORIZE THIS CARD: " + targetValue;

    // Give the player 2 seconds to memorize it
    setTimeout(function() {

        // Flip target face-down
        targetCard.classList.remove("flipped");

        cardMessage.textContent =
            "GET READY...";

        setTimeout(function() {

            // Show all cards
            cards.forEach(function(card, index) {

                card.style.display = "block";
                card.style.left =
                    [0, 145, 290, 435][index] + "px";

            });

            cardMessage.textContent =
                "FOLLOW THE CARD...";

            // Now start the actual shuffle
            setTimeout(function() {
                shuffleCards();
            }, 500);

        }, 500);

    }, 2000);
}
function flipCards() {

    const cards = document.querySelectorAll(".playing-card");

    cards.forEach(function(card) {
        card.classList.add("flipped");
    });

    cardMessage.textContent = "Watch carefully...";

    setTimeout(function() {
        shuffleCards();
    }, 800);
}

function shuffleCards() {

    const cards = Array.from(
        document.querySelectorAll(".playing-card")
    );

    const positions = [0, 145, 290, 435];

    // Put cards in their starting positions
    cards.forEach(function(card, index) {
        card.style.left = positions[index] + "px";
        card.disabled = true;
    });

    cardMessage.textContent =
        "FOLLOW THE CARD...";

    let shuffleCount = 0;

    function doShuffle() {

        if (shuffleCount >= 12) {

            cardMessage.textContent =
                "WHICH CARD WAS IT?";

            // Start timer ONLY after shuffle
            cardStartTime = performance.now();

            clearInterval(cardTimerInterval);

            cardTimerInterval = setInterval(function() {

                const elapsed =
                    (performance.now() - cardStartTime) / 1000;

                cardTimer.textContent =
                    "TIME: " + elapsed.toFixed(2);

            }, 10);

            enableCardSelection();

            return;
        }

        let first =
            Math.floor(Math.random() * cards.length);

        let second =
            Math.floor(Math.random() * cards.length);

        while (second === first) {
            second =
                Math.floor(Math.random() * cards.length);
        }

        // Get current positions
        const firstLeft =
            parseInt(cards[first].style.left);

        const secondLeft =
            parseInt(cards[second].style.left);

        // Visually move the cards
        cards[first].style.left =
            secondLeft + "px";

        cards[second].style.left =
            firstLeft + "px";

        // Swap their stored positions
        const temp = cards[first];
        cards[first] = cards[second];
        cards[second] = temp;

        shuffleCount++;

        setTimeout(doShuffle, 350);
    }

    setTimeout(doShuffle, 500);
}

function enableCardSelection() {

    const cards = document.querySelectorAll(".playing-card");

    cards.forEach(function(card) {

        card.disabled = false;

        card.onclick = function() {

            // Stop the player from selecting another card
            cards.forEach(function(c) {
                c.disabled = true;
            });

            // Reveal selected card
            card.classList.add("flipped");

            cardMessage.textContent =
                "CHECKING...";

            setTimeout(function() {

                if (card.dataset.value === cardValues[correctCardIndex]) {

    clearInterval(cardTimerInterval);
    level2CardTime =
    (performance.now() - cardStartTime) / 1000;

    cardMessage.textContent =
        "CORRECT! YOU FOUND IT.";

    console.log("CARD CHALLENGE PASSED");

    setTimeout(function() {

        cardScreen.style.display = "none";

        pattern9Screen.style.display = "block";

        pattern9StartButton.style.display =
            "inline-block";

        pattern9Message.textContent =
            "Memorize the pattern.";

        pattern9Timer.textContent =
            "TIME: 0.00";

    }, 1200);

                } else {

                    clearInterval(cardTimerInterval);

                    cardMessage.textContent =
                        "WRONG CARD. LEVEL 2 FAILED.";

                    console.log("CARD CHALLENGE FAILED");

                    setTimeout(function() {
                        restartLevel2();
                    }, 1500);
                }

            }, 700);
        };
    });
}
function restartLevel2() {

    clearInterval(robotHuntTimerInterval);
    clearTimeout(robotMoveTimeout);
    clearInterval(gridTimerInterval);

    robotArena.innerHTML = "";

    level2Screen.style.display = "none";
    robotHuntScreen.style.display = "block";

    robotHuntMessage.textContent =
        "LEVEL 2 FAILED. READY TO RESTART?";

    robotRestartButton.style.display = "inline-block";
}
robotRestartButton.addEventListener("click", function() {

    restartLevel2();

});

function startLevel2() {

    level2Screen.style.display = "block";
    robotHuntScreen.style.display = "none";

    level2StartButton.style.display = "inline-block";

}
level2StartButton.addEventListener("click", function() {

    level2Screen.style.display = "none";
    robotHuntScreen.style.display = "block";

    startRobotHunt();

});
function startRobotHunt() {

    robotHuntScreen.style.display = "block";

    robotHuntCount = 0;
    robotArena.innerHTML = "";
    robotHuntMessage.textContent = "Shoot every robot before it disappears.";

    robotHuntStartTime = performance.now();

    clearInterval(robotHuntTimerInterval);

    robotHuntTimerInterval = setInterval(function () {
        const elapsed =
            (performance.now() - robotHuntStartTime) / 1000;

        robotHuntTimer.textContent =
            "TIME: " + elapsed.toFixed(2);
    }, 10);

    showRobot();
}
function showRobot() {

    robotArena.innerHTML = "";

    const robot = document.createElement("div");

    robot.className = "robot-target";
    robot.textContent = "🤖";

    const maxX = robotArena.clientWidth - 55;
    const maxY = robotArena.clientHeight - 55;

    robot.style.left = Math.random() * maxX + "px";
    robot.style.top = Math.random() * maxY + "px";

    robotArena.appendChild(robot);

    robotMoveTimeout = setTimeout(function () {

    clearInterval(robotHuntTimerInterval);

    robotArena.innerHTML = "";

    robotHuntMessage.textContent =
        "YOU MISSED. LEVEL 2 FAILED.";

    robotRestartButton.style.display = "inline-block";

}, 1000);

    robot.addEventListener("click", function () {

        clearTimeout(robotMoveTimeout);

        robotHuntCount++;

        
        if (robotHuntCount >= ROBOTS_TO_HIT) {
    clearInterval(robotHuntTimerInterval);
    level2RobotTime =
    (performance.now() - robotHuntStartTime) / 1000;

    robotHuntMessage.textContent =
        "ROBOT HUNT COMPLETE.";

    setTimeout(function() {
        robotHuntScreen.style.display = "none";
        cardScreen.style.display = "block";

        cardStartButton.style.display = "inline-block";
        cardArena.innerHTML = "";

        cardMessage.textContent =
            "Watch the card carefully.";
        cardTimer.textContent =
            "TIME: 0.00";
    }, 1200);

    return;
}
        showRobot();
    });
}
// =========================
// PLAYER SCORE
// =========================

let memoryTime = 0;
let wordTime = 0;
let observationTime = 0;
let logicTime = 0;
let patternTime = 0;

let level2RobotTime = 0;
let level2CardTime = 0;
let level2PatternTime = 0;
let level2DoorTime = 0;
let level2Misses = 0;

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

    levelSelectScreen.style.display = "block";

    updateLevelSelect();

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
let dialogueTyping = null;
// Psycho button: the last line of the opening dialogue starts Challenge 01
function updatePsychoButton() {

    const isIntro =
        psychoScreen.dataset.ending !== "true" &&
        psychoScreen.dataset.twist !== "true";

    const isLastLine = dialogueIndex === dialogues.length - 1;

    if (isIntro && isLastLine) {
        psychoNext.textContent = "START CHALLENGE 01";
    } else {
        psychoNext.textContent = "CONTINUE";
    }

    // Last line of the opening scene: one button, centred
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

    dialogueTyping = setInterval(function() {

        psychoText.textContent += dialogue[index];

        index++;

        if (index >= dialogue.length) {

            clearInterval(dialogueTyping);

            dialogueTyping = null;

            psychoNext.classList.add("visible");

        }

    }, 45);
}

// ---------- FAST-FORWARD PSYCHO ----------

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
    function(event) {

        if (event.target.closest("button")) return;

        finishDialogueTyping();
    }
);

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
    restartGameBtn.style.display = "block";

    memoryScreen.style.display = "block";

    // Choose a random question only when the challenge starts.
    // Every entry in memoryQuestions is a 6-symbol sequence.
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
    memoryUndoBtn.style.display = "none";

    // Challenge timer starts

    let countdown = MEMORIZE_SECONDS;

    memoryTimer.textContent =
        "MEMORIZE: " + countdown;

    clearInterval(memoryTimerInterval);

    memoryTimerInterval = setInterval(function () {

        countdown--;
        if (countdown > 0) {

    memoryTimer.textContent =
        "MEMORIZE: " + countdown;

} else {

    clearInterval(memoryTimerInterval);

    memorySequence.textContent = "";

    memoryMessage.textContent =
        "Recreate the sequence.";

    memoryTimer.textContent =
        "YOUR TURN";

    // Timer starts only when the player can answer
    memoryStartTime = performance.now();

    showMemoryOptions();

    memorySubmit.style.display = "block";
}
        

    }, 1000);
}


// Maps each emoji symbol to its button for this round, so UNDO can
// find and deselect the right one.
let memorySymbolButtons = {};

function updateSelectedSequence() {

    selectedSequence.textContent =
        playerAnswer.join(" ");
}

function showMemoryOptions() {

    memorySymbolButtons = {};

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

        memorySymbolButtons[symbol] = button;

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

    memoryUndoBtn.style.display = "inline-block";
}

memoryUndoBtn.addEventListener("click", function() {

    if (playerAnswer.length === 0) return;

    const lastSymbol = playerAnswer.pop();

    updateSelectedSequence();

    const button = memorySymbolButtons[lastSymbol];

    if (button) {
        button.classList.remove("selected");
    }
});
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
    memoryUndoBtn.style.display = "none";

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

    // Pick a question from the "easy" tier - the first content challenge
    currentWordQuestion =
        pickQuestionByDifficulty(wordQuestions, "easy");

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
    if (
        playerAnswer === currentWordQuestion.word ||
        (currentWordQuestion.accept || []).includes(playerAnswer)
    ) {

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
        { left: "4%", top: "10%" },
        { left: "28%", top: "6%" },
        { left: "52%", top: "12%" },
        { left: "76%", top: "8%" },
        { left: "10%", top: "54%" },
        { left: "34%", top: "58%" },
        { left: "58%", top: "52%" },
        { left: "80%", top: "56%" }
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

    // Pick a question from the "medium" tier - harder than the word challenge
    currentObservationQuestion =
        pickQuestionByDifficulty(observationQuestions, "medium");

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
        "MEMORIZE: " + MEMORIZE_SECONDS;

    let countdown = MEMORIZE_SECONDS;

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
                "YOUR TURN";

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

        startLogicChallenge();

    }
);
function startLogicChallenge() {

    logicScreen.style.display = "block";

    // Pick a question from the "hard" tier - the toughest content challenge
    currentLogicQuestion =
        pickQuestionByDifficulty(logicQuestions, "hard");

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
        startPatternChallenge();
    }
);


function startPatternChallenge() {

    patternScreen.style.display = "block";

    // Every entry in patternQuestions is a 6-symbol pattern.
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
    patternUndoBtn.style.display = "none";

    patternDisplay.textContent =
        currentPatternQuestion.pattern.join(" ");

    patternTimer.textContent =
        "MEMORIZE: " + MEMORIZE_SECONDS;

    let countdown = MEMORIZE_SECONDS;

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
                    "YOUR TURN";

                showPatternOptions();
            }

        }, 1000);

}


function showPatternOptions() {

    patternUndoBtn.style.display = "inline-block";

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

patternUndoBtn.addEventListener("click", function() {

    if (patternAnswer.length === 0) return;

    patternAnswer.pop();

    selectedPattern.textContent =
        patternAnswer.join(" ");

    // Fewer symbols than the pattern means it can't be submitted yet
    patternSubmit.style.display = "none";
});

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
patternUndoBtn.style.display = "none";

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
        playerProgress.level1Completed = true;
playerProgress.level2Unlocked = true;

localStorage.setItem(
    "lastSecondProgress",
    JSON.stringify(playerProgress)
);
    

    finalMessage.textContent =
        "STOPPED: " + finalTime.toFixed(2) +
        " SECONDS | ACCURACY: " + finalAccuracy.toFixed(2) + " SECONDS";

    console.log("5-CHALLENGE TOTAL:", totalChallengeTime.toFixed(2), "seconds");
    console.log("FINAL RESULT: PLAYER WINS", finalTime.toFixed(2));

    setTimeout(function() {
        startWinEnding();
    }, 2500);

} else {

    finalMessage.textContent =
        "STOPPED: " + finalTime.toFixed(2) +
        " SECONDS | ACCURACY: " + finalAccuracy.toFixed(2) + " SECONDS";

    console.log("FINAL RESULT: PSYCHO WINS", finalTime.toFixed(2));

    setTimeout(function() {
        startLoseEnding();
    }, 2500);
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
    finalScreen.style.display = "none";
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
    finalScreen.style.display = "none";
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
            gender: playerGender.toUpperCase(),
            total_time: Number(totalChallengeTime.toFixed(2)),
            accuracy: Number((level2Misses + finalAccuracy).toFixed(2))
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
restartGameBtn.addEventListener(
    "click",
    function() {

        restartConfirm.style.display =
            "flex";

        // Stop every challenge timer
        clearInterval(memoryTimerInterval);
        clearInterval(wordCountdown);
        clearInterval(observationTimerInterval);
        clearInterval(logicTimerInterval);
        clearInterval(patternTimerInterval);
        clearInterval(finalTimerInterval);

    }
);


restartCancelBtn.addEventListener(
    "click",
    function() {

        restartConfirm.style.display =
            "none";

    }
);
restartConfirmBtn.addEventListener(
    "click",
    function() {

        restartConfirm.style.display =
            "none";

        // Reset challenge scores
        resetPlayerScore();
        psychoScreen.dataset.twist = "false";
        psychoScreen.dataset.ending = "false";

        // Hide every game screen
        startScreen.style.display = "none";
        memoryScreen.style.display = "none";
        memoryResultScreen.style.display = "none";
        wordScreen.style.display = "none";
        wordResultScreen.style.display = "none";
        observationScreen.style.display = "none";
        observationResultScreen.style.display = "none";
        logicScreen.style.display = "none";
        logicResultScreen.style.display = "none";
        patternScreen.style.display = "none";
        patternResultScreen.style.display = "none";
        psychoScreen.style.display = "none";
        finalScreen.style.display = "none";
        leaderboardScreen.style.display = "none";

        // Start Challenge 1 again
        startMemoryChallenge();

    }
);


// =====================================================
// KEYBOARD: ENTER / SPACE press the main button
// =====================================================

(function () {

    // The main button on each screen
    const MAIN_BUTTON = {
        "start-screen": "start-btn",
        "name-screen": "continue-btn",
        "school-screen": "enter-school-btn",
        "hallway-screen": "hallway-continue",
        "memory-result-screen": "result-continue",
        "word-result-screen": "word-result-continue",
        "observation-result-screen": "observation-result-continue",
        "logic-result-screen": "logic-result-continue",
        "pattern-result-screen": "pattern-result-continue"
    };

    // Buttons this handler controls. If one of these still has
    // focus from a mouse click, it is released first so the key
    // press is not counted twice.
    const MANAGED = [
        "psycho-next", "psycho-skip", "final-start", "final-stop"
    ].concat(Object.keys(MAIN_BUTTON).map(function (id) {
        return MAIN_BUTTON[id];
    }));

    function isShown(element) {
        return element !== null &&
            getComputedStyle(element).display !== "none";
    }

    function currentScreenElement() {

        const sections = document.querySelectorAll("#game > section");

        for (let i = 0; i < sections.length; i++) {
            if (isShown(sections[i])) return sections[i];
        }

        return null;
    }

    document.addEventListener("keydown", function (event) {

        // ESC closes the restart box
        if (event.key === "Escape" && isShown(restartConfirm)) {
            document.getElementById("restart-cancel-btn").click();
            return;
        }

        const isEnter = event.key === "Enter";
        const isSpace = event.key === " ";

        if (!isEnter && !isSpace) return;

        if (event.ctrlKey || event.altKey || event.metaKey) return;

        // Holding the key down must not press twice
        if (event.repeat) {
            if (isShown(document.getElementById("final-stop"))) {
                event.preventDefault();
            }
            return;
        }

        // The restart box has its own buttons
        if (isShown(restartConfirm)) return;

        const active = document.activeElement;
        const tag = active ? active.tagName : "";

        // Typing: only ENTER in the name box continues
        if (tag === "INPUT" || tag === "TEXTAREA") {
            if (!(isEnter && active.id === "player-name")) return;
        }

        // Any other focused button (answers, SUBMIT, SOUND...) keeps
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

            target = document.getElementById(MAIN_BUTTON[screen.id]);
        }

        if (target === null || !isShown(target) || target.disabled) return;

        event.preventDefault();

        if (tag === "BUTTON") active.blur();

        target.click();
    });

})();
