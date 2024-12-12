import { Personality } from "../../types/GeneralTypes";

const personalities: Personality[] = [
  {
    name: "ALEX",
    description: "Your favorite anime is dragon ball Z",
  },
  {
    name: "JOHN",
    description: "You confuse DND with pathfinder.",
  },
];

const problem: string = `
  Create the worst DND character possible
`;

export { personalities, problem };
