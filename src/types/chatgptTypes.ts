export interface Personality {
  name?: string;
  description: string;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}
