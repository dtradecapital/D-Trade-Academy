/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, ArrowRight, Timer, Award } from 'lucide-react';
import { cn } from '../lib/utils';
import { Language, translations } from '../lib/translations';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
}

interface Quiz {
  id: string;
  title: string;
  questions: Question[];
}

interface QuizModalProps {
  quiz: Quiz;
  isOpen: boolean;
  onClose: () => void;
  onComplete: (score: number) => void;
  language: Language;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, isOpen, onClose, onComplete, language }) => {
  const t = translations[language];
  const [currentStep, setCurrentStep] = useState<'intro' | 'quiz' | 'result'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (currentStep === 'quiz' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && currentStep === 'quiz') {
      handleNextQuestion(selectedAnswer !== null ? selectedAnswer : -1);
    }
    return () => clearInterval(timer);
  }, [currentStep, timeLeft, selectedAnswer]);

  const handleStart = () => {
    setCurrentStep('quiz');
    setTimeLeft(60);
    setSelectedAnswer(null);
  };

  const handleNextQuestion = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(60);
      setSelectedAnswer(null);
    } else {
      // Calculate results
      const correctAnswersCount = quiz.questions.reduce((acc, q, idx) => {
        return acc + (newAnswers[idx] === q.correctAnswer ? 1 : 0);
      }, 0);
      const finalScore = Math.round((correctAnswersCount / quiz.questions.length) * 100);
      setScore(finalScore);
      setCurrentStep('result');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-card w-full max-w-2xl rounded-none border border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-display font-bold text-primary tracking-tight">
                {quiz.title}
              </h3>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/5 rounded-none transition-colors"
              >
                <X className="w-5 h-5 text-muted" />
              </button>
            </div>

            <div className="p-8">
              {currentStep === 'intro' && (
                <div className="space-y-8 text-center">
                  <div className="inline-flex p-4 bg-primary/10 border border-primary/20 rounded-none">
                    <AlertCircle className="w-10 h-10 text-primary" />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-2xl font-display font-bold text-text">Are you ready to start?</h4>
                    <p className="text-muted text-sm max-w-md mx-auto">
                      Once started, you will have 60 seconds per question. You need 70% or more to pass this assessment.
                    </p>
                    <div className="flex justify-center gap-8 pt-4">
                      <div className="text-center">
                        <p className="label-caps !text-primary text-[10px]">{quiz.questions.length}</p>
                        <p className="label-caps !text-muted text-[8px]">Questions</p>
                      </div>
                      <div className="text-center">
                        <p className="label-caps !text-primary text-[10px]">{quiz.questions.length * 1} min</p>
                        <p className="label-caps !text-muted text-[8px]">Total Time</p>
                      </div>
                      <div className="text-center">
                        <p className="label-caps !text-primary text-[10px]">70%</p>
                        <p className="label-caps !text-muted text-[8px]">Pass Score</p>
                      </div>
                    </div>
                  </div>
                  <button onClick={handleStart} className="btn-premium w-full max-w-xs mx-auto flex items-center justify-center gap-3">
                    Start Assessment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {currentStep === 'quiz' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="label-caps !text-primary text-[10px]">Question {currentQuestionIndex + 1} of {quiz.questions.length}</p>
                      <div className="w-48 h-1 bg-white/5 rounded-none overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all duration-300" 
                          style={{ width: `${((currentQuestionIndex + 1) / quiz.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center gap-2 px-3 py-1.5 border font-mono font-bold text-sm",
                      timeLeft < 10 ? "border-error text-error animate-pulse" : "border-primary/20 text-primary"
                    )}>
                      <Timer className="w-4 h-4" />
                      {timeLeft}s
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h4 className="text-xl font-display font-bold text-text leading-tight">
                      {quiz.questions[currentQuestionIndex].text}
                    </h4>
                    <div className="grid grid-cols-1 gap-3">
                      {quiz.questions[currentQuestionIndex].options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedAnswer(idx)}
                          className={cn(
                            "w-full p-4 text-left border rounded-none text-sm group flex items-center justify-between transition-all",
                            selectedAnswer === idx 
                              ? "bg-primary/20 border-primary text-primary" 
                              : "bg-black border-border hover:border-primary/40 text-text"
                          )}
                        >
                          <span className="font-medium">{option}</span>
                          <div className={cn(
                            "w-2 h-2 rounded-full border transition-all",
                            selectedAnswer === idx ? "bg-primary border-primary scale-125 shadow-[0_0_8px_rgba(245,185,66,0.6)]" : "border-primary group-hover:bg-primary/50"
                          )} />
                        </button>
                      ))}
                    </div>

                    <div className="pt-4">
                      <button 
                        disabled={selectedAnswer === null}
                        onClick={() => handleNextQuestion(selectedAnswer!)}
                        className={cn(
                          "w-full py-3 label-caps !text-[10px] font-bold tracking-[0.2em] transition-all flex items-center justify-center gap-2",
                          selectedAnswer !== null 
                            ? "bg-primary text-black shadow-[0_0_20px_rgba(245,185,66,0.3)]" 
                            : "bg-white/5 text-muted border border-border cursor-not-allowed"
                        )}
                      >
                        {currentQuestionIndex === quiz.questions.length - 1 ? t.finishAssessment : t.nextQuestion}
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 'result' && (
                <div className="space-y-8 text-center">
                  <div className="inline-flex p-6 bg-primary/10 border border-primary/20 rounded-none relative">
                    <Award className="w-12 h-12 text-primary drop-shadow-[0_0_10px_rgba(245,185,66,0.3)]" />
                    {score >= 70 && (
                      <CheckCircle2 className="absolute -top-2 -right-2 w-6 h-6 text-success fill-black" />
                    )}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-3xl font-display font-bold text-text uppercase tracking-widest">
                      {score >= 70 ? 'Assessment Passed' : 'Assessment Failed'}
                    </h4>
                    <div className="flex flex-col items-center">
                      <span className={cn(
                        "text-6xl font-display font-bold mb-2",
                        score >= 70 ? "text-success" : "text-error"
                      )}>
                        {score}%
                      </span>
                      <p className="label-caps !text-muted">Final Score</p>
                    </div>
                    <p className="text-muted text-sm max-w-md mx-auto">
                      {score >= 70 
                        ? 'Congratulations! You have demonstrated a strong understanding of these concepts and earned a new certification.'
                        : 'Your score was below the passing requirement of 70%. We recommend reviewing the module and trying again.'}
                    </p>
                  </div>
                  <div className="flex gap-4 max-w-xs mx-auto">
                    <button onClick={onClose} className="w-full btn-premium">
                      Return Home
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
