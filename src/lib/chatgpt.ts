import OpenAI from "openai";
import { Personality, Message } from "../types/chatgptTypes";

export class ChatGPTInstance {
  private personality: Personality;
  private conversationHistory: Message[];
  private client: OpenAI;

  LISTEN_SYSTEM_PROMPT = `The next message is an inner thought. Respond with one of the options ["SPEAK", "LISTEN"].
    You must respond with exactly one of the options, without saying anything else.

    Say "SPEAK" if:
    - You want to continue the conversation; the conversation will end if all participants say "LISTEN".
    - You have something new to say or a new idea to introduce.
    - You want to respond to a question or comment.

    Say "LISTEN" if:
    - You are bored or don't find the topic interesting.
    - The conversation is wrapping up.
    - You have nothing new to say.
    - The conversation has been going on for a while; you get`;

  LISTEN_USER_PROMPT = `What would you like to do next`;

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

  listen = async ({
    message,
    speaker,
  }: {
    message: string;
    speaker: string;
  }): Promise<string> => {
    // add user message to conversation history
    this.conversationHistory.push({
      role: "user",
      name: speaker,
      content: message,
    });
    try {
      // listen to the new message and ask agent for next action
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          ...this.conversationHistory,
          { role: "system", name: speaker, content: this.LISTEN_SYSTEM_PROMPT },
          { role: "user", content: this.LISTEN_USER_PROMPT },
        ],
        temperature: 1,
        response_format: {
          type: "text",
        },
      });
      const gptResponse = response.choices[0].message.content;
      console.log("GPT Response:", gptResponse);

      switch (gptResponse) {
        case null:
          throw new Error("Received null response from GPT");
        case "SPEAK":
          await this.speak();
          break;
        case "LISTEN":
          await this.listen({ message, speaker });
          break;
        default:
          console.log("Unexpected response:", gptResponse);
      }

      return gptResponse;
    } catch (error) {
      console.error("Error during OpenAI API request:", error);
      throw error;
    }
  };

  speak = async (): Promise<void> => {
    try {
      const response = await this.client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: this.conversationHistory,
        temperature: 1,
        response_format: {
          type: "text",
        },
      });
      const gptResponse = response.choices[0].message.content;
      if (gptResponse === null) {
        throw new Error("Received null response from GPT");
      }
      this.conversationHistory.push({
        role: "assistant",
        content: gptResponse,
      });
    } catch (error) {
      console.error("Error during OpenAI API request:", error);
      throw error;
    }
  };
}
