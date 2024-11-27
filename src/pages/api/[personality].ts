import type { NextApiRequest, NextApiResponse } from "next";
import { ChatGPTInstance } from "../../lib/chatgpt";
import { RandomStrategy } from "../../lib/Strategy/RandomStrategy";
import personalities from "../../lib/Personalities/personalities";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const chatGPT = new ChatGPTInstance(personalities[1]);
    const chatGPT1 = new ChatGPTInstance(personalities[0]);
    const castMembers = [chatGPT, chatGPT1];
    const Test = new RandomStrategy();

    Test.registerIntent(chatGPT);
    let speaker: ChatGPTInstance | null = null;

    while ((speaker = Test.next()) !== null) {
      const new_message: string = await (speaker.speak() as unknown as string);

      for (const castMember of castMembers) {
        if (castMember !== speaker) {
          const nextAction = await castMember.listen({
            speaker: speaker.getPersonality().name,
            message: new_message,
          });
          if (nextAction === "SPEAK") {
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
