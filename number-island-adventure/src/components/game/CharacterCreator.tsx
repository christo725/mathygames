"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useGameStore } from "@/stores/gameStore";
import type { Character } from "@/types/game";

const skinTones = ["#FFE0BD", "#F3DBC4", "#EDC4B3", "#D4A574", "#A86543", "#8B5A3C"];
const outfitColors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A8E6CF", "#FF8B94", "#B4A7D6"];
const accessories = ["glasses", "hat", "bandana", "crown", "none"];

export function CharacterCreator({ onComplete }: { onComplete: () => void }) {
  const setCharacter = useGameStore((state) => state.setCharacter);
  const [name, setName] = useState("");
  const [selectedSkin, setSelectedSkin] = useState(skinTones[0]);
  const [selectedOutfit, setSelectedOutfit] = useState(outfitColors[0]);
  const [selectedAccessory, setSelectedAccessory] = useState("none");

  const handleCreate = () => {
    if (!name.trim()) return;

    const newCharacter: Character = {
      id: Date.now().toString(),
      name: name.trim(),
      skinTone: selectedSkin,
      outfit: selectedOutfit,
      accessory: selectedAccessory !== "none" ? selectedAccessory : undefined,
      level: 1,
      experience: 0,
      coins: 100, // Starting coins
    };

    setCharacter(newCharacter);
    onComplete();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto"
    >
      <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
        Create Your Pirate!
      </h1>

      <div className="space-y-6">
        {/* Name Input */}
        <div>
          <label className="block text-lg font-semibold mb-2">Your Pirate Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-orange-500 focus:outline-none text-lg"
            maxLength={20}
          />
        </div>

        {/* Character Preview */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-32 h-32 rounded-full flex items-center justify-center text-6xl"
              style={{ backgroundColor: selectedSkin }}
            >
              <div style={{ color: selectedOutfit }}>
                {selectedAccessory === "glasses" && "🥽"}
                {selectedAccessory === "hat" && "🎩"}
                {selectedAccessory === "bandana" && "🏴‍☠️"}
                {selectedAccessory === "crown" && "👑"}
                {selectedAccessory === "none" && "🏴‍☠️"}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Skin Tone Selection */}
        <div>
          <label className="block text-lg font-semibold mb-2">Skin Tone</label>
          <div className="flex gap-3 flex-wrap">
            {skinTones.map((tone) => (
              <button
                key={tone}
                onClick={() => setSelectedSkin(tone)}
                className={`w-12 h-12 rounded-full border-4 transition-transform ${
                  selectedSkin === tone
                    ? "border-orange-500 scale-110"
                    : "border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: tone }}
              />
            ))}
          </div>
        </div>

        {/* Outfit Color Selection */}
        <div>
          <label className="block text-lg font-semibold mb-2">Outfit Color</label>
          <div className="flex gap-3 flex-wrap">
            {outfitColors.map((color) => (
              <button
                key={color}
                onClick={() => setSelectedOutfit(color)}
                className={`w-12 h-12 rounded-full border-4 transition-transform ${
                  selectedOutfit === color
                    ? "border-orange-500 scale-110"
                    : "border-gray-300 hover:scale-105"
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Accessory Selection */}
        <div>
          <label className="block text-lg font-semibold mb-2">Accessory</label>
          <div className="flex gap-3 flex-wrap">
            {accessories.map((accessory) => (
              <button
                key={accessory}
                onClick={() => setSelectedAccessory(accessory)}
                className={`px-4 py-2 rounded-xl border-2 transition-all ${
                  selectedAccessory === accessory
                    ? "border-orange-500 bg-orange-100"
                    : "border-gray-300 hover:bg-gray-100"
                }`}
              >
                {accessory === "none" ? "No Accessory" : accessory}
              </button>
            ))}
          </div>
        </div>

        {/* Create Button */}
        <Button
          onClick={handleCreate}
          disabled={!name.trim()}
          size="lg"
          className="w-full"
        >
          Start Adventure!
        </Button>
      </div>
    </motion.div>
  );
}