import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  registerUserWithSocket,
  disconnectUserFromSocket,
} from "@/utils/socketManager";

const SocketManager: React.FC = () => {
  const { user, isAuthenticated } = useSelector((state: any) => state.auth);

  useEffect(() => {
    console.log("SocketManager: Auth state changed", {
      isAuthenticated,
      user: user?.id,
    });

    if (isAuthenticated && user && user.organizationId) {
      // Register user with socket when authenticated
      console.log("SocketManager: Registering user with socket");
      registerUserWithSocket(user);
    } else {
      // Disconnect when not authenticated
      console.log("SocketManager: Disconnecting from socket");
      disconnectUserFromSocket();
    }

    // Cleanup on unmount
    return () => {
      if (!isAuthenticated) {
        disconnectUserFromSocket();
      }
    };
  }, [isAuthenticated, user]);

  return null; // This component doesn't render anything
};

export default SocketManager;
