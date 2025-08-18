import { useEffect, useCallback } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { useProfileStore } from "../stores/useProfileStore";
import { useRoomsStore } from "../stores/useRoomsStore";
import socket from "../socket";
import { type LobbySocketOptions } from "./../types/room";

let listenersInitialized = false;

export const useLobbySocket = ({ setPlayers }: LobbySocketOptions) => {
  const { uuid } = useAuthStore.getState();
  const { nickname, balance } = useProfileStore();
  const { setMyRoom, setRoomPlayers, setAvailableRooms } = useRoomsStore();

  const rejoin = useCallback(() => {
    if (uuid && nickname) {
      socket.emit("playerJoined", { uuid, nickname, balance });
      socket.emit("getRooms");
    }
  }, [uuid, nickname, balance]);

  const setupListeners = useCallback(() => {
    if (listenersInitialized) return;
    listenersInitialized = true;

    socket.on("connect", rejoin);

    socket.on("updatePlayers", (updatedList) => {
      setPlayers(updatedList);
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
  }, [rejoin, setPlayers, setMyRoom, setAvailableRooms, setRoomPlayers]);

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
