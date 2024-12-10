import type { NextApiRequest, NextApiResponse } from "next";
import OpenAIChat from "../../lib/Models/OpenAIChat";
import GeminiAIChat from "../../lib/Models/GeminiAIChat";
import { ChatInstance } from "@/lib/ChatInstance";
import { RandomStrategy } from "../../lib/Strategy/RandomStrategy";
import { personalities, problem } from "../../lib/Personalities/personalities";
import { Solution } from "@/lib/Solution/Solution";
import { Intent } from "@/lib/Strategy/DialogueStrategy";

const LogDetails = (
  speaker: Intent,
  new_message: string,
  solution: Solution
) => {
  console.log("__________________________");
  console.log(
    `NEW MESSAGE BY ${speaker.castMember.getPersonality().name} with intent: ${
      speaker.intent
    }`,
    new_message
  );
  console.log("SOLUTION:", solution.getSolution());
  console.log("__________________________");
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    // const chatGPT = new OpenAIChat();
    const geminiAI = new GeminiAIChat();

    const person1 = new ChatInstance({
      personality: personalities[0],
      problem: problem,
      model: geminiAI,
    });
    const person2 = new ChatInstance({
      personality: personalities[1],
      problem: problem,
      model: geminiAI,
    });
    const person3 = new ChatInstance({
      personality: personalities[2],
      problem: problem,
      model: geminiAI,
    });

    const castMembers = [person1, person2, person3];
    const Test = new RandomStrategy();
    const solution = new Solution();
    Test.registerIntent(person1, "speak");

    let speaker: Intent | null = null;

    while ((speaker = Test.next())) {
      let new_message = "";
      if (speaker.intent === "speak") {
        new_message = await (speaker.castMember.speak() as unknown as string);
      } else if (speaker.intent === "speakwithedit") {
        new_message = await (speaker.castMember.speak() as unknown as string);
        speaker.castMember.editSolution(solution);
      }

      LogDetails(speaker, new_message, solution);

      for (const castMember of castMembers) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        if (castMember !== speaker.castMember) {
          const nextAction = await castMember.listen(
            speaker.castMember.getPersonality().name,
            new_message,
            solution
          );
          if (nextAction === "speak") {
            Test.registerIntent(castMember, "speak");
          } else if (nextAction === "speakwithedit") {
            Test.registerIntent(castMember, "speakwithedit");
          } else {
            Test.withdrawIntent(castMember);
          }
        }
      }
    }

    console.log(`SOLUTION: ${solution.getSolution()}`);
    res.status(200).json({ response: "hello" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
    console.log("failed");
  }
}
