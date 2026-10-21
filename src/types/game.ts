export type Difficulty = 'mudah' | 'menengah' | 'sulit';

export interface Question {
  id: string;
  chapterId: string;
  chapterTitle: string;
  level: 1 | 2 | 3; // 1: Mudah (100pt), 2: Menengah (200pt), 3: Sulit/HOTS (300pt)
  difficulty: Difficulty;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface Chapter {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
}

export type PowerUpType = 'turbo' | 'freeze' | 'banana' | 'shield' | 'double_points';

export interface PowerUp {
  type: PowerUpType;
  name: string;
  icon: string;
  description: string;
}

export interface Player {
  id: number;
  name: string;
  color: string;
  bgGradient: string;
  avatar: string;
  avatarName: string;
  score: number;
  distance: number; // in meters (progress towards catching target)
  catchCount: number; // how many times caught target/leader
  streak: number;
  maxStreak: number;
  correctAnswers: number;
  totalAnswers: number;
  powerUps: PowerUpType[];
  activeEffects: {
    frozenUntil: number; // timestamp
    shieldUntil: number; // timestamp
    doublePoints: boolean;
    turboUntil: number;
  };
  lastAnswerStatus?: 'correct' | 'wrong' | null;
  selectedOptionIndex?: number | null;
  hasAnsweredCurrentQuestion: boolean;
  buzzTimestamp?: number;
}

export interface TargetRunner {
  name: string;
  distance: number;
  baseSpeed: number; // meters per second
  avatar: string;
}

export interface ChatMessage {
  id: string;
  playerId: number;
  playerName: string;
  playerColor: string;
  text: string;
  timestamp: number;
  isQuickShout?: boolean;
}

export type PlayMode = 'simultaneous' | 'buzzer';

export type GamePhase = 'SETUP' | 'PLAYING' | 'PAUSED' | 'SUMMARY';
