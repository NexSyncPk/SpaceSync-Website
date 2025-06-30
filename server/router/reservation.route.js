const express = require("express");
const router = express.Router({ mergeParams: true });
const ReservationController = require("../controllers/reservation.controller");

router.get("/", ReservationController.getAllReservations);
router.post("/", ReservationController.createReservation);
router.get("/:reservationId", ReservationController.getReservationById);
router.put("/:reservationId", ReservationController.updateReservation);
router.delete("/:reservationId", ReservationController.deleteReservation);

module.exports = router;