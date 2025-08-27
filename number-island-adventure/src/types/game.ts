export type MathOperation = '+' | '-' | '×' | '÷';

export type Difficulty = 'easy' | 'medium' | 'hard';

export type IslandTheme = 
  | 'volcano'
  | 'crystal'
  | 'pirate'
  | 'jungle'
  | 'arctic'
  | 'desert'
  | 'underwater';

export interface Island {
  id: string;
  name: string;
  theme: IslandTheme;
  description: string;
  unlocked: boolean;
  completed: boolean;
  stars: number; // 0-3 stars
  challenges: Challenge[];
  position: { x: number; y: number };
  requiredLevel: number;
}

export interface Challenge {
  id: string;
  name: string;
  type: 'math' | 'pattern' | 'puzzle' | 'speed' | 'memory';
  difficulty: Difficulty;
  completed: boolean;
  bestScore: number;
  mathOperation?: MathOperation;
  timeLimit?: number;
}

export interface Character {
  id: string;
  name: string;
  skinTone: string;
  outfit: string;
  accessory?: string;
  hat?: string;
  level: number;
  experience: number;
  coins: number;
}

export interface CrewMember {
  id: string;
  name: string;
  type: 'koala' | 'frog' | 'parrot' | 'turtle' | 'monkey' | 'crab';
  powerUp: PowerUp;
  unlocked: boolean;
  level: number;
}

export interface PowerUp {
  id: string;
  name: string;
  description: string;
  type: 'hint' | 'timeBonus' | 'doublePoints' | 'shield' | 'slowMotion';
  duration?: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
}

export interface GameState {
  currentIsland?: Island;
  currentChallenge?: Challenge;
  score: number;
  streak: number;
  treasuresCollected: number;
}

export interface MathProblem {
  question: string;
  answer: number;
  choices: number[];
  operation: MathOperation;
}

export interface UserProgress {
  level: number;
  experience: number;
  totalScore: number;
  islandsUnlocked: string[];
  achievements: Achievement[];
  dailyStreak: number;
  lastPlayedDate: string;
}