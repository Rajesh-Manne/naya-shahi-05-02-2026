
import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  /**
   * Fetches actionable next steps for a given incident description.
   * Re-instantiates GoogleGenAI on each call to ensure the latest API key from the environment is used.
   */
  async getNextSteps(incidentDescription: string): Promise<{ steps: string[], summary: string }> {
    try {
      // Create fresh instance per request to handle potentially updated API keys
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Situation: "${incidentDescription}". 
        Role: You are the Naya Sahai Navigation Engine. 
        Output: JSON format only.
        Task: 
        1. Provide a calm, 2-sentence empathetic summary. 
        2. Provide exactly 3 clear actionable steps in the following order:
           - Step 1: WHAT TO DO NOW (Immediate protective/financial action).
           - Step 2: WHAT TO DO IF BLOCKED (If authorities/company refuse to help).
           - Step 3: WHERE TO ESCALATE (Final official authority).
        
        CRITICAL ROUTING RULES:
        - PATH A: CONSUMER DISPUTES (E-commerce, Defects, Mis-selling, Services):
          - Use 1915 (National Consumer Helpline), NCH, and e-Daakhil.
          - NEVER suggest Police, FIR, or Cyber Cell (1930) for these.
        - PATH B: CRIMINAL/CYBER CRIMES (Loan App Harassment, SIM Swap, UPI Fraud, Harassment, Extortion):
          - Use 1930, Cyber Cell, and National Cyber Crime Reporting Portal.
          - FOR LOAN APPS: Prioritize Bank Freeze and Cyber Cell over RBI Sachet. RBI Sachet is regulatory ONLY.
          - NEVER suggest NCH (1915) for these.
          
        No legal jargon. Keep it mobile-friendly.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              steps: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                minItems: 3,
                maxItems: 3
              }
            },
            required: ['summary', 'steps']
          }
        }
      });

      // Directly access .text property from GenerateContentResponse
      const text = response.text;
      if (!text) {
        throw new Error("Empty response from Gemini API");
      }

      return JSON.parse(text.trim());
    } catch (error) {
      console.error("Gemini Error:", error);
      // Consistent fallback for UI stability
      return {
        summary: "We are here to help you navigate this difficult situation. Your safety and rights are protected by law.",
        steps: [
          "Preserve all evidence (screenshots, bank records) immediately.",
          "If blocked by local authorities, file a complaint on the official central portal.",
          "Escalate to the relevant Nodal Officer or Ombudsman if the issue persists."
        ]
      };
    }
  }
}

export const geminiService = new GeminiService();
