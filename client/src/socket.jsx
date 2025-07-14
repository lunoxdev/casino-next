// Main entry point for the socket connection
// This file is used to connect to the server and handle socket events
import { io } from "socket.io-client";
const socket = io("http://localhost:3001");
export default socket;
