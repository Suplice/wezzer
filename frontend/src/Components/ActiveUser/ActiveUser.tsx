import { Avatar, Tooltip } from "@mantine/core";
import React, { useEffect } from "react";

interface ActiveUserInterface {
  isActive: boolean;
  name: string;
}

const ActiveUser: React.FC<ActiveUserInterface> = ({ name, isActive }) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1  px-2 py-4 border border-hidden hover:">
      <Tooltip label={name} position="bottom" withArrow>
        <Avatar
          variant="filled"
          size={100}
          color="violet"
          name={name}
          className={`w-[100px] h-[100px] rounded-full bg-slate-400 border shadow-md shadow-slate-500  border-stone-300 transition-all duration-75  ${
            isActive ? "outline-green-600 outline-4 outline " : "bg-slate-400 "
          }`}
          id="avatar"
        ></Avatar>
      </Tooltip>
    </div>
  );
};

export default ActiveUser;
