const { Server } = require("socket.io");

let clients = new Map();
let io = null;

function initializeSocket(server) {
  console.log("Initializing Socket.io...");
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("New Connection Established", socket.id);

    socket.on("userRegistered", (data) => {
      const { userId, role, organizationId } = data;
      clients.set(userId.toString(), {
        socketId: socket.id,
        role: role,
        organizationId: organizationId,
      });
      console.log("Connected", { userId, role, organizationId });
    });

    socket.on("disconnect", () => {
      for (const [key, value] of clients.entries()) {
        if (value.socketId === socket.id) {
          clients.delete(key);
          console.log(`User with ID ${key} has been disconnected`);
          break;
        }
      }
    });
  });
}

function getIO() {
  if (!io) {
    throw new Error(
      "Socket.io is not initialized. Call initializeSocket(server) first."
    );
  }
  return io;
}

function getClients() {
  if (!clients) {
    throw new Error(
      "Clients map is not initialized. Ensure the server has called initializeSocket(server)."
    );
  }
  return clients;
}

// Notify admins when employee makes a reservation request
function notifyAdminNewReservation(reservation, organizationId) {
  try {
    if (!io) return;

    // Find all admin users in the organization
    for (const [userId, clientData] of clients.entries()) {
      if (
        clientData.role === "admin" &&
        clientData.organizationId === organizationId
      ) {
        io.to(clientData.socketId).emit("newReservationRequest", {
          type: "new_reservation_request",
          reservation: reservation,
          message: `New reservation request from ${
            reservation.User?.name || "Employee"
          }`,
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error notifying admin:", error);
  }
}

// Notify employee when admin responds to their reservation
function notifyEmployeeReservationStatus(reservation, organizationId) {
  try {
    if (!io) return;

    const employeeClient = clients.get(reservation.userId.toString());
    if (employeeClient && employeeClient.organizationId === organizationId) {
      io.to(employeeClient.socketId).emit("reservationStatusUpdate", {
        type: "reservation_status_update",
        reservation: reservation,
        message: `Your reservation has been ${reservation.status}`,
        timestamp: new Date(),
      });
    }
  } catch (error) {
    console.error("Error notifying employee:", error);
  }
}

// Notify organization when room becomes occupied/free
function notifyRoomStatusChange(roomId, status, organizationId) {
  try {
    if (!io) return;

    // Notify all users in the organization about room status change
    for (const [userId, clientData] of clients.entries()) {
      if (clientData.organizationId === organizationId) {
        io.to(clientData.socketId).emit("roomStatusUpdate", {
          type: "room_status_change",
          roomId: roomId,
          status: status, // 'occupied' or 'free'
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error notifying room status:", error);
  }
}

// Notify organization when room details are updated
function notifyRoomUpdated(room, organizationId) {
  try {
    if (!io) return;

    // Notify all users in the organization about room updates
    for (const [userId, clientData] of clients.entries()) {
      if (clientData.organizationId === organizationId) {
        io.to(clientData.socketId).emit("roomUpdated", {
          type: "room_updated",
          room: room,
          message: `Room "${room.name}" has been updated`,
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error notifying room update:", error);
  }
}

// Notify organization when reservation is updated
function notifyReservationUpdated(reservation, organizationId) {
  try {
    if (!io) return;

    // Notify all users in the organization about reservation update
    for (const [userId, clientData] of clients.entries()) {
      if (clientData.organizationId === organizationId) {
        io.to(clientData.socketId).emit("reservationUpdated", {
          type: "reservation_updated",
          reservation: reservation,
          message: `Reservation for ${
            reservation.Room?.name || "room"
          } has been updated`,
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error notifying reservation update:", error);
  }
}

// Notify organization when reservation is cancelled
function notifyReservationCancelled(reservation, organizationId) {
  try {
    if (!io) return;

    // Notify all users in the organization about reservation cancellation
    for (const [userId, clientData] of clients.entries()) {
      if (clientData.organizationId === organizationId) {
        io.to(clientData.socketId).emit("reservationCancelled", {
          type: "reservation_cancelled",
          reservation: reservation,
          message: `Reservation for ${
            reservation.Room?.name || "room"
          } has been cancelled`,
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error notifying reservation cancellation:", error);
  }
}

// Notify organization when reservation is completed
function notifyReservationCompleted(reservation, organizationId) {
  try {
    if (!io) return;

    // Notify all users in the organization about reservation completion
    for (const [userId, clientData] of clients.entries()) {
      if (clientData.organizationId === organizationId) {
        io.to(clientData.socketId).emit("reservationCompleted", {
          type: "reservation_completed",
          reservation: reservation,
          message: `Reservation for ${
            reservation.Room?.name || "room"
          } has been completed`,
          timestamp: new Date(),
        });
      }
    }
  } catch (error) {
    console.error("Error notifying reservation completion:", error);
  }
}

module.exports = {
  initializeSocket,
  getIO,
  getClients,
  notifyAdminNewReservation,
  notifyEmployeeReservationStatus,
  notifyRoomStatusChange,
  notifyRoomUpdated,
  notifyReservationUpdated,
  notifyReservationCancelled,
  notifyReservationCompleted,
};
