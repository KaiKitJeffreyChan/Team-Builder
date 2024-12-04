import Model from "../lib/Models/Model";

export interface Personality {
  name: string;
  description: string;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

export interface ChatInstanceParams {
  personality: Personality;
  messageCount?: number;
  model: Model;
}
