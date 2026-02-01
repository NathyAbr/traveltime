
import { GoogleGenAI } from "@google/genai";

const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

export async function getGeminiResponse(userQuery: string): Promise<string> {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const systemPrompt = `Tu es CHRONOS, l'IA de l'agence TimeTravel. 
  Ton style : Cyberpunk, précis, utile. Tu dois CONSEILLER l'utilisateur.
  Catalogue : Paris 1889, Crétacé, Florence 1504, Gizeh -2560, NY 1920, Tokyo 2150.
  Si l'utilisateur demande un conseil, propose une destination.
  Fais des phrases courtes. Réponds toujours en français.`;

  try {
    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: userQuery,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    return response.text || "Désolé, j'ai rencontré une erreur dans mes banques de données.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "ERR: Connexion neuronale instable. Veuillez réessayer.";
  }
}
