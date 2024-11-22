import { motion } from "motion/react";
import React from "react";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  roomId: string;
  roomName: string;
  roomDescription: string;
  roomBackground: string;
  roomCreator: string;
  roomCreaterAvatar: string;
}

const RoomCard: React.FC<RoomCardProps> = ({
  roomId,
  roomName,
  roomDescription,
  roomBackground,
  roomCreator,
  roomCreaterAvatar,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate(`/r/${roomId}`);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleNavigate}
        className="w-full bg-gray-200 rounded-xl hover:cursor-pointer "
      >
        <div className="relative bg-gray-400 rounded-xl shadow-lg ">
          <img
            src="/SignInImage.jpg"
            className="aspect-video w-full rounded-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-md ">
            <p className="text-white text-xl font-semibold text-center">
              {roomDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-between px-3 py-5 items-center relative">
          <p
            className="text-xl font-semibold truncate mr-10"
            title={roomName ?? ""}
          >
            Test Name
          </p>
          <img
            src={roomCreaterAvatar === "" ? "/basicAvatar.png" : "/Logo.jpg"}
            className="rounded-full absolute right-5 bottom-11 shadow-[0px_0px_6px_1px_rgba(0,_0,_0,_0.45)] bg-white w-[48px] "
            alt="Logo"
            title={roomCreator ?? ""}
          />
        </div>
      </motion.div>
    </>
  );
};

export default RoomCard;
