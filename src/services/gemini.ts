import { GoogleGenAI, Type } from "@google/genai";

export class GeminiService {
  private ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_GEMINI_API_KEY,
  });

  async getNextSteps(incidentDescription: string) {
    try {
      const response = await this.ai.models.generateContent({
        // ✅ FREE MODEL
        model: "gemini-1.5-flash",

        contents: `
Situation: "${incidentDescription}"

You are the Naya Sahai Navigation Engine.

Return JSON only:
{
  "summary": string,
  "steps": string[3]
}
        `,

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
                maxItems: 3,
              },
            },
            required: ["summary", "steps"],
          },
        },
      });

      if (!response.text) throw new Error("Empty response");

      return JSON.parse(response.text);
    } catch (error) {
      console.warn("Gemini fallback triggered:", error);

      // ✅ ALWAYS WORKS EVEN IF QUOTA EXCEEDED
      return {
        summary:
          "We are here to help you. Follow these official steps to stay safe.",
        steps: [
          "Preserve all evidence immediately.",
          "Report to the official government authority.",
          "Escalate to higher authorities if ignored.",
        ],
      };
    }
  }
}

export const geminiService = new GeminiService();
