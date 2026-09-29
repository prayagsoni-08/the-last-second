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

    }

});