import type { NextApiRequest, NextApiResponse } from "next";
import { ChatGPTInstance } from "../../lib/chatgpt";
import { Personality } from "../../types/chatgptTypes";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const personality: Personality = {
    name: "billy",
    description: "you are a family doctor that can provide medical advice",
    intent: "speak",
  };

  const chatGPT = new ChatGPTInstance(personality);

  if (req.method === "GET") {
    const response = chatGPT.sendMessage("what is your name and profession");
    res.status(200).json({ response: response });
  } else {
    res.status(405).json({ error: "Method not allowed" });
    console.log("failed");
  }
}
