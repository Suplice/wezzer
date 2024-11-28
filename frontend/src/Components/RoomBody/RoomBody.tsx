import React from "react";
import ActiveMembersSection from "../ActiveMembersSection/ActiveMembersSection";
import RoomControls from "../RoomControls/RoomControls";

const RoomBody: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100%-80px)]  items-center justify-center  relative   ">
      <img
        className="absolute w-full h-full -z-10  "
        src="/public/Logo.jpg"
      ></img>
      <ActiveMembersSection />
      <RoomControls />
    </div>
  );
};

export default RoomBody;
