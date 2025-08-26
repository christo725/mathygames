import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';
import mathFunImage from '../assets/math_fun.png';
import blastOffSound from '../assets/blast-off.mp3';
import laserBlastSound from '../assets/laser-blast.mp3';
import selectLaserSound from '../assets/select-laser.mp3';

const StartScreenContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 1.4rem;
  margin-top: 0.5rem;
  width: 100%;
  max-width: 560px;
  transform: scale(1.4);
  position: relative;
  z-index: 2;

  /* Tablet styles */
  @media (max-width: 768px) {
    transform: scale(0.84);
    margin-top: 0.7rem;
    padding: 0.7rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    transform: scale(1);
    margin-top: 0;
    padding: 1rem;
    max-width: none;
    justify-content: center;
  }
`;

const StartImage = styled(motion.img)`
  width: 100%;
  max-width: 350px;
  margin-top: 50px;
  margin-bottom: 1.4rem;
  border-radius: 0.7rem;
  box-shadow: 0 0 21px rgba(34, 227, 255, 0.3);
  border: 1.4px solid var(--cyan);

  /* Tablet styles */
  @media (max-width: 768px) {
    margin-top: 70px;
    margin-bottom: 1.05rem;
    max-width: 280px;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    margin-top: 0.5rem;
    margin-bottom: 0.8rem;
    max-width: none;
    width: calc(100% - 2rem);
    height: auto;
    max-height: 180px;
    object-fit: contain;
  }
`;

const StartText = styled(motion.h2)`
  font-size: 1.75rem;
  color: var(--cyan);
  text-align: center;
  margin-bottom: 1.05rem;
  text-shadow: 0 0 7px rgba(34, 227, 255, 0.7);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 1.05rem;
  border-radius: 0.7rem;
  box-shadow: 0 0 14px rgba(34, 227, 255, 0.2);
  border: 1.4px solid var(--cyan);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 0.84rem;
    margin-bottom: 0.84rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 1.1rem;
    padding: 0.8rem;
    margin-bottom: 0.8rem;
    width: calc(100% - 2rem);
  }
`;

// Laser animations
const laserBeam = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  20% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(2);
  }
`;

const laserGlow = keyframes`
  0% {
    box-shadow: 0 0 10px 5px rgba(255, 37, 183, 0.8),
                0 0 20px 10px rgba(34, 227, 255, 0.6);
  }
  50% {
    box-shadow: 0 0 20px 10px rgba(255, 37, 183, 0.9),
                0 0 40px 20px rgba(34, 227, 255, 0.8);
  }
  100% {
    box-shadow: 0 0 10px 5px rgba(255, 37, 183, 0.8),
                0 0 20px 10px rgba(34, 227, 255, 0.6);
  }
`;

const LaserContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none;
  z-index: 100;
  display: ${props => props.isLaserActive ? 'block' : 'none'};
`;

const LaserBeam = styled.div`
  position: absolute;
  background: linear-gradient(to right, 
    rgba(255, 37, 183, 0.8), 
    rgba(34, 227, 255, 0.8));
  width: 100vw;
  height: 100vh;
  animation: ${laserBeam} 1.2s ease-out forwards;
  opacity: 0;
  transform-origin: center center;
  border-radius: 50%;
`;

const StartButton = styled(motion.button)`
  font-size: 1.75rem;
  font-weight: bold;
  background: linear-gradient(45deg, var(--orange), var(--bright-pink));
  color: white;
  border: none;
  border-radius: 0.7rem;
  padding: 0.7rem 2.1rem;
  margin-top: 1.05rem;
  box-shadow: 0 0 14px rgba(255, 37, 183, 0.5);
  text-shadow: 0 1.4px 2.8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  cursor: pointer;
  font-family: 'Comic Neue', cursive;
  position: relative;
  overflow: hidden;
  letter-spacing: 0.7px;

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.4rem;
    padding: 0.56rem 1.4rem;
    margin-top: 0.84rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 1.3rem;
    padding: 0.8rem;
    margin-top: 0.8rem;
    width: calc(100% - 2rem);
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, var(--cyan), var(--bright-pink), var(--orange), var(--yellow));
    z-index: -1;
    border-radius: 1.2rem;
    background-size: 400%;
    animation: glowing 10s linear infinite;
  }

  @keyframes glowing {
    0% { background-position: 0 0; }
    50% { background-position: 400% 0; }
    100% { background-position: 0 0; }
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(255, 37, 183, 0.7);
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 0 15px rgba(255, 37, 183, 0.6);
  }

  ${props => props.isLaserActive && css`
    animation: ${laserGlow} 0.8s infinite;
  `}
`;

const NumberButtonsContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-bottom: 0.7rem;
  width: 100%;
  
  /* Mobile styles */
  @media (max-width: 480px) {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(4, 1fr);
    gap: 0.8rem;
    margin-bottom: 1rem;
    width: calc(100% - 2rem);
  }
`;

