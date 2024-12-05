import { Message } from "@/types/ModelTypes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Model from "./Model";

class GeminiAIChat extends Model {
  private genAI: GoogleGenerativeAI;
  private model: any;

  constructor() {
    super();
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  }

  async create({ messages }: { messages: Message[] }): Promise<string> {
    try {
      const formattedMessages = messages.map((message) => message.content);
      const response = await this.model.generateContent(formattedMessages);
      return response.response.text() || "No response received from Gemini AI";
    } catch (error) {
      console.error("Error in GeminiAIChat.create:", error);
      throw new Error("Failed to generate content with Gemini AI");
    }
  }
}

export default GeminiAIChat;
