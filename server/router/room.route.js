const express = require("express");
const router = express.Router({ mergeParams: true });
const RoomController = require("../controllers/room.controller");
const reservationRoutes = require("./reservation.route");

router.get("/", RoomController.getAllRooms);
router.post("/", RoomController.createRoom);
router.get("/:roomId", RoomController.getRoomById);
router.put("/:roomId", RoomController.updateRoom);
router.delete("/:roomId", RoomController.deleteRoom);

router.use("/:roomId/reservations", reservationRoutes);

module.exports = router;