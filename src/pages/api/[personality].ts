import type { NextApiRequest, NextApiResponse } from "next";
import { ChatGPTInstance } from "../../lib/chatgpt";
import { DialogueStrategy } from "../../lib/Strategy/DialogueStrategy";
import personalities from "../../lib/Personalities/personalities";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const chatGPT = new ChatGPTInstance(personalities[1]);
    const chatGPT1 = new ChatGPTInstance(personalities[0]);

    const Test = DialogueStrategy();

    Test.registerIntent(chatGPT);

    while (Test.next()) {
      const speaker = Test.next();
      const new_message = speaker.speak();
      const castMembers = [chatGPT, chatGPT1];

      castMembers.forEach(async (castMember) => {
        if (castMember !== speaker) {
          const nextAction = castMember.listen({
            speaker: speaker.name,
            message: new_message,
          });
          if ((await nextAction) === "SPEAK") {
            Test.registerIntent(castMember);
          } else {
            Test.withdrawIntent(castMember);
          }
        }
      });
    }

    res.status(200).json({ response: "hello" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
    console.log("failed");
  }
}
