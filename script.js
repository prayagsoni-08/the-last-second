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

// ---------- PLAYER DATA ----------

let playerGender = "";
let playerName = "";
let dialogues = [];
let dialogueIndex = 0;


// ---------- START GAME ----------

startButton.addEventListener("click", function () {

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
psychoNext.addEventListener("click", function () {

    dialogueIndex++;

    if (dialogueIndex < dialogues.length) {

        showDialogue(dialogues[dialogueIndex]);

    } else {

        // Psycho dialogue finished
        psychoScreen.style.display = "none";

        startMemoryChallenge();
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

    console.log("Ready for Challenge 3");

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

        // Stop timer ONLY when correct
        clearInterval(observationTimerInterval);

        const timeTaken =
            ((performance.now() -
                observationStartTime) / 1000).toFixed(2);

        observationMessage.textContent =
            "Correct. You were paying attention.";

        observationTimer.textContent =
            "TIME: " + timeTaken + " SECONDS";

        observationSubmit.style.display = "none";

        observationOptions.innerHTML = "";

        console.log(
            "Challenge 3 time:",
            timeTaken,
            "seconds"
        );

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