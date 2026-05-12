import React, { useState } from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  TrendingUp, 
  BarChart3, 
  Clock, 
  Award, 
  AlertTriangle,
  Search,
  Filter,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  Zap,
  Target
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  PieChart, 
  Pie, 
  Cell,
  Legend
} from 'recharts';
import { cn } from '../lib/utils';
import { translations, Language } from '../lib/translations';
import { motion } from 'framer-motion';

// Mock Data
const userGrowthData = [
  { name: 'Mon', users: 400, active: 240 },
  { name: 'Tue', users: 520, active: 310 },
  { name: 'Wed', users: 680, active: 450 },
  { name: 'Thu', users: 850, active: 580 },
  { name: 'Fri', users: 1100, active: 720 },
  { name: 'Sat', users: 1250, active: 850 },
  { name: 'Sun', users: 1420, active: 980 },
];

const coursePerformanceData = [
  { name: 'Stock Basics', enrollments: 450, completion: 85, rating: 4.8 },
  { name: 'Options Trading', enrollments: 320, completion: 65, rating: 4.5 },
  { name: 'Crypto 101', enrollments: 580, completion: 45, rating: 4.2 },
  { name: 'Risk Mgmt', enrollments: 210, completion: 92, rating: 4.9 },
  { name: 'Forex Mastery', enrollments: 180, completion: 30, rating: 4.0 },
];

const completionRateData = [
  { name: 'Completed', value: 65 },
  { name: 'In Progress', value: 25 },
  { name: 'Dropped', value: 10 },
];

const COLORS = ['#1D4ED8', '#60A5FA', '#EF4444'];

const quizData = [
  { name: 'Quiz 1', score: 88, pass: 92 },
  { name: 'Quiz 2', score: 75, pass: 80 },
  { name: 'Quiz 3', score: 62, pass: 55 },
  { name: 'Quiz 4', score: 81, pass: 88 },
  { name: 'Quiz 5', score: 55, pass: 40 },
];

const tradingData = [
  { name: 'Week 1', pnl: 1200 },
  { name: 'Week 2', pnl: -500 },
  { name: 'Week 3', pnl: 2800 },
  { name: 'Week 4', pnl: 4500 },
  { name: 'Week 5', pnl: 3200 },
  { name: 'Week 6', pnl: 6100 },
];

const userTableData = [
  { name: 'Alex Johnson', course: 'Crypto 101', progress: 45, score: 82, time: '12h 30m' },
  { name: 'Sarah Miller', course: 'Stock Basics', progress: 100, score: 95, time: '8h 15m' },
  { name: 'Michael Chen', course: 'Options Trading', progress: 20, score: 65, time: '4h 45m' },
  { name: 'Emma Wilson', course: 'Risk Mgmt', progress: 92, score: 88, time: '10h 20m' },
  { name: 'David Brown', course: 'Forex Mastery', progress: 10, score: 45, time: '2h 10m' },
];

