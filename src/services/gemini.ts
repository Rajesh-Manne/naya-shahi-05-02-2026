export class GeminiService {
  async getNextSteps(incident: string) {
    const res = await fetch("/.netlify/functions/gemini", {
      method: "POST",
      body: JSON.stringify({ incident }),
    });

    return res.json();
  }
}

export const geminiService = new GeminiService();
