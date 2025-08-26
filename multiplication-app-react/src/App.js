import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import CelebrationScreen from './components/CelebrationScreen';
import { Howl } from 'howler';

// Import audio files
import correctSound from './assets/correct.mp3';
import wrongSound from './assets/wrong.mp3';
import celebrationSound from './assets/celebration.mp3';

// Create sounds
const sounds = {
  correct: new Howl({ 
    src: [correctSound],
    volume: 0.17  // Lowered by approx 15dB (previously 0.3)
  }),
  wrong: new Howl({ src: [wrongSound] }),
  celebration: new Howl({ 
    src: [celebrationSound],
    volume: 0.32  // Raised by approx 5dB (previously 0.18)
  })
};

// Create problems based on the selected multiplier
const createProblems = (multiplier) => {
  const problems = [];
  for (let i = 1; i <= 12; i++) {
    problems.push([multiplier, i]);
  }
  return problems;
};

// App Container
const AppContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
  z-index: 2;
`;

// Title
const Title = styled.h1`
  font-size: 5rem;
  color: var(--bright-pink);
  text-align: center;
  margin: 1rem 0;
  text-shadow: 0 0 10px rgba(255, 37, 183, 0.8), 0 0 20px rgba(255, 37, 183, 0.5);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(34, 227, 255, 0.3), inset 0 0 10px rgba(34, 227, 255, 0.2);
  border: 2px solid var(--cyan);
  animation: glow 2s ease-in-out infinite;
  font-weight: 800;
  letter-spacing: 2px;
  
  /* Hide on mobile */
  @media (max-width: 480px) {
    display: none;
  }
`;

function App() {
  // Game state
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'celebration'
  const [multiplier, setMultiplier] = useState(7);
  const [problems, setProblems] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [solvedProblems, setSolvedProblems] = useState([]);
  const [showCelebrationGif, setShowCelebrationGif] = useState(false);
  const [currentCelebrationGif, setCurrentCelebrationGif] = useState(1);
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      setAudioEnabled(true);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('keydown', enableAudio);
    document.addEventListener('touchstart', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('keydown', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
    };
  }, []);


  // Start the game with the selected multiplier
  const startGame = (selectedNumber) => {
    console.log(`Starting game with multiplier: ${selectedNumber}`);
    setMultiplier(selectedNumber);
    // Don't create problems here, let the useEffect handle it
    // when gameState changes to 'playing'
    setGameState('playing');
    setSolvedProblems([]);
    setIsProcessingAnswer(false);
    setShowCelebrationGif(false);
  };

  // Check the answer
  const checkAnswer = (answer) => {
    // Prevent multiple submissions while processing
    if (isProcessingAnswer) return;
    
    const [num1, num2] = currentProblem;
    const correctAnswer = num1 * num2;

    if (parseInt(answer, 10) === correctAnswer) {
      // Set processing flag to prevent multiple submissions
      setIsProcessingAnswer(true);
      
      // Correct answer
      sounds.correct.play();
      
      // Remove the problem from the list and add to solved
      const newProblems = problems.filter(
        p => !(p[0] === currentProblem[0] && p[1] === currentProblem[1])
      );
      
      // Update state in a specific order
      setProblems(newProblems);
      setSolvedProblems(prev => [...prev, currentProblem]);
      setShowCelebrationGif(true);
      setCurrentCelebrationGif(Math.floor(Math.random() * 7) + 1);

      // Use a timer to ensure the celebration GIF is displayed for a set time
      const gifTimer = setTimeout(() => {
        setShowCelebrationGif(false);
        
        // Move to next problem or celebration
        if (newProblems.length > 0) {
          // Force a small delay before showing the next problem
          setTimeout(() => {
            setCurrentProblem(newProblems[Math.floor(Math.random() * newProblems.length)]);
            setIsProcessingAnswer(false);
          }, 300);
        } else {
          // All problems solved
          setGameState('celebration');
          sounds.celebration.play();
        }
      }, 1500);

      // Clean up timer if component unmounts
      return () => clearTimeout(gifTimer);
    } else {
      // Wrong answer
      sounds.wrong.play();
    }
  };

  // Reset game
  const resetGame = () => {
    // Stop the celebration sound
    sounds.celebration.stop();
    
    setGameState('start');
    // Clear problems but don't set new ones until a multiplier is selected on start screen
    setProblems([]);
    setSolvedProblems([]);
    setCurrentProblem(null);
    setShowCelebrationGif(false);
    setIsProcessingAnswer(false);
  };

  // Exit game
  const exitGame = () => {
    // Stop the celebration sound
    sounds.celebration.stop();
    
    // Return to start screen
    setGameState('start');
    // Clear problems but don't set new ones until a multiplier is selected on start screen
    setProblems([]);
    setCurrentProblem(null);
    setShowCelebrationGif(false);
    setIsProcessingAnswer(false);
  };

  // Create problems and select initial problem when game starts or multiplier changes
  useEffect(() => {
    if (gameState === 'playing') {
      // Create problems for the current multiplier
      const newProblems = createProblems(multiplier);
      console.log(`Created problems for multiplier ${multiplier}:`, newProblems);
      setProblems(newProblems);
      
      // Select the first problem
      if (newProblems.length > 0) {
        const randomIndex = Math.floor(Math.random() * newProblems.length);
        setCurrentProblem(newProblems[randomIndex]);
      }
    }
  }, [gameState, multiplier]);

  return (
    <AppContainer>
      {(gameState === 'playing' || gameState === 'celebration') && (
        <Title>Math Blasters!</Title>
      )}
      
      {gameState === 'start' && (
        <StartScreen onStartClick={startGame} audioEnabled={audioEnabled} />
      )}
      
      {gameState === 'playing' && (
        <GameScreen 
          currentProblem={currentProblem}
          onAnswerSubmit={checkAnswer}
          totalProblems={12}
          solvedProblems={solvedProblems}
          showCelebrationGif={showCelebrationGif}
          celebrationGifNumber={currentCelebrationGif}
          isProcessingAnswer={isProcessingAnswer}
          multiplier={multiplier}
          onExitClick={exitGame}
        />
      )}
      
      {gameState === 'celebration' && (
        <CelebrationScreen 
          onPlayAgainClick={resetGame} 
          onExitClick={exitGame}
          multiplier={multiplier}
        />
      )}
    </AppContainer>
  );
}

export default App; 