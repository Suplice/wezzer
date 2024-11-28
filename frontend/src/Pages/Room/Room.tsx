import React, { useState } from "react";
import { useParams } from "react-router-dom";
import RoomBody from "../../Components/RoomBody/RoomBody";
import RoomHeader from "../../Components/RoomHeader/RoomHeader";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [roomName, setRoomName] = useState<string>("Test Room Name");
  return (
    <div className="h-screen">
      <RoomHeader roomName={roomName} />
      <RoomBody />
    </div>
  );
};

export default Room;
