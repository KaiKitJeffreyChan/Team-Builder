import { Message } from "../../types/ModelTypes";

abstract class Model {
  constructor() {}

  abstract create({
    messages,
  }: {
    messages: Message[];
    temperature: number;
  }): Promise<string>;
}

export default Model;
