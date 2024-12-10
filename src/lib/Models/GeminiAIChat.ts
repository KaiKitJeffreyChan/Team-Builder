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

  // Right now i dont think the messages are being detected as system or user
  async create({ messages }: { messages: Message[] }): Promise<string> {
    try {
      const formattedMessages = messages.map((message) => {
        switch (message.role) {
          case "system":
            return { role: "model", parts: { text: message.content } };
          case "user":
            return { role: "user", parts: { text: message.content } };
          // case "assistant":
          //   return { role: "assistant", parts: message.content };
          default:
            throw new Error(`Unsupported role: ${message.role}`);
        }
      });
      console.log(formattedMessages);
      const response = await this.model.generateContent({
        contents: formattedMessages,
      });
      return response.response.text() || "No response received from Gemini AI";
    } catch (error) {
      console.error("Error in GeminiAIChat.create:", error);
      throw new Error("Failed to generate content with Gemini AI");
    }
  }
}

export default GeminiAIChat;
