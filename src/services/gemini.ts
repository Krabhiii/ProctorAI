import { GoogleGenAI, Type } from "@google/genai";
import { Question, EvaluationReport, InterviewSession } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const geminiService = {
  async generateQuestions(role: string, experience: string): Promise<Question[]> {
    const prompt = `Generate a set of 5 professional technical and behavioral interview questions for the following candidate profile:
    Role: ${role}
    Experience: ${experience}
    
    The questions should range from technical depth to soft skills.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              text: { type: Type.STRING },
              category: { type: Type.STRING },
              difficulty: { type: Type.STRING, enum: ['easy', 'medium', 'hard'] }
            },
            required: ["id", "text", "category", "difficulty"]
          }
        }
      }
    });

    try {
      return JSON.parse(response.text || "[]");
    } catch (e) {
      console.error("Failed to parse AI questions", e);
      return [];
    }
  },

  async evaluateInterview(session: InterviewSession): Promise<EvaluationReport> {
    const interviewData = session.questions.map(q => ({
      question: q.text,
      answer: session.answers[q.id] || "No answer provided"
    }));

    const prompt = `Evaluate the following interview performance for the role: ${session.role}.
    
    Candidate Data:
    ${JSON.stringify(interviewData, null, 2)}
    
    Proctoring Score (0-100, where 100 means cheated): ${session.proctoringScore}
    
    Provide a detailed evaluation report.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: { type: Type.NUMBER },
            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            detailedFeedback: { type: Type.STRING },
            proctoringSummary: {
              type: Type.OBJECT,
              properties: {
                finalScore: { type: Type.NUMBER },
                status: { type: Type.STRING, enum: ['clean', 'suspicious', 'failed'] },
                summary: { type: Type.STRING }
              },
              required: ["finalScore", "status", "summary"]
            }
          },
          required: ["overallScore", "strengths", "weaknesses", "detailedFeedback", "proctoringSummary"]
        }
      }
    });

    try {
      return JSON.parse(response.text || "{}");
    } catch (e) {
      console.error("Failed to parse evaluation report", e);
      throw e;
    }
  }
};
