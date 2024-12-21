import React, { useEffect, useState } from "react";
import RoomCard from "../RoomCard/RoomCard";
import { Room } from "../../../utils/models";
import RoomsLoading from "../RoomsLoading/RoomsLoading";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { toast } from "react-toastify";
import { ThreeDot } from "react-loading-indicators";

const RoomManager: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleShowDeleteMessage = async (roomId: string) => {
    const result = await window.confirm(
      "Are you sure you want to delete this room? This action is irreversible"
    );

    if (result) {
      setIsDeleting(true);
      try {
        const response = await fetch(
          `${import.meta.env.VITE_DJANGO_URL}/api/deleteRoom/${roomId}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const updatedRooms = rooms.filter((room) => room.RoomId !== roomId);
          setRooms(updatedRooms);
          toast.success("Room deleted successfully", {
            autoClose: 2000,
          });
        } else {
          const error = await response.json();
          console.error(
            "An error occured while trying to delete room, please try again.:",
            error
          );
          toast.error(
            "An error occured while trying to delete room, please try again.",
            {
              autoClose: 2000,
            }
          );
        }
      } catch (error) {
        console.error(
          "An error occured while trying to delete room, please try again.:",
          error
        );
        toast.error(
          "An error occured while trying to delete room, please try again.",
          {
            autoClose: 2000,
          }
        );
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 p-5 ">
      {roomsLoading && <RoomsLoading />}
      {rooms.map((room) => (
        <RoomCard
          key={room.RoomId}
          handleDeleteRoom={handleShowDeleteMessage}
          roomName={room.Name}
          roomDescription={room.Description}
          roomBackground={room.backgroundImage}
          roomCreator={room.creatorName}
          roomCreaterAvatar={""}
          roomCreatorId={room.CreatorId}
          roomId={room.RoomId}
          onClick={() => handleJoinRoom(room.RoomId, room.Name)}
        />
      ))}
      {isDeleting && (
        <div className="fixed inset-0 backdrop-blur-sm backdrop-filter z-20 flex items-center justify-center text-white text-2xl font-semibold bg-black bg-opacity-50">
          <ThreeDot
            variant="pulsate"
            color="#000000"
            size="large"
            text="Deleting..."
            textColor="#000000"
          />
        </div>
      )}
    </div>
  );
};

export default RoomManager;
