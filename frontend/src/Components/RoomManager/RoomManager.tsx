import React, { useEffect, useState } from "react";
import RoomCard from "../RoomCard/RoomCard";
import { Room } from "../../utils/models";
import RoomsLoading from "../RoomsLoading/RoomsLoading";
import { useAuth } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import Loading from "../../Pages/Loading/Loading";
import { BlinkBlur, ThreeDot } from "react-loading-indicators";

const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);

  const { user } = useAuth();

  const navigate = useNavigate();

  const handleJoinRoom = async (roomId: string) => {
    try {
      setIsJoiningRoom(true);

      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/joinroom`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ roomId: roomId, userId: user?.id }),
          credentials: "include",
        }
      );

      if (response.ok) {
        navigate(`/r/${roomId}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsJoiningRoom(false);
    }
  };

  useEffect(() => {
    const getRooms = async () => {
      setRoomsLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/rooms`,
        {}
      );

      if (response.ok) {
        const data = await response.json();
        setRooms(data);
        setRoomsLoading(false);
      }
    };

    getRooms();
  }, []);

  return (
    <>
      {isJoiningRoom ? (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-gray-800 bg-opacity-25 backdrop-blur-sm w-full h-full px-2 md:px-0">
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <ThreeDot
              color="black"
              size="large"
              text="Connecting..."
              textColor=""
            />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5 ">
          {roomsLoading && <RoomsLoading />}
          {rooms.map((room) => (
            <RoomCard
              key={room.RoomId}
              roomName={room.Name}
              roomDescription={room.Description}
              roomBackground={room.backgroundImage}
              roomCreator={room.CreatorId}
              roomCreaterAvatar={""}
              roomId={room.RoomId}
              onClick={() => handleJoinRoom(room.RoomId)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default RoomManager;
