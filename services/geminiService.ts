import { GoogleGenerativeAI } from "@google/generative-ai";

// Lấy API Key từ biến môi trường của Vercel
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY || "");

export const geminiService = {
  async generateSKKNContent(prompt: string, history: any[] = []) {
    try {
      // Sử dụng model ổn định nhất hiện nay
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: history.map(h => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.parts[0].text }],
        })),
      });

      const result = await chat.sendMessage(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }
};
