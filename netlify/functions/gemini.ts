import { GoogleGenAI, Type } from "@google/genai";

export const handler = async (event: any) => {
  try {
    const { incidentDescription } = JSON.parse(event.body);

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY, // 🔒 SERVER ONLY
    });

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",

      contents: `
Situation: "${incidentDescription}"

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

    return {
      statusCode: 200,
      body: response.text || "{}",
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        summary: "We are here to help you stay safe.",
        steps: [
          "Preserve evidence immediately.",
          "Contact official authority.",
          "Escalate if ignored.",
        ],
      }),
    };
  }
};
