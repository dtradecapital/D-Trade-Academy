import React, { useState } from 'react';
import { Search, Bell, User, Moon, Sun, Menu, Languages, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { translations, Language } from '../lib/translations';
import { motion, AnimatePresence } from 'framer-motion';

interface TopNavProps {
  toggleMobileMenu: () => void;
  isAdminView: boolean;
  toggleAdminView: () => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  setActiveTab: (tab: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({ 
  toggleMobileMenu,
  isAdminView,
  toggleAdminView,
  language,
  setLanguage,
  showToast,
  setActiveTab
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const t = translations[language];

  const notifications = [
    { id: 1, title: 'Course Completed', desc: 'You finished "Technical Analysis Pro"', time: '2h ago', icon: 'award' },
    { id: 2, title: 'New Badge Earned', desc: 'Earned the "Fast Learner" badge', time: '5h ago', icon: 'zap' },
    { id: 3, title: 'Market Alert', desc: 'NIFTY 50 crossed 15,800 mark', time: '1d ago', icon: 'chart' },
    { id: 4, title: 'Certificate Issued', desc: 'Download your new certificate', time: '2d ago', icon: 'shield' },
  ];

  const suggestions = [
    { type: 'Course', title: 'Technical Analysis Pro' },
    { type: 'Topic', title: 'Candlestick Patterns' },
    { type: 'Stock', title: 'RELIANCE Industries' },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'हिन्दी (Hindi)' },
    { code: 'es', label: 'Español (Spanish)' },
    { code: 'fr', label: 'Français (French)' },
    { code: 'de', label: 'Deutsch (German)' },
    { code: 'zh', label: '中文 (Chinese)' },
    { code: 'ja', label: '日本語 (Japanese)' },
    { code: 'ko', label: '한국어 (Korean)' },
    { code: 'ar', label: 'العربية (Arabic)' },
    { code: 'pt', label: 'Português (Portuguese)' },
    { code: 'ru', label: 'Русский (Russian)' },
    { code: 'it', label: 'Italiano (Italian)' },
    { code: 'tr', label: 'Türkçe (Turkish)' },
    { code: 'vi', label: 'Tiếng Việt (Vietnamese)' },
    { code: 'nl', label: 'Nederlands (Dutch)' },
  ];

  return (
    <header className="fixed top-0 right-0 left-0 lg:left-64 h-16 bg-black/80 backdrop-blur-xl border-b border-border z-40 px-4 lg:px-8 flex items-center justify-between shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4 flex-1">
        <button 
          onClick={toggleMobileMenu}
          className="lg:hidden p-2 hover:bg-white/5 rounded-none transition-colors"
        >
          <Menu className="w-5 h-5 text-primary" />
        </button>
        
        <div className="relative max-w-md w-full hidden sm:block group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className={cn(
              "w-4 h-4 transition-colors",
              searchQuery ? "text-primary" : "text-muted"
            )} />
          </div>
          <input 
            type="text" 
            placeholder={t.searchPlaceholder} 
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-10 pr-10 py-2 bg-black border border-border rounded-none text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/30 transition-all placeholder:text-muted/50"
          />
          {searchQuery && (
            <button 
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-white/5 rounded-none transition-colors"
            >
              <X className="w-3 h-3 text-muted" />
            </button>
          )}
          
          <AnimatePresence>
            {showSuggestions && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 p-2"
              >
                <p className="px-3 py-2 label-caps">Quick Results</p>
                {suggestions.map((s, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => {
                      setSearchQuery('');
                      setShowSuggestions(false);
                      showToast(`Navigating to ${s.title}...`);
                    }}
                    className="flex items-center justify-between p-3 hover:bg-white/5 rounded-none cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-none bg-black border border-border flex items-center justify-center group-hover:border-primary transition-colors">
                        <Search className="w-3.5 h-3.5 text-muted group-hover:text-primary" />
                      </div>
                      <span className="text-sm font-medium group-hover:text-primary transition-colors">{s.title}</span>
                    </div>
                    <span className="label-caps !text-primary/60 group-hover:!text-primary px-2 py-1 bg-black border border-border rounded-none">{s.type}</span>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="flex items-center gap-2 lg:gap-4">
        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className={cn(
              "p-2 text-muted hover:bg-white/5 rounded-none transition-all relative group",
              showNotifications && "bg-white/5 text-primary"
            )}
          >
            <Bell className="w-5 h-5 group-hover:text-primary transition-colors" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-card shadow-[0_0_8px_rgba(245,185,66,0.6)]"></span>
          </button>
          
          <AnimatePresence>
            {showNotifications && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-2 w-80 bg-card border border-border rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden z-50 py-2"
              >
                <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                  <h4 className="label-caps !text-primary !text-[10px]">Notifications</h4>
                  <button className="text-[9px] text-muted hover:text-primary font-bold label-caps">Mark all as read</button>
                </div>
                <div className="max-h-[300px] overflow-y-auto">
                  {notifications.map((n) => (
                    <div 
                      key={n.id}
                      className="px-4 py-3 hover:bg-white/5 transition-colors cursor-pointer border-b border-border last:border-0 group"
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div className="w-8 h-8 rounded-none bg-black border border-border flex items-center justify-center flex-shrink-0 group-hover:border-primary transition-colors">
                          <Bell className="w-4 h-4 text-muted group-hover:text-primary" />
                        </div>
                        <div className="flex-1 space-y-0.5">
                          <p className="text-sm font-bold tracking-tight text-white group-hover:text-primary transition-colors">{n.title}</p>
                          <p className="text-xs text-muted leading-tight">{n.desc}</p>
                          <p className="text-[10px] text-primary/40 font-bold label-caps pt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button 
                  onClick={() => {
                    setShowNotifications(false);
                    showToast("Opening full notification center...");
                  }}
                  className="w-full py-2 text-center text-[10px] text-primary hover:bg-primary/5 font-bold label-caps transition-colors border-t border-border mt-1"
                >
                  View All Notifications
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        <div className="h-8 w-px bg-border mx-1 hidden sm:block"></div>
        
        <div className="relative">
          <button 
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 pl-1 cursor-pointer group"
          >
            <div className="hidden sm:block text-right">
              <p className="text-sm font-display font-bold leading-none group-hover:text-primary transition-colors">Anuj Panday</p>
              <p className="label-caps !text-primary/60 mt-1">
                {isAdminView ? t.platformAdmin : t.premiumMember}
              </p>
            </div>
            <div className={cn(
              "w-9 h-9 rounded-none flex items-center justify-center transition-all border border-border group-hover:border-primary",
              isAdminView ? "bg-primary/10 text-primary" : "bg-black text-primary shadow-[0_0_10px_rgba(245,185,66,0.1)]"
            )}>
              <User className="w-5 h-5" />
            </div>
          </button>

          <AnimatePresence>
            {showProfileMenu && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="absolute top-full right-0 mt-2 w-56 bg-card border border-border rounded-none shadow-[0_10px_40px_rgba(0,0,0,0.8)] overflow-hidden py-2 z-50"
              >
                <div className="px-4 py-3 border-b border-border mb-2">
                  <p className="text-sm font-display font-bold text-primary">Anuj Panday</p>
                  <p className="text-[10px] text-muted truncate uppercase tracking-wider">anuj@dtradecapital.com</p>
                </div>
                <button 
                  onClick={() => {
                    setActiveTab('settings');
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-white/5 hover:text-primary transition-colors label-caps !text-inherit"
                >
                  My Profile
                </button>
                <button 
                  onClick={() => {
                    showToast("Redirecting to Billing...");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-muted hover:bg-white/5 hover:text-primary transition-colors label-caps !text-inherit"
                >
                  Billing & Subscription
                </button>
                <div className="h-px bg-border my-2"></div>
                <button 
                  onClick={() => {
                    showToast("Signing out...");
                    setShowProfileMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-900/10 transition-colors label-caps !text-inherit"
                >
                  Sign Out
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
