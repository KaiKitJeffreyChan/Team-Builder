import type { NextApiRequest, NextApiResponse } from "next";
import OpenAIChat from "../../lib/Models/OpenAIChat";
import GeminiAIChat from "../../lib/Models/GeminiAIChat";
import { ChatInstance } from "@/lib/ChatInstance";
import { RandomStrategy } from "../../lib/Strategy/RandomStrategy";
import personalities from "../../lib/Personalities/personalities";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const chatGPT = new OpenAIChat();
    const geminiAI = new GeminiAIChat();

    const person1 = new ChatInstance({
      personality: personalities[0],
      model: chatGPT,
    });
    const person2 = new ChatInstance({
      personality: personalities[1],
      model: geminiAI,
    });

    const castMembers = [person1, person2];
    const Test = new RandomStrategy();

    Test.registerIntent(person1);
    let speaker: ChatInstance | null = null;

    while ((speaker = Test.next())) {
      const new_message: string = await (speaker.speak() as unknown as string);
      for (const castMember of castMembers) {
        if (castMember !== speaker) {
          const nextAction = await castMember.listen(
            speaker.getPersonality().name,
            new_message
          );
          if (nextAction === "speak") {
            Test.registerIntent(castMember);
          } else {
            Test.withdrawIntent(castMember);
          }
        }
      }
    }
    res.status(200).json({ response: "hello" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
    console.log("failed");
  }
}
