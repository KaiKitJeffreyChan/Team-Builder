import { useEffect, useState } from "react";
import { io as ClientIO, Socket } from "socket.io-client";
import { CopyBlock } from "react-code-blocks";

type Message = {
  speaker: string;
  message: string;
};

const Simulation: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messageStream, setMessages] = useState<Message[]>([]);
  const [solution, setSolution] = useState<string | null>(null);

  useEffect(() => {
    const newSocket = ClientIO();
    setSocket(newSocket);

    newSocket.on("message", (response: Message) => {
      setMessages((prev) => [...prev, response]);
    });

    newSocket.on("solution", (finalSolution: string) => {
      setSolution(finalSolution);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <div className="m-5">
      <h1 className="my-5">Simulation Messages</h1>
      <div className="grid grid-cols-[50%_50%]">
        <div className="col-span-1 ">
          <h2>Messages:</h2>
          {messageStream.map((msg, index) => (
            <div className="my-5" key={index}>
              <strong>{msg.speaker}:</strong> {msg.message}
            </div>
          ))}
        </div>
        <div className="col-span-1">
          <h2>Solution:</h2>
          <p>
            {solution && (
              <CopyBlock text={solution || ""} language={"python"} />
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
