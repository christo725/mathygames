"use client";

import { motion } from "framer-motion";
import { Trophy, Star, Target, Zap, Award, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

const achievements = [
  {
    id: "first_treasure",
    name: "First Treasure",
    description: "Find your first treasure",
    icon: Trophy,
    color: "from-yellow-400 to-orange-500",
    unlocked: true,
    progress: 1,
    maxProgress: 1,
  },
  {
    id: "math_master",
    name: "Math Master",
    description: "Solve 100 math problems",
    icon: Star,
    color: "from-purple-400 to-pink-500",
    unlocked: false,
    progress: 45,
    maxProgress: 100,
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete 10 challenges in under 30 seconds",
    icon: Zap,
    color: "from-blue-400 to-cyan-500",
    unlocked: false,
    progress: 3,
    maxProgress: 10,
  },
  {
    id: "perfect_streak",
    name: "Perfect Streak",
    description: "Get 20 correct answers in a row",
    icon: Target,
    color: "from-green-400 to-emerald-500",
    unlocked: false,
    progress: 8,
    maxProgress: 20,
  },
  {
    id: "island_explorer",
    name: "Island Explorer",
    description: "Unlock all islands",
    icon: Award,
    color: "from-red-400 to-rose-500",
    unlocked: false,
    progress: 1,
    maxProgress: 5,
  },
  {
    id: "coin_collector",
    name: "Coin Collector",
    description: "Collect 1000 coins",
    icon: Medal,
    color: "from-amber-400 to-yellow-500",
    unlocked: false,
    progress: 250,
    maxProgress: 1000,
  },
];

interface AchievementsProps {
  onClose: () => void;
}

export function Achievements({ onClose }: AchievementsProps) {
  const unlockedCount = achievements.filter(a => a.unlocked).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto max-h-[80vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
          Achievements
        </h2>
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
      </div>

      <div className="text-center mb-6">
        <div className="text-2xl font-semibold text-gray-700">
          {unlockedCount}/{achievements.length} Unlocked
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mt-3">
          <div
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
            style={{ width: `${(unlockedCount / achievements.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement, index) => {
          const Icon = achievement.icon;
          return (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative rounded-2xl p-6 ${
                achievement.unlocked
                  ? "bg-gradient-to-br " + achievement.color + " text-white"
                  : "bg-gray-100 text-gray-400"
              }`}
            >
              {/* Achievement Icon */}
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  achievement.unlocked ? "bg-white/20" : "bg-gray-200"
                }`}>
                  <Icon className={`w-8 h-8 ${
                    achievement.unlocked ? "text-white" : "text-gray-400"
                  }`} />
                </div>
                {achievement.unlocked && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="text-2xl"
                  >
                    ✓
                  </motion.div>
                )}
              </div>

              {/* Achievement Details */}
              <h3 className={`text-xl font-bold mb-2 ${
                achievement.unlocked ? "text-white" : "text-gray-600"
              }`}>
                {achievement.name}
              </h3>
              <p className={`text-sm mb-4 ${
                achievement.unlocked ? "text-white/90" : "text-gray-500"
              }`}>
                {achievement.description}
              </p>

              {/* Progress Bar */}
              {!achievement.unlocked && (
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span>Progress</span>
                    <span>{achievement.progress}/{achievement.maxProgress}</span>
                  </div>
                  <div className="w-full bg-gray-300 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(achievement.progress / achievement.maxProgress) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}