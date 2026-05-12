import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  Clock, 
  HelpCircle, 
  ChevronRight, 
  Play, 
  History,
  CheckCircle2,
  AlertCircle,
  Lock
} from 'lucide-react';
import { cn } from '../lib/utils';
import { translations, Language } from '../lib/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { QuizModal } from './QuizModal';

const allQuizzes = [
  { 
    id: '1', 
    title: 'Market Indicators Quiz', 
    category: 'Technical Analysis', 
    questions: [
      { id: '1-1', text: 'Which indicator measures market volatility?', options: ['RSI', 'MACD', 'Bollinger Bands', 'Moving Average'], correctAnswer: 2 },
      { id: '1-2', text: 'An RSI value above 70 typically indicates what?', options: ['Oversold', 'Overbought', 'Strong Trend', 'Consolidation'], correctAnswer: 1 },
      { id: '1-3', text: 'Which of these is a trend-following indicator?', options: ['Stochastics', 'Moving Averages', 'Fibonacci', 'Volume'], correctAnswer: 1 },
    ], 
    duration: '20 mins', 
    difficulty: 'Intermediate', 
    status: 'pending' 
  },
  { 
    id: '2', 
    title: 'Risk Management Basics', 
    category: 'Fundamentals', 
    questions: [
      { id: '2-1', text: 'What is the "Golden Rule" of risk per trade?', options: ['Risk 10%', 'Risk only 1-2%', 'Risk nothing', 'Risk 50%'], correctAnswer: 1 },
      { id: '2-2', text: 'What is a Stop Loss?', options: ['A way to stop trading', 'A price to lock in profit', 'A price to exit a losing trade', 'A news event'], correctAnswer: 2 },
    ], 
    duration: '15 mins', 
    difficulty: 'Beginner', 
    status: 'completed', 
    score: '92%' 
  },
  { 
    id: '3', 
    title: 'Advanced Options Pricing', 
    category: 'Derivatives', 
    questions: [], 
    duration: '30 mins', 
    difficulty: 'Advanced', 
    status: 'locked' 
  },
  { 
    id: '4', 
    title: 'Trading Psychology', 
    category: 'Mindset', 
    questions: [
      { id: '4-1', text: 'Which emotion often leads to "revenge trading"?', options: ['Fear', 'Greed', 'Anger', 'Hope'], correctAnswer: 2 },
    ], 
    duration: '15 mins', 
    difficulty: 'Beginner', 
    status: 'pending' 
  },
];

const practicalAssignments = [
  { id: '1', title: 'Chart Pattern Analysis', description: 'Identify 5 head-and-shoulders patterns in live charts.', deadline: 'Apr 05, 2026', status: 'In Progress' },
  { id: '2', title: 'Portfolio Diversification', description: 'Create a balanced portfolio of 10 stocks with risk assessment.', deadline: 'Apr 12, 2026', status: 'Pending' },
];

