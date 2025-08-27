"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/gameStore";
import type { MathProblem, Difficulty, MathOperation } from "@/types/game";

interface MathChallengeProps {
  operation?: MathOperation;
  difficulty: Difficulty;
  onComplete: (score: number) => void;
}

export function MathChallenge({ operation = "+", difficulty, onComplete }: MathChallengeProps) {
  const { addCoins, addExperience } = useGameStore();
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds timer

  const totalQuestions = 10;

  // Generate math problem based on difficulty
  const generateProblem = (): MathProblem => {
    let num1: number, num2: number, answer: number;
    const maxNum = difficulty === "easy" ? 10 : difficulty === "medium" ? 20 : 50;

    switch (operation) {
      case "+":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * maxNum) + 1;
        answer = num1 + num2;
        break;
      case "-":
        num1 = Math.floor(Math.random() * maxNum) + 1;
        num2 = Math.floor(Math.random() * Math.min(num1, maxNum)) + 1;
        answer = num1 - num2;
        break;
      case "×":
        num1 = Math.floor(Math.random() * (difficulty === "easy" ? 10 : 12)) + 1;
        num2 = Math.floor(Math.random() * (difficulty === "easy" ? 10 : 12)) + 1;
        answer = num1 * num2;
        break;
      case "÷":
        num2 = Math.floor(Math.random() * 10) + 1;
        answer = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * answer;
        break;
      default:
        num1 = 1;
        num2 = 1;
        answer = 2;
    }

    // Generate choices
    const choices = [answer];
    while (choices.length < 4) {
      const variance = Math.floor(answer * 0.3) + 1;
      const wrongAnswer = answer + (Math.random() > 0.5 ? variance : -variance) * (Math.random() > 0.5 ? 1 : 2);
      if (wrongAnswer > 0 && !choices.includes(Math.floor(wrongAnswer))) {
        choices.push(Math.floor(wrongAnswer));
      }
    }

    // Shuffle choices
    choices.sort(() => Math.random() - 0.5);

    return {
      question: `${num1} ${operation} ${num2}`,
      answer,
      choices,
      operation,
    };
  };

  // Timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Generate new problem
  useEffect(() => {
    if (!showResult) {
      setProblem(generateProblem());
    }
  }, [questionNumber, showResult]);

  const handleAnswerSelect = (answer: number) => {
    if (!problem || showResult) return;

    setSelectedAnswer(answer);
    const correct = answer === problem.answer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      const points = (10 + streak * 2) * (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      setScore(score + points);
      setStreak(streak + 1);
      addCoins(5 + streak);
      addExperience(10);
    } else {
      setStreak(0);
    }

    // Auto proceed after 1.5 seconds
    setTimeout(() => {
      if (questionNumber >= totalQuestions) {
        handleComplete();
      } else {
        setQuestionNumber(questionNumber + 1);
        setShowResult(false);
        setSelectedAnswer(null);
      }
    }, 1500);
  };

  const handleComplete = () => {
    const finalScore = score + (timeLeft * 2); // Bonus for remaining time
    onComplete(finalScore);
  };

  if (!problem) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold">
            Question {questionNumber}/{totalQuestions}
          </div>
          <div className="text-lg font-semibold text-orange-500">
            Score: {score}
          </div>
          {streak > 0 && (
            <div className="text-lg font-semibold text-pink-500">
              Streak: {streak}🔥
            </div>
          )}
        </div>
        <div className={`text-2xl font-bold ${timeLeft < 10 ? "text-red-500" : "text-gray-700"}`}>
          {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
        <motion.div
          className="bg-gradient-to-r from-orange-500 to-pink-500 h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Math Problem */}
      <div className="text-center mb-8">
        <motion.h2
          key={problem.question}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-bold text-gray-800"
        >
          {problem.question} = ?
        </motion.h2>
      </div>

      {/* Answer Choices */}
      <div className="grid grid-cols-2 gap-4">
        {problem.choices.map((choice, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={!showResult ? { scale: 1.05 } : {}}
            whileTap={!showResult ? { scale: 0.95 } : {}}
            onClick={() => handleAnswerSelect(choice)}
            disabled={showResult}
            className={`p-6 rounded-2xl text-2xl font-bold transition-all ${
              showResult
                ? choice === problem.answer
                  ? "bg-green-500 text-white"
                  : selectedAnswer === choice
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-500"
                : "bg-gradient-to-r from-blue-400 to-purple-500 text-white hover:shadow-lg"
            }`}
          >
            {choice}
          </motion.button>
        ))}
      </div>

      {/* Result Feedback */}
      {showResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-center mt-6 text-2xl font-bold ${
            isCorrect ? "text-green-500" : "text-red-500"
          }`}
        >
          {isCorrect ? "Awesome! 🎉" : `Oops! The answer is ${problem.answer}`}
        </motion.div>
      )}
    </motion.div>
  );
}