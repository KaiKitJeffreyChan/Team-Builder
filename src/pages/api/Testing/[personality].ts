import type { NextApiRequest, NextApiResponse } from "next";
import OpenAIChat from "@/lib/Models/OpenAIChat";
import GeminiAIChat from "@/lib/Models/GeminiAIChat";
import { ChatInstance } from "@/lib/ChatInstance";
import { RandomStrategy } from "@/lib/Strategy/RandomStrategy";
import { personalities, problem } from "@/lib/Personalities/personalities";
import { Solution } from "@/lib/Solution/Solution";
import { Intent } from "@/lib/Strategy/DialogueStrategy";
import { Personality } from "@/types/GeneralTypes";

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

const generateAgent = (personality: Personality) => {
  //   const chatGPT = new OpenAIChat();
  const geminiAI = new GeminiAIChat();
  return new ChatInstance({
    personality: personality,
    problem: problem,
    model: geminiAI,
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    const castMembers = personalities.map((personality) =>
      generateAgent(personality)
    );

    const Test = new RandomStrategy();
    const solution = new Solution();
    Test.registerIntent(castMembers[0], "speak");

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
