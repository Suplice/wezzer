import React from "react";
import { FaPlus } from "react-icons/fa";
import RoomManager from "../RoomManager/RoomManager";

const MainField: React.FC = () => {
  return (
    <div className="flex flex-col max-w-[1400px] mx-auto mt-5">
      <div className="flex flex-row justify-between px-6  ">
        <p className="font-semibold text-2xl">Browse Rooms</p>
        <button className="bg-green-600 rounded-full text-white pr-1 pl-1 sm:pr-3  py-1 flex flex-row gap-3 items-center justify-center hover:bg-green-500 transition-all">
          <p className="rounded-full text-green-600 bg-white p-2 text-center  text-md font-semibold ">
            <FaPlus />
          </p>
          <p className="text-lg font-semibold hidden sm:flex">Create Room</p>
        </button>
      </div>
      <RoomManager />
    </div>
  );
};

export default MainField;
