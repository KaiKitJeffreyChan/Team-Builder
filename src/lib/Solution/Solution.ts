export class Solution {
  private text: string | null;

  constructor(text: string | null = null) {
    this.text = text;
  }

  public updateSolution(newText: string): void {
    this.text = newText;
  }

  public getSolution(): string {
    return this.text || "";
  }
}
