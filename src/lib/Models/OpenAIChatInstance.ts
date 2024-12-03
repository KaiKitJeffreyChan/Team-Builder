import OpenAI from "openai";
import { ChatModelInstance } from "./ChatModelInstance";
import { Personality, Message } from "../../types/chatgptTypes";

export class OpenAIChatInstance extends ChatModelInstance {
  private client: OpenAI;
  private responseQueue: { speaker: string; message: string }[] = [];
  private isProcessingQueue: boolean = false;
  public SPEAK_ACTION = "speak";
  public LISTEN_ACTION = "listen";

  constructor(personality: Personality) {
    super(personality);
    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async listen(speaker: string, message: string): Promise<string> {
    // Add user message to conversation history
    this.addToConversationHistory({
      role: "user",
      name: speaker,
      content: message,
    });

    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...this.conversationHistory,
          { role: "system", content: this.returnCountMessages() },
          { role: "system", name: speaker, content: this.LISTEN_SYSTEM_PROMPT },
          { role: "user", content: this.LISTEN_USER_PROMPT },
        ],
        temperature: 1,
      });

      const intent = response.choices[0].message.content;
      console.log(speaker, intent);
      switch (intent) {
        case "SPEAK":
          return this.SPEAK_ACTION;
        case "LISTEN":
          return this.LISTEN_ACTION;
        default:
          return `Invalid intent ${intent}`;
      }
    } catch (error) {
      console.error("Error during OpenAI API request:", error);
      throw error;
    }
  }

  async speak(): Promise<string> {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.conversationHistory,
        temperature: 1,
      });

      const gptResponse = response.choices[0].message.content;
      if (!gptResponse) throw new Error("Null response from GPT");

      this.addToConversationHistory({
        role: "user",
        content: gptResponse,
      });

      this.responseQueue.push({
        speaker: this.personality.name,
        message: gptResponse,
      });
      this.processQueue();

      return gptResponse;
    } catch (error) {
      console.error("Error during OpenAI API request:", error);
      throw error;
    }
  }

  private async processQueue() {
    if (this.isProcessingQueue) return;
    this.isProcessingQueue = true;

    while (this.responseQueue.length > 0) {
      const { speaker, message } = this.responseQueue.shift()!;
      // Can send messages to frontend via web socket here
      console.log("-------------------------");
      console.log(speaker, message);
      console.log("-------------------------");
    }

    this.isProcessingQueue = false;
  }
}
