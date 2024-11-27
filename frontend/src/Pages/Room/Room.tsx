import React from "react";
import { useParams } from "react-router-dom";
import RoomBody from "../../Components/RoomBody/RoomBody";

const Room: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();

  return(
  <div className="h-screen">
    <div className="h-[80px]">Header</div>
    <RoomBody />  
  </div>
)
   };

export default Room;
