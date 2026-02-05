// services/gemini.ts
export const geminiService = {
  getNextSteps: async (prompt: string) => {
    try {
      const response = await fetch('/.netlify/functions/gemini', { // Use relative path
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("AI Guidance Error:", error);
      // Return a fallback so the UI doesn't break
      return { 
        summary: "We are here to help you.", 
        steps: ["Follow the official protocol below"] 
      };
    }
  }
};