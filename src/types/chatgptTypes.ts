export interface Personality {
  name?: string;
  description: string;
  intent: "speak" | "listen" | "advice";
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}
