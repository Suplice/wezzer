// Importy i definicje
import React, { useEffect, useRef, useState } from "react";
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
  const peerConnections: { [id: string]: ExtendedRTCPeerConnection } = {};
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const { user } = useAuth();
  const socketRef = useRef<WebSocket | null>(null);
  const localStreamRef = useRef<MediaStream>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
          case "offer":
            console.log(`Odebrano ofertę od użytkownika ${data.sender}`);

            // Tworzenie połączenia i zapis w obiekcie peerConnections
            const peerConnection: ExtendedRTCPeerConnection =
              createPeerConnection(data.sender);
            peerConnections[data.sender] = peerConnection;
            console.log("Oferta", data);

            try {
              const remoteDescription = new RTCSessionDescription({
                type: data.payload.type, // "offer" lub "answer"
                sdp: data.payload.sdp, // String SDP
              });

              await peerConnection.setRemoteDescription(remoteDescription);
              console.log(
                `remoteDescription ustawione dla użytkownika: ${data.sender}`
              );

              // Dodanie lokalnego audio track
              const localStream = await navigator.mediaDevices.getUserMedia({
                audio: true,
              });
              localStream.getTracks().forEach((track) => {
                peerConnection.addTrack(track, localStream);
              });
              console.log("Dodano lokalny audio track do peerConnection");

              // Przetwarzanie buforowanych kandydatów ICE
              if (
                peerConnection.iceCandidateBuffer &&
                peerConnection.iceCandidateBuffer.length > 0
              ) {
                console.log(
                  `Przetwarzanie ${peerConnection.iceCandidateBuffer.length} buforowanych kandydatów ICE.`
                );
                for (const candidate of peerConnection.iceCandidateBuffer) {
                  try {
                    await peerConnection.addIceCandidate(candidate);
                    console.log(
                      "Dodano buforowanego kandydata ICE:",
                      candidate
                    );
                  } catch (error) {
                    console.error(
                      "Błąd podczas dodawania buforowanego kandydata ICE:",
                      error
                    );
                  }
                }
                peerConnection.iceCandidateBuffer = []; // Czyszczenie bufora po przetworzeniu
              }

              // Stworzenie odpowiedzi
              const answer = await peerConnection.createAnswer();
              await peerConnection.setLocalDescription(answer);

              sendSignal("answer", data.sender, answer);
            } catch (error) {
              console.error("Błąd podczas obsługi oferty:", error);
            }
            break;
          case "answer":
            console.log(`Odebrano odpowiedź od użytkownika ${data.sender}`);
            console.log("Odpowiedź", data);
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
                const iceCandidate = new RTCIceCandidate({
                  candidate: data.payload.candidate,
                  sdpMLineIndex: data.payload.sdpMLineIndex,
                  sdpMid: data.payload.sdpMid,
                });

                // Sprawdź, czy remoteDescription jest ustawiona
                if (
                  pcIce.remoteDescription &&
                  pcIce.remoteDescription.type &&
                  data.payload.candidate
                ) {
                  await pcIce.addIceCandidate(iceCandidate);
                  console.log("Dodano kandydata ICE.");
                } else {
                  // Jeśli remoteDescription nie jest ustawione, dodaj do bufora
                  if (!pcIce.iceCandidateBuffer) {
                    pcIce.iceCandidateBuffer = [];
                  }
                  pcIce.iceCandidateBuffer.push(iceCandidate);
                  console.log(
                    "Kandydat ICE dodany do bufora, ponieważ remoteDescription jest null."
                  );
                }
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
            await getLocalStream(data.data);
            setIsLoading(false);
            break;
          case "user_joined":
            console.log("Nowy uczestnik dołączył:", data.data);

            await userJoined(data.data);
            break;
          case "user_left":
            console.log("Uczestnik opuścił pokój:", data.data);
            await userLeft(data.data);
            break;
        }
      };
    };

    const userLeft = async (leftUser: any) => {
      console.log("Użytkownik opuścił pokój:", leftUser);
      if (leftUser.id !== user!.id) {
        console.log(`Usuwanie połączenia z uczestnikiem: ${leftUser.id}`);
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
      console.log("nowy uzytkownik", newUser);
      if (newUser.id !== user!.id) {
        console.log(`Tworzenie połączenia z nowym uczestnikiem: ${newUser.id}`);
        const peerConnection = createPeerConnection(newUser.id);
        console.log("local stream ref", localStreamRef.current);

        localStreamRef.current!.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current!);
        });

        peerConnection.onicecandidate = (event) => {
          if (event.candidate) {
            console.log("Generowany kandydat ICE:", event.candidate);
            sendSignal("ice-candidate", newUser.UserId, event.candidate);
          } else {
            console.log("ICE gathering zakończone.");
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

    // const updatePeers = async (newParticipants: any) => {
    //   console.log(
    //     "Aktualizacja uczestników. Nowi uczestnicy:",
    //     newParticipants
    //   );

    //   const currentParticipants = participants.map((p) => p.UserId);
    //   const newParticipantIds = newParticipants.map((p: any) => p.UserId);

    //   // Dla każdego nowego uczestnika tworzysz połączenie z obecnymi uczestnikami
    //   for (const participant of newParticipants) {
    //     if (
    //       !currentParticipants.includes(participant.UserId) &&
    //       user &&
    //       participant.UserId !== user.id &&
    //       localStreamRef.current
    //     ) {
    //       console.log(
    //         `Tworzenie połączenia z nowym uczestnikiem: ${participant.UserId}`
    //       );
    //       const peerConnection = createPeerConnection(participant.UserId);

    //       localStreamRef.current.getTracks().forEach((track) => {
    //         peerConnection.addTrack(track, localStreamRef.current!);
    //       });

    //       peerConnection.onicecandidate = (event) => {
    //         if (event.candidate) {
    //           console.log("Generowany kandydat ICE:", event.candidate);
    //           sendSignal("ice-candidate", participant.UserId, event.candidate);
    //         } else {
    //           console.log("ICE gathering zakończone.");
    //         }
    //       };

    //       const offer = await peerConnection.createOffer();
    //       await peerConnection.setLocalDescription(offer);
    //       sendSignal("offer", participant.UserId, offer);
    //     }
    //   }

    //   // Usuwanie połączeń z uczestnikami, którzy odeszli
    //   const disconnectedParticipants = currentParticipants.filter(
    //     (id) => !newParticipantIds.includes(id)
    //   );
    //   for (const userId of disconnectedParticipants) {
    //     console.log(`Usuwanie połączenia z uczestnikiem: ${userId}`);
    //     if (peerConnections[userId]) {
    //       peerConnections[userId].close();
    //       delete peerConnections[userId];
    //     }
    //   }

    //   setParticipants(newParticipants);
    // };

    const getLocalStream = async (currentParticipants: any) => {
      // try {
      setParticipants(currentParticipants);
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });
      console.log("Strumień audio użytkownika został uzyskany.");
      localStreamRef.current = stream;

      for (const participant of currentParticipants) {
        if (
          participant.UserId === user?.id ||
          peerConnections[participant.UserId]
        )
          continue;
        const peerConnection = createPeerConnection(participant.UserId);
        stream.getTracks().forEach((track) => {
          peerConnection.addTrack(track, stream);
        });

        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendSignal("offer", participant.UserId, offer);
      }

      // Teraz dla wszystkich uczestników w pokoju, którzy już są w pokoju, dodaj strumień
      //   for (const participant of currentParticipants) {
      //     if (user && participant.UserId === user.id) continue; // Ignoruj siebie
      //     console.log(participant.UserId);
      //     if (peerConnections[participant.UserId]) {
      //       console.log(
      //         `Dodaję strumień audio do istniejącego połączenia z: ${participant.UserId}`
      //       );

      //       // Dodaj strumień audio do istniejącego połączenia
      //       console.log(
      //         "dodaje strumien do istniejacego polaczenia z",
      //         participant.UserId
      //       );
      //       stream.getTracks().forEach((track) => {
      //         peerConnections[participant.UserId].addTrack(track, stream);
      //       });
      //     } else {
      //       console.log(
      //         `Inicjalizacja połączenia z uczestnikiem: ${participant.UserId}`
      //       );
      //       const peerConnection = createPeerConnection(participant.UserId);
      //       stream.getTracks().forEach((track) => {
      //         peerConnection.addTrack(track, stream);
      //       });

      //       // Tworzenie oferty (send offer to new user)
      //       const offer = await peerConnection.createOffer();
      //       await peerConnection.setLocalDescription(offer);
      //       sendSignal("offer", participant.UserId, offer);
      //     }
      //   }
      // } catch (err) {
      //   console.error("Błąd przy uzyskiwaniu mikrofonu:", err);
      // }
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
          `Odebrano strumień audio od uczestnika ${participantId}:`,
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

    const handleNewParticipant = async (updatedParticipants: any) => {
      console.log("odebrano stru212121", updatedParticipants);

      // Iterujemy po wszystkich uczestnikach w zaktualizowanej liście
      for (const participant of updatedParticipants) {
        if (participant.UserId === user?.id) continue; // Ignoruj siebie
        // Dla każdego uczestnika tworzysz połączenie
        console.log("odebrano stru", participant);
        const peerConnection = createPeerConnection(participant.UserId);

        console.log("odebrano stru local strteam ref", localStreamRef.current);

        // Dodajemy strumień lokalny do połączenia
        localStreamRef.current!.getTracks().forEach((track) => {
          peerConnection.addTrack(track, localStreamRef.current!);
        });

        // Tworzymy ofertę i wysyłamy ją do danego uczestnika
        const offer = await peerConnection.createOffer();
        await peerConnection.setLocalDescription(offer);
        sendSignal("offer", participant.UserId, offer); // Wysyłamy ofertę do każdego uczestnika
      }

      // Opcjonalnie możesz zaktualizować stan z nową listą uczestników, jeśli chcesz
      setParticipants(updatedParticipants);
    };

    checkIdentity();
    getRoomImage();
    initWebSocket();

    return () => {
      console.log("Zamykanie połączeń i czyszczenie zasobów.");
      Object.values(peerConnections).forEach((pc) => pc.close());

      for (const userId in peerConnections) {
        peerConnections[userId].close();
        delete peerConnections[userId];
      }

      document.querySelectorAll("audio").forEach((audio) => audio.remove());

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
