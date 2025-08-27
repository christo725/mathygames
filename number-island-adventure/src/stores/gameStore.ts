import { create } from 'zustand';
import type { Character, Island, CrewMember, Achievement, GameState, UserProgress } from '@/types/game';

interface GameStore {
  // User data
  character: Character | null;
  crewMembers: CrewMember[];
  userProgress: UserProgress;
  
  // Game state
  gameState: GameState;
  islands: Island[];
  currentIslandId: string | null;
  
  // Audio settings
  soundEnabled: boolean;
  musicEnabled: boolean;
  
  // Actions
  setCharacter: (character: Character) => void;
  updateCharacter: (updates: Partial<Character>) => void;
  addCrewMember: (crewMember: CrewMember) => void;
  updateProgress: (progress: Partial<UserProgress>) => void;
  unlockIsland: (islandId: string) => void;
  completeChallenge: (islandId: string, challengeId: string, score: number) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  addCoins: (amount: number) => void;
  addExperience: (amount: number) => void;
}

const initialProgress: UserProgress = {
  level: 1,
  experience: 0,
  totalScore: 0,
  islandsUnlocked: ['volcano'], // First island unlocked by default
  achievements: [],
  dailyStreak: 0,
  lastPlayedDate: new Date().toISOString(),
};

const initialIslands: Island[] = [
  {
    id: 'volcano',
    name: 'Volcano Valley',
    theme: 'volcano',
    description: 'Master addition and subtraction in the fiery depths!',
    unlocked: true,
    completed: false,
    stars: 0,
    challenges: [],
    position: { x: 20, y: 50 },
    requiredLevel: 1,
  },
  {
    id: 'crystal',
    name: 'Crystal Caves',
    theme: 'crystal',
    description: 'Multiply your way through sparkling caverns!',
    unlocked: false,
    completed: false,
    stars: 0,
    challenges: [],
    position: { x: 35, y: 30 },
    requiredLevel: 3,
  },
  {
    id: 'pirate',
    name: 'Pirate Cove',
    theme: 'pirate',
    description: 'Ahoy! Division adventures await ye!',
    unlocked: false,
    completed: false,
    stars: 0,
    challenges: [],
    position: { x: 50, y: 60 },
    requiredLevel: 5,
  },
  {
    id: 'jungle',
    name: 'Jungle Junction',
    theme: 'jungle',
    description: 'Swing through fraction challenges!',
    unlocked: false,
    completed: false,
    stars: 0,
    challenges: [],
    position: { x: 65, y: 40 },
    requiredLevel: 7,
  },
  {
    id: 'arctic',
    name: 'Arctic Outpost',
    theme: 'arctic',
    description: 'Cool decimal problems in the frozen north!',
    unlocked: false,
    completed: false,
    stars: 0,
    challenges: [],
    position: { x: 80, y: 20 },
    requiredLevel: 10,
  },
];

export const useGameStore = create<GameStore>((set, get) => ({
      // Initial state
      character: null,
      crewMembers: [],
      userProgress: initialProgress,
      gameState: {
        score: 0,
        streak: 0,
        treasuresCollected: 0,
      },
      islands: initialIslands,
      currentIslandId: null,
      soundEnabled: true,
      musicEnabled: true,

      // Actions
      setCharacter: (character) => set({ character }),
      
      updateCharacter: (updates) => set((state) => ({
        character: state.character ? { ...state.character, ...updates } : null,
      })),
      
      addCrewMember: (crewMember) => set((state) => ({
        crewMembers: [...state.crewMembers, crewMember],
      })),
      
      updateProgress: (progress) => set((state) => ({
        userProgress: { ...state.userProgress, ...progress },
      })),
      
      unlockIsland: (islandId) => set((state) => ({
        islands: state.islands.map((island) =>
          island.id === islandId ? { ...island, unlocked: true } : island
        ),
        userProgress: {
          ...state.userProgress,
          islandsUnlocked: [...state.userProgress.islandsUnlocked, islandId],
        },
      })),
      
      completeChallenge: (islandId, challengeId, score) => set((state) => {
        const updatedIslands = state.islands.map((island) => {
          if (island.id === islandId) {
            const updatedChallenges = island.challenges.map((challenge) =>
              challenge.id === challengeId
                ? {
                    ...challenge,
                    completed: true,
                    bestScore: Math.max(challenge.bestScore || 0, score),
                  }
                : challenge
            );
            return { ...island, challenges: updatedChallenges };
          }
          return island;
        });
        
        return {
          islands: updatedIslands,
          userProgress: {
            ...state.userProgress,
            totalScore: state.userProgress.totalScore + score,
          },
        };
      }),
      
      toggleSound: () => set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      toggleMusic: () => set((state) => ({ musicEnabled: !state.musicEnabled })),
      
      addCoins: (amount) => set((state) => ({
        character: state.character
          ? { ...state.character, coins: state.character.coins + amount }
          : null,
      })),
      
      addExperience: (amount) => set((state) => {
        if (!state.character) return {};
        
        const newExp = state.character.experience + amount;
        const expPerLevel = 100;
        const newLevel = Math.floor(newExp / expPerLevel) + 1;
        
        return {
          character: {
            ...state.character,
            experience: newExp,
            level: newLevel,
          },
          userProgress: {
            ...state.userProgress,
            level: newLevel,
            experience: newExp,
          },
        };
      }),
}));