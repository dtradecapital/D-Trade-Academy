import React, { useState } from 'react';
import { 
  Play, 
  Clock, 
  BarChart3, 
  TrendingUp, 
  Award, 
  ChevronRight, 
  Lock, 
  CheckCircle2, 
  ArrowUpRight,
  TrendingDown,
  BookOpen,
  Target,
  ClipboardCheck,
  Download,
  X,
  ExternalLink,
  LineChart as LineChartIcon
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { cn } from '../lib/utils';
import { Course, Achievement, SkillStep } from '../types';
import { CourseDetailModal } from './CourseDetailModal';
import { translations, Language } from '../lib/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';

const weeklyData = [
  { name: 'Mon', hours: 1.5 },
  { name: 'Tue', hours: 2.3 },
  { name: 'Wed', hours: 1.8 },
  { name: 'Thu', hours: 3.2 },
  { name: 'Fri', hours: 2.5 },
  { name: 'Sat', hours: 4.1 },
  { name: 'Sun', hours: 3.5 },
];

const marketData = [
  { time: '09:00', price: 15200 },
  { time: '10:00', price: 15350 },
  { time: '11:00', price: 15280 },
  { time: '12:00', price: 15420 },
  { time: '13:00', price: 15500 },
  { time: '14:00', price: 15450 },
  { time: '15:00', price: 15620 },
];

const getAssignments = (courseId: string): any[] => [
  { id: `${courseId}-1`, question: "What is the primary goal of this trading strategy?", options: ["Maximize profit at any cost", "Manage risk while seeking consistent returns", "Predict the exact market top", "Follow social media trends"], correctAnswer: 1 },
  { id: `${courseId}-2`, question: "Which indicator is most commonly used for trend confirmation?", options: ["RSI", "Moving Averages", "Bollinger Bands", "MACD"], correctAnswer: 1 },
  { id: `${courseId}-3`, question: "What does 'Stop Loss' signify in trading?", options: ["A way to stop trading for the day", "A predefined price to exit a losing trade", "A method to lock in all profits", "A technical glitch in the system"], correctAnswer: 1 },
  { id: `${courseId}-4`, question: "How much of your capital should you typically risk per trade?", options: ["10-20%", "50%", "1-2%", "100%"], correctAnswer: 2 },
  { id: `${courseId}-5`, question: "What is 'Market Liquidity'?", options: ["The amount of cash a company has", "The ease with which an asset can be bought/sold", "The volatility of the market", "The total number of traders in a session"], correctAnswer: 1 },
];

const courses: Course[] = [
  { id: '1', title: 'Stock Market Basics', duration: '4h 20m', difficulty: 'Beginner', progress: 100, image: 'https://picsum.photos/seed/chart1/400/250', description: 'Master the fundamentals of the stock market, from understanding how exchanges work to reading basic charts and executing your first trades.', assignments: getAssignments('1') },
  { id: '2', title: 'Technical Analysis Pro', duration: '12h 45m', difficulty: 'Intermediate', progress: 45, image: 'https://picsum.photos/seed/analysis1/400/250', description: 'Dive deep into technical indicators, chart patterns, and price action strategies used by professional traders to identify high-probability setups.', assignments: getAssignments('2') },
  { id: '3', title: 'Options Trading Strategies', duration: '8h 15m', difficulty: 'Advanced', progress: 12, image: 'https://picsum.photos/seed/trading1/400/250', description: 'Learn the complex world of options, including Greeks, spreads, and hedging techniques to protect your portfolio and generate income.', assignments: getAssignments('3') },
  { id: '4', title: 'Cryptocurrency Fundamentals', duration: '6h 30m', difficulty: 'Beginner', progress: 85, image: 'https://picsum.photos/seed/crypto1/400/250', description: 'Understand blockchain technology, different types of tokens, and how to safely navigate the volatile world of digital assets.', assignments: getAssignments('4') },
  { id: '5', title: 'Forex Trading Masterclass', duration: '15h 20m', difficulty: 'Intermediate', progress: 30, image: 'https://picsum.photos/seed/forex1/400/250', description: 'Master the global currency markets, understanding pips, leverage, and the economic factors that drive exchange rates.', assignments: getAssignments('5') },
  { id: '6', title: 'Risk Management in Trading', duration: '5h 10m', difficulty: 'Intermediate', progress: 60, image: 'https://picsum.photos/seed/risk1/400/250', description: 'The most important skill for any trader. Learn how to size your positions, set stop-losses, and manage your emotional capital.', assignments: getAssignments('6') },
  { id: '7', title: 'Behavioral Finance & Psychology', duration: '7h 45m', difficulty: 'Beginner', progress: 10, image: 'https://picsum.photos/seed/psychology1/400/250', description: 'Explore the psychological biases that affect trading decisions and learn how to develop a disciplined, professional mindset.', assignments: getAssignments('7') },
  { id: '8', title: 'Quantitative Trading with Python', duration: '20h 00m', difficulty: 'Advanced', progress: 5, image: 'https://picsum.photos/seed/code1/400/250', description: 'Build automated trading systems using Python. Learn data analysis, backtesting, and algorithmic execution.', assignments: getAssignments('8') },
];

const skillSteps: SkillStep[] = [
  { id: '1', title: 'Financial Literacy Basics', status: 'completed' },
  { id: '2', title: 'Understanding Market Cycles', status: 'completed' },
  { id: '3', title: 'Technical Indicators & Charts', status: 'current' },
  { id: '4', title: 'Advanced Derivatives Trading', status: 'locked' },
  { id: '5', title: 'Portfolio Management Mastery', status: 'locked' },
];

const achievements: Achievement[] = [
  { id: '1', title: 'First Trade Master', icon: '🏆', date: 'Mar 15, 2026' },
  { id: '2', title: 'Quiz Whiz', icon: '🧠', date: 'Mar 22, 2026' },
  { id: '3', title: '7-Day Streak', icon: '🔥', date: 'Mar 28, 2026' },
  { id: '4', title: 'Risk Manager', icon: '🛡️', date: 'Mar 30, 2026' },
  { id: '5', title: 'Market Analyst', icon: '📊', date: 'Apr 02, 2026' },
  { id: '6', title: 'Crypto Pioneer', icon: '₿', date: 'Apr 05, 2026' },
  { id: '7', title: 'Profit Hunter', icon: '💰', date: 'Apr 08, 2026' },
  { id: '8', title: 'Strategy Guru', icon: '♟️', date: 'Apr 10, 2026' },
];

interface DashboardProps {
  language: Language;
  setActiveTab: (tab: string) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ language, setActiveTab, showToast }) => {
  const { user, courses, skillSteps, achievements } = useUser();
  const [showCertificate, setShowCertificate] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [dateRange, setDateRange] = useState<'7d' | '30d'>('7d');
  const t = translations[language];

  const overallProgress = Math.round(courses.reduce((acc, c) => acc + c.progress, 0) / courses.length);
  const coursesDone = courses.filter(c => c.progress === 100).length;
  const currentCourse = courses.find(c => c.progress > 0 && c.progress < 100) || courses[0];

  // Dynamic analytics data based on date range
  const analyticsData = dateRange === '7d' ? weeklyData : [
    { name: 'W1', hours: 12.5 },
    { name: 'W2', hours: 18.3 },
    { name: 'W3', hours: 15.8 },
    { name: 'W4', hours: 22.2 },
  ];

  const stats = dateRange === '7d' ? {
    coursesDone: coursesDone,
    hoursSpent: '18.9h',
    avgScore: '88%'
  } : {
    coursesDone: coursesDone + 2,
    hoursSpent: '68.8h',
    avgScore: '84%'
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
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Course Detail Modal */}
      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailModal 
            course={selectedCourse} 
            onClose={() => setSelectedCourse(null)} 
            language={language}
            showToast={showToast}
          />
        )}
      </AnimatePresence>

      {/* A. Welcome & Overview */}
      <motion.section variants={itemVariants} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl lg:text-3xl font-display font-bold text-primary">
            {t.welcomeBack}, <span className="gold-italic italic">{user?.name}</span>
          </h2>
          <p className="label-caps mt-1">
            {t.trackProgress}
          </p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-card border border-border rounded-none p-3 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-primary/40 transition-all">
            <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <p className="label-caps !text-[8px]">{t.learningStreak}</p>
              <p className="text-sm font-bold text-primary">{user?.streak} {t.days}</p>
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-none p-3 flex items-center gap-3 shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:border-primary/40 transition-all">
            <div className="w-10 h-10 rounded-none bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <p className="label-caps !text-[8px]">{t.overallProgress}</p>
              <p className="text-sm font-bold text-primary">{overallProgress}%</p>
            </div>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* B. Continue Learning (Priority) */}
        <div className="lg:col-span-2 space-y-8">
          <motion.section variants={itemVariants} className="card bg-black border border-primary/30 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl group-hover:bg-primary/10 transition-all duration-700"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-4 flex-1">
                <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-none label-caps !text-primary">{t.currentCourse}</span>
                <h3 className="text-2xl font-bold font-display text-primary tracking-tight">{currentCourse.title}</h3>
                <p className="text-muted text-sm">{t.lastLesson}: <span className="gold-italic italic">Understanding Core Concepts</span></p>
                
                <div className="space-y-2">
                  <div className="flex justify-between label-caps !text-[9px]">
                    <span>{t.courseProgress}</span>
                    <span className="text-primary">{currentCourse.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${currentCourse.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-primary rounded-none shadow-[0_0_10px_rgba(245,185,66,0.5)]"
                    ></motion.div>
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setActiveTab('learning');
                  showToast("Resuming your last lesson...");
                }}
                className="btn-premium flex items-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                {t.resumeLearning}
              </button>
            </div>
          </motion.section>

          {/* C. Learning Progress Analytics */}
          <motion.section variants={itemVariants} className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold font-display text-primary">{t.learningAnalytics}</h3>
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value as '7d' | '30d')}
                className="bg-black border border-border rounded-none text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 focus:outline-none focus:border-primary text-muted cursor-pointer"
              >
                <option value="7d">{t.last7Days}</option>
                <option value="30d">{t.last30Days}</option>
              </select>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="p-4 bg-black border border-border rounded-none">
                <p className="label-caps">{t.coursesDone}</p>
                <p className="text-2xl font-display font-bold mt-1 text-primary">{String(stats.coursesDone).padStart(2, '0')}</p>
              </div>
              <div className="p-4 bg-black border border-border rounded-none">
                <p className="label-caps">{t.hoursSpent}</p>
                <p className="text-2xl font-display font-bold mt-1 text-primary">{stats.hoursSpent}</p>
              </div>
              <div className="p-4 bg-black border border-border rounded-none col-span-2 md:col-span-1">
                <p className="label-caps">{t.avgScore}</p>
                <p className="text-2xl font-display font-bold mt-1 text-primary">{stats.avgScore}</p>
              </div>
            </div>
            
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analyticsData}>
                  <defs>
                    <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#F5B942" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#F5B942" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#737373', fontWeight: 'bold'}}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fontSize: 10, fill: '#737373', fontWeight: 'bold'}}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '0px', 
                      border: '1px solid #F5B942', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.8)',
                      backgroundColor: '#121212',
                      color: '#F5B942'
                    }} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hours" 
                    stroke="#F5B942" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorHours)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.section>
        </div>

        {/* F. Trading Simulator Panel */}
        <div className="space-y-8">
          <motion.section variants={itemVariants} className="card border-primary/30 bg-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-black border border-primary text-primary rounded-none shadow-[0_0_10px_rgba(245,185,66,0.2)]">
                  <LineChartIcon className="w-4 h-4" />
                </div>
                <h3 className="font-bold font-display text-primary uppercase tracking-tight">{t.tradingSimulator}</h3>
              </div>
              <span className="label-caps !text-success flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                {t.live}
              </span>
            </div>
            
            <div className="space-y-1 mb-6">
              <p className="label-caps !text-[8px]">{t.portfolioValue}</p>
              <h4 className="text-2xl font-display font-bold text-primary tracking-tight">₹ {user?.portfolioBalance?.toLocaleString()}</h4>
              <p className="text-xs text-success font-bold">+ ₹ 2,450.00 (1.97%) {t.today}</p>
            </div>
            
            <div className="h-[120px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={marketData}>
                  <Line 
                    type="monotone" 
                    dataKey="price" 
                    stroke="#F5B942" 
                    strokeWidth={2} 
                    dot={false} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <button 
              onClick={() => {
                setActiveTab('markets');
                showToast("Opening Trading Simulator...");
              }}
              className="btn-premium w-full flex items-center justify-center gap-2"
            >
              {t.openSimulator}
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.section>

          {/* E. Skill Progress (Structured Path) */}
          <motion.section variants={itemVariants} className="card">
            <h3 className="text-lg font-bold font-display mb-6 text-primary">{t.skillPath}</h3>
            <div className="space-y-6 relative">
              <div className="absolute left-4 top-2 bottom-2 w-px bg-border"></div>
              
              {skillSteps.map((step) => (
                <div key={step.id} className="flex items-start gap-4 relative z-10">
                  <div className={cn(
                    "w-8 h-8 rounded-none flex items-center justify-center border transition-all duration-300",
                    step.status === 'completed' ? "bg-primary text-black border-primary shadow-[0_0_10px_rgba(245,185,66,0.3)]" : 
                    step.status === 'current' ? "bg-black text-primary border-primary ring-4 ring-primary/5" : 
                    "bg-black text-muted border-border"
                  )}>
                    {step.status === 'completed' ? <CheckCircle2 className="w-4 h-4" /> : 
                     step.status === 'current' ? <Target className="w-4 h-4 animate-pulse" /> : 
                     <Lock className="w-3 h-3" />}
                  </div>
                  <div className="pt-1">
                    <p className={cn(
                      "text-sm font-bold tracking-tight",
                      step.status === 'locked' ? "text-muted" : "text-text"
                    )}>
                      {step.title}
                    </p>
                    {step.status === 'current' && (
                      <p className="label-caps !text-primary !text-[8px] mt-0.5">{t.inProgress}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.section>
        </div>
      </div>

      {/* D. Course Library */}
      <motion.section variants={itemVariants} className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold font-display text-primary tracking-tight">{t.courseLibrary}</h3>
          <button className="label-caps !text-primary hover:underline transition-all">{t.viewAll}</button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course) => (
            <motion.div 
              key={course.id} 
              whileHover={{ y: -5 }}
              onClick={() => setSelectedCourse(course)}
              className="card p-0 overflow-hidden group cursor-pointer"
            >
              <div className="relative h-40 overflow-hidden">
                <img 
                  src={course.image} 
                  alt={course.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors" />
                <div className="absolute top-3 left-3">
                  <span className={cn(
                    "px-2 py-1 rounded-none label-caps !text-white border border-white/20 backdrop-blur-md",
                    course.difficulty === 'Beginner' ? "bg-success/40" :
                    course.difficulty === 'Intermediate' ? "bg-primary/40" :
                    "bg-purple-500/40"
                  )}>
                    {course.difficulty}
                  </span>
                </div>
                {course.progress === 100 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowCertificate(course.title);
                      }}
                      className="btn-premium !py-1.5 !px-3 !text-[10px]"
                    >
                      <Award className="w-3 h-3 mr-1 inline" />
                      View Certificate
                    </button>
                  </div>
                )}
              </div>
              
              <div className="p-4 space-y-3">
                <h4 className="font-display font-bold text-sm line-clamp-1 group-hover:text-primary transition-colors">{course.title}</h4>
                <div className="flex items-center gap-4 label-caps !text-[8px]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {course.duration}
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="w-3 h-3" />
                    12 {t.lessons}
                  </span>
                </div>
                
                <div className="pt-2">
                  <div className="flex justify-between label-caps !text-[8px] mb-1">
                    <span>Progress</span>
                    <span className="text-primary">{course.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-none overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn(
                        "h-full transition-all duration-500",
                        course.progress === 100 ? "bg-success shadow-[0_0_8px_rgba(16,185,129,0.4)]" : "bg-primary shadow-[0_0_8px_rgba(245,185,66,0.4)]"
                      )}
                    ></motion.div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* G. Assessments & H. Achievements */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.section variants={itemVariants} className="card">
            <h3 className="text-lg font-bold font-display mb-6 text-primary">{t.assessments}</h3>
            <div className="space-y-4">
              <div className="p-4 bg-black border border-border rounded-none flex items-center justify-between shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                <div>
                  <p className="label-caps">{t.lastScore}</p>
                  <p className="text-xl font-display font-bold text-primary">92/100</p>
                </div>
                <div className="w-12 h-12 rounded-none border-2 border-success/40 flex items-center justify-center text-success font-display font-bold text-sm shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                  A+
                </div>
              </div>
              
              <div className="space-y-3">
                <p className="label-caps">{t.pendingQuizzes}</p>
                <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-none transition-all group cursor-pointer border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-black border border-border flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      <ClipboardCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">Market Indicators Quiz</p>
                      <p className="label-caps !text-[8px]">15 Questions • 20 mins</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setActiveTab('assessments');
                  showToast("Loading new assessment...");
                }}
                className="btn-premium w-full mt-2"
              >
                {t.startNewAssessment}
              </button>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="card">
            <h3 className="text-lg font-bold font-display mb-6 text-primary">{t.achievements}</h3>
            <div className="grid grid-cols-3 gap-4">
              {achievements.map((item) => (
                <div key={item.id} className="flex flex-col items-center text-center space-y-2 group">
                  <div className="w-16 h-16 rounded-none bg-black border border-border flex items-center justify-center text-3xl group-hover:scale-110 group-hover:border-primary transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-primary leading-tight uppercase tracking-tighter">{item.title}</p>
                    <p className="text-[9px] text-muted mt-0.5 font-medium">{item.date}</p>
                  </div>
                </div>
              ))}
              <div className="flex flex-col items-center text-center space-y-2 group cursor-pointer">
                <div className="w-16 h-16 rounded-none border border-dashed border-border flex items-center justify-center text-muted group-hover:border-primary group-hover:text-primary transition-all">
                  <Award className="w-6 h-6" />
                </div>
                <p className="label-caps !text-[9px]">{t.viewAll}</p>
              </div>
            </div>
          </motion.section>
        </div>

        {/* I. Recommendations */}
        <motion.section variants={itemVariants} className="card">
          <h3 className="text-lg font-bold font-display mb-6 text-primary">{t.recommended}</h3>
          <div className="space-y-4">
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-none border border-border overflow-hidden flex-shrink-0 group-hover:border-primary transition-colors">
                <img src="https://picsum.photos/seed/rec1/200/200" alt="Rec" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-display font-bold leading-tight group-hover:text-primary transition-colors">Advanced Candlestick Patterns</h4>
                <p className="label-caps !text-[8px]">{t.basedOnProgress}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="label-caps !text-primary !text-[8px] px-1.5 py-0.5 bg-primary/10 border border-primary/20">{t.new}</span>
                  <span className="label-caps !text-[8px]">2.5 {t.hours}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 group cursor-pointer">
              <div className="w-20 h-20 rounded-none border border-border overflow-hidden flex-shrink-0 group-hover:border-primary transition-colors">
                <img src="https://picsum.photos/seed/rec2/200/200" alt="Rec" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" referrerPolicy="no-referrer" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-display font-bold leading-tight group-hover:text-primary transition-colors">Macroeconomics for Traders</h4>
                <p className="label-caps !text-[8px]">{t.masterGlobalDrivers}</p>
                <div className="flex items-center gap-2 pt-1">
                  <span className="label-caps !text-secondary !text-[8px] px-1.5 py-0.5 bg-secondary/10 border border-secondary/20">{t.popular}</span>
                  <span className="label-caps !text-[8px]">5 {t.hours}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </div>
      
      <motion.footer variants={itemVariants} className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4 text-muted text-[10px] uppercase font-bold tracking-widest">
        <p>© 2026 D TRADE CAPITAL. {t.rightsReserved}</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-primary transition-colors">{t.privacyPolicy}</a>
          <a href="#" className="hover:text-primary transition-colors">{t.termsOfService}</a>
          <a href="#" className="hover:text-primary transition-colors">{t.support}</a>
        </div>
      </motion.footer>

      {/* Certificate Modal */}
      <AnimatePresence>
        {showCertificate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowCertificate(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-card w-full max-w-3xl rounded-none border border-primary/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  onClick={() => setShowCertificate(null)}
                  className="p-2 bg-black border border-border rounded-none hover:border-primary transition-colors"
                >
                  <X className="w-5 h-5 text-primary" />
                </button>
              </div>

              <div className="p-8 md:p-12">
                <div className="border-[12px] border-double border-primary/20 p-8 md:p-12 text-center space-y-8 relative overflow-hidden bg-black/40">
                  {/* Decorative elements */}
                  <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl"></div>
                  
                  <div className="space-y-2">
                    <Award className="w-16 h-16 text-primary mx-auto mb-4 drop-shadow-[0_0_10px_rgba(245,185,66,0.4)]" />
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-primary uppercase tracking-widest">Certificate of Completion</h2>
                    <p className="label-caps">This is to certify that</p>
                  </div>

                  <div className="py-4">
                    <h3 className="text-4xl md:text-5xl font-display font-bold text-primary italic drop-shadow-[0_0_15px_rgba(245,185,66,0.3)]">Anuj Panday</h3>
                    <div className="w-48 h-px bg-primary/30 mx-auto mt-4"></div>
                  </div>

                  <div className="space-y-4">
                    <p className="text-muted font-medium">has successfully completed the professional course</p>
                    <h4 className="text-2xl font-display font-bold text-text tracking-tight">{showCertificate}</h4>
                    <p className="label-caps !text-[10px]">Issued on March 31, 2026 • Certificate ID: DTC-2026-8842</p>
                  </div>

                  <div className="flex items-center justify-between pt-12">
                    <div className="text-left">
                      <div className="w-32 h-px bg-primary/30 mb-2"></div>
                      <p className="label-caps !text-[8px] !text-text">Director, D Trade Capital</p>
                    </div>
                    <div className="w-20 h-20 border-4 border-primary/5 rounded-full flex items-center justify-center opacity-20">
                      <TrendingUp className="w-10 h-10 text-primary" />
                    </div>
                    <div className="text-right">
                      <div className="w-32 h-px bg-primary/30 mb-2"></div>
                      <p className="label-caps !text-[8px] !text-text">Course Instructor</p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <button className="btn-premium flex items-center gap-2" onClick={() => showToast("Downloading certificate...")}>
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button className="px-6 py-2.5 bg-black border border-border text-muted font-bold rounded-none flex items-center gap-2 hover:border-primary hover:text-primary transition-all uppercase tracking-widest text-xs" onClick={() => showToast("Opening sharing options...")}>
                    <ExternalLink className="w-4 h-4" />
                    Share on LinkedIn
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.main>
  );
};
