import { Message } from "@/types/ModelTypes";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Model from "./Model";

class GeminiAIChat extends Model {
  private genAI: GoogleGenerativeAI;
  private model: any;
  private maxOutputTokens: number;

  constructor(temperature?: number, maxOutputTokens: number = 8192) {
    super();
    this.maxOutputTokens = maxOutputTokens;
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not set.");
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: temperature || Math.random() * 0.5 + 0.5,
      },
    });
  }

  async create({
    messages,
  }: {
    messages: Message[];
    speaker: string;
  }): Promise<string> {
    try {
      const formattedMessages = messages.map((message) => {
        switch (message.role) {
          case "system":
            return { role: "model", parts: { text: message.content } };
          case "user":
            return {
              role: "user",
              parts: { text: `${message.name}: ${message.content}` },
            };
          default:
            throw new Error(`Unsupported role: ${message.role}`);
        }
      });
      const response = await this.model.generateContent({
        contents: formattedMessages,
        generationConfig: {
          maxOutputTokens: this.maxOutputTokens,
        },
      });
      return (
        response.response
          .text()
          .replace(/^[A-Za-z]+:/, "")
          .trim() || "No response received from Gemini AI"
      );
    } catch (error) {
      console.error("Error in GeminiAIChat.create:", error);
      throw new Error("Failed to generate content with Gemini AI");
    }
  }
}

export default GeminiAIChat;
