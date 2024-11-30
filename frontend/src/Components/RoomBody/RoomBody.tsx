import React, { useEffect, useRef, useState } from "react";
import ActiveMembersSection from "../ActiveMembersSection/ActiveMembersSection";
import RoomControls from "../RoomControls/RoomControls";
import { useParams } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import { Participant } from "../../utils/models";

const RoomBody: React.FC = () => {
  const { roomId } = useParams<{
    roomId: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);

  const { user } = useAuth();

  const socketRef = useRef<WebSocket | null>(null);
  const peerConnections: { [id: string]: RTCPeerConnection } = {};
  const localStreamRef = useRef<MediaStream | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  useEffect(() => {
    const initWebSocket = () => {
      setIsLoading(true);
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
          setParticipants(data.data);
          setIsLoading(false);
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
        // Add remote tracks to audio playback
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
        src="/public/Logo.jpg"
      ></img>
      <ActiveMembersSection users={participants} isLoading={isLoading} />
      <RoomControls />
    </div>
  );
};

export default RoomBody;
