import React, { useEffect, useState } from "react";
import RoomCard from "../RoomCard/RoomCard";
import { Room } from "../../utils/models";
import RoomsLoading from "../RoomsLoading/RoomsLoading";
import { useNavigate } from "react-router-dom";

const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const navigate = useNavigate();

  const handleJoinRoom = async (roomId: string, roomName: string) => {
    navigate(`/r/${roomId}/${roomName}`);
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
          onClick={() => handleJoinRoom(room.RoomId, room.Name)}
        />
      ))}
    </div>
  );
};

export default RoomManager;
