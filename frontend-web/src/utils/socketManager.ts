import socket from "./socket";
import { User } from "@/types/interfaces";

// Add connection event listeners
socket.on("connect", () => {
  console.log("✅ Socket connected successfully:", socket.id);
});

socket.on("disconnect", (reason) => {
  console.log("❌ Socket disconnected:", reason);
});

socket.on("connect_error", (error) => {
  console.error("🔴 Socket connection error:", error);
});

export const registerUserWithSocket = (user: User) => {
  if (user && user.id && user.role && user.organizationId) {
    // Connect if not already connected
    if (!socket.connected) {
      console.log("🔄 Connecting to socket server...");
      socket.connect();
    }

    // Wait for connection before registering
    const registerUser = () => {
      console.log("🚀 Registering user with socket:", {
        userId: user.id,
        role: user.role,
        organizationId: user.organizationId,
      });

      socket.emit("userRegistered", {
        userId: user.id,
        role: user.role,
        organizationId: user.organizationId,
      });
    };

    if (socket.connected) {
      registerUser();
    } else {
      socket.once("connect", registerUser);
    }
  }
};

export const disconnectUserFromSocket = () => {
  if (socket && socket.connected) {
    console.log("🔌 Disconnecting user from socket");
    socket.disconnect();
  }
};

export default socket;
