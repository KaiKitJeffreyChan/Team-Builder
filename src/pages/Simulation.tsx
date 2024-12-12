import { createContext, useContext, useEffect, useState } from "react";
import { io as ClientIO } from "socket.io-client";

type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => {
  return useContext(SocketContext);
};

type SimulationProps = {
  children: React.ReactNode;
};

const Simulation: React.FC<SimulationProps> = ({ children }) => {
  const [socket, setSocket] = useState<any | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [messageStream, setMessageStream] = useState<
    { name: string; message: string }[]
  >([]);
  const [solution, setSolution] = useState<string | null>(null);

  useEffect(() => {
    const socketInstance = ClientIO("http://localhost:3000");

    socketInstance.on("connect", () => {
      setIsConnected(true);
      setSocket(socketInstance);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
      setSocket(null);
    });

    socketInstance.on(
      "message",
      (message: {
        speaker: string;
        message: string;
        intent: string;
        solution: string;
      }) => {
        setMessageStream((prev) => [
          ...prev,
          { name: message.speaker, message: message.message },
        ]);
        setSolution(message.solution);
      }
    );

    socketInstance.on("solution", (solution: string) => {
      setSolution(solution);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <div>
      {messageStream.map((msg, index) => (
        <div key={index}>
          <strong>{msg.name}:</strong> {msg.message}
        </div>
      ))}
      {solution && <div>Solution: {solution}</div>}
    </div>
  );
};

export default Simulation;
