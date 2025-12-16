
export enum TaskType {
  DAILY = 'daily',
  ONCE = 'once'
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: TaskType;
  duration: number; // For daily tasks, number of days
  points: number;
}

export enum RewardType {
  TEXT = 'text',
  IMAGE = 'image',
  GEMINI_STORY = 'gemini-story'
}

export interface Reward {
  id: string;
  title: string;
  type: RewardType;
  content: string; // URL for image, prompt for Gemini, text for text
  cost: number;
}

export interface UserProgress {
  name: string;
  points: number;
  completedTasks: string[];
  unlockedRewards: string[]; // Keeping name for compatibility, but now means "purchased"
  dailyProgress: Record<string, {
    completedDates: string[];
    currentProgress: number;
  }>;
}
