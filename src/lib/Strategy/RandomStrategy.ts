import { DialogueStrategy } from "./DialogueStrategy";
import { ChatInstance } from "../ChatInstance";

class RandomStrategy extends DialogueStrategy {
  private castMembers: Set<any>;

  constructor() {
    super();
    this.castMembers = new Set();
  }

  registerIntent(castMember: ChatInstance): void {
    this.castMembers.add(castMember);
  }

  withdrawIntent(castMember: ChatInstance): void {
    this.castMembers.delete(castMember);
  }

  next(): ChatInstance | null {
    const castMembersArray = Array.from(this.castMembers);
    const randomMember =
      castMembersArray[Math.floor(Math.random() * castMembersArray.length)];
    if (!randomMember) return null;
    this.castMembers.delete(randomMember);
    return randomMember;
  }
}

export { RandomStrategy };
