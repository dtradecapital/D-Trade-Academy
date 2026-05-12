import { Language } from './lib/translations';

export interface MyLearningProps {
  language: Language;
  setActiveTab: (tab: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export interface Assignment {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Course {
  id: string;
  title: string;
  duration: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  progress: number;
  image: string;
  description?: string;
  assignments?: Assignment[];
}

export interface Achievement {
  id: string;
  title: string;
  icon: string;
  date: string;
}

export interface SkillStep {
  id: string;
  title: string;
  status: 'completed' | 'current' | 'locked';
}
