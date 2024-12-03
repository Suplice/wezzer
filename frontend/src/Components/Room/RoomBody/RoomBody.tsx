// Importy i definicje
import React, { useEffect, useRef, useState } from "react";
import ActiveMembersSection from "../ActiveMembersSection/ActiveMembersSection";
import RoomControls from "../RoomControls/RoomControls";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../Context/AuthContext";
import { Participant } from "../../../utils/models";
import { toast } from "react-toastify";

const RoomBody: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { user } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const peerConnections: { [id: string]: RTCPeerConnection } = {};
  const localStreamRef = useRef<MediaStream>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);

    const checkIdentity = () => {
      if (!user?.id) {
        console.log(
          "Brak zalogowanego użytkownika. Przekierowanie na stronę główną."
        );
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
        if (!response.ok) throw new Error("Nie znaleziono obrazu.");
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setImageSrc(imageUrl);
        console.log("Obraz pokoju został załadowany.");
      } catch (error) {
        console.error("Błąd przy pobieraniu obrazu:", error);
      }
    };

    const initWebSocket = () => {
      console.log("Inicjalizacja WebSocket.");
      socketRef.current = new WebSocket(
        `${import.meta.env.VITE_DJANGO_URL}/ws/room/${roomId}/`
      );

      socketRef.current.onopen = () => {
        const userId = user?.id;
        const userName = user?.name;
        console.log("WebSocket połączony. Autoryzacja użytkownika:", {
          userId,
          userName,
        });

        const userInfoMessage = {
          type: "authenticate",
          userId,
          userName,
        };

        socketRef.current?.send(JSON.stringify(userInfoMessage));
      };

      socketRef.current.onerror = (error) => {
        console.error("Błąd WebSocket:", error);
        toast.error("Wystąpił błąd. Spróbuj ponownie.", { autoClose: 2000 });
        setIsLoading(false);
        navigate("/");
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket zamknięty.");
        toast.info("Rozłączono z pokojem.", { autoClose: 2000 });
        navigate("/");
      };

      socketRef.current.onmessage = async (e) => {
        const data = JSON.parse(e.data);
        console.log("Odebrano wiadomość przez WebSocket:", data);

        switch (data.type) {
          case "participants":
            console.log("Aktualizacja listy uczestników:", data.data);
            updatePeers(data.data);
            break;
          case "offer":
            console.log(`Odebrano ofertę od użytkownika ${data.sender}`);
            const peerConnection = createPeerConnection(data.sender);
            console.log("oferta", data);

            try {
              await peerConnection.setRemoteDescription(data.payload);

              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);

              sendSignal("answer", data.sender, answer);
            } catch (error) {
              console.error("Błąd podczas obsługi oferty:", error);
            }
            break;
          case "answer":
            console.log(`Odebrano odpowiedź od użytkownika ${data.sender}`);
            console.log("odpowiedź", data);
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
                console.error("Błąd podczas ustawiania zdalnego opisu:", error);
              }
            }
            break;
          case "ice-candidate":
            console.log(`Odebrano kandydata ICE od użytkownika ${data.sender}`);
            console.log("dane odebrane to", data);
            const pcIce = peerConnections[data.sender];
            if (pcIce) {
              try {
                const iceCandidate = {
                  candidate: data.payload.candidate,
                  sdpMLineIndex: data.payload.sdpMLineIndex,
                  sdpMid: data.payload.sdpMid,
                };
                await pcIce.addIceCandidate(new RTCIceCandidate(iceCandidate));
              } catch (error) {
                console.error("Błąd podczas dodawania kandydata ICE:", error);
              }
            }
            break;
          case "authenticated":
            console.log(
              "Użytkownik zautoryzowany. Lista uczestników:",
              data.data
            );
            getLocalStream(data.data);
            updatePeers(data.data);
            setIsLoading(false);
            break;
          case "user_joined":
            console.log("Nowy uczestnik dołączył:", data.data);
            updatePeers(data.data);
            break;
          case "user_left":
            console.log("Uczestnik opuścił pokój:", data.data);
            updatePeers(data.data);
            break;
        }
      };
    };

    const updatePeers = async (newParticipants: any) => {
      console.log(
        "Aktualizacja uczestników. Nowi uczestnicy:",
        newParticipants
      );

      const currentParticipants = participants.map((p) => p.UserId);
      const newParticipantIds = newParticipants.map((p: any) => p.UserId);

      for (const participant of newParticipants) {
        if (
          !currentParticipants.includes(participant.UserId) &&
          user &&
          participant.UserId !== user.id &&
          localStreamRef.current
        ) {
          console.log(
            `Tworzenie połączenia z nowym uczestnikiem: ${participant.UserId}`
          );
          const peerConnection = createPeerConnection(participant.UserId);

          localStreamRef.current.getTracks().forEach((track) => {
            peerConnection.addTrack(track, localStreamRef.current!);
          });

          peerConnection.onicecandidate = (event) => {
            if (event.candidate) {
              sendSignal("ice-candidate", participant.UserId, event.candidate);
            }
          };

          const offer = await peerConnection.createOffer();
          await peerConnection.setLocalDescription(offer);
          sendSignal("offer", participant.UserId, offer);
        }
      }

      const disconnectedParticipants = currentParticipants.filter(
        (id) => !newParticipantIds.includes(id)
      );
      for (const userId of disconnectedParticipants) {
        console.log(`Usuwanie połączenia z uczestnikiem: ${userId}`);
        if (peerConnections[userId]) {
          peerConnections[userId].close();
          delete peerConnections[userId];
        }
      }

      setParticipants(newParticipants);
    };

    const getLocalStream = async (currentParticipants: any) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        console.log("Strumień audio użytkownika został uzyskany.");
        localStreamRef.current = stream;

        for (const participant of currentParticipants) {
          console.log(
            `Inicjalizacja połączenia z uczestnikiem: ${participant.UserId}`
          );
          const peerConnection = createPeerConnection(participant.UserId);
          stream.getTracks().forEach((track) => {
            peerConnection.addTrack(track, stream);
          });
        }
      } catch (err) {
        console.error("Błąd przy uzyskiwaniu mikrofonu:", err);
      }
    };

    const createPeerConnection = (participantId: string) => {
      console.log(
        `Tworzenie RTCPeerConnection dla uczestnika: ${participantId}`
      );
      const peerConnection = new RTCPeerConnection();

      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          console.log(`Wysyłanie kandydata ICE do: ${participantId}`);
          sendSignal("ice-candidate", participantId, event.candidate);
        }
      };

      peerConnection.ontrack = (event) => {
        console.log(
          `Odebrano dźwięk od uczestnika. Źródło strumienia:`,
          event.streams[0]
        );
        const remoteAudio = document.createElement("audio");
        remoteAudio.srcObject = event.streams[0];
        remoteAudio.autoplay = true;
        document.body.appendChild(remoteAudio);
      };

      peerConnections[participantId] = peerConnection;
      return peerConnection;
    };

    const sendSignal = (type: string, recipient: string, payload: any) => {
      console.log(`Wysyłanie sygnału: ${type}, Odbiorca: ${recipient}`);
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

    return () => {
      console.log("Zamykanie połączeń i czyszczenie zasobów.");
      Object.values(peerConnections).forEach((pc) => pc.close());
      socketRef.current?.close();
    };
  }, []);

  return (
    <div className="flex flex-col h-[calc(100%-80px)] items-center justify-center relative">
      <img
        className="absolute w-full h-full -z-10"
        src={`${imageSrc ? imageSrc : "/public/Logo.jpg"}`}
        alt="Background"
      />
      <ActiveMembersSection users={participants} isLoading={isLoading} />
      <RoomControls />
    </div>
  );
};

export default RoomBody;
