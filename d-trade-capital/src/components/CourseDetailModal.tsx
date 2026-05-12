import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Clock, BookOpen, Award, CheckCircle2, ChevronRight, HelpCircle, Send, Play, Download } from 'lucide-react';
import { Course, Assignment } from '../types';
import { cn } from '../lib/utils';
import { Language, translations } from '../lib/translations';
import { useUser } from '../contexts/UserContext';

interface CourseDetailModalProps {
  course: Course;
  onClose: () => void;
  language: Language;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

export const CourseDetailModal: React.FC<CourseDetailModalProps> = ({ course, onClose, language, showToast }) => {
  const t = translations[language];
  const { completeLesson } = useUser();
  const [activeTab, setActiveTab] = useState<'details' | 'content' | 'assignments'>('details');
  const [isEntering, setIsEntering] = useState(false);
  const [tipIndex, setTipIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const tips = [
    "Patience is a trader's best friend.",
    "Risk management is the key to longevity.",
    "Don't trade with money you can't afford to lose.",
    "The trend is your friend until the end.",
    "Plan your trade and trade your plan."
  ];

  const handleAnswer = (assignmentId: string, optionIndex: number) => {
    if (submitted) return;
    setAnswers(prev => ({ ...prev, [assignmentId]: optionIndex }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < (course.assignments?.length || 0)) {
      showToast("Please answer all questions before submitting.", "info");
      return;
    }
    setSubmitted(true);
    showToast("Assignments submitted successfully!", "success");
    
    // Auto complete lesson if score is high
    const score = calculateScore();
    if (score >= 60) {
      completeLesson(course.id, "Assignment Completed");
    }
  };

  const calculateScore = () => {
    if (!course.assignments) return 0;
    let correct = 0;
    course.assignments.forEach(a => {
      if (answers[a.id] === a.correctAnswer) correct++;
    });
    return Math.round((correct / course.assignments.length) * 100);
  };

  const handleStartStudying = () => {
    setIsEntering(true);
    const interval = setInterval(() => {
      setTipIndex(prev => (prev + 1) % tips.length);
    }, 500);

    setTimeout(() => {
      clearInterval(interval);
      setIsEntering(false);
      setActiveTab('content');
    }, 2500);
  };

  const handleCompleteCurrentLesson = () => {
    completeLesson(course.id, "Module 1 Introduction");
    showToast("Lesson completed! Progress updated.", "success");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-3xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="relative h-48 flex-shrink-0">
          <img src={course.image} alt={course.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-all"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex items-center gap-2 mb-2">
              <span className={cn(
                "px-2 py-0.5 rounded text-[10px] font-bold uppercase text-white",
                course.difficulty === 'Beginner' ? "bg-green-500" :
                course.difficulty === 'Intermediate' ? "bg-blue-500" :
                "bg-purple-500"
              )}>
                {course.difficulty}
              </span>
              {course.progress === 100 && (
                <span className="flex items-center gap-1 text-[10px] font-bold text-green-400">
                  <CheckCircle2 className="w-3 h-3" />
                  {t.completed}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-display font-bold text-white">{course.title}</h2>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100 dark:border-slate-800 px-6">
          <button 
            onClick={() => setActiveTab('details')}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'details' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab('content')}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'content' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Content
          </button>
          <button 
            onClick={() => setActiveTab('assignments')}
            className={cn(
              "px-6 py-4 text-sm font-bold transition-all border-b-2",
              activeTab === 'assignments' ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700"
            )}
          >
            Assignments
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar relative">
          <AnimatePresence mode="wait">
            {isEntering && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-50 bg-white dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center space-y-4"
              >
                <motion.div 
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-bold font-display">Entering Classroom...</h3>
                  <AnimatePresence mode="wait">
                    <motion.p 
                      key={tipIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="text-sm text-primary font-medium italic"
                    >
                      "{tips[tipIndex]}"
                    </motion.p>
                  </AnimatePresence>
                  <p className="text-xs text-slate-500">Preparing your personalized learning environment</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {activeTab === 'details' ? (
            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="card p-4 text-center space-y-1">
                  <Clock className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Duration</p>
                  <p className="text-sm font-bold">{course.duration}</p>
                </div>
                <div className="card p-4 text-center space-y-1">
                  <BookOpen className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Lessons</p>
                  <p className="text-sm font-bold">12 Modules</p>
                </div>
                <div className="card p-4 text-center space-y-1">
                  <Award className="w-5 h-5 text-primary mx-auto" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">Certificate</p>
                  <p className="text-sm font-bold">Included</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display">About this course</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {course.description || "This comprehensive course covers everything you need to know about the subject. From fundamental concepts to advanced strategies, you'll gain practical insights and hands-on experience to master the markets."}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display">What you'll learn</h3>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    "Master core fundamental principles",
                    "Understand complex market dynamics",
                    "Develop professional-grade strategies",
                    "Risk management and capital preservation",
                    "Real-world case studies and analysis",
                    "Practical application in simulators"
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <CheckCircle2 className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold font-display">Course Curriculum</h3>
                <div className="space-y-2">
                  {[
                    { title: "Module 1: Introduction & Fundamentals", duration: "45 mins" },
                    { title: "Module 2: Technical Analysis Deep Dive", duration: "1h 20m" },
                    { title: "Module 3: Risk Management Strategies", duration: "55 mins" },
                    { title: "Module 4: Practical Trading Simulator", duration: "1h 10m" }
                  ].map((module, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-700 flex items-center justify-center text-xs font-bold shadow-sm">
                          {i + 1}
                        </div>
                        <p className="text-sm font-medium">{module.title}</p>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">{module.duration}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <motion.button 
                  onClick={handleStartStudying}
                  animate={{ 
                    boxShadow: ["0 0 0 0px rgba(59, 130, 246, 0)", "0 0 0 10px rgba(59, 130, 246, 0)", "0 0 0 0px rgba(59, 130, 246, 0)"]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Start Studying Now
                </motion.button>
              </div>
            </div>
          ) : activeTab === 'content' ? (
            <div className="space-y-8">
              <div className="aspect-video bg-slate-100 dark:bg-slate-800 rounded-2xl flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 group cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <p className="mt-4 font-bold text-slate-500">Watch Introduction Video</p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold font-display">Module 1: Introduction to {course.title}</h3>
                  <span className="text-xs font-bold text-primary px-2 py-1 bg-primary/10 rounded">Current Lesson</span>
                </div>

                <div className="prose prose-slate dark:prose-invert max-w-none">
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Welcome to the first module of this comprehensive guide. In this section, we will explore the foundational elements that define the current market landscape. Understanding these basics is crucial before moving on to more complex technical strategies.
                  </p>
                  <h4 className="text-lg font-bold mt-6 mb-4">Key Objectives:</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Defining the core terminology and market participants
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Historical context and evolution of trading systems
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                      Setting up your analytical framework
                    </li>
                  </ul>
                </div>

                <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 text-white flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <div>
                    <h5 className="font-bold text-blue-900 dark:text-blue-100">Reading Material</h5>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">Download the PDF guide for this module to follow along with the exercises.</p>
                    <button className="mt-3 text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline">
                      <Download className="w-3 h-3" />
                      Download Module_1_Guide.pdf
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button 
                  onClick={() => setActiveTab('details')}
                  className="px-6 py-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-all"
                >
                  Back to Overview
                </button>
                <div className="flex gap-2">
                  <button 
                    onClick={handleCompleteCurrentLesson}
                    className="px-6 py-3 bg-success/10 text-success border border-success/30 font-bold rounded-xl hover:bg-success hover:text-black transition-all flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Complete Lesson
                  </button>
                  <button 
                    onClick={() => setActiveTab('assignments')}
                    className="px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-all flex items-center gap-2"
                  >
                    Next: Take Quiz
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {course.assignments && course.assignments.length > 0 ? (
                <>
                  <div className="space-y-6">
                    {course.assignments.map((assignment, index) => (
                      <div key={assignment.id} className="space-y-4">
                        <div className="flex gap-3">
                          <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                            {index + 1}
                          </span>
                          <p className="text-sm font-bold">{assignment.question}</p>
                        </div>
                        <div className="grid grid-cols-1 gap-2 pl-9">
                          {assignment.options.map((option, optIndex) => (
                            <button
                              key={optIndex}
                              onClick={() => handleAnswer(assignment.id, optIndex)}
                              className={cn(
                                "w-full text-left px-4 py-3 rounded-xl text-sm transition-all border",
                                answers[assignment.id] === optIndex 
                                  ? "bg-primary/10 border-primary text-primary font-bold" 
                                  : "bg-slate-50 dark:bg-slate-800 border-transparent hover:border-slate-200 dark:hover:border-slate-700",
                                submitted && optIndex === assignment.correctAnswer && "bg-success/10 border-success text-success",
                                submitted && answers[assignment.id] === optIndex && optIndex !== assignment.correctAnswer && "bg-error/10 border-error text-error"
                              )}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>

                  {!submitted ? (
                    <div className="pt-6 flex justify-center">
                      <button 
                        onClick={handleSubmit}
                        className="flex items-center gap-2 px-8 py-3 bg-primary text-white font-bold rounded-xl hover:bg-secondary transition-all shadow-lg shadow-primary/20"
                      >
                        <Send className="w-4 h-4" />
                        Submit Assignments
                      </button>
                    </div>
                  ) : (
                    <div className="card bg-slate-900 text-white p-8 text-center space-y-4">
                      <Trophy className="w-12 h-12 text-primary mx-auto" />
                      <div className="space-y-1">
                        <h4 className="text-xl font-bold font-display">Assignment Completed!</h4>
                        <p className="text-slate-400">Your score: <span className="text-primary font-bold">{calculateScore()}%</span></p>
                      </div>
                      <button 
                        onClick={() => {
                          setSubmitted(false);
                          setAnswers({});
                        }}
                        className="text-sm font-bold text-primary hover:underline"
                      >
                        Retake Assignments
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <HelpCircle className="w-12 h-12 text-slate-300 mx-auto" />
                  <div className="space-y-1">
                    <p className="text-lg font-bold">No assignments available yet</p>
                    <p className="text-sm text-slate-500">We are currently preparing assignments for this course. Check back soon!</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
              <img src="https://picsum.photos/seed/avatar1/100/100" alt="Instructor" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">Instructor</p>
              <p className="text-sm font-bold">Dr. Sarah Miller</p>
            </div>
          </div>
          <button 
            onClick={() => {
              if (activeTab === 'details') handleStartStudying();
              else if (activeTab === 'content') setActiveTab('assignments');
              else showToast(`Enrolling in ${course.title}...`);
            }}
            className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-secondary transition-all text-sm flex items-center gap-2"
          >
            {activeTab === 'details' ? (
              <>
                <Play className="w-4 h-4 fill-current" />
                Start Studying
              </>
            ) : activeTab === 'content' ? (
              <>
                Next: Quiz
                <ChevronRight className="w-4 h-4" />
              </>
            ) : (
              course.progress > 0 ? "Continue Learning" : "Enroll Now"
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const Trophy = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
    <path d="M4 22h16" />
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
  </svg>
);
