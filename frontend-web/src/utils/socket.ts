// frontend/src/socket.js
import { io } from "socket.io-client";

// Connect to backend (adjust URL and port accordingly)
const socket = io("http://localhost:8000", {
  autoConnect: false, // Don't connect automatically
  withCredentials: true,
}); // or your deployed backend URL

export default socket;
