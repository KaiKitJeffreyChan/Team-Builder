import { DialogueStrategy } from "./DialogueStrategy";
import { ChatGPTInstance } from "../../lib/chatgpt";

class RandomStrategy extends DialogueStrategy {
  private castMembers: Set<any>;

  constructor() {
    super();
    this.castMembers = new Set();
  }

  registerIntent(castMember: ChatGPTInstance): void {
    this.castMembers.add(castMember);
  }

  withdrawIntent(castMember: ChatGPTInstance): void {
    this.castMembers.delete(castMember);
  }

  next(): ChatGPTInstance | null {
    const membersArray = Array.from(this.castMembers);
    if (membersArray.length === 0) {
      return null;
    }
    const randomIndex = Math.floor(Math.random() * membersArray.length);
    return membersArray[randomIndex];
  }
}

export { RandomStrategy };
