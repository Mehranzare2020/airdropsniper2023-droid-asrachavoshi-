import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

// Initialize the Gemini client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const MODEL_NAME = 'gemini-2.5-flash';

/**
 * Generates a creative description for an artwork based on its title and basic category.
 */
export const generateArtworkDescription = async (title: string, category: string): Promise<string> => {
  try {
    const prompt = `I am a PhD philosopher of art and an artist. Write a sophisticated, deep, and artistic description (about 80 words) for my new piece titled "${title}" which is a "${category}". Use philosophical terminology and artistic critique language.`;
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Description unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI generation failed. Please try again later.";
  }
};

/**
 * Provides strategic advice for the website based on a user query.
 */
export const askStrategicAdvisor = async (query: string, context: string): Promise<string> => {
  try {
    const prompt = `
      You are the strategic advisor for a world-renowned Professor of Philosophy and Artist. 
      Context of current site status: ${context}.
      
      The user asks: "${query}"
      
      Provide a concise, professional, and actionable strategy or answer (max 150 words).
      If the user asks in Persian, reply in Persian.
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
    });

    return response.text || "Strategy unavailable.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI Strategy module offline.";
  }
};

/**
 * Generates multilingual content (EN, FA, FR, DE, RU, TR, AR, ZH) for a new item based on Persian input.
 */
export const generateMultilingualData = async (
  type: 'artwork' | 'book' | 'journal',
  titleFa: string,
  inputFa: string,
  extraContext: string = ''
): Promise<any> => {
  try {
    const prompt = `
      You are the content engine for a multilingual high-end art website.
      I will provide a Persian title and description/context for a new ${type}.
      
      Your task:
      1. Translate the Title and Description into: English (en), French (fr), German (de), Russian (ru), Turkish (tr), Arabic (ar), and Chinese (zh).
      2. Ensure the tone is academic, philosophical, and sophisticated.
      3. For English fields, just use 'title' and 'description' (or 'excerpt'/'content' for journal, 'subtitle' for book).
      4. For other languages, append the code (e.g., title_fr, description_ru).
      5. Return ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json.
      
      Input Title (Persian): ${titleFa}
      Input Context/Description (Persian): ${inputFa}
      Extra Info: ${extraContext}

      Structure required based on type:
      
      IF ARTWORK:
      {
        "title": "...", "title_fa": "...", "title_fr": "...", ... (all langs),
        "description": "...", "description_fa": "...", ... (all langs),
        "technique": "...", "technique_fa": "...", ... (all langs) // Infer technique if possible
      }

      IF BOOK:
      {
        "title": "...", "title_fa": "...", ... (all langs),
        "subtitle": "...", "subtitle_fa": "...", ... (all langs),
        "description": "...", "description_fa": "...", ... (all langs)
      }

      IF JOURNAL:
      {
        "title": "...", "title_fa": "...", ... (all langs),
        "excerpt": "...", "excerpt_fa": "...", ... (all langs),
        "content": "..." // Generate a short essay body (approx 300 words) in English (content) and Persian (content_fa) only for now.
      }
    `;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const jsonText = response.text || "{}";
    // Clean up if markdown exists (safety check)
    const cleanJson = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("Gemini Translation Error:", error);
    throw new Error("Failed to generate multilingual data");
  }
};