const NumberButton = styled(motion.button)`
  font-size: 1.4rem;
  font-weight: bold;
  background: ${props => props.isSelected 
    ? 'linear-gradient(45deg, var(--cyan), var(--bright-pink))' 
    : 'linear-gradient(45deg, var(--dark-blue), var(--space-blue))'};
  color: white;
  border: none;
  border-radius: 0.7rem;
  width: 2.8rem;
  height: 2.8rem;
  box-shadow: 0 0 10.5px ${props => props.isSelected 
    ? 'rgba(34, 227, 255, 0.7)' 
    : 'rgba(34, 227, 255, 0.3)'};
  text-shadow: 0 1.4px 2.8px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  cursor: pointer;
  font-family: 'Comic Neue', cursive;
  border: 1.4px solid ${props => props.isSelected ? 'var(--yellow)' : 'var(--cyan)'};

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.19rem;
    width: 2.45rem;
    height: 2.45rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 1.3rem;
    width: 100%;
    height: 3rem;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 0 20px rgba(34, 227, 255, 0.6);
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 0 10px rgba(34, 227, 255, 0.5);
  }
`;

// Sound effects
const playBlastOffSound = () => {
  try {
    const audio = new Audio(blastOffSound);
    audio.volume = 0.7;
    audio.play().catch(error => {
      console.log('Unable to play blast-off sound:', error);
    });
  } catch (error) {
    console.log('Unable to play blast-off sound:', error);
  }
};

const playLaserSound = () => {
  try {
    const audio = new Audio(laserBlastSound);
    audio.volume = 0.5;
    audio.play().catch(error => {
      console.log('Unable to play laser sound effect:', error);
    });
  } catch (error) {
    console.log('Unable to play laser sound effect:', error);
  }
};

const playSelectSound = () => {
  try {
    const audio = new Audio(selectLaserSound);
    audio.volume = 0.4;
    audio.play().catch(error => {
      console.log('Unable to play select sound effect:', error);
    });
  } catch (error) {
    console.log('Unable to play select sound effect:', error);
  }
};

const StartScreen = ({ onStartClick, audioEnabled = false }) => {
  const [selectedNumber, setSelectedNumber] = useState(1);
  const [isLaserActive, setIsLaserActive] = useState(false);
  const availableNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  const handleNumberSelect = (number) => {
    setSelectedNumber(number);
    
    // Play select sound when a number is clicked
    if (audioEnabled) {
      playSelectSound();
    }
  };

  const handleStartClick = () => {
    // Play blast off sound
    if (audioEnabled) {
      playBlastOffSound();
    }
    
    // Activate laser effect
    setIsLaserActive(true);
    
    // Play laser sound after a small delay
    setTimeout(() => {
      if (audioEnabled) {
        playLaserSound();
      }
    }, 300);
    
    // Wait for animation to complete before starting game
    setTimeout(() => {
      onStartClick(selectedNumber);
    }, 1200); // Match this with the laser animation duration
  };

  return (
    <StartScreenContainer
      initial={{ opacity: 0, scale: window.innerWidth <= 480 ? 0.9 : window.innerWidth <= 768 ? 0.77 : 1.26 }}
      animate={{ opacity: 1, scale: window.innerWidth <= 480 ? 1 : window.innerWidth <= 768 ? 0.84 : 1.4 }}
      transition={{ duration: 0.5 }}
    >
      {/* Laser effect overlay */}
      <LaserContainer isLaserActive={isLaserActive}>
        <LaserBeam />
      </LaserContainer>
      
      <StartImage 
        src={mathFunImage} 
        alt="Math Fun"
        initial={{ x: -20 }}
        animate={{ x: 20 }}
        transition={{ 
          duration: 1.2, 
          repeat: Infinity, 
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      />
      
      <StartText
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        Ready to blast off with multiplying by:
      </StartText>
      
      <NumberButtonsContainer
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
      >
        {availableNumbers.map(number => (
          <NumberButton
            key={number}
            isSelected={selectedNumber === number}
            onClick={() => handleNumberSelect(number)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            disabled={isLaserActive}
            style={
              // For mobile, place 10, 11, 12 on the bottom row
              window.innerWidth <= 480 && number === 10 ? { gridColumn: '1' } :
              window.innerWidth <= 480 && number === 11 ? { gridColumn: '2' } :
              window.innerWidth <= 480 && number === 12 ? { gridColumn: '3' } : {}
            }
          >
            {number}
          </NumberButton>
        ))}
      </NumberButtonsContainer>
      
      <StartButton
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleStartClick}
        disabled={isLaserActive}
        isLaserActive={isLaserActive}
      >
        BLAST OFF!
      </StartButton>
    </StartScreenContainer>
  );
};

export default StartScreen; 