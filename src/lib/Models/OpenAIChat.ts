import { Message } from "@/types/ModelTypes";
import { OpenAI } from "openai";
import Model from "./Model";

class OpenAIChat extends Model {
  private client: OpenAI;
  constructor() {
    super();
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set.");
    }
    this.client = new OpenAI({ apiKey: apiKey });
  }

  async create({
    messages,
    temperature,
  }: {
    messages: Message[];
    temperature: number;
  }): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: temperature || Math.random() * 0.5 + 0.5,
      });
      const content = response.choices[0].message.content;

      return content || "Received null content from OpenAI API";
    } catch (error) {
      console.error("Error in OpenAIChat.create:", error);
      throw new Error("Failed to generate content with OpenAI");
    }
  }
}

export default OpenAIChat;
