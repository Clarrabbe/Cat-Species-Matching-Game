import React, { useState, useEffect } from 'react';

const CatMatchingGame = () => {
  // Cat species data organized by difficulty levels
  const catLevels = [
    // Level 1 - Easy (4 pairs)
    [
      { id: 1, name: "Domestic Cat", emoji: "🐈" },
      { id: 2, name: "Lion", emoji: "🦁" },
      { id: 3, name: "Tiger", emoji: "🐅" },
      { id: 4, name: "Black Cat", emoji: "🐈‍⬛" },
    ],
    // Level 2 - Medium (6 pairs)
    [
      { id: 1, name: "Domestic Cat", emoji: "🐈" },
      { id: 2, name: "Lion", emoji: "🦁" },
      { id: 3, name: "Tiger", emoji: "🐅" },
      { id: 4, name: "Black Cat", emoji: "🐈‍⬛" },
      { id: 5, name: "Leopard", emoji: "🐆" },
      { id: 6, name: "Cat Face", emoji: "🐱" },
    ],
    // Level 3 - Hard (8 pairs)
    [
      { id: 1, name: "Domestic Cat", emoji: "🐈" },
      { id: 2, name: "Lion", emoji: "🦁" },
      { id: 3, name: "Tiger", emoji: "🐅" },
      { id: 4, name: "Black Cat", emoji: "🐈‍⬛" },
      { id: 5, name: "Leopard", emoji: "🐆" },
      { id: 6, name: "Cat Face", emoji: "🐱" },
      { id: 7, name: "Lynx", emoji: "🐈" },
      { id: 8, name: "Panther", emoji: "🐆" },
    ],
    // Level 4 - Expert (10 pairs with time limit)
    [
      { id: 1, name: "Domestic Cat", emoji: "🐈" },
      { id: 2, name: "Lion", emoji: "🦁" },
      { id: 3, name: "Tiger", emoji: "🐅" },
      { id: 4, name: "Black Cat", emoji: "🐈‍⬛" },
      { id: 5, name: "Leopard", emoji: "🐆" },
      { id: 6, name: "Cat Face", emoji: "🐱" },
      { id: 7, name: "Lynx", emoji: "🐈" },
      { id: 8, name: "Panther", emoji: "🐆" },
      { id: 9, name: "Snow Leopard", emoji: "🐆" },
      { id: 10, name: "Siamese Cat", emoji: "🐈" },
    ],
    // Level 5 - Master (12 pairs, less time)
    [
      { id: 1, name: "Domestic Cat", emoji: "🐈" },
      { id: 2, name: "Lion", emoji: "🦁" },
      { id: 3, name: "Tiger", emoji: "🐅" },
      { id: 4, name: "Black Cat", emoji: "🐈‍⬛" },
      { id: 5, name: "Leopard", emoji: "🐆" },
      { id: 6, name: "Cat Face", emoji: "🐱" },
      { id: 7, name: "Lynx", emoji: "🐈" },
      { id: 8, name: "Panther", emoji: "🐆" },
      { id: 9, name: "Snow Leopard", emoji: "🐆" },
      { id: 10, name: "Siamese Cat", emoji: "🐈" },
      { id: 11, name: "Persian Cat", emoji: "🐈" },
      { id: 12, name: "Jaguar", emoji: "🐆" },
    ],
  ];
  
  // Game state
  const [currentLevel, setCurrentLevel] = useState(0);
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [levelCompleted, setLevelCompleted] = useState(false);
  const [timer, setTimer] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [maxLevel, setMaxLevel] = useState(0); // Highest level unlocked
  
  // Time limits per level (in seconds)
  const timeLimits = [null, null, null, 60, 45];

  // Create pairs by duplicating the data (one for emoji, one for name)
  const createGameCards = (level) => {
    const catData = catLevels[level];
    let cards = [];
    catData.forEach(cat => {
      cards.push({
        id: `${cat.id}-emoji`,
        content: cat.emoji,
        type: 'emoji',
        matchId: cat.id,
        isFlipped: false,
        isMatched: false
      });
      cards.push({
        id: `${cat.id}-name`,
        content: cat.name,
        type: 'name',
        matchId: cat.id,
        isFlipped: false,
        isMatched: false
      });
    });
    return shuffleCards(cards);
  };
  
  // Shuffle the cards
  const shuffleCards = (cards) => {
    const shuffled = [...cards];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Setup game when level changes or game starts
  useEffect(() => {
    if (gameStarted) {
      setCards(createGameCards(currentLevel));
      setFlippedCards([]);
      setMatchedPairs(0);
      setMoves(0);
      setLevelCompleted(false);
      setGameCompleted(false);
      
      // Clear any existing timer
      if (timer) {
        clearInterval(timer);
      }
      
      // Set up timer for levels that have time limits
      if (timeLimits[currentLevel] !== null) {
        setTimeRemaining(timeLimits[currentLevel]);
        const newTimer = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(newTimer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        setTimer(newTimer);
        
        return () => clearInterval(newTimer);
      }
    }
  }, [gameStarted, currentLevel]);
  
  // Effect for time running out
  useEffect(() => {
    if (timeRemaining === 0 && timeLimits[currentLevel] !== null && gameStarted && !levelCompleted) {
      // Time's up - game over for this level
      setLevelCompleted(true);
    }
  }, [timeRemaining, currentLevel, gameStarted, levelCompleted]);
  
  // Check for matches and handle game logic
  useEffect(() => {
    if (flippedCards.length === 2) {
      const [first, second] = flippedCards;
      
      // Increment moves
      setMoves(prevMoves => prevMoves + 1);
      
      // Check if cards match
      if (cards[first].matchId === cards[second].matchId) {
        // Mark as matched
        setCards(prevCards => 
          prevCards.map((card, index) => 
            index === first || index === second
              ? { ...card, isMatched: true }
              : card
          )
        );
        
        // Increment matched pairs
        setMatchedPairs(prevPairs => prevPairs + 1);
        
        // Reset flipped cards
        setFlippedCards([]);
      } else {
        // Set timeout to flip cards back if they don't match
        setTimeout(() => {
          setCards(prevCards => 
            prevCards.map((card, index) => 
              index === first || index === second
                ? { ...card, isFlipped: false }
                : card
            )
          );
          setFlippedCards([]);
        }, 1000);
      }
    }
  }, [flippedCards, cards]);
  
  // Check if level is completed
  useEffect(() => {
    const currentLevelData = catLevels[currentLevel];
    if (gameStarted && matchedPairs === currentLevelData.length && !levelCompleted) {
      // Level completed
      setLevelCompleted(true);
      
      // Clear timer if exists
      if (timer) {
        clearInterval(timer);
      }
      
      // Update max level if this is a new highest level
      if (currentLevel >= maxLevel) {
        setMaxLevel(prev => Math.max(prev, currentLevel + 1));
      }
      
      // Check if this was the final level
      if (currentLevel === catLevels.length - 1) {
        setGameCompleted(true);
      }
    }
  }, [matchedPairs, gameStarted, currentLevel, levelCompleted, timer, maxLevel]);
  
  // Handle card click
  const handleCardClick = (index) => {
    // Prevent clicks if level is completed or we already have 2 cards flipped
    // or if the card is already flipped/matched
    if (
      levelCompleted ||
      flippedCards.length === 2 || 
      cards[index].isFlipped || 
      cards[index].isMatched
    ) {
      return;
    }
    
    // Flip the card
    setCards(prevCards => 
      prevCards.map((card, i) => 
        i === index ? { ...card, isFlipped: true } : card
      )
    );
    
    // Add to flipped cards
    setFlippedCards(prevFlipped => [...prevFlipped, index]);
  };
  
  // Start a new game at level 0
  const startNewGame = () => {
    setCurrentLevel(0);
    setGameStarted(true);
    setMaxLevel(Math.max(maxLevel, 1)); // Ensure at least level 1 is unlocked
  };
  
  // Start next level
  const startNextLevel = () => {
    setCurrentLevel(prev => prev + 1);
    setLevelCompleted(false);
  };
  
  // Restart current level
  const restartLevel = () => {
    setLevelCompleted(false);
    setCards(createGameCards(currentLevel));
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    
    // Reset timer if this level has a time limit
    if (timeLimits[currentLevel] !== null) {
      setTimeRemaining(timeLimits[currentLevel]);
      
      if (timer) {
        clearInterval(timer);
      }
      
      const newTimer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(newTimer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      setTimer(newTimer);
    }
  };
  
  // Load a specific level
  const loadLevel = (level) => {
    setCurrentLevel(level);
    setLevelCompleted(false);
    setGameStarted(true);
  };
  
  // Get level difficulty description
  const getLevelDifficulty = (level) => {
    const difficulties = ["Easy", "Medium", "Hard", "Expert", "Master"];
    return difficulties[level] || "Unknown";
  };
  
  // Get grid columns based on level
  const getGridColumns = () => {
    const pairs = catLevels[currentLevel].length;
    if (pairs <= 4) return "grid-cols-4";
    if (pairs <= 6) return "grid-cols-4";
    if (pairs <= 8) return "grid-cols-4";
    if (pairs <= 10) return "grid-cols-5";
    return "grid-cols-6";
  };
  
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-blue-50 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-2 text-center">Cat Species Matching Game</h1>
      
      {!gameStarted ? (
        // Game start screen
        <div className="flex flex-col items-center">
          <p className="mb-4 text-center">Match the cat species with their emoji representations!</p>
          <p className="mb-2 text-center font-semibold">Unlock more difficult levels as you progress!</p>
          
          {maxLevel > 0 && (
            <div className="w-full mb-4">
              <h3 className="font-bold mb-2">Select Level:</h3>
              <div className="grid grid-cols-5 gap-2">
                {catLevels.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => loadLevel(index)}
                    disabled={index > maxLevel}
                    className={`py-1 px-3 rounded font-bold
                      ${index <= maxLevel 
                        ? 'bg-blue-500 hover:bg-blue-600 text-white cursor-pointer' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
                    `}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          <button 
            onClick={startNewGame}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded transition"
          >
            {maxLevel > 0 ? "Start New Game" : "Start Game"}
          </button>
        </div>
      ) : (
        // Game screen
        <>
          <div className="flex justify-between w-full items-center mb-2">
            <span className="font-semibold">Level {currentLevel + 1}: {getLevelDifficulty(currentLevel)}</span>
            {timeLimits[currentLevel] !== null && (
              <span className={`font-bold ${timeRemaining <= 10 ? 'text-red-500' : ''}`}>
                Time: {timeRemaining}s
              </span>
            )}
            <span className="font-semibold">Pairs: {matchedPairs}/{catLevels[currentLevel].length}</span>
          </div>
          
          <div className="mb-2 flex justify-between w-full">
            <span className="font-semibold">Moves: {moves}</span>
            <button 
              onClick={() => {
                if (timer) clearInterval(timer);
                setGameStarted(false);
              }}
              className="text-sm bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded"
            >
              Exit
            </button>
          </div>
          
          <div className={`grid ${getGridColumns()} gap-2 mb-4`}>
            {cards.map((card, index) => (
              <div
                key={card.id}
                onClick={() => handleCardClick(index)}
                className={`
                  w-16 h-16 
                  flex items-center justify-center 
                  rounded-lg cursor-pointer transition-all duration-300
                  ${card.isFlipped || card.isMatched 
                    ? (card.type === 'emoji' ? 'bg-yellow-200' : 'bg-green-200') 
                    : 'bg-gray-300'}
                  ${card.isMatched ? 'opacity-70' : 'hover:bg-gray-400'}
                  ${levelCompleted ? 'cursor-default' : ''}
                  shadow
                `}
              >
                {(card.isFlipped || card.isMatched) && (
                  <span className={`${card.type === 'emoji' ? 'text-3xl' : 'text-xs font-bold text-center'}`}>
                    {card.content}
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {levelCompleted && !gameCompleted && (
            <div className="text-center bg-yellow-100 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">
                {timeRemaining === 0 && timeLimits[currentLevel] !== null 
                  ? '⏰ Time\'s Up! ⏰' 
                  : '🎉 Level Completed! 🎉'}
              </h2>
              
              {timeRemaining === 0 && timeLimits[currentLevel] !== null ? (
                <p className="mb-4">You ran out of time! Try again?</p>
              ) : (
                <p className="mb-4">You completed level {currentLevel + 1} in {moves} moves!</p>
              )}
              
              <div className="flex space-x-3">
                <button 
                  onClick={restartLevel}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
                >
                  Retry Level
                </button>
                
                {currentLevel < catLevels.length - 1 && timeRemaining !== 0 && (
                  <button 
                    onClick={startNextLevel}
                    className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition"
                  >
                    Next Level
                  </button>
                )}
              </div>
            </div>
          )}
          
          {gameCompleted && (
            <div className="text-center bg-green-100 p-4 rounded-lg shadow">
              <h2 className="text-xl font-bold mb-2">🏆 Game Completed! 🏆</h2>
              <p className="mb-4">Congratulations! You've beaten all levels!</p>
              <button 
                onClick={() => setGameStarted(false)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition"
              >
                Back to Menu
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CatMatchingGame;
