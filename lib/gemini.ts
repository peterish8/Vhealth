import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function getGeminiResponse(prompt: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini API:', error);
    throw error;
  }
}

export async function getGeminiVisionResponse(prompt: string, imageUrl: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    const result = await model.generateContent([prompt, imageUrl]);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in Gemini Vision API:', error);
    throw error;
  }
}