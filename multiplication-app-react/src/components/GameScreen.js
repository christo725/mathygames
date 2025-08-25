import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import badgeImage from '../assets/badge.png';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 800px;
  position: relative;
  z-index: 2;
`;

const MobileTitle = styled.h1`
  display: none;
  font-size: 1.2rem;
  color: var(--cyan);
  text-shadow: 0 0 10px rgba(34, 227, 255, 0.7);
  margin-bottom: 1rem;
  
  @media (max-width: 480px) {
    display: block;
  }
`;

const ProgressContainer = styled(motion.div)`
  width: 100%;
  background-color: rgba(1, 3, 38, 0.7);
  padding: 1.5rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
  box-shadow: 0 0 20px rgba(34, 227, 255, 0.3);
  border: 2px solid var(--cyan);
`;

const ProgressBarOuter = styled.div`
  width: 100%;
  background-color: rgba(34, 227, 255, 0.1);
  height: 2rem;
  border-radius: 1rem;
  overflow: hidden;
  margin-bottom: 1rem;
  border: 1px solid rgba(34, 227, 255, 0.3);
`;

const ProgressBarInner = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--bright-pink));
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(255, 37, 183, 0.5);
`;

const ProgressText = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--cyan);
  text-align: center;
  text-shadow: 0 0 5px rgba(34, 227, 255, 0.7);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 1.1rem;
  }
`;

const SubmitButton = styled(motion.button)`
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(45deg, var(--orange), var(--yellow));
  color: rgba(1, 3, 38, 0.9);
  border: 3px solid var(--orange);
  border-radius: 1rem;
  padding: 1rem 3rem;
  box-shadow: 0 0 20px rgba(255, 145, 57, 0.5);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
  font-family: 'Comic Neue', cursive;
  cursor: pointer;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 480px) {
    display: none;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(255, 205, 57, 0.7);
  }
  
  &:active {
    transform: translateY(3px);
    box-shadow: 0 0 15px rgba(255, 145, 57, 0.6);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitHint = styled.span`
  font-size: 0.9rem;
  font-weight: normal;
  margin-top: 0.3rem;
  opacity: 0.8;
`;

const MobileKeypad = styled.div`
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.8rem;
  margin-top: 1.5rem;
  width: 100%;
  max-width: 320px;
  
  @media (max-width: 480px) {
    display: grid;
  }
`;

const KeypadButton = styled(motion.button)`
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, var(--cyan), #5648C0);
  color: white;
  border: none;
  border-radius: 0.8rem;
  padding: 1.2rem;
  box-shadow: 0 0 15px rgba(34, 227, 255, 0.3);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  font-family: 'Comic Neue', cursive;
  cursor: pointer;
  
  &:active {
    transform: scale(0.95);
    box-shadow: 0 0 10px rgba(34, 227, 255, 0.5);
  }
  
  &.clear {
    background: linear-gradient(45deg, var(--bright-pink), #FF6B9D);
    grid-column: span 2;
  }
  
  &.submit {
    background: linear-gradient(45deg, var(--orange), var(--yellow));
    color: rgba(1, 3, 38, 0.9);
    grid-column: span 3;
    font-size: 1.8rem;
  }
`;

const ProblemContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  width: 100%;
  position: relative;
`;

const ProblemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;

  /* Mobile styles */
  @media (max-width: 480px) {
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

const Problem = styled(motion.span)`
  font-size: 7.5rem;
  font-weight: bold;
  color: var(--cyan);
  text-align: center;
  text-shadow: 0 0 15px rgba(34, 227, 255, 0.7);
  padding: 1rem;
  background-color: rgba(1, 3, 38, 0.7);
  border-radius: 1rem;
  display: inline-block;
  border: 2px solid var(--cyan);
  box-shadow: 0 0 20px rgba(34, 227, 255, 0.3);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 5rem;
    padding: 0.8rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 3rem;
    padding: 0.5rem;
  }
`;

const EqualsSign = styled.span`
  font-size: 7.5rem;
  font-weight: bold;
  margin: 0 1rem;
  color: var(--cyan);
  text-shadow: 0 0 15px rgba(34, 227, 255, 0.7);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 5rem;
    margin: 0 0.8rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 3rem;
    margin: 0 0.5rem;
  }
