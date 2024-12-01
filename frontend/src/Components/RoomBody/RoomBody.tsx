import React, { useEffect, useRef, useState } from "react";
import ActiveMembersSection from "../ActiveMembersSection/ActiveMembersSection";
import RoomControls from "../RoomControls/RoomControls";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Participant } from "../../utils/models";
import _ from "lodash";
import { toast } from "react-toastify";

const RoomBody: React.FC = () => {
  const { roomId } = useParams<{
    roomId: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);

  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const { user } = useAuth();

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnections: { [id: string]: RTCPeerConnection } = {};
  const localStreamRef = useRef<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const checkIdentity = () => {
      if (!user?.id) {
        navigate("/");
      }
    };

    const getRoomImage = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_DJANGO_URL
          }/api/getBackgroundImageWithId/${roomId}`
        );

        if (!response.ok) throw new Error("Image not found");
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    const initWebSocket = () => {
      socketRef.current = new WebSocket(
        `${import.meta.env.VITE_DJANGO_URL}/ws/room/${roomId}/`
      );

      socketRef.current.onopen = () => {
        const userId = user?.id;
        const userName = user?.name;

        const userInfoMessage = {
          type: "authenticate",
          userId,
          userName,
        };

        socketRef.current?.send(JSON.stringify(userInfoMessage));
      };

      socketRef.current.onerror = (error) => {
        toast.error("An error occured, please try connecting again", {
          autoClose: 2000,
        });
        setIsLoading(false);
        navigate("/");
      };

      socketRef.current.onclose = () => {
        toast.info("Disconnected from room", { autoClose: 2000 });
        navigate("/");
      };

      socketRef.current.onmessage = async (e) => {
        const data = JSON.parse(e.data);

        if (data.type === "participants") {
          setParticipants(data.participants);
        } else if (data.type === "offer") {
          const peerConnection = createPeerConnection(data.sender);
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          sendSignal("answer", data.sender, answer);
        } else if (data.type === "answer") {
          const peerConnection = peerConnections[data.sender];
          if (peerConnection) {
            await peerConnection.setRemoteDescription(
              new RTCSessionDescription(data.answer)
            );
          }
        } else if (data.type === "ice-candidate") {
          const peerConnection = peerConnections[data.sender];
          if (peerConnection) {
            await peerConnection.addIceCandidate(
              new RTCIceCandidate(data.candidate)
            );
          }
        } else if (data.type === "authenticated") {
          console.log(
            "Authenticated and received participants list:",
            data.data
          );
          setParticipants(data.data);
          setIsLoading(false);
        } else if (data.type === "user_joined") {
          console.log("Participants list updated:", data.data);
          setParticipants(data.data);
        } else if (data.type === "user_left") {
          console.log("Participants list updated:", data.data);
          setParticipants(data.data);
        }
      };
    };

    const getLocalStream = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        localStreamRef.current = stream;

        for (const participant of participants) {
          const peerConnection = createPeerConnection(participant.userId);
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });
        }
      } catch (err) {
        console.error("Error accessing microphone:", err);
      }
    };

    const createPeerConnection = (participantId: string) => {
      const peerConnection = new RTCPeerConnection();

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignal("ice-candidate", participantId, event.candidate);
        }
      };

      peerConnection.ontrack = (event) => {
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.autoplay = true;
        document.body.appendChild(remoteAudio);
      };

      peerConnections[participantId] = peerConnection;
      return peerConnection;
    };

    const sendSignal = (type: string, recipient: string, payload: any) => {
      socketRef.current?.send(
        JSON.stringify({
          type,
          recipient,
          payload,
        })
      );
    };
    checkIdentity();
    getRoomImage();
    initWebSocket();
    getLocalStream();

    return () => {
      Object.values(peerConnections).forEach((pc) => pc.close());
      socketRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100%-80px)]  items-center justify-center  relative   ">
      <img
        className="absolute w-full h-full -z-10  "
        src={`${imageSrc ? imageSrc : "/public/Logo.jpg"}`}
      ></img>
      <ActiveMembersSection users={participants} isLoading={isLoading} />
      <RoomControls />
    </div>
  );
};

export default RoomBody;
