import { Personality, Message } from "../types/ModelTypes";
import { ChatInstanceParams } from "../types/ModelTypes";
import Model from "./Models/Model";

export class ChatInstance {
  private personality: Personality;
  private conversationHistory: Message[];
  private client: Model;

  private messageCount: number;
  private responseQueue: { speaker: string; message: string }[] = [];
  private isProcessingQueue: boolean = false;

  public SPEAK_ACTION = "speak";
  public LISTEN_ACTION = "listen";

  private LISTEN_SYSTEM_PROMPT = `The next message is an inner thought. Respond with one of the options ["SPEAK", "LISTEN"].
  You must respond with exactly one of the options, without saying anything else.

  Say "SPEAK" if:
  - You want to continue the conversation; the conversation will end if all participants say "LISTEN".
  - You have something new to say or a new idea to introduce.
  - You want to respond to a question or comment.

  Say "LISTEN" if:
  - You are bored or don't find the topic interesting.
  - The conversation is wrapping up.
  - You have nothing new to say.
  - The conversation has been going on for a while;  you get tired the longer the conversation goes on`;

  private LISTEN_USER_PROMPT = `What would you like to do next? Respond with one of the options ["SPEAK", "LISTEN"]`;

  constructor({ personality, messageCount = 0, model }: ChatInstanceParams) {
    this.messageCount = messageCount;
    this.personality = personality;
    this.client = model;
    this.conversationHistory = [
      {
        role: "system",
        content: `
          - You are ${this.personality.name}. You are ${this.personality.description}.
          - You must wrap up your conversation within 15 messages in total.
          - You are meeting with the group for the first time.
          - Do not respond with more than one paragraph at a time.
          - Speak naturally as a human and do not sound robotic.
          - If the conversation is becoming repetitive, change the topic or end the conversation.
          - Do not respond in the form of a script.
          - Do not break character.
        `,
      },
    ];
  }

  async listen(speaker: string, message: string): Promise<string> {
    // Add user message to conversation history
    this.addToConversationHistory({
      role: "user",
      name: speaker,
      content: message,
    });

    try {
      const intent = await this.client.create({
        messages: [
          ...this.conversationHistory,
          { role: "system", content: this.returnCountMessages() },
          { role: "system", name: speaker, content: this.LISTEN_SYSTEM_PROMPT },
          { role: "user", content: this.LISTEN_USER_PROMPT },
        ],
        temperature: 1,
      });

      switch (intent.trim().toLowerCase()) {
        case "speak":
          return this.SPEAK_ACTION;
        case "listen":
          return this.LISTEN_ACTION;
        default:
          return `invalid intent ${intent}`;
      }
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  }

  async speak(): Promise<string> {
    try {
      const response = await this.client.create({
        messages: this.conversationHistory,
        temperature: 1,
      });

      if (!response) throw new Error("Null response from GPT");

      this.addToConversationHistory({
        role: "user",
        content: response,
      });
      this.messageCount++;
      this.responseQueue.push({
        speaker: this.personality.name,
        message: response,
      });
      this.processQueue();

      return response;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  }

  private addToConversationHistory(message: Message) {
    this.conversationHistory.push(message);
  }

  private returnCountMessages(): string {
    return `There has been a total of ${this.messageCount} messages so far.`;
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

  getPersonality(): Personality {
    return this.personality;
  }
}
