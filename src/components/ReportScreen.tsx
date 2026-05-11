import React from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { 
  Trophy, 
  BarChart3, 
  AlertCircle, 
  CheckCircle,
  FileText,
  RefreshCcw,
  ShieldCheck,
  ShieldAlert
} from 'lucide-react';
import { EvaluationReport } from '../types';
import { cn } from '../lib/utils';

interface ReportScreenProps {
  report: EvaluationReport;
  onRestart: () => void;
}

export const ReportScreen: React.FC<ReportScreenProps> = ({ report, onRestart }) => {
  const isFailed = report.proctoringSummary.status === 'failed';

  return (
    <div className="min-h-screen bg-brand-bg p-10 font-sans text-gray-200">
      <div className="max-w-6xl mx-auto">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-16"
        >
          <div>
            <div className="flex items-center gap-2 text-brand-primary mb-3 font-black uppercase tracking-[0.3em] text-[10px] font-mono">
              <Trophy size={14} />
              Session_Protocol_Terminated
            </div>
            <h1 className="text-5xl font-black text-white italic tracking-tighter">Mission <span className="text-brand-primary">Report</span></h1>
          </div>
          <button 
            onClick={onRestart}
            className="flex items-center gap-3 bg-brand-primary text-white px-8 py-3 rounded-xl font-bold text-sm uppercase tracking-widest shadow-glow hover:brightness-110 transition-all border border-white/10"
          >
            <RefreshCcw size={18} />
            Re-Initialize_System
          </button>
        </motion.header>

        <div className="grid grid-cols-12 gap-8">
          {/* Performance Overview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="col-span-8 card-3d p-12 bg-gradient-to-br from-brand-card to-brand-bg border-white/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/10 rounded-full blur-[100px] -mr-32 -mt-32" />
            
            <div className="relative z-10">
              <h3 className="text-[10px] font-black text-brand-primary uppercase tracking-[0.4em] mb-12 font-mono">Performance_Metrics</h3>
              
              <div className="flex items-center gap-16 mb-16">
                <div className="relative">
                   <div className="w-48 h-48 rounded-full bg-black/40 border-[10px] border-white/5 flex flex-col items-center justify-center relative">
                      <motion.div 
                        initial={{ rotate: -90 }}
                        animate={{ rotate: 270 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="absolute inset-[-10px] rounded-full border-[10px] border-brand-primary border-t-transparent border-l-transparent" 
                      />
                      <span className="text-6xl font-black text-white tracking-tighter italic">{report.overallScore}</span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Global_Score</span>
                   </div>
                </div>
                
                <div className="flex-1 space-y-6">
                  <h2 className="text-3xl font-black text-white leading-tight italic">Technical Competency Analysis</h2>
                  <p className="text-gray-400 font-medium leading-relaxed max-w-md">
                    Detailed breakdown of your interaction patterns and knowledge retrieval speed during the simulated environment.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-success rounded-full" />
                    <h3 className="text-[10px] font-black text-brand-success uppercase tracking-widest font-mono">Neural_Strengths</h3>
                  </div>
                  <ul className="space-y-4">
                    {report.strengths.map((s, i) => (
                      <li key={i} className="flex items-center gap-4 group">
                        <CheckCircle size={16} className="text-brand-success/40 group-hover:text-brand-success transition-colors" />
                        <span className="text-xs font-bold text-gray-300 leading-snug">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-brand-accent rounded-full" />
                    <h3 className="text-[10px] font-black text-brand-accent uppercase tracking-widest font-mono">Optimization_Required</h3>
                  </div>
                  <ul className="space-y-4">
                    {report.weaknesses.map((w, i) => (
                      <li key={i} className="flex items-center gap-4 group">
                        <AlertCircle size={16} className="text-brand-accent/40 group-hover:text-brand-accent transition-colors" />
                        <span className="text-xs font-bold text-gray-300 leading-snug">{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Integrity & System Logs */}
          <div className="col-span-4 space-y-8">
             <div className={cn(
              "card-3d p-8 relative overflow-hidden",
              isFailed ? "bg-brand-danger/10 border-brand-danger/30" : "bg-brand-success/10 border-brand-success/30"
             )}>
                <div className="flex items-center justify-between mb-10">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shadow-lg",
                    isFailed ? "bg-brand-danger text-white" : "bg-brand-success text-white shadow-success"
                  )}>
                    {isFailed ? <ShieldAlert size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-500 font-mono">Integrity_Score</span>
                    <h4 className={cn(
                      "text-4xl font-black font-mono italic",
                      isFailed ? "text-brand-danger" : "text-brand-success"
                    )}>{(100 - report.proctoringSummary.finalScore).toFixed(1)}</h4>
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase mb-3 font-mono">Proctor_Audit_Result</h3>
                <p className="text-xs font-medium text-gray-400 leading-relaxed mb-8 font-mono">
                  {report.proctoringSummary.summary}
                </p>

                <div className={cn(
                  "inline-flex items-center gap-3 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] font-mono",
                  isFailed ? "bg-brand-danger/20 text-brand-danger" : "bg-brand-success/20 text-brand-success"
                )}>
                  STATUS_{isFailed ? "REVOKED" : "VERIFIED"}
                </div>
             </div>

             <div className="card-3d p-8 bg-black/40">
                <div className="flex items-center gap-3 mb-8">
                  <FileText className="text-brand-primary" size={20} />
                  <h3 className="text-[10px] font-black text-gray-500 uppercase tracking-widest font-mono">Detailed_Intelligence</h3>
                </div>
                <div className="prose prose-invert prose-sm max-w-none text-gray-400 font-mono text-[11px] leading-relaxed opacity-80">
                  <ReactMarkdown>{report.detailedFeedback}</ReactMarkdown>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};
