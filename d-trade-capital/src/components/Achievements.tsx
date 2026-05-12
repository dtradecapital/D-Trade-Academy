import React from 'react';
import { Award, Star, Zap, Target, Shield, TrendingUp, BookOpen, Users, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { translations, Language } from '../lib/translations';
import { cn } from '../lib/utils';

interface AchievementsProps {
  language: Language;
}

const allAchievements = [
  { id: '1', title: 'First Trade Master', icon: <Trophy className="w-8 h-8" />, date: 'Mar 15, 2026', desc: 'Successfully executed your first simulated trade.', category: 'Trading', rarity: 'Common' },
  { id: '2', title: 'Quiz Whiz', icon: <Star className="w-8 h-8" />, date: 'Mar 22, 2026', desc: 'Scored 100% on a market fundamentals assessment.', category: 'Learning', rarity: 'Uncommon' },
  { id: '3', title: '7-Day Streak', icon: <Zap className="w-8 h-8" />, date: 'Mar 28, 2026', desc: 'Logged in and learned for 7 consecutive days.', category: 'Engagement', rarity: 'Rare' },
  { id: '4', title: 'Risk Manager', icon: <Shield className="w-8 h-8" />, date: 'Mar 30, 2026', desc: 'Used stop-loss in 10 consecutive winning trades.', category: 'Trading', rarity: 'Epic' },
  { id: '5', title: 'Market Scholar', icon: <BookOpen className="w-8 h-8" />, date: 'In Progress', desc: 'Complete 10 courses in the learning library.', category: 'Learning', rarity: 'Legendary', progress: 80 },
  { id: '6', title: 'Profit Pioneer', icon: <TrendingUp className="w-8 h-8" />, date: 'In Progress', desc: 'Achieve a 20% portfolio growth in the simulator.', category: 'Trading', rarity: 'Epic', progress: 65 },
  { id: '7', title: 'Social Trader', icon: <Users className="w-8 h-8" />, date: 'In Progress', desc: 'Share 5 trade setups with the community.', category: 'Engagement', rarity: 'Common', progress: 40 },
  { id: '8', title: 'Bullseye', icon: <Target className="w-8 h-8" />, date: 'In Progress', desc: 'Predict a stock movement within 0.5% accuracy.', category: 'Trading', rarity: 'Legendary', progress: 10 },
];

export const Achievements: React.FC<AchievementsProps> = ({ language }) => {
  const t = translations[language];

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
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h2 className="text-2xl font-display font-bold">{t.achievements}</h2>
        <p className="text-slate-500 dark:text-slate-400">Track your milestones and unlock exclusive rewards as you master the markets.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {allAchievements.map((achievement) => (
          <motion.div 
            key={achievement.id}
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className={cn(
              "card p-6 flex flex-col items-center text-center space-y-4 group transition-all",
              achievement.date === 'In Progress' ? "opacity-75 grayscale-[0.5]" : "border-primary/20 bg-primary/5"
            )}
          >
            <div className={cn(
              "w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:scale-110 group-hover:rotate-3",
              achievement.date === 'In Progress' ? "bg-slate-100 dark:bg-slate-800 text-slate-400" : "bg-white dark:bg-slate-900 text-primary shadow-primary/10"
            )}>
              {achievement.icon}
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col items-center gap-1">
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                  achievement.rarity === 'Legendary' ? "bg-orange-100 text-orange-600" :
                  achievement.rarity === 'Epic' ? "bg-purple-100 text-purple-600" :
                  achievement.rarity === 'Rare' ? "bg-blue-100 text-blue-600" :
                  achievement.rarity === 'Uncommon' ? "bg-green-100 text-green-600" :
                  "bg-slate-100 text-slate-600"
                )}>
                  {achievement.rarity}
                </span>
                <h3 className="text-lg font-bold font-display leading-tight">{achievement.title}</h3>
              </div>
              <p className="text-xs text-slate-500 line-clamp-2">{achievement.desc}</p>
            </div>

            {achievement.date === 'In Progress' ? (
              <div className="w-full space-y-2 pt-2">
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase">
                  <span>Progress</span>
                  <span>{achievement.progress}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${achievement.progress}%` }}
                    className="h-full bg-primary"
                  />
                </div>
              </div>
            ) : (
              <div className="pt-2">
                <p className="text-[10px] font-bold text-success uppercase flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Unlocked {achievement.date}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Rewards Section */}
      <motion.section variants={itemVariants} className="card bg-slate-900 text-white border-none overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center md:text-left">
            <h3 className="text-2xl font-bold font-display">Hall of Fame Rewards</h3>
            <p className="text-slate-400 max-w-md">Unlock exclusive trading tools, premium courses, and personalized mentorship by completing legendary achievements.</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 pt-2">
              <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold">Premium Badge</span>
              </div>
              <div className="px-4 py-2 bg-white/10 rounded-xl border border-white/10 flex items-center gap-2">
                <Star className="w-4 h-4 text-orange-400" />
                <span className="text-xs font-bold">Early Access</span>
              </div>
            </div>
          </div>
          <div className="w-32 h-32 md:w-48 md:h-48 bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary/20 shadow-[0_0_50px_rgba(29,78,216,0.3)]">
            <Trophy className="w-16 h-16 md:w-24 md:h-24 text-primary animate-bounce-slow" />
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
};
