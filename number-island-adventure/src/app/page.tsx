"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { CharacterCreator } from "@/components/game/CharacterCreator";
import { IslandMap } from "@/components/game/IslandMap";
import { MathChallenge } from "@/components/game/MathChallenge";
import { TreasureHunt } from "@/components/game/TreasureHunt";
import { Achievements } from "@/components/game/Achievements";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/gameStore";
import { Volume2, VolumeX, Music, Music2, Home, Trophy, User } from "lucide-react";
import type { Island, Challenge, MathOperation } from "@/types/game";

type GameScreen = "welcome" | "character" | "map" | "challenge" | "achievements";

export default function Game() {
  const [currentScreen, setCurrentScreen] = useState<GameScreen>("welcome");
  const [selectedIsland, setSelectedIsland] = useState<Island | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);
  
  const {
    character,
    soundEnabled,
    musicEnabled,
    toggleSound,
    toggleMusic,
    userProgress,
  } = useGameStore();

  // Check if player has character
  useEffect(() => {
    if (character && currentScreen === "welcome") {
      setCurrentScreen("map");
    }
  }, [character, currentScreen]);

  const handleIslandSelect = (island: Island) => {
    setSelectedIsland(island);
    
    // Select challenge based on island
    let challengeType: Challenge["type"] = "math";
    let mathOp: MathOperation = "+";
    
    switch (island.theme) {
      case "volcano":
        mathOp = "+";
        challengeType = "math";
        break;
      case "crystal":
        mathOp = "×";
        challengeType = "math";
        break;
      case "pirate":
        challengeType = "puzzle"; // Treasure hunt
        break;
      case "jungle":
        mathOp = "-";
        challengeType = "math";
        break;
      case "arctic":
        mathOp = "÷";
        challengeType = "math";
        break;
    }
    
    setSelectedChallenge({
      id: "default",
      name: island.theme === "pirate" ? "Treasure Hunt" : "Math Adventure",
      type: challengeType,
      difficulty: island.requiredLevel < 5 ? "easy" : island.requiredLevel < 10 ? "medium" : "hard",
      completed: false,
      bestScore: 0,
      mathOperation: mathOp,
    });
    setCurrentScreen("challenge");
  };

  const handleChallengeComplete = (score: number) => {
    // Add score, coins, experience
    const { addCoins, addExperience } = useGameStore.getState();
    addCoins(Math.floor(score / 10));
    addExperience(score);
    
    // Return to map
    setCurrentScreen("map");
    setSelectedIsland(null);
    setSelectedChallenge(null);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case "welcome":
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-8"
          >
            <h1 className="text-6xl font-bold text-white drop-shadow-lg mb-4">
              Number Island Adventure
            </h1>
            <p className="text-2xl text-white/90 mb-8">
              Embark on an epic math adventure across magical islands!
            </p>
            <div className="space-y-4">
              <Button
                size="lg"
                onClick={() => setCurrentScreen("character")}
                className="text-xl px-8 py-6"
              >
                New Adventure
              </Button>
              {character && (
                <Button
                  size="lg"
                  variant="secondary"
                  onClick={() => setCurrentScreen("map")}
                  className="text-xl px-8 py-6 ml-4"
                >
                  Continue Adventure
                </Button>
              )}
            </div>
          </motion.div>
        );

      case "character":
        return (
          <CharacterCreator onComplete={() => setCurrentScreen("map")} />
        );

      case "map":
        return (
          <div className="w-full max-w-6xl mx-auto">
            <IslandMap onIslandSelect={handleIslandSelect} />
          </div>
        );

      case "challenge":
        if (!selectedChallenge) return null;
        
        if (selectedChallenge.type === "puzzle") {
          return <TreasureHunt onComplete={handleChallengeComplete} />;
        }
        
        return (
          <MathChallenge
            operation={selectedChallenge.mathOperation}
            difficulty={selectedChallenge.difficulty}
            onComplete={handleChallengeComplete}
          />
        );

      case "achievements":
        return <Achievements onClose={() => setCurrentScreen("map")} />;

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen p-8 relative">
      {/* Navigation Header */}
      {currentScreen !== "welcome" && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-4 left-4 right-4 flex justify-between items-center z-10"
        >
          {/* Left side - Navigation */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setCurrentScreen("map")}
              className="bg-white/90 hover:bg-white"
            >
              <Home className="w-5 h-5" />
            </Button>
            {character && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setCurrentScreen("achievements")}
                  className="bg-white/90 hover:bg-white"
                >
                  <Trophy className="w-5 h-5" />
                </Button>
                <div className="flex items-center bg-white/90 rounded-lg px-3 py-1 ml-2">
                  <User className="w-4 h-4 mr-2" />
                  <span className="font-semibold">{character.name}</span>
                  <span className="ml-2 text-sm text-gray-600">Lvl {character.level}</span>
                </div>
                <div className="flex items-center bg-yellow-400 rounded-lg px-3 py-1 ml-2">
                  <span className="font-bold">{character.coins} 🪙</span>
                </div>
              </>
            )}
          </div>

          {/* Right side - Audio controls */}
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSound}
              className="bg-white/90 hover:bg-white"
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMusic}
              className="bg-white/90 hover:bg-white"
            >
              {musicEnabled ? <Music className="w-5 h-5" /> : <Music2 className="w-5 h-5" />}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen">
        {renderScreen()}
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-20 h-20 bg-white/10 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
              y: typeof window !== 'undefined' ? window.innerHeight + 100 : 800,
            }}
            animate={{
              y: -100,
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
}