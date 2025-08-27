"use client";

import { motion } from "framer-motion";
import { Lock, Star } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import type { Island } from "@/types/game";

const islandEmojis: Record<string, string> = {
  volcano: "🌋",
  crystal: "💎",
  pirate: "🏴‍☠️",
  jungle: "🌴",
  arctic: "❄️",
  desert: "🏜️",
  underwater: "🌊",
};

interface IslandMapProps {
  onIslandSelect: (island: Island) => void;
}

export function IslandMap({ onIslandSelect }: IslandMapProps) {
  const { islands, userProgress } = useGameStore();
  const userLevel = userProgress.level;

  return (
    <div className="relative w-full h-full min-h-[600px] bg-gradient-to-b from-sky-200 to-blue-400 rounded-3xl overflow-hidden">
      {/* Ocean waves animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="wave wave1"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>

      {/* Map title */}
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-center pt-8 text-white drop-shadow-lg"
      >
        Island Adventure Map
      </motion.h2>

      {/* Islands */}
      <div className="relative w-full h-full p-8">
        {islands.map((island, index) => {
          const isUnlocked = island.unlocked || userLevel >= island.requiredLevel;
          const delay = index * 0.1;

          return (
            <motion.div
              key={island.id}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay, type: "spring", stiffness: 100 }}
              style={{
                position: "absolute",
                left: `${island.position.x}%`,
                top: `${island.position.y}%`,
                transform: "translate(-50%, -50%)",
              }}
              className="group cursor-pointer"
              onClick={() => isUnlocked && onIslandSelect(island)}
            >
              {/* Island button */}
              <motion.div
                whileHover={isUnlocked ? { scale: 1.1 } : {}}
                whileTap={isUnlocked ? { scale: 0.95 } : {}}
                className={`relative w-24 h-24 rounded-full flex items-center justify-center ${
                  isUnlocked
                    ? "bg-gradient-to-br from-yellow-400 to-orange-500 shadow-xl"
                    : "bg-gray-400 opacity-75"
                } ${isUnlocked ? "island-bounce" : ""}`}
              >
                <span className="text-4xl">
                  {isUnlocked ? islandEmojis[island.theme] : <Lock className="w-8 h-8 text-gray-600" />}
                </span>

                {/* Stars */}
                {isUnlocked && island.stars > 0 && (
                  <div className="absolute -bottom-2 flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={`${
                          i < island.stars
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-300 text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </motion.div>

              {/* Island name */}
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 whitespace-nowrap">
                <div
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    isUnlocked
                      ? "bg-white text-gray-800 shadow-lg"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  {island.name}
                </div>
                {!isUnlocked && (
                  <div className="text-xs text-center mt-1 text-white">
                    Level {island.requiredLevel}
                  </div>
                )}
              </div>

              {/* Hover tooltip */}
              {isUnlocked && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-4 w-48 p-3 bg-white rounded-lg shadow-xl pointer-events-none"
                >
                  <p className="text-sm text-gray-700">{island.description}</p>
                </motion.div>
              )}
            </motion.div>
          );
        })}

        {/* Connection paths between islands */}
        <svg className="absolute inset-0 pointer-events-none" style={{ zIndex: -1 }}>
          <defs>
            <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
            </linearGradient>
          </defs>
          {islands.slice(0, -1).map((island, index) => {
            const nextIsland = islands[index + 1];
            const x1 = `${island.position.x}%`;
            const y1 = `${island.position.y}%`;
            const x2 = `${nextIsland.position.x}%`;
            const y2 = `${nextIsland.position.y}%`;

            return (
              <motion.line
                key={`path-${island.id}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="url(#pathGradient)"
                strokeWidth="3"
                strokeDasharray="10 5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, delay: index * 0.2 }}
              />
            );
          })}
        </svg>
      </div>

      <style jsx>{`
        .wave {
          position: absolute;
          width: 200%;
          height: 100px;
          bottom: 0;
          left: -50%;
          background: linear-gradient(
            to right,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
          animation: wave-animation 10s linear infinite;
        }
        
        .wave1 {
          animation-duration: 10s;
          bottom: 0;
        }
        
        .wave2 {
          animation-duration: 15s;
          bottom: 20px;
          opacity: 0.2;
        }
        
        .wave3 {
          animation-duration: 20s;
          bottom: 40px;
          opacity: 0.1;
        }
        
        @keyframes wave-animation {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(50%);
          }
        }
      `}</style>
    </div>
  );
}