`;

const AnswerInput = styled(motion.input)`
  font-size: 7rem;
  text-align: center;
  width: 180px;
  height: 120px;
  border: 3px solid var(--orange);
  border-radius: 1rem;
  background-color: rgba(1, 3, 38, 0.7);
  padding: 0.5rem;
  outline: none;
  font-family: 'Comic Neue', cursive;
  font-weight: bold;
  color: var(--yellow);
  margin-left: 1rem;
  text-shadow: 0 0 5px rgba(255, 205, 57, 0.7);
  box-shadow: 0 0 15px rgba(255, 145, 57, 0.5);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 4.5rem;
    width: 140px;
    height: 90px;
    margin-left: 0.8rem;
    padding: 0.4rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 2.5rem;
    width: 100px;
    height: 60px;
    margin-left: 0.5rem;
    padding: 0.3rem;
  }
  
  &:focus {
    border-color: var(--bright-pink);
    box-shadow: 0 0 25px rgba(255, 37, 183, 0.5);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FeedbackContainer = styled(motion.div)`
  margin-top: 2rem;
  text-align: center;
`;

const CorrectFeedback = styled(motion.p)`
  font-size: 3rem;
  font-weight: bold;
  color: var(--cyan);
  text-shadow: 0 0 15px rgba(34, 227, 255, 0.7);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 1rem 2rem;
  border-radius: 1rem;
  display: inline-block;
  border: 2px solid var(--cyan);
  box-shadow: 0 0 20px rgba(34, 227, 255, 0.5);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 0.8rem 1.5rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 2rem;
    padding: 0.6rem 1rem;
  }
`;

const WrongFeedback = styled(motion.p)`
  font-size: 3rem;
  font-weight: bold;
  color: var(--bright-pink);
  text-shadow: 0 0 15px rgba(255, 37, 183, 0.7);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 1rem 2rem;
  border-radius: 1rem;
  display: inline-block;
  border: 2px solid var(--bright-pink);
  box-shadow: 0 0 20px rgba(255, 37, 183, 0.5);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 2.5rem;
    padding: 0.8rem 1.5rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 2rem;
    padding: 0.6rem 1rem;
  }
`;

const CelebrationGif = styled(motion.img)`
  width: 300px;
  margin-top: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 30px rgba(255, 145, 57, 0.7);
  border: 2px solid var(--orange);

  /* Tablet styles */
  @media (max-width: 768px) {
    width: 250px;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    width: 200px;
  }
`;

const BadgesContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.2rem;
  margin: 2rem 0;
  width: 100%;
  max-width: 800px;

  /* Tablet styles */
  @media (max-width: 768px) {
    gap: 1rem;
    margin: 1.5rem 0;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    gap: 0.8rem;
    margin: 1rem 0;
  }
`;

const Badge = styled(motion.img)`
  width: 112px;
  height: 112px;
  object-fit: contain;
  filter: drop-shadow(0 0 12px rgba(255, 205, 57, 0.8));

  /* Tablet styles */
  @media (max-width: 768px) {
    width: 96px;
    height: 96px;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    width: 80px;
    height: 80px;
  }
`;

const ReturnButton = styled(motion.button)`
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(45deg, var(--cyan), #5648C0);
  color: white;
  border: none;
  border-radius: 1rem;
  padding: 0.8rem 1.5rem;
  box-shadow: 0 0 20px rgba(34, 227, 255, 0.5);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  font-family: 'Comic Neue', cursive;
  cursor: pointer;
  margin-top: 2rem;

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.6rem;
    padding: 0.7rem 1.3rem;
    margin-top: 1.5rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 1.4rem;
    padding: 0.6rem 1rem;
    margin-top: 1rem;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 30px rgba(34, 227, 255, 0.7);
  }

  &:active {
    transform: translateY(3px);
    box-shadow: 0 0 15px rgba(34, 227, 255, 0.6);
  }
`;

const GameScreen = ({ 
  currentProblem, 
  onAnswerSubmit, 
  totalProblems, 
  solvedProblems,
  showCelebrationGif,
  celebrationGifNumber,
  isProcessingAnswer,
  multiplier,
  onExitClick
}) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const inputRef = useRef(null);

  // Choose which way to display the problem (7×n or n×7)
  const [displayOrder, setDisplayOrder] = useState(Math.random() < 0.5);
  
  // Re-randomize display order when problem changes
  useEffect(() => {
    if (currentProblem) {
      setDisplayOrder(Math.random() < 0.5);
      setAnswer('');
      setFeedback(null);
      
      // Focus on input when problem changes
      if (inputRef.current) {
        setTimeout(() => {
          inputRef.current.focus();
        }, 100);
      }
    }
  }, [currentProblem]);
  
  // Keep focus on input when component updates
  useEffect(() => {
    if (inputRef.current && !isProcessingAnswer) {
      inputRef.current.focus();
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isProcessingAnswer) return;
    
    if (!answer || isNaN(parseInt(answer, 10))) {
      return;
    }
    
    const [num1, num2] = currentProblem;
    const correctAnswer = num1 * num2;
    
    if (parseInt(answer, 10) === correctAnswer) {
      setFeedback('Correct!');
      onAnswerSubmit(answer);
    } else {
      setFeedback('Try again!');
      
      // Refocus on input after wrong answer
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const handleInputChange = (e) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setAnswer(value);
    
    // Clear feedback when typing
    if (feedback) {
      setFeedback(null);
    }
  };

  // Calculate progress
  const progress = solvedProblems.length / totalProblems;

  if (!currentProblem) return null;

  return (
    <GameContainer>
      <MobileTitle>Math Blasters</MobileTitle>
      <ProgressContainer
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <ProgressBarOuter>
          <ProgressBarInner 
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </ProgressBarOuter>
        <ProgressText>
          Multiplying by {multiplier}: {solvedProblems.length}/{totalProblems} problems solved
        </ProgressText>
      </ProgressContainer>

      <ProblemContainer
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <form onSubmit={handleSubmit}>
          <ProblemRow>
            <Problem
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {displayOrder ? `${currentProblem[0]} × ${currentProblem[1]}` : `${currentProblem[1]} × ${currentProblem[0]}`}
            </Problem>
            <EqualsSign>=</EqualsSign>
            <AnswerInput
              ref={inputRef}
              type="text"
              value={answer}
              onChange={handleInputChange}
              autoFocus
              disabled={isProcessingAnswer}
              whileFocus={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            />
          </ProblemRow>
          <SubmitButton
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isProcessingAnswer || !answer}
          >
            Submit
            <SubmitHint>(or press Enter)</SubmitHint>
          </SubmitButton>
        </form>
      </ProblemContainer>
      
      <MobileKeypad>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <KeypadButton
            key={num}
            type="button"
            whileTap={{ scale: 0.9 }}
            onClick={() => setAnswer(answer + num)}
          >
            {num}
          </KeypadButton>
        ))}
        <KeypadButton
          className="clear"
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setAnswer('')}
        >
          Clear
        </KeypadButton>
        <KeypadButton
          key={0}
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={() => setAnswer(answer + 0)}
        >
          0
        </KeypadButton>
        <KeypadButton
          className="submit"
          type="button"
          whileTap={{ scale: 0.9 }}
          onClick={handleSubmit}
          disabled={isProcessingAnswer || !answer}
        >
          Submit
        </KeypadButton>
      </MobileKeypad>

      {/* Badge collection display - moved up, directly under problems */}
      <BadgesContainer>
        <AnimatePresence>
          {solvedProblems.map((problem, index) => (
            <Badge
              key={`badge-${index}`}
              src={badgeImage}
              alt={`Badge ${index + 1}`}
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                rotate: 0,
                y: [0, -10, 0]
              }}
              transition={{ 
                duration: 0.7,
                y: {
                  duration: 0.5,
                  repeat: 2,
                  repeatType: "reverse",
                }
              }}
            />
          ))}
        </AnimatePresence>
      </BadgesContainer>

      <AnimatePresence>
        {feedback && (
          <FeedbackContainer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {feedback === 'Correct!' ? (
              <CorrectFeedback
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring", 
                  stiffness: 300
                }}
              >
                {feedback}
              </CorrectFeedback>
            ) : (
              <WrongFeedback
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ 
                  duration: 0.5,
                  type: "spring", 
                  stiffness: 300
                }}
              >
                {feedback}
              </WrongFeedback>
            )}
          </FeedbackContainer>
        )}
        
        {showCelebrationGif && (
          <CelebrationGif
            key="celebration-gif"
            src={require(`../assets/celebration${celebrationGifNumber}.gif`)}
            alt="Celebration"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
      
      <ReturnButton
        onClick={onExitClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Return to Base
      </ReturnButton>
    </GameContainer>
  );
};

export default GameScreen; 