interface AssessmentsProps {
  language: Language;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const Assessments: React.FC<AssessmentsProps> = ({ language, showToast }) => {
  const t = translations[language];
  const [quizzes, setQuizzes] = useState(allQuizzes);
  const [selectedQuiz, setSelectedQuiz] = useState<any | null>(null);

  const startQuiz = (quiz: any) => {
    if (quiz.status === 'locked') return;
    setSelectedQuiz(quiz);
  };

  const handleQuizComplete = (score: number) => {
    showToast(`You scored ${score}% in ${selectedQuiz.title}`, score >= 70 ? 'success' : 'error');
    
    // Update local state for UI
    setQuizzes(prev => prev.map(q => 
      q.id === selectedQuiz.id 
        ? { ...q, status: 'completed', score: `${score}%` } 
        : q
    ));
    
    setSelectedQuiz(null);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      <QuizModal 
        quiz={selectedQuiz}
        isOpen={!!selectedQuiz}
        onClose={() => setSelectedQuiz(null)}
        onComplete={handleQuizComplete}
        language={language}
      />

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary tracking-tight">{t.assessments}</h2>
          <p className="label-caps mt-1">{t.assessmentsDesc}</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-card border border-border rounded-none px-4 py-2 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            <History className="w-5 h-5 text-primary" />
            <div>
              <p className="label-caps !text-[10px] text-muted">{t.avgScore}</p>
              <p className="text-sm font-bold text-primary">88.5%</p>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Quizzes Section */}
          <section className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-display text-primary uppercase tracking-tight">{t.availableQuizzes}</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-primary text-black text-[10px] font-bold uppercase tracking-widest">{t.all}</button>
                <button className="px-3 py-1 text-muted text-[10px] font-bold uppercase tracking-widest hover:text-primary">{t.pending}</button>
              </div>
            </div>

            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  onClick={() => startQuiz(quiz)}
                  className={cn(
                    "p-4 border transition-all group rounded-none",
                    quiz.status === 'locked' ? "bg-black/40 border-border/50 opacity-60 cursor-not-allowed" : 
                    "bg-black border-border hover:border-primary/50 cursor-pointer shadow-[0_5px_15px_rgba(0,0,0,0.3)] hover:shadow-primary/5"
                  )}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-12 h-12 rounded-none flex items-center justify-center border transition-all duration-300",
                        quiz.status === 'completed' ? "bg-success/10 text-success border-success/30" :
                        quiz.status === 'locked' ? "bg-white/5 text-muted border-border" :
                        "bg-primary/10 text-primary border-primary/30"
                      )}>
                        {quiz.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                         quiz.status === 'locked' ? <Lock className="w-6 h-6" /> : 
                         <ClipboardCheck className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="label-caps !text-[8px] text-muted">{quiz.category}</span>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-none text-[8px] font-bold uppercase tracking-widest border",
                            quiz.difficulty === 'Beginner' ? "bg-green-500/10 text-success border-success/20" :
                            quiz.difficulty === 'Intermediate' ? "bg-primary/10 text-primary border-primary/20" :
                            "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          )}>
                            {quiz.difficulty}
                          </span>
                        </div>
                        <h4 className="font-bold font-display group-hover:text-primary transition-colors">{quiz.title}</h4>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="hidden sm:flex items-center gap-4 text-[10px] text-muted font-bold uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5" /> {quiz.questions.length || '?'} {t.questions}</span>
                        <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {quiz.duration}</span>
                      </div>
                      
                      {quiz.status === 'completed' ? (
                        <div className="text-right">
                          <p className="label-caps !text-[8px] text-muted">Score</p>
                          <p className="text-xl font-display font-bold text-success">{quiz.score}</p>
                        </div>
                      ) : quiz.status === 'locked' ? (
                        <Lock className="w-5 h-5 text-muted" />
                      ) : (
                        <button className="btn-premium !py-1.5 !px-4 animate-glow">
                          <Play className="w-3 h-3 fill-current mr-2 inline" />
                          {t.start}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Practical Assignments Section */}
          <section className="card">
            <h3 className="text-lg font-bold font-display text-primary uppercase tracking-tight mb-6">{t.practicalAssignments}</h3>
            <div className="space-y-4">
              {practicalAssignments.map((assignment) => (
                <div key={assignment.id} className="p-5 bg-black rounded-none border border-border group hover:border-primary/20 transition-all shadow-inner">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h4 className="font-bold font-display text-text">{assignment.title}</h4>
                        <span className={cn(
                          "px-2 py-0.5 rounded-none text-[8px] font-bold uppercase tracking-widest border",
                          assignment.status === 'In Progress' ? "bg-blue-500/10 text-blue-400 border-blue-400/20" : "bg-warning/10 text-warning border-warning/20"
                        )}>
                          {assignment.status}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed max-w-lg">{assignment.description}</p>
                      <div className="flex items-center gap-4 pt-2">
                        <span className="text-[10px] text-muted font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary" />
                          {t.deadline}: {assignment.deadline}
                        </span>
                      </div>
                    </div>
                    <button className="px-6 py-2 bg-black border border-border text-muted rounded-none text-[10px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all" onClick={() => showToast(`Submitting ${assignment.title}...`, "info")}>
                      {t.submitWork}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="card bg-primary/5 text-white border-primary/20">
            <h3 className="text-lg font-bold font-display text-primary uppercase tracking-tight mb-4">{t.quizGuidelines}</h3>
            <ul className="space-y-4">
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-none border border-primary/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">1</div>
                <p className="text-[11px] text-muted leading-relaxed font-medium">{t.guideline1}</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-none border border-primary/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">2</div>
                <p className="text-[11px] text-muted leading-relaxed font-medium">{t.guideline2}</p>
              </li>
              <li className="flex gap-3">
                <div className="w-5 h-5 rounded-none border border-primary/30 flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-primary">3</div>
                <p className="text-[11px] text-muted leading-relaxed font-medium">{t.guideline3}</p>
              </li>
            </ul>
            <div className="mt-8 p-4 bg-black border border-primary/10 rounded-none flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-primary" />
              <p className="label-caps !text-primary !text-[8px]">{t.timerWarning}</p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="card">
            <h3 className="text-lg font-bold font-display text-primary uppercase tracking-tight mb-6">{t.recentResults}</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-black border border-border rounded-none">
                <div>
                  <p className="text-xs font-bold text-text">Stock Basics</p>
                  <p className="label-caps !text-[8px] text-muted">2 {t.days} ago</p>
                </div>
                <span className="text-sm font-display font-bold text-success shadow-glow-success">92%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-black border border-border rounded-none">
                <div>
                  <p className="text-xs font-bold text-text">Chart Patterns</p>
                  <p className="label-caps !text-[8px] text-muted">1 week ago</p>
                </div>
                <span className="text-sm font-display font-bold text-success shadow-glow-success">85%</span>
              </div>
            </div>
            <button className="w-full mt-6 text-[10px] font-bold text-primary uppercase tracking-widest hover:underline transition-all">{t.viewFullHistory}</button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

