import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';

// Import all celebration GIFs
const celebrationGifs = [];
for (let i = 1; i <= 7; i++) {
  celebrationGifs.push(require(`../assets/celebration${i}.gif`));
}

const CelebrationContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
  max-width: 1000px;
  position: relative;
  z-index: 2;

  /* Tablet styles */
  @media (max-width: 768px) {
    padding: 1.5rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    padding: 1rem;
  }
`;

const CongratsText = styled(motion.h1)`
  font-size: 5rem;
  font-weight: bold;
  color: var(--bright-pink);
  text-align: center;
  margin-bottom: 1rem;
  text-shadow: 0 0 20px rgba(255, 37, 183, 0.8);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 1.5rem;
  border-radius: 1rem;
  box-shadow: 0 0 30px rgba(255, 37, 183, 0.4);
  border: 2px solid var(--bright-pink);
  animation: glow 2s ease-in-out infinite;
  letter-spacing: 2px;

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 3.5rem;
    padding: 1.2rem;
    letter-spacing: 1px;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 2.5rem;
    padding: 1rem;
    letter-spacing: 0.5px;
  }
`;

const SubText = styled(motion.h2)`
  font-size: 3rem;
  color: var(--cyan);
  text-align: center;
  margin-bottom: 2rem;
  text-shadow: 0 0 15px rgba(34, 227, 255, 0.7);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 1rem;
  border-radius: 1rem;
  box-shadow: 0 0 20px rgba(34, 227, 255, 0.3);
  border: 2px solid var(--cyan);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 2.2rem;
    margin-bottom: 1.5rem;
    padding: 0.8rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    padding: 0.6rem;
  }
`;

const GifGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin: 2rem 0;
  width: 100%;

  /* Tablet styles */
  @media (max-width: 768px) {
    gap: 1rem;
    margin: 1.5rem 0;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    margin: 1rem 0;
  }
`;

const GifContainer = styled(motion.div)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CelebrationGif = styled(motion.img)`
  width: 100%;
  border-radius: 1rem;
  box-shadow: 0 0 30px rgba(255, 145, 57, 0.5);
  border: 2px solid var(--orange);

  /* Mobile styles */
  @media (max-width: 480px) {
    max-width: 300px;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
  width: 100%;

  /* Tablet styles */
  @media (max-width: 768px) {
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 1rem;
  }
`;

const Button = styled(motion.button)`
  font-size: 2.5rem;
  font-weight: bold;
  background: ${props => props.primary ? 
    `linear-gradient(45deg, var(--orange), var(--bright-pink))` : 
    `linear-gradient(45deg, var(--cyan), #5648C0)`};
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 1rem 2rem;
  box-shadow: ${props => props.primary ? 
    `0 0 20px rgba(255, 37, 183, 0.5)` : 
    `0 0 20px rgba(34, 227, 255, 0.5)`};
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  font-family: 'Comic Neue', cursive;
  position: relative;
  overflow: hidden;
  letter-spacing: 1px;

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 2rem;
    padding: 0.8rem 1.5rem;
    letter-spacing: 0.5px;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 1.5rem;
    padding: 0.7rem 1.2rem;
    letter-spacing: 0;
    width: 250px;
  }

  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: ${props => props.primary ? 
      `linear-gradient(45deg, var(--orange), var(--bright-pink), var(--yellow), var(--orange))` : 
      `linear-gradient(45deg, var(--cyan), #5648C0, var(--cyan), #5648C0)`};
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
    box-shadow: ${props => props.primary ? 
      `0 0 30px rgba(255, 37, 183, 0.7)` : 
      `0 0 30px rgba(34, 227, 255, 0.7)`};
  }

  &:active {
    transform: translateY(3px);
    box-shadow: ${props => props.primary ? 
      `0 0 15px rgba(255, 37, 183, 0.6)` : 
      `0 0 15px rgba(34, 227, 255, 0.6)`};
  }
`;

const CelebrationScreen = ({ onPlayAgainClick, onExitClick, multiplier }) => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Update window size for confetti
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Get celebration message based on multiplier
  const getCelebrationMessage = () => {
    return `You Blasted Thru the ${multiplier}'s! Keep it Going!`;
  };

  return (
    <CelebrationContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        recycle={true}
        numberOfPieces={200}
        colors={['#22e3ff', '#ff25b7', '#ff9139', '#ffcd39']}
      />
      
      <CongratsText
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          type: "spring",
          stiffness: 300
        }}
      >
        MISSION ACCOMPLISHED!
      </CongratsText>
      
      <SubText
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ 
          duration: 0.8,
          delay: 0.2,
          type: "spring",
          stiffness: 300
        }}
      >
        {getCelebrationMessage()}
      </SubText>
      
      <GifGrid>
        {celebrationGifs.map((gif, index) => (
          <GifContainer
            key={`celebration-${index}`}
            initial={{ opacity: 0, scale: 0, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.5, 
              delay: 0.3 + (index * 0.1),
              type: "spring"
            }}
          >
            <CelebrationGif
              src={gif}
              alt={`Celebration ${index + 1}`}
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ duration: 0.2 }}
            />
          </GifContainer>
        ))}
      </GifGrid>
      
      <ButtonContainer>
        <Button
          primary
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onPlayAgainClick}
        >
          New Mission
        </Button>
        <Button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onExitClick}
        >
          Return to Base
        </Button>
      </ButtonContainer>
    </CelebrationContainer>
  );
};

export default CelebrationScreen; 