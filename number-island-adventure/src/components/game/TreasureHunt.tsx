"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/gameStore";
import { MapPin, X } from "lucide-react";

interface TreasureHuntProps {
  onComplete: (score: number) => void;
}

interface TreasureSpot {
  x: number;
  y: number;
  value: number;
  found: boolean;
}

export function TreasureHunt({ onComplete }: TreasureHuntProps) {
  const { addCoins, addExperience } = useGameStore();
  const [treasureMap, setTreasureMap] = useState<TreasureSpot[]>([]);
  const [currentClue, setCurrentClue] = useState<string>("");
  const [answer, setAnswer] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>("");
  const [score, setScore] = useState(0);
  const [foundCount, setFoundCount] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const totalTreasures = 5;

  // Generate treasure locations
  useEffect(() => {
    const spots: TreasureSpot[] = [];
    for (let i = 0; i < totalTreasures; i++) {
      spots.push({
        x: 10 + Math.random() * 80, // 10-90% of container width
        y: 10 + Math.random() * 80, // 10-90% of container height
        value: (i + 1) * 100,
        found: false,
      });
    }
    setTreasureMap(spots);
    generateClue();
  }, []);

  const generateClue = () => {
    const operations = [
      { 
        template: "If you have {a} gold coins and find {b} more, how many will you have?",
        calc: (a: number, b: number) => a + b,
      },
      {
        template: "A pirate had {a} gems but lost {b} in a storm. How many are left?",
        calc: (a: number, b: number) => a - b,
      },
      {
        template: "There are {a} treasure chests with {b} coins each. How many coins total?",
        calc: (a: number, b: number) => a * b,
      },
      {
        template: "You found {a} gold bars worth {b} coins each. What's the total value?",
        calc: (a: number, b: number) => a * b,
      },
    ];

    const operation = operations[Math.floor(Math.random() * operations.length)];
    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 10) + 2;

    // Ensure subtraction doesn't go negative
    if (operation.calc === operations[1].calc) {
      const maxA = a + b;
      setCurrentClue(operation.template.replace("{a}", maxA.toString()).replace("{b}", b.toString()));
      setAnswer(maxA - b);
    } else {
      setCurrentClue(operation.template.replace("{a}", a.toString()).replace("{b}", b.toString()));
      setAnswer(operation.calc(a, b));
    }
  };

  const handleSubmit = () => {
    const userNum = parseInt(userAnswer);
    if (isNaN(userNum)) return;

    const correct = userNum === answer;
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Find next unfound treasure
      const unfoundIndex = treasureMap.findIndex(t => !t.found);
      if (unfoundIndex !== -1) {
        const updatedMap = [...treasureMap];
        updatedMap[unfoundIndex].found = true;
        setTreasureMap(updatedMap);
        
        setFoundCount(foundCount + 1);
        setScore(score + updatedMap[unfoundIndex].value);
        addCoins(50);
        addExperience(25);
      }
    }

    setTimeout(() => {
      setShowFeedback(false);
      setUserAnswer("");
      
      if (foundCount + (correct ? 1 : 0) >= totalTreasures) {
        onComplete(score + (correct ? treasureMap[foundCount].value : 0));
      } else {
        generateClue();
      }
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto"
    >
      <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
        Treasure Hunt Adventure!
      </h2>

      {/* Progress */}
      <div className="flex justify-between items-center mb-4">
        <div className="text-lg font-semibold">
          Treasures Found: {foundCount}/{totalTreasures}
        </div>
        <div className="text-lg font-semibold text-yellow-600">
          Score: {score} 🪙
        </div>
      </div>

      {/* Treasure Map */}
      <div className="relative bg-gradient-to-br from-yellow-100 to-orange-100 rounded-2xl h-96 mb-6 overflow-hidden">
        {/* Map background pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="brown" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Treasure spots */}
        {treasureMap.map((treasure, index) => (
          <motion.div
            key={index}
            className="absolute"
            style={{ left: `${treasure.x}%`, top: `${treasure.y}%` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            {treasure.found ? (
              <motion.div
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 360 }}
                className="text-4xl"
              >
                💎
              </motion.div>
            ) : (
              <div className="text-3xl opacity-30">
                <X className="w-8 h-8 text-red-600" />
              </div>
            )}
          </motion.div>
        ))}

        {/* Compass */}
        <div className="absolute top-4 right-4 text-4xl animate-pulse">
          🧭
        </div>
      </div>

      {/* Clue Section */}
      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-blue-600" />
          Solve the Clue to Find Treasure!
        </h3>
        <p className="text-lg text-gray-700 mb-4">{currentClue}</p>
        
        <div className="flex gap-3">
          <input
            type="number"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="Your answer..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-lg"
            disabled={showFeedback}
          />
          <Button
            onClick={handleSubmit}
            disabled={!userAnswer || showFeedback}
            size="lg"
          >
            Dig Here!
          </Button>
        </div>

        {/* Feedback */}
        {showFeedback && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 text-lg font-semibold ${
              isCorrect ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCorrect 
              ? "Treasure found! 🎉 Great job!" 
              : `Not quite! The answer is ${answer}`}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}