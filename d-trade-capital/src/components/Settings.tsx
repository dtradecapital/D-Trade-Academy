import React, { useState, useRef } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Globe, 
  CreditCard, 
  LogOut,
  ChevronRight,
  Camera,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Link as LinkIcon,
  Twitter,
  Github,
  Linkedin
} from 'lucide-react';
import { cn } from '../lib/utils';
import { translations, Language } from '../lib/translations';
import { motion } from 'framer-motion';

interface SettingsProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const Settings: React.FC<SettingsProps> = ({ language, setLanguage, showToast }) => {
  const t = translations[language];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const languages: { code: Language; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'hi', label: 'हिन्दी', flag: '🇮🇳' },
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
    { code: 'zh', label: '中文', flag: '🇨🇳' },
    { code: 'ja', label: '日本語', flag: '🇯🇵' },
    { code: 'ko', label: '한국어', flag: '🇰🇷' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'pt', label: 'Português', flag: '🇧🇷' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
    { code: 'it', label: 'Italiano', flag: '🇮🇹' },
    { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'nl', label: 'Nederlands', flag: '🇳🇱' },
  ];

  const [profile, setProfile] = useState({
    fullName: 'Anuj Panday',
    email: 'anuj@example.com',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    bio: 'Financial analyst and trading enthusiast. Passionate about market trends and technical analysis.',
    occupation: 'Senior Financial Analyst',
    website: 'https://anujpanday.com',
    photo: null as string | null,
  });

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile(prev => ({ ...prev, photo: reader.result as string }));
        showToast("Profile photo updated successfully!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    showToast("Profile changes saved successfully!", "success");
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
      className="p-4 lg:p-8 space-y-8 max-w-5xl mx-auto"
    >
      <motion.div variants={itemVariants} className="space-y-1">
        <h2 className="text-2xl font-display font-bold text-primary tracking-tight">{t.settings}</h2>
        <p className="label-caps mt-1">{t.settingsDesc}</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Sidebar */}
        <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
          <div className="card text-center p-8 border-primary/20">
            <div className="relative inline-block group">
              <div className="w-32 h-32 rounded-none bg-black border border-primary flex items-center justify-center text-primary text-4xl font-display font-bold shadow-[0_0_30px_rgba(245,185,66,0.2)] overflow-hidden">
                {profile.photo ? (
                  <img src={profile.photo} alt="Profile" className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                ) : (
                  profile.fullName.split(' ').map(n => n[0]).join('')
                )}
              </div>
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-1 right-1 p-2.5 bg-primary text-black rounded-none shadow-lg hover:bg-secondary transition-all transform hover:scale-110 active:scale-95"
              >
                <Camera className="w-5 h-5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handlePhotoUpload} 
                className="hidden" 
                accept="image/*"
              />
            </div>
            
            <div className="mt-6 space-y-1">
              <h3 className="text-xl font-display font-bold text-text tracking-tight">{profile.fullName}</h3>
              <p className="label-caps !text-[9px]">{profile.occupation}</p>
            </div>

            <div className="mt-6 pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-3 text-sm text-muted font-medium">
                <Mail className="w-4 h-4 text-primary" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted font-medium">
                <MapPin className="w-4 h-4 text-primary" />
                <span>{profile.location}</span>
              </div>
            </div>

