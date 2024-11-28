import React from "react";

interface ActiveUserInterface {
  isActive: boolean;
  name: string;
  profileImg: string;
}

const ActiveUser: React.FC<ActiveUserInterface> = ({
  name,
  isActive,
  profileImg,
}) => {
  return (
    <div className="flex flex-col items-center justify-center gap-1">
      <img
        className={`w-[100px] h-[100px] rounded-full bg-slate-400 border shadow-md shadow-slate-500  border-stone-300 transition-all duration-75  ${
          isActive ? "outline-green-600 outline-4 outline " : "bg-slate-400 "
        }`}
        src={profileImg}
      ></img>
    </div>
  );
};

export default ActiveUser;
