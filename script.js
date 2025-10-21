// Game State
let gameState = {
    petName: '',
    stage: 0,
    hunger: 0,
    lastFeedTime: null,
    canFeed: true
};

// Stage Configuration
const stages = [
    { 
        name: 'Egg', 
        hungerToEvolve: 1, 
        //emoji: '🥚', 
       
        image: 'images/1.png',
        size: 300
    },
    { 
        name: 'Little Tadpole', 
        hungerToEvolve: 3, 
       // emoji: '🎣',
      image: 'images/2.png',
        size: 300
    },
    { 
        name: 'Big Tadpole', 
        hungerToEvolve: 5, 
        //emoji: '🐟',
        image: 'images/3.png',
        size: 300 
    },
    { 
        name: 'Young Frog', 
        hungerToEvolve: 7, 
       // emoji: '🐸',
     image: 'images/4.png',
        size: 300
    },
    { 
        name: 'luluwa', 
        hungerToEvolve: Infinity, 
        //emoji: '🐸',
      image: 'images/5.png',
        size: 300
    }
];

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const gameScreen = document.getElementById('gameScreen');
const petNameInput = document.getElementById('petNameInput');
const startButton = document.getElementById('startButton');
const petNameDisplay = document.getElementById('petNameDisplay');
const petNameTag = document.getElementById('petNameTag');
const stageNameDisplay = document.getElementById('stageNameDisplay');
const stageNumber = document.getElementById('stageNumber');
const progressText = document.getElementById('progressText');
const progressFill = document.getElementById('progressFill');
const feedButton = document.getElementById('feedButton');
const totalFeed = document.getElementById('totalFeed');
const statusText = document.getElementById('statusText');
const characterEmoji = document.getElementById('characterEmoji');
const swimmingCharacter = document.getElementById('swimmingCharacter');
const leafCharacter = document.getElementById('leafCharacter');
const characterOnLeaf = document.getElementById('characterOnLeaf');
const waterDrops = document.getElementById('waterDrops');
const messagePopup = document.getElementById('messagePopup');
const messageText = document.getElementById('messageText');
const cloudsContainer = document.getElementById('cloudsContainer');

// Initialize
function init() {
    createFloatingClouds();
    setupEventListeners();
    updateStartButton();
}

// Event Listeners
function setupEventListeners() {
    startButton.addEventListener('click', startGame);
    petNameInput.addEventListener('input', updateStartButton);
    petNameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') startGame();
    });
    feedButton.addEventListener('click', feedPet);
}

function updateStartButton() {
    startButton.disabled = petNameInput.value.trim() === '';
}

function startGame() {
    const name = petNameInput.value.trim();
    if (!name) return;

    gameState.petName = name;
    petNameDisplay.textContent = name;
    petNameTag.textContent = name;

    welcomeScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    updateDisplay();
}

// Create Floating Clouds
function createFloatingClouds() {
    for (let i = 0; i < 8; i++) {
        const cloud = document.createElement('div');
        cloud.className = 'floating-cloud';
        
        const size = Math.random() * 40 + 20;
        cloud.style.width = size + 'px';
        cloud.style.height = size + 'px';
        cloud.style.top = (Math.random() * 30) + '%';
        cloud.style.left = (Math.random() * 100) + '%';
        cloud.style.animationDuration = (Math.random() * 10 + 10) + 's';
        cloud.style.animationDelay = (Math.random() * 5) + 's';
        
        cloudsContainer.appendChild(cloud);
    }
}

// Feed Pet
function feedPet() {
    if (!gameState.canFeed) return;

    gameState.hunger++;
    gameState.canFeed = false;
    gameState.lastFeedTime = Date.now();

    updateDisplay();
    startCooldown();

    // Check for evolution
    const currentStage = stages[gameState.stage];
    if (gameState.hunger >= currentStage.hungerToEvolve && gameState.stage < stages.length - 1) {
        setTimeout(() => {
            gameState.stage++;
            updateDisplay();
            showMessage(`${gameState.petName} has evolved into ${stages[gameState.stage].name}! 🎉`);
        }, 500);
    } else {
        showMessage(`${gameState.petName} eat heartily！ 😋`);
    }
}

// Cooldown Timer
function startCooldown() {
    const cooldownInterval = setInterval(() => {
        const now = Date.now();
        const timePassed = now - gameState.lastFeedTime;
        const timeLeft = 300000 - timePassed; // 5 minutes in milliseconds

        if (timeLeft <= 0) {
            gameState.canFeed = true;
            clearInterval(cooldownInterval);
            updateDisplay();
        } else {
            const seconds = Math.ceil(timeLeft / 1000);
            const mins = Math.floor(seconds / 60);
            const secs = seconds % 60;
            feedButton.textContent = `⏱️ Wait ${mins}:${secs.toString().padStart(2, '0')}`;
        }
    }, 1000);
}

// Update Display
function updateDisplay() {
    const currentStage = stages[gameState.stage];
    
    // Update stage info
    stageNameDisplay.textContent = currentStage.name;
    stageNumber.textContent = `${gameState.stage + 1}/5`;
    
    // Update progress bar
    if (gameState.stage === stages.length - 1) {
        progressText.textContent = 'MAX';
        progressFill.style.width = '100%';
    } else {
        progressText.textContent = `${gameState.hunger}/${currentStage.hungerToEvolve}`;
        const progress = (gameState.hunger / currentStage.hungerToEvolve) * 100;
        progressFill.style.width = progress + '%';
    }
    
    // Update character display
    if (gameState.stage === 4) {
        // Stage 4: Show on leaf
        swimmingCharacter.classList.remove('hidden');
        leafCharacter.classList.remove('hidden');
        
        // Untuk pakai gambar:
         characterEmoji.innerHTML = `<img src="${currentStage.image}" alt="${currentStage.name}" style="width: ${currentStage.size}px">`;
       // characterOnLeaf.textContent = currentStage.emoji;
        //characterOnLeaf.style.fontSize = currentStage.size + 'px';
    } else {
        // Stage 0-3: Show swimming
        swimmingCharacter.classList.remove('hidden');
        leafCharacter.classList.add('hidden');
        
        // Untuk pakai gambar:
        characterEmoji.innerHTML = `<img src="${currentStage.image}" alt="${currentStage.name}" style="width: ${currentStage.size}px">`;
       // characterEmoji.textContent = currentStage.emoji;
       //characterEmoji.style.fontSize = currentStage.size + 'px';
        
        // Show water drops only for stage 0-2
        if (gameState.stage < 3) {
            waterDrops.style.display = 'flex';
        } else {
            waterDrops.style.display = 'none';
        }
    }
    
    // Update feed button
    if (gameState.stage === stages.length - 1) {
        feedButton.textContent = '🎉  The Frog is All Grown Up! 🎉';
        feedButton.disabled = true;
    } else if (gameState.canFeed) {
        feedButton.textContent = '🍖 Feed';
        feedButton.disabled = false;
    } else {
        feedButton.disabled = true;
    }
    
    // Update stats
    totalFeed.textContent = gameState.hunger;
    statusText.textContent = gameState.stage === stages.length - 1 ? '✨ Adult' : '🌱 Grow';
}

// Show Message
function showMessage(message) {
    messageText.textContent = message;
    messagePopup.classList.remove('hidden');
    
    setTimeout(() => {
        messagePopup.classList.add('hidden');
    }, 3000);
}

// Initialize game when page loads
window.addEventListener('DOMContentLoaded', init);