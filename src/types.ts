export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
}

export interface ChatSettings {
  language: 'english' | 'hindi' | 'both';
  responseStyle: 'professional' | 'casual' | 'friendly';
}

export interface User {
  id: string;
  email: string;
  name: string;
  messageCount: number;
  isPremium: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
}