import React from "react";
import { useParams } from "react-router-dom";
import RoomBody from "../../Components/Room/RoomBody/RoomBody";
import RoomHeader from "../../Components/Room/RoomHeader/RoomHeader";

const Room: React.FC = () => {
  useParams<{
    roomName: string;
  }>();

  return (
    <div className="h-screen">
      <RoomHeader roomName={"test"} />
      <RoomBody />
    </div>
  );
};

export default Room;
