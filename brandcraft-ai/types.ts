
export interface User {
  id: string;
  email: string;
  username: string;
  password?: string; // Only for the mock DB storage
}

export interface BrandProject {
  id: string;
  userId: string;
  name: string;
  industry: string;
  tagline?: string;
  colors?: string[];
  logoUrl?: string;
  aestheticUrl?: string;
  description: string;
  strategy?: {
    mission: string;
    vision: string;
    values: string[];
  };
}

export enum AppTab {
  DASHBOARD = 'dashboard',
  IDENTITY = 'identity',
  VISUALS = 'visuals',
  CONTENT = 'content',
  SENTIMENT = 'sentiment',
  ASSISTANT = 'assistant'
}

export interface GeneratedContent {
  type: 'slogan' | 'social' | 'email';
  text: string;
}

export interface SentimentResult {
  score: number;
  label: 'Positive' | 'Neutral' | 'Negative';
  breakdown: {
    joy: number;
    trust: number;
    fear: number;
    surprise: number;
  };
}
