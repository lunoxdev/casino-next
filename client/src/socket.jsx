// Main entry point for the socket connection
// This file is used to connect to the server and handle socket events
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_SOCKET_URL);

export default socket;
