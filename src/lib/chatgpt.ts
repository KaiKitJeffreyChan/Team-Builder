import OpenAI from "openai";
import { Personality, Message } from "../types/chatgptTypes";

export class ChatGPTInstance {
  private personality: Personality;
  private conversationHistory: Message[];
  private client: OpenAI;

  constructor(personality: Personality) {
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.personality = personality;
    this.conversationHistory = [
      {
        role: "assistant",
        content: `
      - You are ${this.personality.name}. You are ${this.personality.description}.
      - You are going to work with other people and work towards a common goal which will be known later.
      - This is also a simulation, you are pretending to be a ${this.personality.name}. 
      - Do not break character.
    `,
      },
    ];
  }

  async sendMessage(message: string): Promise<void> {
    this.conversationHistory.push({
      role: "user",
      name: this.personality.name,
      content: message,
    });
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.conversationHistory,
        temperature: 1,
        max_tokens: 2048,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
        response_format: {
          type: "text",
        },
      });
      const gptResponse = response.choices[0].message.content;
      if (gptResponse === null) {
        throw new Error("Received null response from GPT");
      }
      console.log("GPT Response:", gptResponse);
      this.conversationHistory.push({
        role: "user",
        name: this.personality.name,
        content: gptResponse,
      });
    } catch (error) {
      console.error("Error during OpenAI API request:", error);
      throw error;
    }
  }

  getHistory(): Message[] {
    return this.conversationHistory;
  }

  resetConversation(): void {
    this.conversationHistory = [];
  }

  setIntent(intent: "speak" | "listen" | "advice"): void {
    this.personality.intent = intent;
  }
}
