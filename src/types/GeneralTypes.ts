import Model from "../lib/Models/Model";
import { NextApiResponse } from "next";
import { Socket } from "socket.io";
import { Server as SocketIOServer } from "socket.io";
import { Server } from "http";

export interface Personality {
  name: string;
  description: string;
}

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
  name?: string;
}

export interface ChatInstanceParams {
  personality: Personality;
  messageCount?: number;
  model: Model;
  problem: string;
}

export type NextApiResponseServerIo = NextApiResponse & {
  socket: Socket & {
    server: Server & {
      io: SocketIOServer;
    };
  };
};
