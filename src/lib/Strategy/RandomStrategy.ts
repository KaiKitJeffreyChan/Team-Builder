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
    const castMembersArray = Array.from(this.castMembers);
    const randomMember =
      castMembersArray[Math.floor(Math.random() * castMembersArray.length)];
    if (!randomMember) return null;
    this.castMembers.delete(randomMember);
    return randomMember;
  }
}

export { RandomStrategy };
