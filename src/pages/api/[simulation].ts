import { NextApiRequest, NextApiResponse } from "next";
import { ChatInstance } from "../../lib/ChatInstance";
import { Personality } from "../../types/GeneralTypes";
import OpenAIChat from "../../lib/Models/OpenAIChat";
import GeminiAIChat from "../../lib/Models/GeminiAIChat";
import { Server } from "socket.io";
import { personalities, problem } from "../../lib/Personalities/personalities";

import { NextApiResponseServerIo } from "../../types/GeneralTypes";
import { Intent } from "@/lib/Strategy/DialogueStrategy";
import { Solution } from "@/lib/Solution/Solution";
import { RandomStrategy } from "../../lib/Strategy/RandomStrategy";

const generateAgent = (
  personality: Personality,
  problem: string,
  modelType: "OpenAIChat" | "GeminiAIChat"
) => {
  const model =
    modelType === "OpenAIChat" ? new OpenAIChat() : new GeminiAIChat();
  return new ChatInstance({
    personality: personality,
    problem: problem,
    model: model,
  });
};

const getIncomingMessage = (
  speaker: Intent,
  new_message: string,
  solution: Solution
) => {
  return {
    speaker: speaker.castMember.getPersonality().name,
    message: new_message,
    intent: speaker.intent,
    solution: solution.getSolution(),
  };
};

const handler = (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method === "POST") {
    console.log(personalities);
    const castMembers: ChatInstance[] = personalities.map(
      (personality: Personality) =>
        generateAgent(personality, req.body.problem, req.body.model)
    );

    // Open socket for chat
    const io = new Server((res.socket as any).server);

    io.on("connection", async (socket) => {
      console.log("Client connected");
      console.log("here");

      const communicationMethod =
        // Will add more strategies in the future
        req.body.communicationMethod === "Random"
          ? new RandomStrategy()
          : new RandomStrategy();

      const solution = new Solution();
      communicationMethod.registerIntent(castMembers[0], "speak");
      let speaker: Intent | null = null;

      while ((speaker = communicationMethod.next())) {
        let new_message = "";
        if (speaker.intent === "speak") {
          new_message = await speaker.castMember.speak();
        } else if (speaker.intent === "speakwithedit") {
          new_message = await (speaker.castMember.speak() as unknown as string);
          speaker.castMember.editSolution(solution);
        }

        const message = getIncomingMessage(speaker, new_message, solution);
        socket.emit("message", message);
        for (const castMember of castMembers) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          if (castMember !== speaker.castMember) {
            const nextAction = await castMember.listen(
              speaker.castMember.getPersonality().name,
              new_message,
              solution
            );
            if (nextAction === "speak") {
              communicationMethod.registerIntent(castMember, "speak");
            } else if (nextAction === "speakwithedit") {
              communicationMethod.registerIntent(castMember, "speakwithedit");
            } else {
              communicationMethod.withdrawIntent(castMember);
            }
          }
        }
      }
      socket.emit("solution", solution.getSolution());
      socket.on("disconnect", () => {
        console.log("Client disconnected");
      });
    });

    (res.socket as any).server.io = io;

    res.status(200).json({ message: "POST request received" });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
