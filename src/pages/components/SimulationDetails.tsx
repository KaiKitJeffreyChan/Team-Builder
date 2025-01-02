import { useEffect, useState } from "react";

interface AgentDetailsI {
  submitAgent: (name: string, description: string) => void;
}

const AgentDetails: React.FC<AgentDetailsI> = ({ submitAgent }) => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  return (
    <form className="flex flex-col text-secHighlight">
      <div>
        <div className="flex flex-col mb-4">
          <label className="my-1">Name:</label>
          <input
            className="bg-secHighlight outline-none rounded-sm p-2 text-black"
            type="text"
            id="name"
            name="name"
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="flex flex-col">
          <label className="my-1">Description:</label>
          <textarea
            className="bg-secHighlight p-2 h-32 resize-none text-black rounded-sm outline-none"
            id="description"
            name="description"
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className="flex justify-between">
        <div></div>
        <button
          type="button"
          onClick={() => submitAgent(name, description)}
          className="my-3 bg-secondary px-3 py-1 rounded hover:bg-primHighlight hover:text-white"
        >
          Add Agent
        </button>
      </div>
      <div className="flex flex-col">
        <div className="flex flex-col mb-4"></div>
        <label className="my-1">Problem Statement:</label>
        <textarea
          className="bg-secHighlight p-2 h-32 resize-none text-black rounded-sm outline-none"
          id="problemStatement"
          name="problemStatement"
        ></textarea>
      </div>
      <button className="button my-3 bg-secondary px-3 py-1 rounded hover:bg-primHighlight hover:text-white">
        RUN IT{" "}
      </button>
    </form>
  );
};

export default AgentDetails;
