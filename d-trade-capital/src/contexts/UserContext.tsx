/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Achievement, SkillStep } from '../types';

interface User {
  id: string;
  name: string;
  email: string;
  photo: string | null;
  role: 'user' | 'admin';
  streak: number;
  expertiseScore: number;
  badgesEarned: number;
  portfolioBalance: number;
  membership: 'Free' | 'Premium';
}

interface UserContextType {
  user: User | null;
  courses: Course[];
  skillSteps: SkillStep[];
  achievements: Achievement[];
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  completeLesson: (courseId: string) => void;
  updateCourseProgress: (courseId: string, progress: number) => void;
  executeTrade: (amount: number, type: 'buy' | 'sell') => void;
  isReady: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const initialCourses: Course[] = [
  { 
    id: '1', 
    title: 'Stock Market Basics', 
    duration: '4h 20m', 
    difficulty: 'Beginner', 
    progress: 100, 
    image: 'https://picsum.photos/seed/chart1/400/250', 
    description: 'Master the fundamentals of the stock market, from understanding how exchanges work to reading basic charts and executing your first trades.', 
    assignments: [
      {
        id: 'a1-1',
        question: 'Which chart pattern typically consists of a peak (shoulder), followed by a higher peak (head), and then another lower peak (shoulder)?',
        options: ['Double Top', 'Head and Shoulders', 'Cup and Handle', 'Triangles'],
        correctAnswer: 1
      },
      {
        id: 'a1-2',
        question: 'A pattern characterized by two consecutive peaks that are roughly equal, with a moderate trough in between, is known as:',
        options: ['Double Top', 'Double Bottom', 'Flag Pattern', 'Wedge'],
        correctAnswer: 0
      },
      {
        id: 'a1-3',
        question: 'Identify the bullish reversal pattern that resembles a base with a small dip on the right side before moving upward.',
        options: ['Rounding Bottom', 'Falling Wedge', 'Cup and Handle', 'Pennant'],
        correctAnswer: 2
      }
    ] 
  },
  { id: '2', title: 'Technical Analysis Pro', duration: '12h 45m', difficulty: 'Intermediate', progress: 45, image: 'https://picsum.photos/seed/analysis1/400/250', description: 'Dive deep into technical indicators, chart patterns, and price action strategies used by professional traders to identify high-probability setups.', assignments: [] },
  { id: '3', title: 'Options Trading Strategies', duration: '8h 15m', difficulty: 'Advanced', progress: 12, image: 'https://picsum.photos/seed/trading1/400/250', description: 'Learn the complex world of options, including Greeks, spreads, and hedging techniques to protect your portfolio and generate income.', assignments: [] },
  { id: '4', title: 'Cryptocurrency Fundamentals', duration: '6h 30m', difficulty: 'Beginner', progress: 85, image: 'https://picsum.photos/seed/crypto1/400/250', description: 'Understand blockchain technology, different types of tokens, and how to safely navigate the volatile world of digital assets.', assignments: [] },
  { id: '5', title: 'Forex Trading Masterclass', duration: '15h 20m', difficulty: 'Intermediate', progress: 30, image: 'https://picsum.photos/seed/forex1/400/250', description: 'Master the global currency markets, understanding pips, leverage, and the economic factors that drive exchange rates.', assignments: [] },
  { id: '6', title: 'Risk Management in Trading', duration: '5h 10m', difficulty: 'Intermediate', progress: 60, image: 'https://picsum.photos/seed/risk1/400/250', description: 'The most important skill for any trader. Learn how to size your positions, set stop-losses, and manage your emotional capital.', assignments: [] },
];

const initialSkillSteps: SkillStep[] = [
  { id: '1', title: 'Financial Literacy Basics', status: 'completed' },
  { id: '2', title: 'Understanding Market Cycles', status: 'completed' },
  { id: '3', title: 'Technical Indicators & Charts', status: 'current' },
  { id: '4', title: 'Advanced Derivatives Trading', status: 'locked' },
  { id: '5', title: 'Portfolio Management Mastery', status: 'locked' },
  { id: '6', title: 'Algorithmic Trading Strategies', status: 'locked' },
];

const initialAchievements: Achievement[] = [
  { id: '1', title: 'First Trade Master', icon: '🏆', date: 'Mar 15, 2026' },
  { id: '2', title: 'Quiz Whiz', icon: '🧠', date: 'Mar 22, 2026' },
  { id: '3', title: '7-Day Streak', icon: '🔥', date: 'Mar 28, 2026' },
  { id: '4', title: 'Risk Manager', icon: '🛡️', date: 'Mar 30, 2026' },
];

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>(initialCourses);
  const [skillSteps, setSkillSteps] = useState<SkillStep[]>(initialSkillSteps);
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    console.log("UserProvider: starting initialization...");
    try {
      const savedUser = localStorage.getItem('dtc_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        console.log("UserProvider: found saved user", parsed.name);
        setUser(parsed);
      } else {
        console.log("UserProvider: no saved user, using default");
        const mockUser: User = {
          id: '1',
          name: 'Anuj Panday',
          email: 'anuj@example.com',
          photo: null,
          role: 'user',
          streak: 12,
          expertiseScore: 740,
          badgesEarned: 12,
          portfolioBalance: 124500,
          membership: 'Premium'
        };
        setUser(mockUser);
      }
      
      const savedCourses = localStorage.getItem('dtc_courses');
      if (savedCourses) {
        setCourses(JSON.parse(savedCourses));
      }
    } catch (e) {
      console.error("UserProvider: initialization failed", e);
      // Ensure we have a user anyway for demo
      setUser({
        id: '1',
        name: 'Anuj Panday',
        email: 'anuj@example.com',
        photo: null,
        role: 'user',
        streak: 12,
        expertiseScore: 740,
        badgesEarned: 12,
        portfolioBalance: 124500,
        membership: 'Premium'
      });
    } finally {
      console.log("UserProvider: ready");
      setIsReady(true);
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Mock login logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    const mockUser: User = {
      id: '1',
      name: 'Anuj Panday',
      email: email,
      photo: null,
      role: email.includes('admin') ? 'admin' : 'user',
      streak: 12,
      expertiseScore: 740,
      badgesEarned: 12,
      portfolioBalance: 124500,
      membership: 'Premium'
    };
    setUser(mockUser);
    localStorage.setItem('dtc_user', JSON.stringify(mockUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dtc_user');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!user) return;
    const updatedUser = { ...user, ...data };
    setUser(updatedUser);
    localStorage.setItem('dtc_user', JSON.stringify(updatedUser));
  };

  const updateCourseProgress = (courseId: string, progress: number) => {
    const updatedCourses = courses.map(c => 
      c.id === courseId ? { ...c, progress: Math.min(100, progress) } : c
    );
    setCourses(updatedCourses);
    localStorage.setItem('dtc_courses', JSON.stringify(updatedCourses));
    
    // Auto-unlock next skill step if a course reaches 100%
    if (progress === 100) {
      // Logic to advance skill path
      const currentIdx = skillSteps.findIndex(s => s.status === 'current');
      if (currentIdx !== -1) {
        const nextSteps = [...skillSteps];
        nextSteps[currentIdx].status = 'completed';
        if (nextSteps[currentIdx + 1]) {
          nextSteps[currentIdx + 1].status = 'current';
        }
        setSkillSteps(nextSteps);
      }
    }
  };

  const completeLesson = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      const newProgress = Math.min(100, course.progress + 10);
      updateCourseProgress(courseId, newProgress);
    }
  };

  const executeTrade = (amount: number, type: 'buy' | 'sell') => {
    if (!user) return;
    const newBalance = type === 'buy' ? user.portfolioBalance - amount : user.portfolioBalance + amount;
    updateProfile({ portfolioBalance: newBalance });
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      courses, 
      skillSteps, 
      achievements, 
      login, 
      logout, 
      updateProfile, 
      completeLesson,
      updateCourseProgress,
      executeTrade,
      isReady
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
