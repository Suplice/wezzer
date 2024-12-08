import React, { useEffect, useState } from "react";
import RoomCard from "../RoomCard/RoomCard";
import { Room } from "../../../utils/models";
import RoomsLoading from "../RoomsLoading/RoomsLoading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { toast } from "react-toastify";

const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);

  const navigate = useNavigate();

  const { user } = useAuth();

  const handleJoinRoom = async (roomId: string, roomName: string) => {
    if (!user?.id) {
      toast.error("You firstly need to login to join a room", {
        autoClose: 2000,
      });
    } else {
      navigate(`/r/${roomId}/${roomName}`);
    }
  };

  useEffect(() => {
    const getRooms = async () => {
      setRoomsLoading(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DJANGO_URL}/api/getRoomsWithCreator`,
          {}
        );

        if (response.ok) {
          const data = await response.json();
          const mappedRooms: Room[] = data.map((roomData: any) => ({
            RoomId: roomData.RoomId,
            Description: roomData.Description,
            Name: roomData.Name,
            backgroundImage: roomData.backgroundImage,
            CreatorId: roomData.CreatorId,
            creatorName: roomData.project_users?.Nickname || "Unknown",
          }));

          setRooms(mappedRooms);
          setRoomsLoading(false);
        } else {
          const error = await response.json();
          console.error("Error fetching rooms:", error);
        }
      } catch (error) {
        console.error("Error fetching rooms:", error);
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
          roomCreator={room.creatorName}
          roomCreaterAvatar={""}
          roomId={room.RoomId}
          onClick={() => handleJoinRoom(room.RoomId, room.Name)}
        />
      ))}
    </div>
  );
};

export default RoomManager;
