document.getElementById("startGameButton").addEventListener("click", function() {
    document.getElementById("screen0").style.display = "none";
    document.getElementById("screen1").style.display = "flex";
});

document.getElementById("beginnerButton").addEventListener("click", function() {
    document.getElementById("screen1").style.display = "none";
    document.getElementById("screen2").style.display = "flex";
});

document.getElementById("level1").addEventListener("click", function() {
    startLevel(0);
});

document.getElementById("level2").addEventListener("click", function() {
    startLevel(1);
});

document.getElementById("level3").addEventListener("click", function() {
    startLevel(2);
});

document.getElementById("level4").addEventListener("click", function() {
    startLevel(3);
});

document.getElementById("level5").addEventListener("click", function() {
    startLevel(4);
});

document.getElementById("resetGameButton").addEventListener("click", function() {
    resetGame();
});

document.getElementById("prevButton").addEventListener("click", function() {
    if (currentLevel > 0) {
        currentLevel--;
        startLevel(currentLevel); 
    }
});

document.getElementById("nextButton").addEventListener("click", function() {
    if (currentLevel < puzzles.length - 1) {
        currentLevel++;
        startLevel(currentLevel); 
    }
});

const puzzles = [
    // Level 1 Puzzles
    [
        { numbers: [12, 38, 19, 25, 41, 46, 37, 79], answer: '84', options: [99, 92, 84, 97] },
        { numbers: [8, 17, 34, 28, 35, 42, 19, 56], answer: '45', options: [45, 50, 60, 80] },
    ],
    // Level 2 Puzzles
    [
        { numbers: [5, 10, 15, 20, 25, 30, 35, 40], answer: '45', options: [45, 50, 55, 56] },
        { numbers: [15, 30, 45, 60, 75, 90, 105, 120], answer: '135', options: [130, 135, 140, 135] },
    ],
    // Level 3 Puzzles
    [
        { numbers: [3, 6, 9, 12, 15, 18, 21, 24], answer: '27', options: [25, 27, 29, 31] },
        { numbers: [2, 4, 6, 8, 10, 12, 14, 16], answer: '18', options: [16, 18, 20, 22] },
    ],
    // Level 4 Puzzles
    [
        { numbers: [20, 40, 60, 80, 100, 120, 140, 160], answer: '180', options: [160, 170, 180, 190] },
        { numbers: [25, 50, 75, 100, 125, 150, 175, 200], answer: '225', options: [215, 225, 235, 245] },
    ],
    // Level 5 Puzzles
    [
        { numbers: [30, 60, 90, 120, 150, 180, 210, 240], answer: '270', options: [250, 260, 270, 280] },
        { numbers: [35, 70, 105, 140, 175, 210, 245, 280], answer: '315', options: [295, 305, 315, 325] },
    ]
];

let currentLevel = 0;
let currentSet = 0;
let draggedElement;
let score = 0;
let submittedAnswer = null;
let timerInterval; 
let timeLeft = 180; 

const correctSound = new Audio('correct.mp3');
const incorrectSound = new Audio('incorrect.mp3');
const gameOverSound = new Audio('gameover.mp3'); // Add your game over sound file here

function startLevel(level) {
    currentLevel = level;
    currentSet = 0;
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen3").style.display = "flex";
    document.getElementById("current-level").textContent = level + 1; 
    startTimer(); 
    generatePuzzle(currentLevel, currentSet);
}

function startTimer() {
    timeLeft = 180; 
    clearInterval(timerInterval); 
    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            gameOver(); // Call the game over function when time is up
        } else {
            timeLeft--;
            document.getElementById('time-left').textContent = formatTime(timeLeft);
        }
    }, 1000);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateScore(value) {
    score += value;
    document.getElementById('score').textContent = score;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function generatePuzzle(level, set) {
    const puzzleData = puzzles[level][set];
    const puzzleContainer = document.getElementById("puzzle");
    const draggablesContainer = document.getElementById("draggables");

    puzzleContainer.innerHTML = "";
    draggablesContainer.innerHTML = "";

    puzzleData.numbers.forEach(num => {
        const cell = document.createElement("div");
        cell.className = "puzzle-cell";
        cell.textContent = num;
        puzzleContainer.appendChild(cell);
    });

    const dropZone = document.createElement("div");
    dropZone.className = "puzzle-cell drop-zone";
    dropZone.id = "drop-zone";
    dropZone.textContent = "?";
    puzzleContainer.appendChild(dropZone);

    shuffleArray(puzzleData.options);  

    puzzleData.options.forEach((option, index) => {
        const draggable = document.createElement("div");
        draggable.className = "draggable";
        draggable.textContent = option;
        draggable.draggable = true;
        draggable.id = `draggable-${index + 1}`;
        draggablesContainer.appendChild(draggable);
        
        draggable.addEventListener('dragstart', function() {
            draggedElement = this;
        });
    });

    dropZone.addEventListener('dragover', function(event) {
        event.preventDefault();
    });

    dropZone.addEventListener('drop', function(event) {
        event.preventDefault();
        if (draggedElement) {
            dropZone.textContent = draggedElement.textContent;
            submittedAnswer = draggedElement.textContent;
            checkAnswer(level, set);
        }
    });
}

function checkAnswer(level, set) {
    const correctAnswer = puzzles[level][set].answer;
    if (submittedAnswer === correctAnswer) {
        playCorrectFeedback();
        updateScore(1); 
        loadNextPuzzle(level, set); 
    } else {
        playIncorrectFeedback();
        updateScore(-1); 
    }
    submittedAnswer = null;
}

function playCorrectFeedback() {
    correctSound.play();
    showTransitionEffect("green");
}

function playIncorrectFeedback() {
    incorrectSound.play();
    showTransitionEffect("red");
}

function showTransitionEffect(color) {
    const overlay = document.createElement("div");
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = color;
    overlay.style.opacity = 0.5;
    overlay.style.zIndex = 1000;
    document.body.appendChild(overlay);

    setTimeout(() => {
        overlay.remove();
    }, 3000);
}

function loadNextPuzzle(level, set) {
    if (set < puzzles[level].length - 1) {
        currentSet++;
        generatePuzzle(level, currentSet);
    } else {
        alert('You have completed all the puzzles for this level!');
    }
}

function resetGame() {
    clearInterval(timerInterval); 
    document.getElementById("screen3").style.display = "none";
    document.getElementById("screen2").style.display = "none";
    document.getElementById("screen1").style.display = "none";
    document.getElementById("screen0").style.display = "flex";
    document.getElementById("drop-zone").textContent = "?"; 
    score = 0;
    document.getElementById('score').textContent = score; 
    currentLevel = 0;
    currentSet = 0;
    submittedAnswer = null; 
    document.getElementById('time-left').textContent = "03:00"; 
}

function gameOver() {
    document.getElementById("screen3").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "flex";
    document.getElementById("final-score").textContent = score;
    gameOverSound.play();

    setTimeout(() => {
        gameOverSound.pause();
        gameOverSound.currentTime = 0;
        resetGame();
        document.getElementById("gameOverScreen").style.display = "none";
        document.getElementById("screen0").style.display = "flex";
    }, 3000); // Wait for 3 seconds before returning to the start screen
}
