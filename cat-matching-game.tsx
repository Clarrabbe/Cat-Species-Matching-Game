<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cat Species Matching Game</title>
    <style>
        body {
            font-family: 'Arial', sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            background-color: #f0f8ff;
            padding: 20px;
        }
        
        h1 {
            color: #FF6B6B;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
            margin-bottom: 10px;
        }
        
        .subtitle {
            color: #666;
            margin-bottom: 20px;
        }
        
        .game-stats {
            display: flex;
            justify-content: space-between;
            width: 400px;
            max-width: 100%;
            margin-bottom: 20px;
        }
        
        .stat {
            background-color: white;
            padding: 10px 15px;
            border-radius: 10px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        
        #timer {
            color: #FF6B6B;
            font-weight: bold;
        }
        
        #moves {
            color: #4CACBC;
            font-weight: bold;
        }
        
        .game-container {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 10px;
            max-width: 400px;
        }
        
        .card {
            width: 80px;
            height: 80px;
            background-color: #FF6B6B;
            border-radius: 10px;
            display: flex;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            font-size: 2.5rem;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            transition: transform 0.3s, background-color 0.3s;
            position: relative;
            overflow: hidden;
        }
        
        .card:hover {
            transform: translateY(-5px);
        }
        
        .card.flipped {
            background-color: white;
            transform: rotateY(180deg);
        }
        
        .card-content {
            display: none;
            transform: rotateY(180deg);
        }
        
        .flipped .card-content {
            display: block;
        }
        
        .matched {
            background-color: #A0E7E5;
            cursor: default;
        }
        
        .paw-print {
            position: absolute;
            font-size: 1.5rem;
            color: rgba(255, 255, 255, 0.5);
        }
        
        .game-over {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: white;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.5s;
        }
        
        .game-over.show {
            opacity: 1;
            pointer-events: auto;
        }
        
        .game-over h2 {
            font-size: 2.5rem;
            color: #A0E7E5;
            margin-bottom: 20px;
        }
        
        .game-over p {
            font-size: 1.2rem;
            margin-bottom: 10px;
        }
        
        .game-over button {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #FF6B6B;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .game-over button:hover {
            background-color: #ff4f4f;
        }
        
        .restart-btn {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #4CACBC;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .restart-btn:hover {
            background-color: #3d9eaf;
        }
        
        .next-level-btn {
            margin-top: 20px;
            padding: 10px 20px;
            background-color: #FF6B6B;
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        
        .next-level-btn:hover:not([disabled]) {
            background-color: #ff4f4f;
        }
        
        .next-level-btn:disabled {
            background-color: #ffb5b5;
            cursor: not-allowed;
        }
        
        @media (max-width: 450px) {
            .game-container {
                grid-template-columns: repeat(3, 1fr);
            }
            
            .card {
                width: 70px;
                height: 70px;
            }
        }
    </style>
</head>
<body>
    <h1>🐱 Cat Species Match 🐱</h1>
    <p class="subtitle">Match all the cat species to win!</p>
    
    <div class="game-stats">
        <div class="stat">Level: <span id="level">1</span></div>
        <div class="stat">Time: <span id="timer">00:00</span></div>
        <div class="stat">Moves: <span id="moves">0</span></div>
    </div>
    
    <div class="game-container" id="game-board">
        <!-- Cards will be generated by JavaScript -->
    </div>
    
    <div class="button-container" style="display: flex; gap: 10px; margin-top: 20px;">
        <button class="restart-btn" id="restart-button">Restart Game</button>
        <button class="next-level-btn" id="next-level-button" style="padding: 10px 20px; background-color: #FF6B6B; color: white; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer; transition: background-color 0.3s;" disabled>Next Level</button>
    </div>
    
    <div class="game-over" id="game-over">
        <h2>Purr-fect! 🏆</h2>
        <p>You completed level <span id="completed-level">1</span>!</p>
        <p>Time: <span id="final-time">00:00</span></p>
        <p>Moves: <span id="final-moves">0</span></p>
        <div style="display: flex; gap: 10px; margin-top: 10px;">
            <button id="play-again">Restart Game</button>
            <button id="continue-next-level" style="padding: 10px 20px; background-color: #FF6B6B; color: white; border: none; border-radius: 5px; font-size: 1rem; cursor: pointer;">Continue to Level <span id="next-level-num">2</span></button>
        </div>
    </div>
    
    <script>
        document.addEventListener('DOMContentLoaded', () => {
            // Cat species emojis (for all levels)
            const allCatEmojis = [
                '🐱', // Domestic cat
                '🦁', // Lion
                '🐯', // Tiger
                '🐆', // Leopard
                '🐅', // Bengal tiger
                '🦊', // Fox (not exactly a cat, but cute!)
                '🦝', // Raccoon (also not a cat, but cat-like)
                '🦧', // Orangutan (as a substitute)
                '😺', // Cat face
                '😸', // Grinning cat
                '😹', // Cat with tears of joy
                '😻', // Smiling cat with heart eyes
                '😼', // Cat with wry smile
                '😽', // Kissing cat
                '🙀', // Weary cat
                '😿', // Crying cat
                '😾', // Pouting cat
                '🐈', // Cat
                '🐈‍⬛', // Black cat
                '🦓', // Zebra (for higher levels)
            ];
            
            // Current level
            let currentLevel = 1;
            
            // Define number of pairs for each level
            function getPairsForLevel(level) {
                // Start with 4 pairs at level 1, add 2 pairs per level, max 10 pairs
                return Math.min(4 + (level - 1) * 2, 10);
            }
            
            let cards = [];
            let flippedCards = [];
            let matchedPairs = 0;
            let isProcessing = false;
            let moves = 0;
            let gameStarted = false;
            let timerInterval;
            let startTime;
            let catEmojis = [];
            
            const gameBoard = document.getElementById('game-board');
            const movesDisplay = document.getElementById('moves');
            const timerDisplay = document.getElementById('timer');
            const levelDisplay = document.getElementById('level');
            const gameOverScreen = document.getElementById('game-over');
            const finalTimeDisplay = document.getElementById('final-time');
            const finalMovesDisplay = document.getElementById('final-moves');
            const restartButton = document.getElementById('restart-button');
            const playAgainButton = document.getElementById('play-again');
            const nextLevelButton = document.getElementById('next-level-button');
            const completedLevelDisplay = document.getElementById('completed-level');
            const nextLevelNumDisplay = document.getElementById('next-level-num');
            const continueNextLevelButton = document.getElementById('continue-next-level');
            
            function initGame(level = currentLevel, resetLevel = false) {
                // Reset game state
                cards = [];
                flippedCards = [];
                matchedPairs = 0;
                isProcessing = false;
                moves = 0;
                gameStarted = false;
                clearInterval(timerInterval);
                
                // Reset to level 1 if requested
                if (resetLevel) {
                    currentLevel = 1;
                }
                
                // Get the right number of emojis for the current level
                const pairsForLevel = getPairsForLevel(currentLevel);
                
                // Shuffle all emojis and take only what we need for this level
                const shuffledAllEmojis = [...allCatEmojis];
                shuffleArray(shuffledAllEmojis);
                catEmojis = shuffledAllEmojis.slice(0, pairsForLevel);
                
                // Update displays
                levelDisplay.textContent = currentLevel;
                movesDisplay.textContent = '0';
                timerDisplay.textContent = '00:00';
                gameOverScreen.classList.remove('show');
                nextLevelButton.disabled = true;
                
                // Clear the board
                gameBoard.innerHTML = '';
                
                // Create a deck with pairs of cat emojis
                const emojiPairs = [...catEmojis, ...catEmojis];
                
                // Shuffle the deck
                shuffleArray(emojiPairs);
                
                // Adjust grid columns based on number of cards
                if (emojiPairs.length <= 12) {
                    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
                } else if (emojiPairs.length <= 16) {
                    gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
                } else {
                    gameBoard.style.gridTemplateColumns = 'repeat(5, 1fr)';
                }
                
                // Create cards and add them to the board
                emojiPairs.forEach((emoji, index) => {
                    const card = document.createElement('div');
                    card.className = 'card';
                    card.dataset.index = index;
                    card.dataset.emoji = emoji;
                    
                    // Add paw prints as decorations to the back of cards
                    const pawPrint = document.createElement('span');
                    pawPrint.className = 'paw-print';
                    pawPrint.textContent = '🐾';
                    pawPrint.style.top = `${Math.random() * 60}%`;
                    pawPrint.style.left = `${Math.random() * 60}%`;
                    card.appendChild(pawPrint);
                    
                    const cardContent = document.createElement('span');
                    cardContent.className = 'card-content';
                    cardContent.textContent = emoji;
                    card.appendChild(cardContent);
                    
                    card.addEventListener('click', () => flipCard(card));
                    gameBoard.appendChild(card);
                    cards.push(card);
                });
            }
            
            function startTimer() {
                gameStarted = true;
                startTime = new Date();
                timerInterval = setInterval(updateTimer, 1000);
            }
            
            function updateTimer() {
                const currentTime = new Date();
                const elapsedTime = new Date(currentTime - startTime);
                const minutes = elapsedTime.getMinutes().toString().padStart(2, '0');
                const seconds = elapsedTime.getSeconds().toString().padStart(2, '0');
                timerDisplay.textContent = `${minutes}:${seconds}`;
            }
            
            function flipCard(card) {
                // Prevent flipping if the card is already flipped, matched, or processing is happening
                if (card.classList.contains('flipped') || 
                    card.classList.contains('matched') || 
                    isProcessing || 
                    flippedCards.length >= 2) {
                    return;
                }
                
                // Start the timer on first card flip
                if (!gameStarted) {
                    startTimer();
                }
                
                // Flip the card
                card.classList.add('flipped');
                flippedCards.push(card);
                
                // Check for a match if two cards are flipped
                if (flippedCards.length === 2) {
                    moves++;
                    movesDisplay.textContent = moves;
                    
                    const firstCard = flippedCards[0];
                    const secondCard = flippedCards[1];
                    
                    if (firstCard.dataset.emoji === secondCard.dataset.emoji) {
                        // Match found
                        firstCard.classList.add('matched');
                        secondCard.classList.add('matched');
                        flippedCards = [];
                        matchedPairs++;
                        
                        // Check if all pairs are matched
                        if (matchedPairs === catEmojis.length) {
                            endGame();
                            nextLevelButton.disabled = false;
                        }
                    } else {
                        // No match
                        isProcessing = true;
                        setTimeout(() => {
                            firstCard.classList.remove('flipped');
                            secondCard.classList.remove('flipped');
                            flippedCards = [];
                            isProcessing = false;
                        }, 1000);
                    }
                }
            }
            
            function endGame() {
                clearInterval(timerInterval);
                finalTimeDisplay.textContent = timerDisplay.textContent;
                finalMovesDisplay.textContent = moves;
                completedLevelDisplay.textContent = currentLevel;
                nextLevelNumDisplay.textContent = currentLevel + 1;
                
                // Enable the next level button
                nextLevelButton.disabled = false;
                
                setTimeout(() => {
                    gameOverScreen.classList.add('show');
                }, 500);
            }
            
            function nextLevel() {
                currentLevel++;
                initGame(currentLevel);
            }
            
            function shuffleArray(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
                return array;
            }
            
            // Event listeners for buttons
            restartButton.addEventListener('click', () => initGame(currentLevel, true));
            playAgainButton.addEventListener('click', () => initGame(currentLevel, true));
            nextLevelButton.addEventListener('click', nextLevel);
            continueNextLevelButton.addEventListener('click', () => {
                nextLevel();
                gameOverScreen.classList.remove('show');
            });
            
            // Initialize the game on page load
            initGame();
        });
    </script>
</body>
</html>
