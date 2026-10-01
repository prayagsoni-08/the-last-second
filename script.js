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
    totalChallengeTime =
        memoryTime + wordTime + observationTime + logicTime + patternTime;

    saveLeaderboardScore();

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
