import { ChatInstance } from "../ChatInstance";

export interface Intent {
  castMember: ChatInstance;
  intent: string;
}

export class DialogueStrategy {
  registerIntent(castMember: ChatInstance, intent: string): void {
    throw new Error("Not implemented");
  }

  withdrawIntent(castMember: ChatInstance): void {
    throw new Error("Not implemented");
  }

  next(): void {
    throw new Error("Not implemented");
  }
}
