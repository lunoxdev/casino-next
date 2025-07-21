import { useEffect, useCallback } from "react";
import { usePlayerStore } from "../stores/usePlayerStore";
import { useRoomsStore } from "../stores/useRoomsStore";
import socket from "../socket";

let listenersInitialized = false;

export const useLobbySocket = ({ setPlayers }) => {
  const { name, balance, token, registered, setBalance } = usePlayerStore();
  const { setMyRoom, setRoomPlayers, setAvailableRooms } = useRoomsStore();

  const rejoin = useCallback(() => {
    if (registered && token) {
      socket.emit("playerJoined", { name, balance, token });
      socket.emit("getRooms");
    }
  }, [registered, token, name, balance]);

  const setupListeners = useCallback(() => {
    if (listenersInitialized) return;
    listenersInitialized = true;

    socket.on("connect", rejoin);

    socket.on("updatePlayers", (updatedList) => {
      setPlayers(updatedList);

      const currentPlayer = updatedList.find((p) => p.token === token);
      if (currentPlayer) setBalance(currentPlayer.balance);
    });

    socket.on("roomCreated", ({ roomId, gameName, player }) => {
      setMyRoom(roomId, gameName, [player]);
    });

    socket.on("roomListUpdated", (rooms) => {
      setAvailableRooms(rooms);
    });

    socket.on("matchPlayers", (playersInRoom) => {
      setRoomPlayers(playersInRoom);
    });

    socket.on("joinedRoom", ({ roomId, gameName, roomPlayers }) => {
      setMyRoom(roomId, gameName, roomPlayers);
    });
  }, [
    rejoin,
    token,
    setPlayers,
    setBalance,
    setMyRoom,
    setAvailableRooms,
    setRoomPlayers,
  ]);

  const cleanupListeners = useCallback(() => {
    socket.off("connect", rejoin);
    socket.off("updatePlayers");
    socket.off("roomCreated");
    socket.off("roomListUpdated");
    socket.off("matchPlayers");
    socket.off("joinedRoom");

    listenersInitialized = false;
  }, [rejoin]);

  useEffect(() => {
    rejoin();
    setupListeners();

    return () => {
      cleanupListeners();
    };
  }, [rejoin, setupListeners, cleanupListeners]);
};