            <div className="mt-8 flex justify-center gap-4">
              <button className="p-2 rounded-none bg-black border border-border text-muted hover:text-primary hover:border-primary transition-all">
                <Twitter className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-none bg-black border border-border text-muted hover:text-primary hover:border-primary transition-all">
                <Github className="w-5 h-5" />
              </button>
              <button className="p-2 rounded-none bg-black border border-border text-muted hover:text-primary hover:border-primary transition-all">
                <Linkedin className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="card p-6 space-y-4 border-primary/20">
            <h4 className="label-caps !text-[9px] text-primary">Account Status</h4>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Membership</span>
                <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 text-primary border border-primary/30 label-caps !text-inherit">Premium</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Member Since</span>
                <span className="text-sm font-bold text-text">Jan 2026</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Trust Score</span>
                <span className="text-sm font-display font-bold text-success italic">98/100</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Settings Area */}
        <div className="lg:col-span-2 space-y-8">
          <motion.section variants={itemVariants} className="card">
            <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight mb-6">{t.profileInfo}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="label-caps !text-[9px]">{t.fullName}</label>
                <input 
                  type="text" 
                  value={profile.fullName}
                  onChange={(e) => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-none text-sm focus:outline-none focus:border-primary transition-colors text-text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="label-caps !text-[9px]">{t.emailAddress}</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-none text-sm focus:outline-none focus:border-primary transition-colors text-text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="label-caps !text-[9px]">{t.phoneNumber}</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => setProfile(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-none text-sm focus:outline-none focus:border-primary transition-colors text-text"
                />
              </div>
              <div className="space-y-1.5">
                <label className="label-caps !text-[9px]">{t.location}</label>
                <input 
                  type="text" 
                  value={profile.location}
                  onChange={(e) => setProfile(prev => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-none text-sm focus:outline-none focus:border-primary transition-colors text-text"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="label-caps !text-[9px]">Occupation</label>
                <input 
                  type="text" 
                  value={profile.occupation}
                  onChange={(e) => setProfile(prev => ({ ...prev, occupation: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-none text-sm focus:outline-none focus:border-primary transition-colors text-text"
                />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <label className="label-caps !text-[9px]">Bio</label>
                <textarea 
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile(prev => ({ ...prev, bio: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-border rounded-none text-sm focus:outline-none focus:border-primary transition-colors text-text resize-none"
                />
              </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border flex justify-end">
              <button 
                onClick={handleSave}
                className="btn-premium px-8"
              >
                {t.saveChanges}
              </button>
            </div>
          </motion.section>

          <motion.section variants={itemVariants} className="card col-span-1 md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight">{t.language}</h3>
              <p className="label-caps !text-[10px] text-muted">{languages.find(l => l.code === language)?.label}</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    showToast(`Language changed to ${lang.label}`, "success");
                  }}
                  className={cn(
                    "flex flex-col items-center justify-center p-4 border rounded-none transition-all group relative overflow-hidden",
                    language === lang.code 
                      ? "bg-primary/10 border-primary text-primary shadow-[0_0_20px_rgba(245,185,66,0.1)]" 
                      : "bg-black border-border text-muted hover:border-primary/40 hover:bg-white/5"
                  )}
                >
                  <span className="text-2xl mb-2 group-hover:scale-110 transition-transform">{lang.flag}</span>
                  <span className={cn(
                    "text-[10px] font-bold uppercase tracking-widest",
                    language === lang.code ? "text-primary" : "text-muted group-hover:text-primary"
                  )}>
                    {lang.label}
                  </span>
                  {language === lang.code && (
                    <motion.div 
                      layoutId="activeLang"
                      className="absolute top-1 right-1"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(245,185,66,0.6)]" />
                    </motion.div>
                  )}
                </button>
              ))}
            </div>
          </motion.section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.section variants={itemVariants} className="card space-y-6">
              <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight">{t.preferences}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-none transition-all cursor-pointer group border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-black border border-border flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      <Bell className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">{t.notifications}</p>
                      <p className="label-caps !text-[8px]">Email, Push, SMS</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.section>

            <motion.section variants={itemVariants} className="card space-y-6">
              <h3 className="text-lg font-display font-bold text-primary uppercase tracking-tight">{t.security}</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-none transition-all cursor-pointer group border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-black border border-border flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      <Lock className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">{t.password}</p>
                      <p className="label-caps !text-[8px]">Last changed 3 months ago</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                </div>
                
                <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-none transition-all cursor-pointer group border border-transparent hover:border-primary/20">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-none bg-black border border-border flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold tracking-tight">{t.twoFactorAuth}</p>
                      <p className="label-caps !text-[8px] !text-success">{t.enabled}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted group-hover:text-primary transition-colors" />
                </div>
              </div>
            </motion.section>
          </div>

          {/* Danger Zone */}
          <motion.section variants={itemVariants} className="card border-error/30 bg-error/5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="text-lg font-display font-bold text-error uppercase tracking-tight">{t.dangerZone}</h3>
                <p className="text-sm text-muted font-medium">{t.deleteAccountDesc}</p>
              </div>
              <button 
                className="px-6 py-2 border border-error text-error font-bold rounded-none hover:bg-error hover:text-black transition-all whitespace-nowrap label-caps !text-inherit" 
                onClick={() => showToast("Account deletion request initiated", "error")}
              >
                {t.deleteAccount}
              </button>
            </div>
          </motion.section>
        </div>
      </div>

      <motion.div variants={itemVariants} className="flex justify-center pt-8">
        <button 
          className="flex items-center gap-2 text-muted hover:text-error transition-colors font-bold label-caps !text-inherit" 
          onClick={() => showToast("Signing out from all devices...")}
        >
          <LogOut className="w-4 h-4" />
          {t.signOutDevices}
        </button>
      </motion.div>
    </motion.div>
  );
};
