require("dotenv").config();

const app = require("./app");
const { createServer } = require("http");
const { initializeSocket } = require("./services/SocketService");
const roomStatusService = require("./services/RoomStatusService");
const reservationStatusService = require("./services/ReservationStatusService");

const PORT = process.env.PORT || 8000;

// Create HTTP server
const server = createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Start room status monitoring
roomStatusService.startMonitoring();

// Start reservation status monitoring
reservationStatusService.start();

server.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
    console.log(`Socket.io initialized and ready for connections`);
    console.log(`Room status monitoring started`);
    console.log(`Reservation status monitoring started`);
});

process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    process.exit(1);
});

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    roomStatusService.stopMonitoring();
    reservationStatusService.stop();
    server.close(() => {
        console.log('Process terminated');
    });
});