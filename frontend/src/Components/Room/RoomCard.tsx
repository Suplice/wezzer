import React from "react";

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
  return (
    <div className="w-full bg-gray-200 rounded-xl">
      <div className="relative bg-gray-400 rounded-xl">
        <img
          src="/SignInImage.jpg"
          className="aspect-video w-full rounded-xl"
        />
      </div>
      <div className="flex flex-row justify-between px-3 py-5 items-center relative">
        <p
          className="text-xl font-semibold truncate mr-10"
          title={roomName ?? ""}
        >
          Test Name
        </p>
        <img
          src="/Logo.jpg"
          className="rounded-full absolute right-5 bottom-11 shadow-[0px_0px_8px_1px_rgba(0,_0,_0,_0.45)] "
          width="48px"
          alt="Logo"
        />
      </div>
    </div>
  );
};

export default RoomCard;
