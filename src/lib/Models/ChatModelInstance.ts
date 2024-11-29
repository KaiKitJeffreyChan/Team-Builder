import { Personality, Message } from "../../types/chatgptTypes";

export abstract class ChatModelInstance {
  protected personality: Personality;
  protected conversationHistory: Message[];

  protected LISTEN_SYSTEM_PROMPT = `The next message is an inner thought. Respond with one of the options ["SPEAK", "LISTEN"].
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

  protected LISTEN_USER_PROMPT = `What would you like to do next? Respond with one of the options ["SPEAK", "LISTEN"]`;

  constructor(personality: Personality) {
    this.personality = personality;
    this.conversationHistory = [
      {
        role: "system",
        content: `
          - You are ${this.personality.name}. You are ${this.personality.description}.
          - You are meeting with the group for the first time.
          - Do not respond with more than one paragraph at a time.
          - Speak naturally as a human and do not sound robotic.
          - If the conversation is becoming repetitive, change the topic or end the conversation.
          - Do not respond in the form of a script.
          - Do not repeat the same information multiple times or revisit the same topic unless necessary.
          - If the topic of the conversation is persiting too long, introduce a new topic or try to end the conversation
          - Do not break character.
        `,
      },
    ];
  }

  abstract listen(message: string, speaker: string): Promise<string>;
  abstract speak(): Promise<string>;

  getPersonality(): Personality {
    return this.personality;
  }

  protected addToConversationHistory(message: Message) {
    this.conversationHistory.push(message);
  }
}
