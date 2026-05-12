import React from 'react';
import { 
  CheckCircle2, 
  Target, 
  Lock, 
  ChevronRight, 
  Award, 
  Star, 
  Zap,
  BookOpen,
  Trophy
} from 'lucide-react';
import { cn } from '../lib/utils';
import { SkillStep } from '../types';
import { translations, Language } from '../lib/translations';
import { motion } from 'framer-motion';

const skillPath: SkillStep[] = [
  { id: '1', title: 'Financial Literacy Basics', status: 'completed' },
  { id: '2', title: 'Understanding Market Cycles', status: 'completed' },
  { id: '3', title: 'Technical Indicators & Charts', status: 'current' },
  { id: '4', title: 'Advanced Derivatives Trading', status: 'locked' },
  { id: '5', title: 'Portfolio Management Mastery', status: 'locked' },
  { id: '6', title: 'Algorithmic Trading Strategies', status: 'locked' },
];

interface SkillProgressProps {
  language: Language;
  setActiveTab: (tab: string) => void;
}

export const SkillProgress: React.FC<SkillProgressProps> = ({ language, setActiveTab }) => {
  const t = translations[language];

  const [showLeaderboard, setShowLeaderboard] = React.useState(false);

  const leaderboard = [
    { rank: 1, name: "Varun Malhotra", score: 2840, avatar: "VM", isUser: false },
    { rank: 2, name: "Sneha Reddy", score: 2710, avatar: "SR", isUser: false },
    { rank: 3, name: "Ananya Sharma", score: 2650, avatar: "AS", isUser: false },
    { rank: 4, name: "Arjun Das", score: 2520, avatar: "AD", isUser: false },
    { rank: 12, name: "You (Intermediate)", score: 740, avatar: "YO", isUser: true },
    { rank: 13, name: "Priya Singh", score: 710, avatar: "PS", isUser: false },
  ];

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
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary tracking-tight">{t.skills}</h2>
          <p className="label-caps mt-1">{t.roadmapDesc}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="label-caps !text-[8px]">{t.currentLevel}</p>
            <p className="text-lg font-display font-bold text-primary italic">Intermediate</p>
          </div>
          <div className="w-12 h-12 rounded-none bg-black border border-primary flex items-center justify-center text-primary shadow-[0_0_15px_rgba(245,185,66,0.2)]">
            <Zap className="w-6 h-6" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={itemVariants} className="card">
            <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight mb-8">{t.learningRoadmap}</h3>
            <div className="space-y-0 relative">
              <div className="absolute left-6 top-4 bottom-4 w-px bg-border"></div>
              
              {skillPath.map((step, index) => (
                <div key={step.id} className="relative flex gap-8 pb-12 last:pb-0 group">
                  <div className={cn(
                    "w-12 h-12 rounded-none flex items-center justify-center relative z-10 transition-all duration-300 border-2 border-card",
                    step.status === 'completed' ? "bg-success text-black border-success" : 
                    step.status === 'current' ? "bg-primary text-black border-primary shadow-[0_0_15px_rgba(245,185,66,0.4)]" : 
                    "bg-black text-muted border-border"
                  )}>
                    {step.status === 'completed' ? <CheckCircle2 className="w-6 h-6" /> : 
                     step.status === 'current' ? <Target className="w-6 h-6" /> : 
                     <Lock className="w-5 h-5" />}
                  </div>
                  
                  <div className={cn(
                    "flex-1 p-6 rounded-none border transition-all duration-300",
                    step.status === 'current' ? "bg-white/5 border-primary/40 shadow-[0_0_20px_rgba(245,185,66,0.05)]" : 
                    step.status === 'completed' ? "bg-white/5 border-border" :
                    "bg-transparent border-transparent opacity-40"
                  )}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="label-caps !text-[8px]">{t.module} 0{index + 1}</span>
                      {step.status === 'completed' && <span className="label-caps !text-[8px] !text-success">{t.completed}</span>}
                      {step.status === 'current' && <span className="label-caps !text-[8px] !text-primary animate-pulse">{t.active}</span>}
                    </div>
                    <h4 className="text-lg font-display font-bold text-text group-hover:text-primary transition-colors tracking-tight">{step.title}</h4>
                    <p className="text-sm text-muted mb-4 font-medium">
                      {step.status === 'locked' ? t.completePrevious : t.masterCore}
                    </p>
                    
                    {step.status !== 'locked' && (
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 label-caps !text-[8px]">
                          <BookOpen className="w-3 h-3" />
                          12 {t.lessons}
                        </div>
                        <div className="flex items-center gap-1 label-caps !text-[8px]">
                          <Trophy className="w-3 h-3" />
                          2 Quizzes
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} className="card bg-black border border-primary/30 text-white">
            <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight mb-6">{t.skillStats}</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-black border border-primary/20 flex items-center justify-center text-primary">
                    <Star className="w-5 h-5" />
                  </div>
                  <span className="label-caps !text-[9px]">{t.expertiseScore}</span>
                </div>
                <span className="text-lg font-display font-bold text-primary">740</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-black border border-primary/20 flex items-center justify-center text-primary">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="label-caps !text-[9px]">{t.badgesEarned}</span>
                </div>
                <span className="text-lg font-display font-bold text-primary">12</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-none bg-black border border-primary/20 flex items-center justify-center text-primary">
                    <Zap className="w-5 h-5" />
                  </div>
                  <span className="label-caps !text-[9px]">{t.learningVelocity}</span>
                </div>
                <span className="text-lg font-display font-bold text-primary italic">Fast</span>
              </div>
            </div>
            
            <div className="mt-8 pt-8 border-t border-border">
              <p className="label-caps !text-[8px] mb-4">{t.topLearner}</p>
              <button 
                onClick={() => setShowLeaderboard(!showLeaderboard)}
                className={cn(
                  "w-full py-2.5 label-caps !text-[10px] transition-all border",
                  showLeaderboard ? "bg-primary text-black border-primary" : "bg-black text-primary border-primary/40 hover:border-primary"
                )}
              >
                {showLeaderboard ? t.hideLeaderboard : t.viewLeaderboard}
              </button>
            </div>

            {showLeaderboard && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-6 space-y-3"
              >
                {leaderboard.map((player) => (
                  <div 
                    key={player.rank}
                    className={cn(
                      "flex items-center justify-between p-2.5 border transition-all",
                      player.isUser ? "bg-primary/10 border-primary" : "bg-black border-border hover:border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "w-6 text-center text-[10px] font-bold",
                        player.rank <= 3 ? "text-primary" : "text-muted"
                      )}>
                        #{player.rank}
                      </span>
                      <div className="w-8 h-8 bg-card border border-border flex items-center justify-center text-[10px] font-bold text-muted">
                        {player.avatar}
                      </div>
                      <span className={cn(
                        "text-xs font-bold tracking-tight",
                        player.isUser ? "text-primary" : "text-text"
                      )}>
                        {player.name}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-primary">{player.score}</span>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

          <motion.div variants={itemVariants} className="card border-primary/20">
            <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight mb-4">{t.nextMilestone}</h3>
            <div className="p-4 bg-white/5 rounded-none border border-border">
              <p className="label-caps !text-[8px] !text-primary mb-2">{t.unlockCertificate}</p>
              <h4 className="font-display font-bold text-text mb-3 tracking-tight">Technical Analysis Professional</h4>
              <div className="space-y-2">
                <div className="flex justify-between label-caps !text-[8px]">
                  <span>Progress</span>
                  <span className="text-primary">85%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "85%" }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="h-full bg-primary shadow-[0_0_8px_rgba(245,185,66,0.4)]"
                  ></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
