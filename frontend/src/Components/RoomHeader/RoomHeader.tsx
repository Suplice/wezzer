import { AnimatePresence, motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { FaPowerOff } from "react-icons/fa6";

interface RoomHeaderInterface {
  roomName: string;
}

const RoomHeader: React.FC<RoomHeaderInterface> = ({ roomName }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.addEventListener("click", (e) => {
      if (e.target !== document.getElementById("menu")) {
        setMenuOpen(false);
      }
    });
    return document.removeEventListener("click", () => {});
  }, []);

  return (
    <div className=" bg-gray-900 h-[80px] flex flex-row  items-center justify-between xl:px-48 lg:px-32 md:px-16 sm:px-8 px-4  ">
      <div
        onClick={() => window.history.back()}
        className="text-white w-[40px] h-[40px] rounded-full bg-white flex items-center justify-center hover:cursor-pointer hover:bg-slate-100 tansition-all duration-150"
      >
        <FaArrowLeft color="black" />
      </div>
      <div className="text-white font-bold text-lg">{roomName}</div>
      <div className="relative ">
        <img
          id="menu"
          onClick={() => setMenuOpen(!menuOpen)}
          src="/public/basicAvatar.png"
          className="rounded-full w-[40px] h-[40px] bg-white hover:bg-slate-100 transition-all duration-150 hover:cursor-pointer"
        ></img>
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { duration: 0.3 } }}
              exit={{ y: -20, opacity: 0, transition: { duration: 0.3 } }}
              onClick={(e) => e.stopPropagation()}
              className={`absolute w-[180px] flex flex-col gap-2 bg-white z-10  rounded-md shadow-lg top-12 right-0 mx-auto p-2 `}
            >
              <p className="text-sm text-center">Hello, Test Name</p>
              <div>
                <button className="text-red-500 rounded-md p-1 text-left flex flex-row gap-3 items-center hover:bg-red-100/50 w-full pr-6 pl-2">
                  <FaPowerOff />
                  <p className="text-md font-semibold">Logout</p>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RoomHeader;
