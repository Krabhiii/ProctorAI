import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Flag, 
  ListOrdered,
  Mic,
  MicOff,
  Video,
  FileText
} from 'lucide-react';
import { Question, InterviewSession } from '../types';
import { cn } from '../lib/utils';

interface InterviewLayoutProps {
  session: InterviewSession;
  onSaveAnswer: (questionId: string, answer: string) => void;
  onSubmit: () => void;
  onFlag: (questionId: string) => void;
  flaggedIds: string[];
}

export const InterviewLayout: React.FC<InterviewLayoutProps> = ({
  session,
  onSaveAnswer,
  onSubmit,
  onFlag,
  flaggedIds
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(1800); // 30 mins
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const currentQuestion = session.questions[currentIdx];

  useEffect(() => {
    setAnswer(session.answers[currentQuestion?.id] || '');
  }, [currentIdx]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 0) {
          clearInterval(timer);
          onSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const currentIsAnswered = !!session.answers[currentQuestion?.id];

  return (
    <div className="flex flex-col h-screen bg-brand-bg font-sans overflow-hidden text-gray-200">
      {/* 3D Header */}
      <header className="h-16 bg-brand-card/80 backdrop-blur-md border-b border-white/5 px-8 flex items-center justify-between shrink-0 z-20 shadow-lg">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-brand-primary rounded-full animate-pulse shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            <div className="text-lg font-black tracking-tighter text-white italic">PROCTOR<span className="text-brand-primary font-mono not-italic">_AI</span></div>
          </div>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-3">
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Session:</span>
             <span className="text-xs font-bold text-brand-secondary">{session.role}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 bg-black/40 px-4 py-1.5 rounded-lg border border-white/5 shadow-inner">
            <div className="flex items-center gap-2">
              <Clock size={14} className="text-brand-primary" />
              <span className="text-sm font-mono font-bold tracking-tight text-white tabular-nums">
                {formatTime(timeLeft)}
              </span>
            </div>
          </div>
          <button 
            onClick={onSubmit}
            className="bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary hover:text-white px-6 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all shadow-glow"
          >
            Finalize_Session
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 overflow-hidden p-6 gap-6 grid grid-cols-[1fr_380px] relative">
        {/* Decorative Gradients */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-brand-primary/5 blur-[150px] -z-10" />

        {/* Assessment Card */}
        <section className="card-3d bg-brand-card/40 backdrop-blur-xl border-white/10 flex flex-col overflow-hidden relative">
          <div className="p-10 flex-1 flex flex-col min-h-0">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-[10px] font-black text-brand-primary bg-brand-primary/10 px-3 py-1 rounded-full uppercase tracking-widest font-mono">
                TASK_{ (currentIdx+1).toString().padStart(2, '0') }
              </span>
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">Priority: 0xFF</span>
            </div>

            <h1 className="text-4xl font-black text-white leading-[1.1] tracking-tight mb-12 italic">
              {currentQuestion?.text}
            </h1>

            <div className="flex-1 flex flex-col min-h-0 space-y-4">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-brand-success rounded-full shadow-[0_0_5px_#10b981]" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest font-mono">Response_Encrypted</span>
                </div>
                <button 
                  onClick={() => setIsRecording(!isRecording)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border",
                    isRecording 
                      ? "bg-brand-danger border-brand-danger text-white shadow-[0_0_15px_rgba(239,68,68,0.5)]" 
                      : "bg-white/5 border-white/10 text-gray-400 hover:border-brand-primary"
                  )}
                >
                  {isRecording ? <div className="w-2 h-2 bg-white rounded-full animate-ping" /> : <Mic size={14} />}
                  {isRecording ? "Live_Capture" : "Voice_Input"}
                </button>
              </div>

              <div className="flex-1 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-2xl blur opacity-25 group-focus-within:opacity-50 transition-opacity" />
                <textarea
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="> Begin input transmission..."
                  className="w-full h-full bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-8 text-lg font-mono text-gray-300 leading-relaxed outline-none focus:border-brand-primary/50 transition-all shadow-inner relative z-10"
                />
              </div>
            </div>
          </div>

          <footer className="h-20 bg-black/20 border-t border-white/5 px-10 flex items-center justify-between shrink-0">
             <div className="flex gap-4">
               <button
                  onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                  disabled={currentIdx === 0}
                  className="flex items-center gap-2 px-6 py-2 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-bold text-xs uppercase tracking-widest hover:bg-white/10 disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={16} />
                  Prev
                </button>
                <button
                  onClick={() => onFlag(currentQuestion.id)}
                  className={cn(
                    "flex items-center gap-2 px-6 py-2 rounded-lg border text-xs font-bold uppercase tracking-widest transition-all",
                    flaggedIds.includes(currentQuestion.id) 
                      ? "bg-brand-accent/20 border-brand-accent text-brand-accent" 
                      : "bg-white/5 border-white/10 text-gray-500 hover:border-brand-accent/50"
                  )}
                >
                  <Flag size={14} />
                  Review_Flag
                </button>
             </div>

             <motion.button
                whileHover={{ x: 5 }}
                onClick={() => {
                  onSaveAnswer(currentQuestion.id, answer);
                  if (currentIdx < session.questions.length - 1) {
                    setCurrentIdx(currentIdx + 1);
                  }
                }}
                className="bg-brand-primary text-white px-8 py-3 rounded-lg font-black text-xs uppercase tracking-[0.2em] shadow-glow flex items-center gap-2"
              >
                Commit_&_Next
                <ChevronRight size={16} />
              </motion.button>
          </footer>
        </section>

        {/* Sidebar Controls */}
        <aside className="flex flex-col gap-6 overflow-y-auto">
          {/* 3D Video Stream Card */}
          <div className="card-3d bg-black aspect-video relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute inset-0 flex items-center justify-center">
               <Video size={40} className="text-white/10" />
            </div>
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-brand-danger/90 px-2 py-0.5 rounded text-[8px] font-black text-white uppercase tracking-widest shadow-[0_0_10px_rgba(239,68,68,0.4)]">
              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Capture_Active
            </div>
          </div>

          {/* Integrity Metric */}
          <div className="card-3d p-6 bg-gradient-to-br from-brand-card to-black">
             <div className="flex justify-between items-end mb-4">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Neural_Purity</span>
                <span className={cn(
                  "text-2xl font-black font-mono tracking-tighter",
                  session.proctoringScore > 70 ? "text-brand-danger" : "text-brand-success shadow-success"
                )}>{(100 - session.proctoringScore).toFixed(1)}</span>
             </div>
             <div className="h-1 bg-white/5 rounded-full overflow-hidden shadow-inner">
                <motion.div 
                  className={cn("h-full", session.proctoringScore > 70 ? "bg-brand-danger" : "bg-brand-success")}
                  initial={{ width: '100%' }}
                  animate={{ width: `${100 - session.proctoringScore}%` }}
                />
             </div>
          </div>

          {/* Event Stream */}
          <div className="card-3d flex-1 p-6 flex flex-col bg-black/40 overflow-hidden">
             <div className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] mb-4 font-mono opacity-60">Realtime_Telemetry</div>
             <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {session.suspiciousEvents.map((evt, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={i} 
                    className="grid grid-cols-[80px_1fr] text-[10px] font-mono pb-2 border-b border-white/5"
                  >
                    <span className="text-gray-600 font-bold">
                      [{ new Date(evt.timestamp).toLocaleTimeString([], { hour12: false }) }]
                    </span>
                    <span className="text-brand-danger font-black uppercase text-right tracking-tighter">{evt.message}</span>
                  </motion.div>
                ))}
                <div className="grid grid-cols-[80px_1fr] text-[10px] font-mono py-2 opacity-30 italic">
                  <span className="">[ SISTEM_IDLE ]</span>
                  <span className="text-right">Waiting for input...</span>
                </div>
             </div>
          </div>

          {/* Navigation Matrix */}
          <div className="card-3d p-6">
             <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4 font-mono">State_Matrix</div>
             <div className="grid grid-cols-5 gap-2">
               {session.questions.map((q, idx) => (
                 <button
                   key={q.id}
                   onClick={() => setCurrentIdx(idx)}
                   className={cn(
                     "aspect-square rounded-lg flex items-center justify-center text-[10px] font-mono font-black transition-all border-2",
                     currentIdx === idx ? "bg-brand-primary border-brand-primary text-white shadow-glow scale-110" :
                     session.answers[q.id] ? "bg-brand-success/10 border-brand-success/40 text-brand-success" :
                     "bg-white/5 border-white/10 text-gray-600 hover:border-white/20"
                   )}
                 >
                   {(idx + 1).toString().padStart(2, '0')}
                 </button>
               ))}
             </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
