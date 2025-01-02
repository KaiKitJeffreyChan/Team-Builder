import React from "react";

interface AgentPropsI {
  name: string;
  description: string;
}

const Agent: React.FC<AgentPropsI> = ({ name }) => {
  return (
    <div key={name} className="flex flex-col">
      <p>{name}</p>
    </div>
  );
};

export default Agent;
