import { Message } from "@/types/ModelTypes";
import { OpenAI } from "openai";
import Model from "./Model";

class OpenAIChat extends Model {
  private client: OpenAI;
  constructor() {
    super();
    this.client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
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
        temperature: temperature,
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
