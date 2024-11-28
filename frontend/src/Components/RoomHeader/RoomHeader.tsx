import React from "react";
import { FaArrowLeft } from "react-icons/fa";

interface RoomHeaderInterface {
  roomName: string;
}

const RoomHeader: React.FC<RoomHeaderInterface> = ({ roomName }) => {
  return (
    <div className="w-full bg-gray-900 h-[80px] flex flex-row  items-center justify-between xl:px-48 lg:px-32 md:px-16 sm:px-8 px-4  ">
      <div className="text-white w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center hover:cursor-pointer hover:bg-slate-100 tansition-all duration-150">
        <FaArrowLeft color="black" />
      </div>
      <div className="text-white font-bold text-lg">{roomName}</div>
      <div>
        <img
          src="/public/basicAvatar.png"
          className="rounded-full w-[40px] h-[40px] bg-white hover:bg-slate-100 transition-all duration-150 hover:cursor-pointer"
        ></img>
      </div>
    </div>
  );
};

export default RoomHeader;
