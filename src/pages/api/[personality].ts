import type { NextApiRequest, NextApiResponse } from "next";
import OpenAIChat from "../../lib/Models/OpenAIChat";
import GeminiAIChat from "../../lib/Models/GeminiAIChat";
import { ChatInstance } from "@/lib/ChatInstance";
import { RandomStrategy } from "../../lib/Strategy/RandomStrategy";
import { personalities, problem } from "../../lib/Personalities/personalities";
import { Solution } from "@/lib/Solution/Solution";
import next from "next";

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
    const solutionInstance = new Solution();

    Test.registerIntent(person1);
    let speaker: ChatInstance | null = null;

    while ((speaker = Test.next())) {
      const new_message: string = await (speaker.speak() as unknown as string);
      console.log("__________________________");
      console.log(
        `NEW MESSAGE BY : ${speaker.getPersonality().name}`,
        new_message
      );
      console.log("SOLUTION: ", solutionInstance.getSolution());
      console.log("__________________________");

      for (const castMember of castMembers) {
        await new Promise((resolve) => setTimeout(resolve, 10000));
        if (castMember !== speaker) {
          const nextAction = await castMember.listen(
            speaker.getPersonality().name,
            new_message,
            solutionInstance
          );
          console.log(castMember.getPersonality().name, nextAction);
          if (nextAction === "speak") {
            Test.registerIntent(castMember);
          } else if (nextAction === "speakwithedit") {
            console.log("SPEAKING WITH EDIT");
            Test.registerIntent(castMember);
            castMember.editSolution(solutionInstance);
          } else {
            Test.withdrawIntent(castMember);
          }
        }
      }
    }

    console.log(solutionInstance.getSolution());
    res.status(200).json({ response: "hello" });
  } else {
    res.status(405).json({ error: "Method not allowed" });
    console.log("failed");
  }
}
