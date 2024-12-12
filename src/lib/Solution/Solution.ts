export class Solution {
  private text: string | null;

  constructor(text: string | null = null) {
    this.text = text;
  }

  public updateSolution(newText: string): void {
    console.log("Updating solution with:", newText);
    const cleanedText = newText.trim().toLowerCase();
    if (
      cleanedText !== "" &&
      cleanedText !== "no response received from gemini ai"
    ) {
      this.text = cleanedText;
    }
  }

  public getSolution(): string {
    return this.text || "";
  }
}
