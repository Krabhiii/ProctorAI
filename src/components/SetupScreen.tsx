import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Briefcase, 
  UserCircle, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  Timer,
  Video,
  RefreshCcw
} from 'lucide-react';

interface SetupScreenProps {
  onStart: (role: string, experience: string) => void;
  isLoading: boolean;
}

export const SetupScreen: React.FC<SetupScreenProps> = ({ onStart, isLoading }) => {
  const [role, setRole] = useState('');
  const [experience, setExperience] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role && experience) {
      onStart(role, experience);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, rotateX: 20, y: 40 }}
        animate={{ opacity: 1, rotateX: 0, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-xl w-full perspective-1000"
      >
        <div className="text-center mb-12">
          <motion.div 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm"
          >
            <Sparkles className="text-brand-accent" size={14} />
            <span className="text-[10px] font-black text-brand-accent uppercase tracking-[0.2em]">Quantum AI Proctoring</span>
          </motion.div>
          <h1 className="text-6xl font-black text-white mb-4 tracking-tighter leading-none italic">
            Proctor<span className="text-brand-primary">AI</span>
          </h1>
          <p className="text-gray-400 font-medium text-sm tracking-wide">
            Enter the simulation. Your interview begins now.
          </p>
        </div>

        <motion.div
          whileHover={{ rotateY: 2, rotateX: -2, scale: 1.01 }}
          className="card-3d p-10 bg-gradient-to-br from-brand-card to-brand-bg/50 backdrop-blur-md relative z-10"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] ml-1">Target_Specialization</label>
              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={16} />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="e.g. Lead System Architect"
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-brand-border rounded-xl focus:border-brand-primary outline-none transition-all font-mono text-sm text-white placeholder:text-gray-600 shadow-inner"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] font-black text-brand-primary uppercase tracking-[0.3em] ml-1">Knowledge_Base_Input</label>
              <div className="relative group">
                <UserCircle className="absolute left-4 top-4 text-gray-500 group-focus-within:text-brand-primary transition-colors" size={16} />
                <textarea
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  placeholder="Insert experience blob or paste resume..."
                  required
                  className="w-full pl-12 pr-4 py-4 bg-black/40 border border-brand-border rounded-xl focus:border-brand-primary outline-none transition-all font-mono text-sm text-white placeholder:text-gray-600 min-h-[160px] resize-none shadow-inner"
                />
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-primary text-white py-5 rounded-xl font-bold text-sm uppercase tracking-[0.2em] shadow-glow hover:brightness-110 transition-all flex items-center justify-center gap-3 disabled:opacity-50 relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              {isLoading ? (
                <>
                  <RefreshCcw className="animate-spin" size={18} />
                  Compiling Challenge...
                </>
              ) : (
                <>
                  Initiate Session
                  <Send size={16} />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-10 grid grid-cols-3 gap-6 pt-10 border-t border-white/5">
            {[
              { icon: ShieldCheck, label: 'Secured', color: 'text-brand-success' },
              { icon: Timer, label: 'Timed', color: 'text-brand-secondary' },
              { icon: Video, label: 'Tracked', color: 'text-brand-danger' }
            ].map((item, i) => (
              <div key={i} className="text-center group">
                <div className="mb-2 p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors inline-block">
                  <item.icon size={18} className={item.color} />
                </div>
                <span className="text-[10px] font-bold text-gray-500 uppercase block tracking-widest">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>
        
        <p className="text-center mt-10 text-[9px] text-gray-600 font-mono uppercase tracking-[0.4em] opacity-50">
          Neural Interface Active & Verified
        </p>
      </motion.div>
    </div>
  );
};
