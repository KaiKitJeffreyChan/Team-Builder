import { DialogueStrategy } from "./DialogueStrategy";

class RandomStrategy extends DialogueStrategy {
  private castMembers: Set<any>;

  constructor() {
    super();
    this.castMembers = new Set();
  }

  registerIntent(castMember: any): void {
    this.castMembers.add(castMember);
  }

  withdrawIntent(castMember: any): void {
    this.castMembers.delete(castMember);
  }

  next(): any {
    const castMembersArray = Array.from(this.castMembers);
    const randomMember =
      castMembersArray[Math.floor(Math.random() * castMembersArray.length)];
    if (!randomMember) return null;
    this.castMembers.delete(randomMember);
    return randomMember;
  }
}

export { RandomStrategy };
