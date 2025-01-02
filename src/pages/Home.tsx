import React from "react";

const Home: React.FC = () => {
  return (
    <div className="bg-primary h-screen flex items-center p-48 font-shareTechMono">
      <div className="flex flex-col text-secHighlight text-lg cursor-pointer">
        <h1
          onClick={() => (window.location.href = "/SimDetails")}
          className="button"
        >
          Create Simulation{" "}
        </h1>

        <h1 onClick={() => (window.location.href = "/Info")} className="button">
          What Is This{" "}
        </h1>
      </div>
    </div>
  );
};

export default Home;
