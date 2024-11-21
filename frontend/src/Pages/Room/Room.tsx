import React from "react";
import { useParams } from "react-router-dom";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return <div>Room {roomId}</div>;
};

export default Room;
