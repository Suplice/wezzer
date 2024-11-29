import React, { useEffect, useState } from "react";
import RoomCard from "../RoomCard/RoomCard";
import { Room } from "../../utils/models";
import RoomsLoading from "../RoomsLoading/RoomsLoading";

const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRooms = async () => {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_DJANGO_URL}/api/rooms`,
        {}
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data);
        setRooms(data);
        console.log(rooms);
        setLoading(false);
      }
    };

    getRooms();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5 ">
      {loading && <RoomsLoading />}
      {rooms.map((room) => (
        <RoomCard
          roomName={room.Name}
          roomDescription={room.Description}
          roomBackground={room.backgroundImage}
          roomCreator={room.CreatorId}
          roomCreaterAvatar={""}
          roomId={room.RoomId}
        />
      ))}
    </div>
  );
};

export default RoomManager;
