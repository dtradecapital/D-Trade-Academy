import React, { useState, useRef } from 'react';
import { BookOpen, Clock, Award, Play, CheckCircle2, X, Download, Share2, Search, Filter } from 'lucide-react';
import { cn } from '../lib/utils';
import { MyLearningProps, Course } from '../types';
import { CourseDetailModal } from './CourseDetailModal';
import { translations, Language } from '../lib/translations';
import { motion, AnimatePresence } from 'framer-motion';
import { useUser } from '../contexts/UserContext';
// Replace static imports with dynamic ones inside the function
// import jsPDF from 'jspdf';
// import html2canvas from 'html2canvas';

export const MyLearning: React.FC<MyLearningProps> = ({ language, setActiveTab, showToast }) => {
  const { user, courses } = useUser();
  const [selectedCertificate, setSelectedCertificate] = useState<Course | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [learningTab, setLearningTab] = useState<'all' | 'certificates'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const t = translations[language];
  const certificateRef = useRef<HTMLDivElement>(null);

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = learningTab === 'all' || course.progress === 100;
    return matchesSearch && matchesTab;
  });

  const downloadCertificate = async () => {
    if (!certificateRef.current || !selectedCertificate) return;
    
    showToast("Preparing PDF engine...", "info");
    
    try {
      // Import libraries dynamically
      const [jspdfModule, html2canvasModule] = await Promise.all([
        import('jspdf'),
        import('html2canvas')
      ]);
      
      const jsPDF = jspdfModule.default;
      const html2canvas = html2canvasModule.default;

      showToast("Generating high-quality PDF...", "info");

      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#000000'
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`DTC-Certificate-${selectedCertificate.title.replace(/\s+/g, '-')}.pdf`);
      showToast("Certificate downloaded successfully!", "success");
    } catch (error) {
      console.error("PDF Generation error:", error);
      showToast("Failed to generate PDF. Please try again.", "error");
    }
  };

  const containerVariants = {
    // ... same as before
  };

  const itemVariants = {
    // ... same as before
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="p-4 lg:p-8 space-y-8 max-w-7xl mx-auto"
    >
      {/* Certificate Modal */}
      <AnimatePresence>
        {selectedCertificate && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCertificate(null)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-3xl z-10"
            >
              <div 
                ref={certificateRef}
                className="bg-black border-[1px] border-primary/40 relative aspect-[1.4/1] overflow-hidden shadow-[0_0_100px_rgba(245,185,66,0.15)]"
              >
                {/* Certificate Background Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full -ml-32 -mb-32 blur-3xl opacity-50" />
                
                <div className="absolute inset-0 border-[20px] border-double border-primary/10 m-6 flex flex-col items-center justify-center p-12 text-center" style={{ backgroundImage: 'radial-gradient(circle at center, #111 0%, #000 100%)' }}>
                  <div className="space-y-2 mb-8">
                    <h2 className="text-primary font-display font-bold text-3xl tracking-tighter">D TRADE CAPITAL</h2>
                    <div className="h-0.5 w-12 bg-primary/40 mx-auto" />
                    <p className="label-caps !text-[10px] text-primary/60">OFFICIAL TRADING CERTIFICATION</p>
                  </div>
                  
                  <div className="space-y-6">
                    <p className="text-muted italic text-lg font-medium font-serif">This prestigious award is presented to</p>
                    <div className="relative inline-block">
                      <h3 className="text-4xl md:text-5xl font-display font-bold text-primary italic drop-shadow-[0_0_15px_rgba(245,185,66,0.4)] px-8 py-2 border-b-2 border-primary/20">
                        {user?.name}
                      </h3>
                    </div>
                    <p className="text-muted italic text-lg font-medium font-serif mt-4">for achieving the highest standard of excellence in</p>
                    <h4 className="text-2xl font-display font-bold text-text tracking-tight uppercase">{selectedCertificate.title}</h4>
                  </div>
                  
                  <div className="mt-16 w-full flex items-end justify-between px-4">
                    <div className="text-left space-y-4">
                      <div className="space-y-1">
                        <p className="label-caps !text-[8px] text-muted">{t.issueDate}</p>
                        <p className="text-sm font-bold text-text border-b border-white/10 pb-1">April 18, 2026</p>
                      </div>
                      <div className="space-y-1">
                        <p className="label-caps !text-[8px] text-muted">{t.certificateId}</p>
                        <p className="text-xs font-mono font-bold text-primary">DTC-{selectedCertificate.id}-CERT-884V</p>
                      </div>
                    </div>

                    <div className="relative group">
                      <div className="w-20 h-20 bg-white p-1 rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://dtrade.capital/verify/DTC-${selectedCertificate.id}-884V`} 
                          alt="Verification QR"
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <p className="absolute -bottom-4 left-1/2 -translate-x-1/2 label-caps !text-[7px] text-muted whitespace-nowrap">SCAN TO VERIFY</p>
                    </div>

                    <div className="text-right space-y-6">
                      <div className="space-y-1">
                         <div className="w-32 h-0.5 bg-white/20 ml-auto" />
                         <p className="label-caps !text-[8px] text-muted mt-2">DIRECTOR OF ACADEMICS</p>
                         <p className="text-xs font-serif italic text-primary">Alexander Sterling</p>
                      </div>
                      <div className="flex justify-end rotate-12 opacity-40">
                         <div className="w-16 h-16 border-4 border-primary rounded-full flex items-center justify-center text-[10px] font-bold text-primary p-1 text-center leading-tight">DTC SEAL PRO</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex items-center justify-center gap-4">
                <button className="btn-premium px-8 flex items-center gap-2 group" onClick={downloadCertificate}>
                  <Download className="w-5 h-5 group-hover:animate-bounce" />
                  {t.downloadPdf}
                </button>
                <button 
                  onClick={() => setSelectedCertificate(null)}
                  className="px-8 py-2.5 bg-black border border-border text-muted font-bold rounded-none hover:border-primary hover:text-primary transition-all text-sm label-caps !text-inherit"
                >
                  <X className="w-5 h-5 mr-2 inline-block" />
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      <motion.div variants={itemVariants} className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-display font-bold text-primary tracking-tight">{t.learning}</h2>
          <p className="label-caps mt-1">{t.continueJourney}</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted group-focus-within:text-primary transition-colors" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-10 pr-4 py-2 bg-black border border-border focus:border-primary rounded-none outline-none text-sm transition-all text-text"
            />
          </div>
          <div className="flex bg-black border border-border p-1 rounded-none">
            <button 
              onClick={() => setLearningTab('all')}
              className={cn(
                "px-4 py-1.5 label-caps !text-[10px] transition-all",
                learningTab === 'all' ? "bg-primary text-black" : "text-muted hover:text-primary"
              )}
            >
              {t.allCourses}
            </button>
            <button 
              onClick={() => setLearningTab('certificates')}
              className={cn(
                "px-4 py-1.5 label-caps !text-[10px] transition-all",
                learningTab === 'certificates' ? "bg-primary text-black" : "text-muted hover:text-primary"
              )}
            >
              {t.certificates}
            </button>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {learningTab === 'all' ? (
          filteredCourses.length > 0 ? filteredCourses.map((course) => (
            <motion.div 
              key={course.id} 
              variants={itemVariants}
              className="card flex flex-col md:flex-row gap-6 items-center group relative overflow-hidden"
            >
              {/* ... same card content as before ... */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rotate-45 pointer-events-none" />
              
              <div 
                className="w-full md:w-64 h-40 rounded-none border border-border overflow-hidden flex-shrink-0 cursor-pointer group-hover:border-primary transition-colors relative"
                onClick={() => setSelectedCourse(course)}
              >
                <img src={course.image} alt={course.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" referrerPolicy="no-referrer" />
                {course.progress === 100 && (
                  <div className="absolute inset-0 bg-success/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                     <Award className="w-12 h-12 text-white drop-shadow-lg" />
                  </div>
                )}
              </div>
              
              <div className="flex-1 space-y-4 w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="cursor-pointer" onClick={() => setSelectedCourse(course)}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "px-2 py-0.5 rounded-none label-caps !text-white border border-white/10",
                        course.difficulty === 'Beginner' ? "bg-success/40" :
                        course.difficulty === 'Intermediate' ? "bg-primary/40" :
                        "bg-purple-500/40"
                      )}>
                        {course.difficulty}
                      </span>
                      {course.progress === 100 && (
                        <span className="flex items-center gap-1 label-caps !text-success">
                          <CheckCircle2 className="w-3 h-3" />
                          {t.completed}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-display font-bold text-text group-hover:text-primary transition-colors tracking-tight uppercase">{course.title}</h3>
                  </div>
                  <div className="flex items-center gap-4 label-caps !text-[9px]">
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-primary" /> {course.duration}</span>
                    <span className="flex items-center gap-1"><BookOpen className="w-4 h-4 text-primary" /> 12 {t.lessons}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between label-caps !text-[9px]">
                    <span className="text-muted">{t.overallProgress}</span>
                    <span className="text-primary font-bold">{course.progress}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-none overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={cn(
                        "h-full transition-all duration-500",
                        course.progress === 100 ? "bg-success shadow-[0_0_10px_rgba(16,185,129,0.5)]" : "bg-primary shadow-[0_0_10px_rgba(245,185,66,0.5)]"
                      )}
                    ></motion.div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex flex-wrap gap-2">
                     <button 
                      onClick={() => setSelectedCourse(course)}
                      className="px-4 py-1.5 bg-white/5 border border-border text-[9px] font-bold label-caps hover:border-primary transition-all"
                     >
                       Take Quiz
                     </button>
                  </div>
                  
                  <button 
                    onClick={() => {
                      if (course.progress === 100) {
                        setSelectedCertificate(course);
                      } else {
                        setSelectedCourse(course);
                      }
                    }}
                    className={cn(
                      "px-6 py-2 rounded-none font-bold text-[10px] uppercase tracking-widest flex items-center gap-2 transition-all border",
                      course.progress === 100 
                        ? "bg-success/5 text-success border-success/30 hover:bg-success hover:text-black" 
                        : "bg-black text-primary border-primary hover:bg-primary hover:text-black shadow-[0_0_20px_rgba(245,185,66,0.1)]"
                    )}
                  >
                    {course.progress === 100 ? (
                      <>
                        <Award className="w-4 h-4" />
                        {t.viewCertificate}
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        {t.resumeLearning}
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )) : (
            <div className="col-span-full card p-12 text-center border-dashed border-border">
               <div className="w-16 h-16 bg-white/5 border border-border rounded-none flex items-center justify-center text-muted mx-auto mb-4">
                  <Search className="w-8 h-8" />
               </div>
               <p className="text-muted label-caps">No matching courses found</p>
            </div>
          )
        ) : (
          filteredCourses.length > 0 ? filteredCourses.map((course) => (
            <motion.div 
              key={course.id} 
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="card p-6 border-primary/20 bg-gradient-to-br from-card to-black flex flex-col items-center text-center space-y-4 relative group"
            >
              <div className="w-full aspect-video bg-black border border-border relative overflow-hidden">
                 <div className="absolute inset-0 bg-primary/5 flex flex-col items-center justify-center p-4">
                    <Award className="w-12 h-12 text-primary opacity-20" />
                    <p className="label-caps !text-[6px] text-primary/40 mt-2">D TRADE CAPITAL VERIFIED</p>
                 </div>
                 <div className="absolute inset-0 border-[4px] border-double border-primary/10 m-2" />
              </div>
              
              <div className="space-y-1">
                <h4 className="font-display font-bold text-text uppercase tracking-tight text-sm">{course.title}</h4>
                <p className="label-caps !text-[8px] text-muted">Issued on April 18, 2026</p>
              </div>

              <div className="w-full pt-4 flex gap-2">
                <button 
                  onClick={() => setSelectedCertificate(course)}
                  className="flex-1 py-2 bg-primary/10 border border-primary/20 text-primary label-caps !text-[9px] hover:bg-primary hover:text-black transition-all"
                >
                  View
                </button>
                <button 
                  onClick={() => {
                    setSelectedCertificate(course);
                    setTimeout(downloadCertificate, 500); // Small delay to let modal open if needed or just trigger
                  }}
                  className="p-2 bg-black border border-border text-muted hover:border-primary hover:text-primary transition-all"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )) : (
             <div className="col-span-full card p-12 text-center border-dashed border-border">
               <div className="w-16 h-16 bg-white/5 border border-border rounded-none flex items-center justify-center text-muted mx-auto mb-4">
                  <Award className="w-8 h-8" />
               </div>
               <p className="text-muted label-caps">No certificates earned yet</p>
            </div>
          )
        )}
      </div>
    </motion.div>
  );
};
