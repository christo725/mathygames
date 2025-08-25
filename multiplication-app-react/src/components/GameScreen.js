import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import badgeImage from '../assets/badge.png';

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  max-width: 338px;
  position: relative;
  z-index: 2;
`;


const ProgressContainer = styled(motion.div)`
  width: 100%;
  background-color: rgba(1, 3, 38, 0.7);
  padding: 0.65rem;
  border-radius: 0.42rem;
  margin-bottom: 0.845rem;
  box-shadow: 0 0 8.45px rgba(34, 227, 255, 0.3);
  border: 0.845px solid var(--cyan);
  
  @media (max-width: 480px) {
    padding: 0.8rem;
    margin-bottom: 1rem;
  }
`;

const ProgressBarOuter = styled.div`
  width: 100%;
  background-color: rgba(34, 227, 255, 0.1);
  height: 0.845rem;
  border-radius: 0.42rem;
  overflow: hidden;
  margin-bottom: 0.42rem;
  border: 0.42px solid rgba(34, 227, 255, 0.3);
  
  @media (max-width: 480px) {
    height: 1rem;
    margin-bottom: 0.5rem;
  }
`;

const ProgressBarInner = styled(motion.div)`
  height: 100%;
  background: linear-gradient(90deg, var(--cyan), var(--bright-pink));
  border-radius: 1rem;
  box-shadow: 0 0 10px rgba(255, 37, 183, 0.5);
`;

const ProgressText = styled.p`
  font-size: 0.634rem;
  font-weight: bold;
  color: var(--cyan);
  text-align: center;
  text-shadow: 0 0 2.11px rgba(34, 227, 255, 0.7);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 0.549rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 0.8rem;
  }
`;

const SubmitButton = styled(motion.button)`
  font-size: 0.845rem;
  font-weight: bold;
  background: linear-gradient(45deg, var(--orange), var(--yellow));
  color: rgba(1, 3, 38, 0.9);
  border: 1.27px solid var(--orange);
  border-radius: 0.42rem;
  padding: 0.42rem 1.27rem;
  box-shadow: 0 0 8.45px rgba(255, 145, 57, 0.5);
  text-shadow: 0 0.42px 0.845px rgba(0, 0, 0, 0.2);
  transition: all 0.2s;
  font-family: 'Comic Neue', cursive;
  cursor: pointer;
  margin: 0.634rem auto 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  
  @media (max-width: 480px) {
    display: none;
  }
  
  &:hover {
    transform: translateY(-1.95px);
    box-shadow: 0 0 19.5px rgba(255, 205, 57, 0.7);
  }
  
  &:active {
    transform: translateY(1.95px);
    box-shadow: 0 0 9.75px rgba(255, 145, 57, 0.6);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitHint = styled.span`
  font-size: 0.38rem;
  font-weight: normal;
  margin-top: 0.127rem;
  opacity: 0.8;
`;

const MobileKeypad = styled.div`
  display: none;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  margin-top: 0.8rem;
  width: 100%;
  max-width: 280px;
  
  @media (max-width: 480px) {
    display: grid;
  }
`;

const KeypadButton = styled(motion.button)`
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(45deg, var(--cyan), #5648C0);
  color: white;
  border: none;
  border-radius: 0.6rem;
  padding: 0.8rem;
  box-shadow: 0 0 10px rgba(34, 227, 255, 0.3);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
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
    font-size: 1.3rem;
  }
`;

const ProblemContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.845rem;
  width: 100%;
  position: relative;
  
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
  }
`;

const ProblemRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.845rem;

  /* Mobile styles */
  @media (max-width: 480px) {
    margin-bottom: 0.8rem;
    flex-wrap: wrap;
    gap: 0.3rem;
  }
`;

const Problem = styled(motion.span)`
  font-size: 3.169rem;
  font-weight: bold;
  color: var(--cyan);
  text-align: center;
  text-shadow: 0 0 6.34px rgba(34, 227, 255, 0.7);
  padding: 0.42rem;
  background-color: rgba(1, 3, 38, 0.7);
  border-radius: 0.42rem;
  display: inline-block;
  border: 0.845px solid var(--cyan);
  box-shadow: 0 0 8.45px rgba(34, 227, 255, 0.3);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 2.11rem;
    padding: 0.338rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 2.2rem;
    padding: 0.4rem;
  }
`;

const EqualsSign = styled.span`
  font-size: 3.169rem;
  font-weight: bold;
  margin: 0 0.42rem;
  color: var(--cyan);
  text-shadow: 0 0 6.34px rgba(34, 227, 255, 0.7);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 2.11rem;
    margin: 0 0.338rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 2.2rem;
    margin: 0 0.3rem;
  }
`;

