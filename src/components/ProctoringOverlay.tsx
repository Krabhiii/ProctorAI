import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertTriangle, User, Eye, MonitorOff, ShieldAlert } from 'lucide-react';
import { SuspiciousEvent } from '../types';
import { cn } from '../lib/utils';

interface ProctoringOverlayProps {
  score: number;
  onAlert: (event: SuspiciousEvent) => void;
  isExamCancelled: boolean;
}

export const ProctoringOverlay: React.FC<ProctoringOverlayProps> = ({ score, onAlert, isExamCancelled }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [lastAlert, setLastAlert] = useState<string | null>(null);

  useEffect(() => {
    async function setupCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Camera access denied", err);
      }
    }

    setupCamera();

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        const event: SuspiciousEvent = {
          type: 'tab-switch',
          timestamp: Date.now(),
          message: "User switched tabs or minimized window."
        };
        onAlert(event);
        triggerVisualAlert("Tab Switch Detected!");
      }
    };

    const handleBlur = () => {
      const event: SuspiciousEvent = {
        type: 'focus-loss',
        timestamp: Date.now(),
        message: "Window focus lost."
      };
      onAlert(event);
      triggerVisualAlert("Window Focus Lost!");
    };

    window.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleBlur);
      stream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  const triggerVisualAlert = (msg: string) => {
    setLastAlert(msg);
    setTimeout(() => setLastAlert(null), 3000);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 pointer-events-none">
      <AnimatePresence>
        {lastAlert && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-xl flex items-center gap-2 border border-red-400"
          >
            <AlertTriangle size={18} className="animate-pulse" />
            <span className="text-sm font-bold">{lastAlert}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={cn(
        "w-64 aspect-video bg-black rounded-lg overflow-hidden shadow-2xl border-2 pointer-events-auto transition-colors duration-500 relative",
        score > 70 ? "border-brand-danger" : score > 30 ? "border-yellow-500" : "border-brand-success"
      )}>
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover opacity-80"
        />
        
        <div className="absolute inset-0 pointer-events-none border border-white/5" />
        
        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-brand-danger px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-tighter">
          <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
          Live_Feed
        </div>

        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-brand-bg via-brand-bg/40 to-transparent p-3">
          <div className="flex justify-between items-center text-white">
            <div className="flex items-center gap-1.5 opacity-60">
              <User size={12} className="text-gray-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest font-mono">Candidate_01</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-bold uppercase tracking-widest font-mono opacity-60 border-l border-white/20 pl-2">Risk:</span>
              <span className={cn(
                "text-xs font-black font-mono",
                score > 70 ? "text-brand-danger" : score > 30 ? "text-yellow-400" : "text-brand-success"
              )}>{score}</span>
            </div>
          </div>
        </div>

        {isExamCancelled && (
          <div className="absolute inset-0 bg-brand-danger/95 flex flex-col items-center justify-center text-white p-4 text-center z-10">
            <ShieldAlert size={40} className="mb-2" />
            <h3 className="text-lg font-black uppercase tracking-tighter font-mono">Session_Terminated</h3>
            <p className="text-[9px] opacity-80 leading-tight font-mono">Critical Integrity Violation</p>
          </div>
        )}
      </div>

      <div className="bg-brand-card/90 backdrop-blur-md px-3 py-1.5 rounded border border-white/10 flex items-center gap-4 text-white/60 pointer-events-auto shadow-xl">
        <div className="flex items-center gap-1">
          <Eye size={10} className="text-brand-success" />
          <span className="text-[8px] font-bold uppercase font-mono tracking-widest text-brand-success">Tracking_ON</span>
        </div>
        <div className="flex items-center gap-1 border-l border-white/10 pl-4">
          <MonitorOff size={10} className="text-brand-secondary" />
          <span className="text-[8px] font-bold uppercase font-mono tracking-widest text-gray-500">Window_Locked</span>
        </div>
      </div>
    </div>
  );
};
