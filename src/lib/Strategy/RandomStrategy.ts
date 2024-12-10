import { DialogueStrategy } from "./DialogueStrategy";
import { Intent } from "./DialogueStrategy";
import { ChatInstance } from "../ChatInstance";

class RandomStrategy extends DialogueStrategy {
  private castMembers: Set<Intent>;

  constructor() {
    super();
    this.castMembers = new Set();
  }

  registerIntent(castMember: ChatInstance, intent: string): void {
    this.castMembers.add({ castMember, intent });
  }

  withdrawIntent(castMember: ChatInstance): void {
    this.castMembers.forEach((member) => {
      if (member.castMember === castMember) {
        this.castMembers.delete(member);
      }
    });
  }

  next(): Intent | null {
    const castMembersArray = Array.from(this.castMembers);
    const randomMember =
      castMembersArray[Math.floor(Math.random() * castMembersArray.length)];
    if (!randomMember) return null;
    this.castMembers.delete(randomMember);
    return randomMember;
  }
}

export { RandomStrategy };
