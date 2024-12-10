import { Personality, Message } from "../types/ModelTypes";
import { ChatInstanceParams } from "../types/ModelTypes";
import { Solution } from "../lib/Solution/Solution";
import Model from "./Models/Model";

export class ChatInstance {
  private personality: Personality;
  private conversationHistory: Message[];
  private client: Model;
  private problem: string;

  private messageCount: number;
  private responseQueue: { speaker: string; message: string }[] = [];
  private isProcessingQueue: boolean = false;

  public SPEAK_ACTION = "speak";
  public LISTEN_ACTION = "listen";
  public SPEAKWITHEDIT_ACTION = "speakwithedit";

  private LISTEN_SYSTEM_PROMPT = `The next message is an inner thought. Respond with one of the options ["SPEAK", "LISTEN", "SPEAKWITHEDIT"].
  You must respond with exactly one of the options, without saying anything else.

  Say "SPEAK" if:
  - You want to continue the conversation; the conversation will end if all participants say "LISTEN".
  - You have something new to say or a new idea to introduce.
  - You want to speak without changing the solution. 
  - You want to ask a question or make a statement.
  - You want to clarify or elaborate on a point without changing the solution yet.
  - You want to respond to a question or comment.

  Say "LISTEN" if:
  - You are bored or don't find the topic interesting.
  - The conversation is wrapping up.
  - You have nothing new to say.
  - The conversation has been going on for a while;  you get tired the longer the conversation goes on
  
  Say "SPEAKWITHEDIT" if:
  - You are considering contributing a solution or improving upon an existing one.
  - The current solution is incomplete or could be enhanced with a better idea or perspective.
  - Someone else in the group has shared an idea worth incorporating, and you want to highlight or integrate it.
  - There is consensus or discussion that suggests the solution needs to evolve or change.
  - You want to refine, clarify, or optimize the solution to make it more effective.
  `;

  private LISTEN_USER_PROMPT = `What would you like to do next? Respond with one of the options ["SPEAK", "LISTEN", "SPEAKWITHEDIT"]`;

  private ADD_SOLUTION_PROMPT =
    "What would you like the new solution to be for the problem. Only add to the solution, not something you would say.?";

  constructor({
    personality,
    messageCount = 0,
    model,
    problem,
  }: ChatInstanceParams) {
    this.messageCount = messageCount;
    this.personality = personality;
    this.client = model;
    this.problem = problem;
    this.conversationHistory = [
      {
        role: "system",
        content: `
          - Your name is ${this.personality.name}. You are ${this.personality.description}.
          - You are meeting with the group for the first time.
          - Your objective is to solve this: ${this.problem}.
          - Once the solution is complete, try to end the conversation.
          - Only include natural language in your responses and do not include any content within the solution in your response.
          - Do not respond with more than one paragraph at a time.
          - Speak naturally as a human and do not sound robotic.
          - If the conversation is becoming repetitive, change the topic or end the conversation.
          - Do not respond in the form of a script.
          - Do not preface your response with your name.
          - Only talk to the people in your team, and do not break character.
        `,
      },
    ];
  }

  async listen(
    speaker: string,
    message: string,
    solution: Solution
  ): Promise<string> {
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
          {
            role: "system",
            content: `This is the current Solution ${solution.getSolution()}`,
          },
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
        case "speakwithedit":
          return this.SPEAKWITHEDIT_ACTION;
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
        name: this.personality.name,
        content: response,
      });
      this.messageCount++;

      return response;
    } catch (error) {
      console.error("Error during API request:", error);
      throw error;
    }
  }

  async editSolution(solution: Solution): Promise<string> {
    try {
      const response = await this.client.create({
        messages: [
          ...this.conversationHistory,
          {
            role: "system",
            content: `This is the current Solution ${solution.getSolution()}, ${
              this.ADD_SOLUTION_PROMPT
            }`,
          },
        ],
      });

      if (!response) throw new Error("Null response from GPT");

      this.addToConversationHistory({
        role: "user",
        content: `${this.personality.name} changed the solution to: ${response}`,
      });
      this.messageCount++;
      solution.updateSolution(response);
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

  getPersonality(): Personality {
    return this.personality;
  }

  getConversationHistory(): Message[] {
    return this.conversationHistory;
  }
}
