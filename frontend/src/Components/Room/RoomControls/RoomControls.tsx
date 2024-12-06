import { motion } from "motion/react";
import React, { useState } from "react";
import { IoMdExit } from "react-icons/io";
import { PiMicrophoneFill } from "react-icons/pi";
import { PiMicrophoneSlashFill } from "react-icons/pi";
import { TbHeadphonesFilled } from "react-icons/tb";
import { TbHeadphonesOff } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

interface RoomControlsProps {
  toggleMute: (state: boolean) => void;
}

const RoomControls: React.FC<RoomControlsProps> = ({ toggleMute }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isDeafened, setIsDeafened] = useState(false);

  const navigate = useNavigate();

  const handleLeave = () => {
    navigate("/");
  };

  return (
    <motion.div
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="absolute bottom-2 md:w-[500px] bg-white/20 backdrop-blur  h-[64px] rounded-2xl flex flex-row justify-between items-center md:px-10 px-6 w-[300px]  "
    >
      <div className="flex flex-row gap-3">
        <div
          onClick={() => {
            toggleMute(!isMuted);
            setIsMuted(!isMuted);
          }}
          className={`h-[45px] w-[45px] rounded-full bg-black flex justify-center items-center hover:cursor-pointer text-white transition-all duration-150 ${
            isMuted
              ? "bg-red-600 hover:bg-red-500"
              : " bg-black hover:bg-gray-700"
          } `}
        >
          {isMuted ? (
            <PiMicrophoneSlashFill size={20} />
          ) : (
            <PiMicrophoneFill size={20} />
          )}
        </div>
        <div
          onClick={() => setIsDeafened(!isDeafened)}
          className={`h-[45px] w-[45px] rounded-full bg-black flex justify-center items-center hover:cursor-pointer text-white transition-all duration-150 ${
            isDeafened
              ? "bg-red-600 hover:bg-red-500"
              : " bg-black hover:bg-gray-700"
          } `}
        >
          {isDeafened ? (
            <TbHeadphonesOff size={20} />
          ) : (
            <TbHeadphonesFilled size={20} />
          )}
        </div>
      </div>
      <div>
        <button
          onClick={handleLeave}
          className=" gap-6 bg-red-500 px-4 py-2 rounded-md text-center font-bold  text-white flex flex-row  justify-between items-center hover:bg-red-600 transition-all duration-300"
        >
          <p>Leave</p>
          <IoMdExit size={22} />
        </button>
      </div>
    </motion.div>
  );
};

export default RoomControls;
