export interface Question {
  id: string;
  text: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface InterviewSession {
  id: string;
  role: string;
  experience: string;
  questions: Question[];
  currentQuestionId?: string;
  answers: Record<string, string>;
  proctoringScore: number;
  isCompleted: boolean;
  startTime: number;
  suspiciousEvents: SuspiciousEvent[];
}

export interface SuspiciousEvent {
  type: 'tab-switch' | 'focus-loss' | 'multiple-faces' | 'no-face' | 'movement';
  timestamp: number;
  message: string;
}

export interface EvaluationReport {
  overallScore: number;
  strengths: string[];
  weaknesses: string[];
  detailedFeedback: string;
  proctoringSummary: {
    finalScore: number;
    status: 'clean' | 'suspicious' | 'failed';
    summary: string;
  };
}
