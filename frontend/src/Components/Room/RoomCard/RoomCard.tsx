import { motion } from "motion/react";
import React, { useEffect, useState } from "react";
import { Tooltip, Button, Avatar } from "@mantine/core";
import { useNavigate } from "react-router-dom";

interface RoomCardProps {
  roomId: string;
  roomName: string;
  roomDescription: string;
  roomBackground: string;
  roomCreator: string;
  roomCreaterAvatar: string;
  onClick: (roomId: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  roomId,
  roomName,
  roomDescription,
  roomBackground,
  roomCreator,
  roomCreaterAvatar,
  onClick,
}) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_DJANGO_URL
          }/api/getBackgroundImage/${roomBackground}`
        );

        if (!response.ok) throw new Error("Image not found");
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }

      console.log("i finished fetching image");
    };

    fetchImage();
  }, []);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full bg-gray-200 rounded-xl hover:cursor-pointer "
        onClick={() => onClick(roomId)}
      >
        <div className="relative bg-gray-400 rounded-xl shadow-lg ">
          <img
            src={imageSrc !== null ? imageSrc : "/public/Logo.jpg"}
            className="aspect-video w-full rounded-xl"
          />
          <div className="absolute inset-0 bg-black bg-opacity-40 rounded-xl flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 backdrop-blur-md ">
            <p className="text-white text-xl font-semibold text-center">
              {roomDescription}
            </p>
          </div>
        </div>

        <div className="flex flex-row justify-between px-3 py-1 items-center relative">
          <p
            className="text-xl font-semibold truncate mr-10"
            title={roomName ?? ""}
          >
            {roomName}
          </p>
          <Tooltip label={roomCreator} withArrow position="bottom">
            <Avatar
              variant="filled"
              color="violet"
              name={roomCreator}
              size={60}
              className="absolute right-3 bottom-9 shadow-[0px_0px_6px_1px_rgba(0,_0,_0,_0.45)] transition-all "
            ></Avatar>
          </Tooltip>
        </div>
      </motion.div>
    </>
  );
};

export default RoomCard;
