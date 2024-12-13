import { NextApiRequest, NextApiResponse } from "next";
import { Server as IOServer } from "socket.io";
import { NextApiResponseServerIo } from "../../types/GeneralTypes";
import { ChatInstance } from "../../lib/ChatInstance";
import { Personality } from "../../types/GeneralTypes";
import OpenAIChat from "../../lib/Models/OpenAIChat";
import GeminiAIChat from "../../lib/Models/GeminiAIChat";
import { personalities, problem } from "../../lib/Personalities/personalities";
import { Intent } from "@/lib/Strategy/DialogueStrategy";
import { Solution } from "@/lib/Solution/Solution";
import { RandomStrategy } from "../../lib/Strategy/RandomStrategy";

const generateAgent = (
  personality: Personality,
  problem: string,
  modelType: "OpenAIChat" | "GeminiAIChat"
) => {
  // const model =
  //   modelType === "OpenAIChat" ? new OpenAIChat() : new GeminiAIChat();
  const model = new GeminiAIChat();
  return new ChatInstance({
    personality,
    problem,
    model,
  });
};

const getIncomingMessage = (
  speaker: Intent,
  new_message: string,
  solution: Solution
) => {
  const returnMessage = {
    speaker: speaker.castMember.getPersonality().name,
    message: new_message,
    intent: speaker.intent,
    solution: solution.getSolution(),
  };
  // console.log(returnMessage);
  return returnMessage;
};

const handler = async (req: NextApiRequest, res: NextApiResponseServerIo) => {
  if (req.method === "POST") {
    if (!(res.socket as any).server.io) {
      console.log("Initializing Socket.IO...");
      const io = new IOServer((res.socket as any).server);

      (res.socket as any).server.io = io;

      io.on("connection", (socket) => {
        console.log("Client connected");

        socket.on("disconnect", () => {
          console.log("Client disconnected");
        });
      });
    }
    const { model, communicationMethod } = req.body;

    const castMembers: ChatInstance[] = personalities.map((personality) =>
      generateAgent(personality, problem, model)
    );

    const io = (res.socket as any).server.io;

    const communicationStrategy =
      communicationMethod === "Random"
        ? new RandomStrategy()
        : new RandomStrategy();

    const solution = new Solution();

    communicationStrategy.registerIntent(castMembers[0], "speak");

    interface IncomingMessage {
      speaker: string;
      message: string;
      intent: string;
      solution: string;
    }

    io.on("connection", async (socket: any) => {
      let speaker: Intent | null = null;

      while ((speaker = communicationStrategy.next())) {
        let newMessage = "";

        if (speaker.intent === "speak") {
          newMessage = await speaker.castMember.speak();
        } else if (speaker.intent === "speakwithedit") {
          newMessage = await speaker.castMember.speak();
          speaker.castMember.editSolution(solution);
        }

        const message: IncomingMessage = getIncomingMessage(
          speaker,
          newMessage,
          solution
        );

        socket.emit("message", message);
        socket.emit("solution", solution.getSolution());

        for (const castMember of castMembers) {
          await new Promise((resolve) => setTimeout(resolve, 10000));
          if (castMember !== speaker.castMember) {
            const nextAction: string = await castMember.listen(
              speaker.castMember.getPersonality().name,
              newMessage,
              solution
            );
            console.log(castMember.getPersonality().name, nextAction);

            if (nextAction === "speak") {
              communicationStrategy.registerIntent(castMember, "speak");
            } else if (nextAction === "speakwithedit") {
              communicationStrategy.registerIntent(castMember, "speakwithedit");
            } else {
              communicationStrategy.withdrawIntent(castMember);
            }
          }
        }
      }
    });
    res.status(200).end();
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};

export default handler;
