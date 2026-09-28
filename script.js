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

    // Get the name directly from the input
    const name = nameInput.value.trim();

    // If no name was entered, use Stranger
    const finalName = name || "Stranger";

    // Show the Psycho label
    psychoName.textContent = "PSYCHO";

    // Dialogue
    const dialogue =
        "Good evening, " + finalName + ".";

    // Clear previous dialogue
    psychoText.textContent = "";

    // Hide continue button while typing
    psychoNext.classList.remove("visible");

    let index = 0;

    // Typewriter effect
    const typing = setInterval(function () {

        psychoText.textContent += dialogue[index];

        index++;

        // When dialogue is finished
        if (index >= dialogue.length) {

            clearInterval(typing);

            psychoNext.classList.add("visible");
        }

    }, 60);

}

// ---------- NEXT DIALOGUE ----------

psychoNext.addEventListener("click", function () {

    psychoText.textContent =
        "Don't be afraid. You haven't done anything wrong. Yet.";

});