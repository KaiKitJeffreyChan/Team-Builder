import { DialogueStrategy } from "./DialogueStrategy";
import { OpenAIChatInstance } from "../Models/OpenAIChatInstance";

class RandomStrategy extends DialogueStrategy {
  private castMembers: Set<any>;

  constructor() {
    super();
    this.castMembers = new Set();
  }

  registerIntent(castMember: OpenAIChatInstance): void {
    this.castMembers.add(castMember);
  }

  withdrawIntent(castMember: OpenAIChatInstance): void {
    this.castMembers.delete(castMember);
  }

  next(): OpenAIChatInstance | null {
    const membersArray = Array.from(this.castMembers);
    if (membersArray.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * membersArray.length);
    return membersArray[randomIndex];
  }
}

export { RandomStrategy };