const AnswerInput = styled(motion.input)`
  font-size: 2.958rem;
  text-align: center;
  width: 76px;
  height: 51px;
  border: 1.27px solid var(--orange);
  border-radius: 0.42rem;
  background-color: rgba(1, 3, 38, 0.7);
  padding: 0.211rem;
  outline: none;
  font-family: 'Comic Neue', cursive;
  font-weight: bold;
  color: var(--yellow);
  margin-left: 0.42rem;
  text-shadow: 0 0 2.11px rgba(255, 205, 57, 0.7);
  box-shadow: 0 0 6.34px rgba(255, 145, 57, 0.5);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.901rem;
    width: 59px;
    height: 38px;
    margin-left: 0.338rem;
    padding: 0.169rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 2rem;
    width: 80px;
    height: 50px;
    margin-left: 0.3rem;
    padding: 0.2rem;
  }
  
  &:focus {
    border-color: var(--bright-pink);
    box-shadow: 0 0 16.25px rgba(255, 37, 183, 0.5);
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const FeedbackContainer = styled(motion.div)`
  margin-top: 0.845rem;
  text-align: center;
  
  @media (max-width: 480px) {
    margin-top: 0.8rem;
  }
`;

const CorrectFeedback = styled(motion.p)`
  font-size: 1.268rem;
  font-weight: bold;
  color: var(--cyan);
  text-shadow: 0 0 6.34px rgba(34, 227, 255, 0.7);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 0.42rem 0.845rem;
  border-radius: 0.42rem;
  display: inline-block;
  border: 0.845px solid var(--cyan);
  box-shadow: 0 0 8.45px rgba(34, 227, 255, 0.5);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.056rem;
    padding: 0.338rem 0.634rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 0.845rem;
    padding: 0.26rem 0.455rem;
  }
`;

const WrongFeedback = styled(motion.p)`
  font-size: 1.268rem;
  font-weight: bold;
  color: var(--bright-pink);
  text-shadow: 0 0 6.34px rgba(255, 37, 183, 0.7);
  background-color: rgba(1, 3, 38, 0.7);
  padding: 0.42rem 0.845rem;
  border-radius: 0.42rem;
  display: inline-block;
  border: 0.845px solid var(--bright-pink);
  box-shadow: 0 0 8.45px rgba(255, 37, 183, 0.5);

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 1.056rem;
    padding: 0.338rem 0.634rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 0.845rem;
    padding: 0.26rem 0.455rem;
  }
`;

const CelebrationGif = styled(motion.img)`
  width: 126.75px;
  margin-top: 0.42rem;
  border-radius: 0.211rem;
  box-shadow: 0 0 12.675px rgba(255, 145, 57, 0.7);
  border: 0.845px solid var(--orange);

  /* Tablet styles */
  @media (max-width: 768px) {
    width: 105.625px;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    width: 84.5px;
  }
`;

const BadgesContainer = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.507rem;
  margin: 0.845rem 0;
  width: 100%;
  max-width: 338px;

  /* Tablet styles */
  @media (max-width: 768px) {
    gap: 0.42rem;
    margin: 0.634rem 0;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    gap: 0.325rem;
    margin: 0.325rem 0;
  }
`;

const Badge = styled(motion.img)`
  width: 47.32px;
  height: 47.32px;
  object-fit: contain;
  filter: drop-shadow(0 0 5.07px rgba(255, 205, 57, 0.8));

  /* Tablet styles */
  @media (max-width: 768px) {
    width: 40.56px;
    height: 40.56px;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    width: 31.2px;
    height: 31.2px;
  }
`;

const ReturnButton = styled(motion.button)`
  font-size: 0.7605rem;
  font-weight: bold;
  background: linear-gradient(45deg, var(--cyan), #5648C0);
  color: white;
  border: none;
  border-radius: 0.42rem;
  padding: 0.338rem 0.634rem;
  box-shadow: 0 0 8.45px rgba(34, 227, 255, 0.5);
  text-shadow: 0 0.845px 1.69px rgba(0, 0, 0, 0.3);
  transition: all 0.2s;
  font-family: 'Comic Neue', cursive;
  cursor: pointer;
  margin-top: 0.845rem;

  /* Tablet styles */
  @media (max-width: 768px) {
    font-size: 0.676rem;
    padding: 0.296rem 0.549rem;
    margin-top: 0.634rem;
  }

  /* Mobile styles */
  @media (max-width: 480px) {
    font-size: 0.65rem;
    padding: 0.26rem 0.455rem;
    margin-top: 0.325rem;
  }

  &:hover {
    transform: translateY(-1.268px);
    box-shadow: 0 0 12.675px rgba(34, 227, 255, 0.7);
  }

  &:active {
    transform: translateY(1.268px);
    box-shadow: 0 0 6.34px rgba(34, 227, 255, 0.6);
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