/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useCallback } from 'react';
import { InterviewSession, Question, EvaluationReport, SuspiciousEvent } from './types';
import { geminiService } from './services/gemini';
import { SetupScreen } from './components/SetupScreen';
import { InterviewLayout } from './components/InterviewLayout';
import { ReportScreen } from './components/ReportScreen';
import { ProctoringOverlay } from './components/ProctoringOverlay';

type AppState = 'idle' | 'interviewing' | 'submitting' | 'finished';

export default function App() {
  const [state, setState] = useState<AppState>('idle');
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [report, setReport] = useState<EvaluationReport | null>(null);
  const [isExamCancelled, setIsExamCancelled] = useState(false);
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const startInterview = async (role: string, experience: string) => {
    setIsLoading(true);
    try {
      const qns = await geminiService.generateQuestions(role, experience);
      const newSession: InterviewSession = {
        id: Math.random().toString(36).substr(2, 9),
        role,
        experience,
        questions: qns,
        answers: {},
        proctoringScore: 0,
        isCompleted: false,
        startTime: Date.now(),
        suspiciousEvents: [],
      };
      setSession(newSession);
      setState('interviewing');
    } catch (err) {
      console.error("Failed to start session", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProctoringAlert = useCallback((event: SuspiciousEvent) => {
    setSession(prev => {
      if (!prev) return null;
      
      const penalty = event.type === 'tab-switch' ? 25 : 15;
      const newScore = Math.min(100, prev.proctoringScore + penalty);
      
      if (newScore >= 100 && !isExamCancelled) {
        setIsExamCancelled(true);
        // We'll let the user see the "Terminated" overlay for a moment before auto-submitting
        setTimeout(() => submitInterview(true), 2000);
      }

      return {
        ...prev,
        proctoringScore: newScore,
        suspiciousEvents: [...prev.suspiciousEvents, event]
      };
    });
  }, [isExamCancelled]);

  const saveAnswer = (questionId: string, answer: string) => {
    setSession(prev => {
      if (!prev) return null;
      return {
        ...prev,
        answers: { ...prev.answers, [questionId]: answer }
      };
    });
  };

  const toggleFlag = (questionId: string) => {
    setFlaggedIds(prev => 
      prev.includes(questionId) 
        ? prev.filter(id => id !== questionId) 
        : [...prev, questionId]
    );
  };

  const submitInterview = async (isForced = false) => {
    setState('submitting');
    try {
      if (session) {
        const finalReport = await geminiService.evaluateInterview(session);
        setReport(finalReport);
        setState('finished');
      }
    } catch (err) {
      console.error("Evaluation failed", err);
      setState('interviewing');
    }
  };

  if (state === 'idle') {
    return <SetupScreen onStart={startInterview} isLoading={isLoading} />;
  }

  if (state === 'interviewing' && session) {
    return (
      <>
        <InterviewLayout
          session={session}
          onSaveAnswer={saveAnswer}
          onSubmit={() => submitInterview()}
          onFlag={toggleFlag}
          flaggedIds={flaggedIds}
        />
        <ProctoringOverlay 
          score={session.proctoringScore} 
          onAlert={handleProctoringAlert}
          isExamCancelled={isExamCancelled}
        />
      </>
    );
  }

  if (state === 'submitting') {
    return (
      <div className="h-screen bg-white flex flex-col items-center justify-center font-sans">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-6" />
        <h2 className="text-2xl font-black text-gray-900 mb-2">Analyzing Performance</h2>
        <p className="text-gray-400 font-medium tracking-wide text-sm uppercase px-12 text-center">
          Our AI is evaluating your responses and proctoring logs...
        </p>
      </div>
    );
  }

  if (state === 'finished' && report) {
    return <ReportScreen report={report} onRestart={() => setState('idle')} />;
  }

  return null;
}

