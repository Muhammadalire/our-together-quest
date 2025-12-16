
import { GoogleGenAI } from "@google/genai";

export const generateStory = async (prompt: string, partnerName: string, yourName: string) => {
  if (!process.env.API_KEY) {
    // This is a fallback for development.
    // In a real environment, the API_KEY should be set.
    return "API Key not found. Please ask your developer to configure it. For now, here's a placeholder story: Once upon a time, two wonderful people decided to build an app to celebrate their love. They completed quests, earned rewards, and lived happily ever after. The end.";
  }
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const fullPrompt = `${prompt} The story should be about a couple. One person is named ${partnerName}, and the other is ${yourName}. Make it romantic, sweet, and about 200 words long.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story with Gemini:", error);
    return "There was a little hiccup creating your story. Let's try again later! For now, know that our story is my favorite.";
  }
};
   