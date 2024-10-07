const trashItems = [
    { type: "Apple", src: "Images/apple Background Removed.png", binType: "organic-bin" }, 
    { type: "Carrot", src: "Images/carrot Background Removed.png", binType: "organic-bin" },
    { type: "Plastic Cup", src: "Images/plastic cup Background Removed.png", binType: "plastic-bin" },
    { type: "Watermelon", src: "Images/watermelon Background Removed.png", binType: "organic-bin" },
    { type: "Straw", src: "Images/straw Background Removed.png", binType: "plastic-bin" },
    { type: "Screwdriver", src: "Images/screwdriver Background Removed.png", binType: "metal-bin" },
    { type: "Plastic Container", src: "Images/plastic container Background Removed.png", binType: "plastic-bin" },
    { type: "Plastic Bottle Blue", src: "Images/plastic bottle blue Background Removed.png", binType: "plastic-bin" },
    { type: "Pizza", src: "Images/pizza Background Removed.png", binType: "organic-bin" },
    { type: "Paper Roll", src: "Images/paper roll Background Removed.png", binType: "paper-bin" },
    { type: "Paper Box", src: "Images/paper box Background Removed.png", binType: "paper-bin" },
    { type: "Green Plastic Glass", src: "Images/green plastic glass Background Removed.png", binType: "plastic-bin" },
    { type: "Glass Bottle", src: "Images/glass bottle Background Removed.png", binType: "glass-bin" },
    { type: "Egg Paper Box", src: "Images/egg paper box Background Removed.png", binType: "paper-bin" },
    { type: "Can", src: "Images/can Background Removed.png", binType: "metal-bin" },
    { type: "Banana", src: "Images/banana Background Removed.png", binType: "organic-bin" }
];

const bonusItems = [
    { type: "Extra Time", effect: extraTime },
    { type: "Double Points", effect: doublePoints }
];

let score = 0;
let timeLeft = 60;
let missionActive = false;
let level = 1;
let highScore = localStorage.getItem('highScore') || 0;
let selectedItem = null;

document.getElementById("start-mission").onclick = startMission;
document.getElementById("restart-button").onclick = restartGame;
document.getElementById("quit-button").onclick = quitGame;
document.getElementById("main-menu-icon").onclick = goToMainMenu;

const correctSound = new Audio('sounds/correct.mp3');
const wrongSound = new Audio('sounds/wrong.mp3');
const backgroundMusic = new Audio('sounds/background_music.mp3');

function startMission() {
    missionActive = true;
    score = 0;
    timeLeft = 60 - level * 5;
    document.getElementById("score").innerText = "Score: " + score;
    document.getElementById("timer").innerText = "Time Left: " + timeLeft;
    document.getElementById("high-score").innerText = "High Score: " + highScore;
    document.getElementById("message").innerText = "Level " + level + ": Collect the trash!";
    document.getElementById("facts").innerText = "";
    document.getElementById("mission-area").classList.remove("hidden");
    document.getElementById("game-buttons").classList.remove("hidden");
    document.getElementById("trash-container").innerHTML = "";

    backgroundMusic.play();
    backgroundMusic.loop = true;

    generateTrashItems(5); // Only display 5 items initially
    countdownTimer();
}

function generateTrashItems(numberOfItems) {
    const allItems = trashItems.slice(); // Copy trashItems array
    document.getElementById("trash-container").innerHTML = ""; // Clear the trash container

    for (let i = 0; i < numberOfItems; i++) {
        const randomIndex = Math.floor(Math.random() * allItems.length);
        const randomItem = allItems[randomIndex];
        allItems.splice(randomIndex, 1); // Remove the selected item from the list

        const item = document.createElement("div");
        item.classList.add("trash-item");
        item.innerHTML = `<img src="${randomItem.src}" alt="${randomItem.type}" />`;
        item.dataset.type = randomItem.type;
        item.dataset.binType = randomItem.binType;

        item.onclick = () => selectItem(item);
        document.getElementById("trash-container").appendChild(item);
    }
}

function selectItem(item) {
    if (selectedItem) {
        selectedItem.classList.remove("selected");
    }
    selectedItem = item;
    item.classList.add("selected");
}

document.querySelectorAll(".bin").forEach((bin) => {
    bin.onclick = () => placeInBin(bin);
});

function placeInBin(bin) {
    if (!selectedItem) {
        alert("Please select an item first!");
        return;
    }

    const itemType = selectedItem.dataset.binType;
    const binType = bin.id;

    if (itemType === binType) {
        correctSound.play();
        selectedItem.remove(); // Remove the item from the screen
        document.getElementById("message").innerText = "Correct! Item placed in the right bin.";
        score += 10;

        // Add new item after placing the correct one in the bin
        addNewItem();
    } else {
        wrongSound.play();
        document.getElementById("message").innerText = "Oops! Wrong bin. Try again.";
    }

    updateScore(score);
    selectedItem = null;
}

function addNewItem() {
    const remainingItems = trashItems.filter(item => {
        const existingItems = Array.from(document.getElementById("trash-container").children);
        return !existingItems.some(existingItem => existingItem.dataset.type === item.type);
    });

    if (remainingItems.length > 0) {
        const randomIndex = Math.floor(Math.random() * remainingItems.length);
        const randomItem = remainingItems[randomIndex];

        const item = document.createElement("div");
        item.classList.add("trash-item");
        item.innerHTML = `<img src="${randomItem.src}" alt="${randomItem.type}" />`;
        item.dataset.type = randomItem.type;
        item.dataset.binType = randomItem.binType;

        item.onclick = () => selectItem(item);
        document.getElementById("trash-container").appendChild(item);
    }
}

function countdownTimer() {
    const timer = setInterval(() => {
        timeLeft--;
        document.getElementById("timer").innerText = "Time Left: " + timeLeft;
        if (timeLeft <= 0 || !missionActive) {
            clearInterval(timer);
            endMission();
        }
    }, 1000);
}

function updateScore(newScore) {
    document.getElementById("score").innerText = "Score: " + newScore;
}

function endMission() {
    missionActive = false;
    backgroundMusic.pause();
    document.getElementById("message").innerText =
        score > highScore
            ? "New High Score! Your score is " + score + "!"
            : "Mission complete! Your score is " + score + ".";

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
    }

    document.getElementById("restart-button").classList.remove("hidden");
}

function restartGame() {
    score = 0;
    level = 1;
    startMission();
}

function quitGame() {
    missionActive = false;

    document.getElementById("mission-area").classList.add("hidden");
    document.getElementById("message").innerText = "Game Over! You have quit the mission.";
    backgroundMusic.pause();

    document.getElementById("trash-container").innerHTML = ""; // Clear trash items
    score = 0; // Reset score
    timeLeft = 60; // Reset timer if desired

    document.getElementById("main-menu-button").classList.remove("hidden");
}

function goToMainMenu() {
    window.location.href = "main-menu.html"; // Redirect to the main menu page
}

document.getElementById("main-menu-button").onclick = function() {
    goToMainMenu();
};

function extraTime() {
    timeLeft += 10;
    document.getElementById("timer").innerText = "Time Left: " + timeLeft;
}

function doublePoints() {
    score += 10;
}

function showRandomFact() {
    const randomFact = facts[Math.floor(Math.random() * facts.length)];
    document.getElementById("facts").innerText = randomFact;
}

function getRandomFeedback() {
    const feedbacks = ["Great job!", "Keep going!", "You're doing awesome!"];
    return feedbacks[Math.floor(Math.random() * feedbacks.length)];
}
