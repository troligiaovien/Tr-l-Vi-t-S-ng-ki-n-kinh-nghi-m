import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";

export class GeminiService {
  private ai: GoogleGenerativeAI;

  constructor() {
    // Đảm bảo trên Vercel bạn đặt tên biến là API_KEY
    const apiKey = process.env.API_KEY || "";
    this.ai = new GoogleGenerativeAI(apiKey);
  }

  async generateSKKNContent(prompt: string, history: any[] = []) {
    try {
      const model = this.ai.getGenerativeModel({ 
        model: 'gemini-1.5-pro',
        systemInstruction: SYSTEM_INSTRUCTION 
      });

      const chat = model.startChat({
        history: history.map(h => ({ role: h.role, parts: h.parts })),
        generationConfig: {
          temperature: 0.65,
          topP: 0.95,
          topK: 40,
        },
      });

      const result = await chat.sendMessageStream(prompt);
      return result.stream;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  async extractStructureFromFile(base64Data?: string, mimeType?: string, textContent?: string): Promise<string> {
    try {
      const model = this.ai.getGenerativeModel({ model: 'gemini-1.5-pro' });
      const parts: any[] = [];
      
      if (textContent) {
        parts.push({ text: `Nội dung văn bản được trích xuất: \n\n${textContent}` });
      } else if (base64Data && mimeType) {
        parts.push({
          inlineData: { data: base64Data, mimeType: mimeType }
        });
      }

      parts.push({
        text: "Hãy trích xuất khung cấu trúc (dàn ý) của tài liệu này. Chỉ trả về các đầu mục. Định dạng văn bản thuần túy."
      });

      const result = await model.generateContent({ contents: [{ role: 'user', parts }] });
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("Extraction Error:", error);
      throw error;
    }
  }
}

export const geminiService = new GeminiService();
