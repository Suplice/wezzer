import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import RoomBody from "../../Components/Room/RoomBody/RoomBody";
import RoomHeader from "../../Components/Room/RoomHeader/RoomHeader";
import { useAuth } from "../../Context/AuthContext";

const Room: React.FC = () => {
  const { roomName } = useParams<{
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
