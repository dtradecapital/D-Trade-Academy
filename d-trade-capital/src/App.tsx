/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { Dashboard } from './components/Dashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { MyLearning } from './components/MyLearning';
import { MarketsSimulator } from './components/MarketsSimulator';
import { SkillProgress } from './components/SkillProgress';
import { Assessments } from './components/Assessments';
import { Achievements } from './components/Achievements';
import { Settings as SettingsComponent } from './components/Settings';
import { cn } from './lib/utils';
import { translations, Language } from './lib/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from './contexts/UserContext';
import { 
  LayoutDashboard, 
  BookOpen, 
  LineChart, 
  Activity,
  ClipboardCheck, 
  Award, 
  Settings,
  ShieldCheck,
  User as UserIcon,
  X,
  CheckCircle2,
  AlertCircle,
  Info,
  Lock,
  ArrowRight
} from 'lucide-react';

const LogoIcon = Activity;

export default function App() {
  const { user, login, isReady } = useUser();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [language, setLanguage] = useState<Language>('en');
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  
  // Login states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const t = translations[language];

  useEffect(() => {
    // Force dark mode for premium theme
    document.documentElement.classList.add('dark');
  }, []);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      showToast("Please enter both email and password", "error");
      return;
    }
    setIsLoggingIn(true);
    try {
      await login(loginEmail, loginPassword);
      showToast("Logged in successfully!");
    } catch (error) {
      showToast("Login failed", "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleAdminView = () => {
    if (user?.role !== 'admin' && !isAdminView) {
      showToast("Admin access required", "error");
      return;
    }
    setIsAdminView(!isAdminView);
    setActiveTab('dashboard');
  };

  if (!isReady) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 text-center space-y-4">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-none animate-spin"></div>
        <div className="text-primary label-caps animate-pulse">Initializing Premium Experience...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#f5b94210,transparent_50%)]"></div>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md card relative z-10 border-primary/20 bg-card/60 backdrop-blur-xl p-8 md:p-10 space-y-8"
        >
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-primary/10 border border-primary/20 rounded-none mb-4">
              <LogoIcon className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-display font-bold text-primary tracking-tighter">D TRADE <span className="text-white">CAPITAL</span></h1>
            <p className="label-caps !text-muted">{t.welcomeBack}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="label-caps !text-[9px]">{t.emailAddress}</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-border focus:border-primary transition-all rounded-none text-sm outline-none"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="label-caps !text-[9px]">{t.password || 'Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-black border border-border focus:border-primary transition-all rounded-none text-sm outline-none"
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoggingIn}
              className="btn-premium w-full flex items-center justify-center gap-2 group"
            >
              {isLoggingIn ? (
                <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>

            <div className="text-center">
              <p className="text-[10px] text-muted font-bold uppercase tracking-widest leading-loose">
                Demo access: user@example.com / admin@example.com<br/>
                No real password required for demo
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    );
  }

  const sidebarItems = isAdminView ? [
    { id: 'dashboard', label: t.adminOverview, icon: LayoutDashboard },
    { id: 'users', label: t.userManagement, icon: UserIcon },
    { id: 'courses', label: t.courseManagement, icon: BookOpen },
    { id: 'analytics', label: t.advancedAnalytics, icon: Activity },
    { id: 'settings', label: t.adminSettings, icon: Settings },
  ] : [
    { id: 'dashboard', label: t.dashboard, icon: LayoutDashboard },
    { id: 'learning', label: t.learning, icon: BookOpen },
    { id: 'markets', label: t.markets, icon: LineChart },
    { id: 'skills', label: t.skills, icon: Activity },
    { id: 'assessments', label: t.assessments, icon: ClipboardCheck },
    { id: 'achievements', label: t.achievements, icon: Award },
    { id: 'settings', label: t.settings, icon: Settings },
  ];

  const renderContent = () => {
    if (isAdminView) {
      switch (activeTab) {
        case 'dashboard':
          return <AdminDashboard language={language} showToast={showToast} />;
        default:
          return (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-600">
                <ShieldCheck className="w-10 h-10 animate-pulse" />
              </div>
              <h2 className="text-2xl font-display font-bold capitalize">Admin {activeTab.replace('-', ' ')}</h2>
              <p className="text-slate-500 max-w-md">
                This administrative module is currently being optimized for high-performance data processing.
              </p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-all"
              >
                Back to Admin Overview
              </button>
            </div>
          );
      }
    }

    switch (activeTab) {
      case 'dashboard':
        return <Dashboard language={language} setActiveTab={setActiveTab} showToast={showToast} />;
      case 'learning':
        return <MyLearning language={language} setActiveTab={setActiveTab} showToast={showToast} />;
      case 'markets':
        return <MarketsSimulator language={language} showToast={showToast} />;
      case 'skills':
        return <SkillProgress language={language} setActiveTab={setActiveTab} />;
      case 'assessments':
        return <Assessments language={language} showToast={showToast} />;
      case 'achievements':
        return <Achievements language={language} />;
      case 'settings':
        return <SettingsComponent language={language} setLanguage={setLanguage} showToast={showToast} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400">
              <Settings className="w-10 h-10 animate-spin-slow" />
            </div>
            <h2 className="text-2xl font-display font-bold capitalize">{activeTab.replace('-', ' ')}</h2>
            <p className="text-slate-500 max-w-md">
              This section is currently under development as part of our premium platform upgrade.
            </p>
            <button 
              onClick={() => setActiveTab('dashboard')}
              className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-all"
            >
              Back to Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Desktop Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isAdminView={isAdminView}
        toggleAdminView={toggleAdminView}
        language={language}
      />

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-[70] lg:hidden transition-transform duration-300",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 flex items-center justify-between">
          <h1 className="text-xl font-display font-bold text-primary flex items-center gap-2">
            <Activity className="w-6 h-6" />
            D Trade Capital
          </h1>
          <button onClick={toggleMobileMenu} className="p-2 hover:bg-white/5 rounded-none">
            <X className="w-5 h-5 text-primary" />
          </button>
        </div>
        
        <nav className="mt-4 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setIsMobileMenuOpen(false);
              }}
              className={cn(
                "sidebar-item",
                activeTab === item.id && "active"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="label-caps !text-inherit">{item.label}</span>
            </div>
          ))}

          <div className="pt-4 mt-4 border-t border-border">
            <button
              onClick={toggleAdminView}
              className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-muted hover:bg-white/5 rounded-none transition-colors"
            >
              <ShieldCheck className="w-5 h-5 text-primary" />
              <span className="label-caps !text-inherit">{isAdminView ? t.switchUser : t.switchAdmin}</span>
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="lg:pl-64 min-h-screen flex flex-col">
        <TopNav 
          toggleMobileMenu={toggleMobileMenu}
          isAdminView={isAdminView}
          toggleAdminView={toggleAdminView}
          language={language}
          setLanguage={setLanguage}
          showToast={showToast}
          setActiveTab={setActiveTab}
        />
        
        <div className="pt-16 flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab + (isAdminView ? '-admin' : '-user')}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100]"
          >
            <div className={cn(
              "px-6 py-3 rounded-none shadow-[0_0_30px_rgba(0,0,0,0.5)] flex items-center gap-3 border border-primary/30 backdrop-blur-xl bg-black/80",
              toast.type === 'success' ? "text-primary" :
              toast.type === 'error' ? "text-error" :
              "text-primary"
            )}>
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === 'error' && <X className="w-5 h-5" />}
              {toast.type === 'info' && <ShieldCheck className="w-5 h-5" />}
              <span className="label-caps !text-inherit">{toast.message}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}


