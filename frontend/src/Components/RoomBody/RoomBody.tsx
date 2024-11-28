import React from "react";
import ActiveMembersSection from "../ActiveMembersSection/ActiveMembersSection";

const RoomBody: React.FC = () => {
  return (
    <div className="flex flex-col h-[calc(100%-80px)]  items-center justify-center  relative ">
      <img
        className="absolute w-full h-full -z-10  "
        src="/public/Logo.jpg"
      ></img>
      <ActiveMembersSection />
    </div>
  );
};

export default RoomBody;
