// Importy i definicje
import React, { useCallback, useEffect, useRef, useState } from "react";
import ActiveMembersSection from "../ActiveMembersSection/ActiveMembersSection";
import RoomControls from "../RoomControls/RoomControls";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { Participant } from "../../../utils/models";
import { toast } from "react-toastify";

interface ExtendedRTCPeerConnection extends RTCPeerConnection {
  iceCandidateBuffer?: RTCIceCandidate[];
}

const RoomBody: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { user } = useAuth();
  const [isMuted, setIsMuted] = useState(false);
  const peerConnections: { [id: string]: ExtendedRTCPeerConnection } = {};

  const socketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream>();

  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<
    Participant[]
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    const checkIdentity = () => {
      if (!user?.id) {
        navigate("/");
      }
    };
    checkIdentity();
  }, []);

  useEffect(() => {
    const getRoomImage = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_DJANGO_URL
          }/api/getBackgroundImageWithId/${roomId}`
        );
        if (!response.ok) throw new Error("Nie znaleziono obrazu.");
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
      } catch (error) {
        console.error(
          "An error occured while trying to fetch room image",
          error
        );
      }
    };

    getRoomImage();
  }, []);

  useEffect(() => {
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
        console.error("Web Socket Error", error);
        toast.error("An error occured, please try again later", {
          autoClose: 2000,
        });
        setIsLoading(false);
        navigate("/");
      };

      socketRef.current.onclose = () => {
        navigate("/");
      };

      socketRef.current.onmessage = async (e) => {
        const data = JSON.parse(e.data);

        switch (data.type) {
          case "offer":
            const peerConnection: ExtendedRTCPeerConnection =
              createPeerConnection(data.sender);
            peerConnections[data.sender] = peerConnection;

            try {
              const remoteDescription = new RTCSessionDescription({
                type: data.payload.type,
                sdp: data.payload.sdp,
              });

              await peerConnection.setRemoteDescription(remoteDescription);

              const localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
              });

              localStreamRef.current = localStream;

              localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
              });

              if (
                peerConnection.iceCandidateBuffer &&
                peerConnection.iceCandidateBuffer.length > 0
              ) {
                for (const candidate of peerConnection.iceCandidateBuffer) {
                  try {
                    await peerConnection.addIceCandidate(candidate);
                  } catch (error) {
                    console.error(
                      "An error occured while adding ICE candidate",
                      error
                    );
                  }
                }
                peerConnection.iceCandidateBuffer = [];
              }

              // Stworzenie odpowiedzi
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);

              sendSignal("answer", data.sender, answer);
            } catch (error) {
              console.error(
                "An error occured while trying to serve offer",
                error
              );
            }
            break;
          case "answer":
            const pc = peerConnections[data.sender];
            if (pc) {
              try {
                const remoteDescription = {
                  type: data.payload.type,
                  sdp: data.payload.sdp,
                };
                await pc.setRemoteDescription(
                  new RTCSessionDescription(remoteDescription)
                );
              } catch (error) {
                console.error(
                  "An error occured while trying to add remote description",
                  error
                );
              }
            }
            break;
          case "ice-candidate":
            const pcIce = peerConnections[data.sender];
            if (pcIce) {
              try {
                const iceCandidate = new RTCIceCandidate({
                  candidate: data.payload.candidate,
                  sdpMLineIndex: data.payload.sdpMLineIndex,
                  sdpMid: data.payload.sdpMid,
                });

                if (
                  pcIce.remoteDescription &&
                  pcIce.remoteDescription.type &&
                  data.payload.candidate
                ) {
                  await pcIce.addIceCandidate(iceCandidate);
                } else {
                  if (!pcIce.iceCandidateBuffer) {
                    pcIce.iceCandidateBuffer = [];
                  }
                  pcIce.iceCandidateBuffer.push(iceCandidate);
                }
              } catch (error) {
                console.error(
                  "An error occured while trying to add ice candidate",
                  error
                );
              }
            }
            break;
          case "authenticated":
            await getLocalStream(data.data);
            setIsLoading(false);
            break;
          case "user_joined":
            await userJoined(data.data);
            break;
          case "user_left":
            await userLeft(data.data);
            break;
        }
      };
    };

    const userLeft = async (leftUser: any) => {
      if (leftUser.id !== user!.id) {
        if (peerConnections[leftUser.id]) {
          peerConnections[leftUser.id].close();
          delete peerConnections[leftUser.id];
        }
      }
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p.UserId !== leftUser.id)
      );
    };

    const userJoined = async (newUser: any) => {
      if (newUser.id !== user!.id) {
        const peerConnection = createPeerConnection(newUser.id);

        localStreamRef.current!.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current!);
        });

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            sendSignal("ice-candidate", newUser.UserId, event.candidate);
          } else {
          }
        };

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendSignal("offer", newUser.id, offer);
      }
      const newParticipant: Participant = {
        UserId: newUser.id,
        Nickname: newUser.nickname,
      };
      setParticipants((prevParticipants) => [
        ...prevParticipants,
        newParticipant,
      ]);
    };

    const getLocalStream = async (currentParticipants: any) => {
      setParticipants(currentParticipants);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      localStreamRef.current = stream;

      for (const participant of currentParticipants) {
        if (
          participant.UserId === user?.id ||
          peerConnections[participant.UserId]
        )
          continue;
        const peerConnection = createPeerConnection(participant.UserId);
        localStreamRef.current!.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current!);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendSignal("offer", participant.UserId, offer);
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
    initWebSocket();

    return () => {
      Object.values(peerConnections).forEach((pc) => pc.close());

      for (const userId in peerConnections) {
        peerConnections[userId].close();
        delete peerConnections[userId];
      }

      document.querySelectorAll("audio").forEach((audio) => audio.remove());

      socketRef.current?.close();
    };
  }, []);

  const toggleMute = (state: boolean) => {
    console.log("localStreamRef.current", localStreamRef.current);
    console.log("state", state);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => {
        if (track.kind === "audio") {
          track.enabled = !state;
        }
      });
      setIsMuted(!state);
    }
    console.log("localStreamRef.current", localStreamRef.current);
  };

  return (
    <div className="flex flex-col h-[calc(100%-80px)] items-center justify-center relative select-none">
      <img
        className="absolute w-full h-full -z-10"
        src={`${imageSrc ? imageSrc : "/public/Logo.jpg"}`}
        alt="Background"
      />
      <ActiveMembersSection users={participants} isLoading={isLoading} />
      <RoomControls toggleMute={toggleMute} />
    </div>
  );
};

export default RoomBody;
