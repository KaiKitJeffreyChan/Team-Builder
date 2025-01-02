import React from "react";
import Agent from "./components/Agent";
import SimulationDetails from "./components/SimulationDetails";

interface Agent {
  name: string;
  description: string;
}

const FormComponent: React.FC = () => {
  const [agents, setAgents] = React.useState([] as Agent[]);
  const submitAgent = (name: string, description: string) => {
    setAgents([...agents, { name, description }]);
  };

  return (
    <div className="sm:p-32 h-full bg-primary p-10 flex flex-col font-shareTechMono">
      <div className="flex h-36">
        <p className="text-secHighlight text-lg">Current Cast:</p>
        {agents.map((agent) => (
          <Agent name={agent.name} description={agent.description}></Agent>
        ))}
      </div>
      <SimulationDetails submitAgent={submitAgent}></SimulationDetails>
    </div>
  );
};

export default FormComponent;
