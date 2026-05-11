import React from 'react';
import { motion } from 'motion/react';
import { LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from '../lib/auth';

export const AuthScreen: React.FC = () => {
  const { signIn, loading } = useAuth();

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 3D Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-[120px] animate-pulse delay-700" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full text-center"
      >
        <div className="mb-12">
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
            The next generation of technical assessment.
          </p>
        </div>

        <motion.div
          whileHover={{ rotateY: 5, rotateX: -5, scale: 1.02 }}
          className="card-3d p-10 bg-gradient-to-br from-brand-card to-brand-bg/50 backdrop-blur-md relative z-10"
        >
          <div className="mb-8">
            <div className="w-16 h-16 bg-brand-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-brand-primary/20 shadow-glow">
              <ShieldCheck className="text-brand-primary" size={32} />
            </div>
            <h2 className="text-2xl font-black text-white mb-2">Secure Authentication</h2>
            <p className="text-gray-500 text-sm">Please sign in to access your interview dashboard and manage your coin balance.</p>
          </div>

          <button
            onClick={signIn}
            disabled={loading}
            className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-[0.2em] shadow-lg hover:brightness-110 transition-all flex items-center justify-center gap-3 group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-brand-primary/10 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
            <LogIn size={20} />
            Continue with Google
          </button>

          <p className="mt-8 text-[10px] text-gray-600 font-mono uppercase tracking-[0.2em]">
            New users receive <span className="text-brand-primary">300 Credits</span> on join
          </p>
        </motion.div>

        <p className="text-center mt-10 text-[9px] text-gray-600 font-mono uppercase tracking-[0.4em] opacity-50">
          Encrypted Authentication Tunnel Active
        </p>
      </motion.div>
    </div>
  );
};
