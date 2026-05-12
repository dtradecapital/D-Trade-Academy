import React from 'react';
import { 
  LayoutDashboard, 
  BookOpen, 
  LineChart, 
  Activity, 
  ClipboardCheck, 
  Award, 
  Settings,
  ShieldCheck,
  User,
  LogOut
} from 'lucide-react';
import { cn } from '../lib/utils';

import { translations, Language } from '../lib/translations';

import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAdminView: boolean;
  toggleAdminView: () => void;
  language: Language;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isAdminView, 
  toggleAdminView,
  language
}) => {
  const t = translations[language];

  const sidebarItems = isAdminView ? [
    { id: 'dashboard', label: t.adminOverview, icon: LayoutDashboard },
    { id: 'users', label: t.userManagement, icon: User },
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

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 hidden lg:flex flex-col shadow-[10px_0_30px_rgba(0,0,0,0.5)]">
      <div className="p-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black border border-primary rounded-none flex items-center justify-center text-primary shadow-[0_0_15px_rgba(245,185,66,0.2)]">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-primary leading-tight tracking-tight">
              D TRADE
            </h1>
            <p className="label-caps !text-primary/60">CAPITAL</p>
          </div>
        </div>
        
        {isAdminView && (
          <div className="mt-4 px-3 py-1.5 bg-primary/5 border border-primary/20 rounded-none">
            <p className="label-caps !text-primary flex items-center gap-2">
              <ShieldCheck className="w-3 h-3" />
              ADMIN PORTAL
            </p>
          </div>
        )}
      </div>
      
      <nav className="mt-2 px-4 space-y-1 flex-1">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 transition-all duration-300 relative group",
                isActive 
                  ? "text-primary font-bold" 
                  : "text-muted hover:text-primary hover:bg-white/5"
              )}
            >
              {isActive && (
                <motion.div 
                  layoutId="active-pill"
                  className="absolute inset-0 bg-primary/5 border-l-2 border-primary"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <item.icon className={cn(
                "w-5 h-5 transition-all duration-300 group-hover:scale-110 z-10",
                isActive ? "text-primary drop-shadow-[0_0_8px_rgba(245,185,66,0.4)]" : "text-muted group-hover:text-primary"
              )} />
              <span className="z-10 label-caps !text-inherit">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="p-6 border-t border-border space-y-2">
        <button
          onClick={toggleAdminView}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-muted hover:bg-white/5 transition-all group"
        >
          <div className="p-1.5 rounded-none bg-black border border-border group-hover:border-primary group-hover:text-primary transition-colors">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="label-caps !text-inherit">{isAdminView ? t.switchUser : t.switchAdmin}</span>
        </button>
        <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-900/10 transition-all group">
          <div className="p-1.5 rounded-none bg-black border border-red-900/30 group-hover:bg-red-500 group-hover:text-white transition-colors">
            <LogOut className="w-4 h-4" />
          </div>
          <span className="label-caps !text-inherit">{t.logout}</span>
        </button>
      </div>
    </aside>
  );
};