interface AdminDashboardProps {
  language: Language;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ language, showToast }) => {
  const t = translations[language];
  const [dateRange, setDateRange] = useState('Last 7 Days');
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState(userTableData);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.course.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAction = (name: string, action: string) => {
    showToast(`${action} performed for ${name}`, "info");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 bg-black min-h-screen text-text"
    >
      {/* Header & Filters */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-primary tracking-tight">{t.adminOverview}</h1>
          <p className="label-caps mt-1">{t.adminWelcome}</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-4 py-2 bg-black border border-border rounded-none focus:outline-none focus:border-primary transition-colors appearance-none cursor-pointer label-caps !text-inherit"
            >
              <option>Last 24 Hours</option>
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Year to Date</option>
            </select>
          </div>
          <button className="btn-premium flex items-center gap-2 !py-2" onClick={() => showToast("Exporting report...")}>
            <Download className="w-4 h-4" />
            <span>{t.exportReport}</span>
          </button>
        </div>
      </motion.div>

      {/* 1. KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: t.totalUsers, value: '1,420', change: '+12%', icon: Users, color: 'text-primary' },
          { label: t.activeUsers, value: '980', change: '+5%', icon: Activity, color: 'text-primary' },
          { label: t.totalCourses, value: '24', change: '+2', icon: BookOpen, color: 'text-primary' },
          { label: t.completionRate, value: '65%', change: '+3%', icon: CheckCircle, color: 'text-primary' },
          { label: t.totalTrades, value: '12.5k', change: '+18%', icon: TrendingUp, color: 'text-primary' },
        ].map((kpi, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            whileHover={{ y: -4 }}
            className="card p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-black border border-border rounded-none">
                <kpi.icon className={cn("w-5 h-5", kpi.color)} />
              </div>
              <span className="text-[10px] font-bold text-success flex items-center gap-1 label-caps !text-success">
                <ArrowUpRight className="w-3 h-3" />
                {kpi.change}
              </span>
            </div>
            <h3 className="label-caps !text-[9px]">{kpi.label}</h3>
            <p className="text-2xl font-display font-bold mt-1 text-primary">{kpi.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* 2. User Analytics */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-primary uppercase tracking-tight">{t.userGrowthActivity}</h3>
            <div className="flex gap-4 label-caps !text-[8px]">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-primary" />
                <span>{t.totalUsers}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-muted" />
                <span>{t.activeUsers}</span>
              </div>
            </div>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#F5B942" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#F5B942" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#121212', borderRadius: '0px', border: '1px solid #F5B942', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}
                />
                <Area type="monotone" dataKey="users" stroke="#F5B942" strokeWidth={2} fillOpacity={1} fill="url(#colorUsers)" />
                <Area type="monotone" dataKey="active" stroke="#737373" strokeWidth={2} fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 8. Alerts & Insights */}
        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-6">{t.alertsInsights}</h3>
          <div className="space-y-4">
            {[
              { title: 'Low Course Completion', desc: 'Crypto 101 completion dropped by 15%', type: 'warning', icon: AlertTriangle },
              { title: 'High Quiz Failure', desc: 'Quiz 5 has a 60% failure rate this week', type: 'danger', icon: Zap },
              { title: 'Inactive Users Spike', desc: '12% increase in users inactive for > 7 days', type: 'info', icon: Activity },
              { title: 'Popular Course', desc: 'Stock Basics reached 1k enrollments', type: 'success', icon: Award },
            ].map((alert, i) => (
              <div key={i} className={cn(
                "p-4 rounded-none border flex gap-3",
                alert.type === 'warning' && "bg-orange-500/10 border-orange-500/30 text-orange-400",
                alert.type === 'danger' && "bg-red-500/10 border-red-500/30 text-red-400",
                alert.type === 'info' && "bg-blue-500/10 border-blue-500/30 text-blue-400",
                alert.type === 'success' && "bg-green-500/10 border-green-500/30 text-green-400",
              )}>
                <alert.icon className="w-5 h-5 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm tracking-tight">{alert.title}</h4>
                  <p className="text-[10px] opacity-80 mt-0.5 font-medium">{alert.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 label-caps !text-primary hover:bg-white/5 transition-colors" onClick={() => showToast("Loading detailed insights...")}>
            {t.viewAllInsights}
          </button>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* 3. Course Performance */}
        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-6">{t.courseEnrollments}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={coursePerformanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#333" opacity={0.5} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} width={100} />
                <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #F5B942' }} cursor={{fill: 'rgba(255,255,255,0.05)'}} />
                <Bar dataKey="enrollments" fill="#F5B942" radius={[0, 0, 0, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* 5. Quiz & Assessment Analytics */}
        <motion.div variants={itemVariants} className="card p-6">
          <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-6">{t.quizPerformance}</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={quizData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #F5B942' }} />
                <Legend iconType="square" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
                <Bar dataKey="score" name="Avg Score" fill="#F5B942" radius={[0, 0, 0, 0]} />
                <Bar dataKey="pass" name="Pass Rate %" fill="#737373" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* 4. Learning Progress */}
        <motion.div variants={itemVariants} className="card p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-display font-bold text-primary uppercase tracking-tight mb-4">{t.avgPlatformProgress}</h3>
          <div className="relative w-48 h-48 mb-4">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle className="text-white/5 stroke-current" strokeWidth="8" fill="transparent" r="40" cx="50" cy="50" />
              <motion.circle 
                initial={{ strokeDashoffset: 251.2 }}
                animate={{ strokeDashoffset: 251.2 * (1 - 0.68) }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="text-primary stroke-current" 
                strokeWidth="8" 
                strokeDasharray="251.2" 
                strokeLinecap="butt" 
                fill="transparent" 
                r="40" 
                cx="50" 
                cy="50" 
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-display font-bold text-primary italic">68%</span>
              <span className="label-caps !text-[8px]">{t.overallProgress}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="p-3 bg-white/5 border border-border rounded-none">
              <p className="label-caps !text-[8px]">{t.avgTimeDay}</p>
              <p className="font-display font-bold text-primary">42m</p>
            </div>
            <div className="p-3 bg-white/5 border border-border rounded-none">
              <p className="label-caps !text-[8px]">{t.dropOffRate}</p>
              <p className="font-display font-bold text-error">12%</p>
            </div>
          </div>
        </motion.div>

        {/* 7. Trading Simulator Analytics */}
        <motion.div variants={itemVariants} className="lg:col-span-2 card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display font-bold text-primary uppercase tracking-tight">{t.tradingSimulatorPerformance}</h3>
            <div className="flex gap-4">
              <div className="text-right">
                <p className="label-caps !text-[8px]">Avg. P/L</p>
                <p className="font-display font-bold text-success italic">+$2,450</p>
              </div>
              <div className="text-right">
                <p className="label-caps !text-[8px]">Total Volume</p>
                <p className="font-display font-bold text-primary">$1.2M</p>
              </div>
            </div>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={tradingData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" opacity={0.5} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#737373', fontSize: 10, fontWeight: 'bold'}} />
                <Tooltip contentStyle={{ backgroundColor: '#121212', border: '1px solid #F5B942' }} />
                <Line type="monotone" dataKey="pnl" stroke="#F5B942" strokeWidth={2} dot={{r: 4, fill: '#000', strokeWidth: 2, stroke: '#F5B942'}} activeDot={{r: 6, fill: '#F5B942'}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* 10. Detailed Data Table */}
      <motion.div variants={itemVariants} className="card overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-display font-bold text-primary uppercase tracking-tight">{t.detailedUserProgress}</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input 
                type="text" 
                placeholder={t.searchUsers} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white/5 border border-border rounded-none text-sm focus:border-primary transition-colors w-64 label-caps !text-inherit"
              />
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white/5 text-muted label-caps !text-[9px]">
                <th className="px-6 py-4">{t.userName}</th>
                <th className="px-6 py-4">{t.courseEnrolled}</th>
                <th className="px-6 py-4">{t.progress}</th>
                <th className="px-6 py-4">{t.quizScore}</th>
                <th className="px-6 py-4">{t.timeSpent}</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((row, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none border border-primary/30 bg-black text-primary flex items-center justify-center font-bold text-xs">
                        {row.name.charAt(0)}
                      </div>
                      <span className="font-bold text-sm tracking-tight">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted font-medium">{row.course}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-white/5 rounded-none overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${row.progress}%` }} />
                      </div>
                      <span className="text-[10px] font-bold text-primary">{row.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2 py-1 rounded-none text-[10px] font-bold label-caps",
                      row.score >= 80 ? "bg-success/20 text-success border border-success/30" : "bg-orange-500/20 text-orange-400 border border-orange-500/30"
                    )}>
                      {row.score}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted font-medium">{row.time}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAction(row.name, "Review")}
                        className="px-2 py-1 bg-white/5 border border-border text-[8px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                      >
                        Review
                      </button>
                      <button 
                        onClick={() => handleAction(row.name, "Notify")}
                        className="px-2 py-1 bg-white/5 border border-border text-[8px] font-bold uppercase tracking-widest hover:border-primary hover:text-primary transition-all"
                      >
                        Notify
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-white/5 border-t border-border flex items-center justify-between text-xs text-muted">
          <span className="label-caps !text-[9px]">{t.showingUsers.replace('{count}', String(filteredUsers.length)).replace('{total}', '1,420')}</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-black border border-border text-muted rounded-none hover:border-primary hover:text-primary transition-all font-bold label-caps !text-[9px]">Previous</button>
            <button className="px-3 py-1 bg-black border border-border text-muted rounded-none hover:border-primary hover:text-primary transition-all font-bold label-caps !text-[9px]">Next</button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
