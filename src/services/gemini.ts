import { GoogleGenAI, Type } from "@google/genai";

type GeminiResult = {
  summary: string;
  steps: string[];
};

const FALLBACK: GeminiResult = {
  summary:
    "We are here to help you navigate this difficult situation. Your safety and rights are protected by law.",
  steps: [
    "Preserve all evidence immediately (screenshots, bank records, messages).",
    "If local authorities or the company refuse help, use the official central portal to file a complaint.",
    "Escalate to the relevant Nodal Officer or Ombudsman if the issue persists."
  ]
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is missing in environment variables");
    }

    // Only created ONCE on server start
    this.ai = new GoogleGenAI({ apiKey });
  }

  async getNextSteps(
    incidentDescription: string
  ): Promise<GeminiResult> {
    try {
      const controller = new AbortController();

      // 🔥 Timeout protection (10s)
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await this.ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: `Situation: "${incidentDescription}". 
Role: You are the Naya Sahai Navigation Engine. 
Output: STRICT JSON ONLY.

Task:
1. Provide a calm 2-sentence empathetic summary.
2. Provide exactly 3 actionable steps:
   - WHAT TO DO NOW
   - WHAT TO DO IF BLOCKED
   - WHERE TO ESCALATE

Rules:
- Consumer disputes → 1915/NCH/e-Daakhil only
- Criminal/cyber crimes → 1930/Cyber Cell only
- No legal jargon. Mobile friendly.`,

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
            required: ["summary", "steps"]
          }
        },

        signal: controller.signal
      });

      clearTimeout(timeout);

      const text = response.text;

      if (!text) return FALLBACK;

      // 🔥 Safe JSON parse
      try {
        const parsed = JSON.parse(text.trim());

        if (
          !parsed.summary ||
          !Array.isArray(parsed.steps) ||
          parsed.steps.length !== 3
        ) {
          return FALLBACK;
        }

        return parsed;
      } catch {
        return FALLBACK;
      }
    } catch (err) {
      console.error("Gemini API error:", err);
      return FALLBACK;
    }
  }
}

export const geminiService = new GeminiService();
