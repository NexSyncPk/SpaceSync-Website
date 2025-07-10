const express = require("express");
const router = express.Router({ mergeParams: true });
const ReservationController = require("../controllers/ReservationController");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const externalAttendeesRoutes = require("./externalAttendees.route");

const reservationController = new ReservationController();

// Apply authentication middleware to all reservation routes
router.use(authMiddleware);

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Get all reservations
 *     description: Retrieve all reservations. Admins see all reservations in their organization, employees see only their own.
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: roomId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by room ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filter by reservation status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reservations from this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter reservations until this date
 *     responses:
 *       200:
 *         description: Reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reservation'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a new reservation
 *     description: Create a new room reservation
 *     tags: [Reservations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - agenda
 *               - startTime
 *               - endTime
 *               - roomId
 *             properties:
 *               agenda:
 *                 type: string
 *                 description: Meeting agenda or purpose
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Reservation start date and time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Reservation end date and time
 *               roomId:
 *                 type: string
 *                 format: uuid
 *                 description: ID of the room to reserve
 *               internalAttendees:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of user IDs who are internal attendees
 *     responses:
 *       201:
 *         description: Reservation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or room conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", asyncErrorHandler(reservationController.getAllReservations.bind(reservationController)));
router.post("/", asyncErrorHandler(reservationController.createReservation.bind(reservationController)));

/**
 * @swagger
 * /reservations/upcoming:
 *   get:
 *     summary: Get upcoming reservations
 *     description: Retrieve upcoming reservations for the current user or organization
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of reservations to return
 *     responses:
 *       200:
 *         description: Upcoming reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reservation'
 */
router.get("/upcoming", asyncErrorHandler(reservationController.getUpcomingReservations.bind(reservationController)));

/**
 * @swagger
 * /reservations/my:
 *   get:
 *     summary: Get current user's reservations
 *     description: Retrieve all reservations made by the current user
 *     tags: [Reservations]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, cancelled]
 *         description: Filter by reservation status
 *     responses:
 *       200:
 *         description: User reservations retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Reservation'
 */
router.get("/my", asyncErrorHandler(reservationController.getMyReservations.bind(reservationController)));

/**
 * @swagger
 * /reservations/{reservationId}:
 *   get:
 *     summary: Get reservation by ID
 *     description: Retrieve a specific reservation by its ID
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Reservation'
 *       403:
 *         description: Forbidden - Not authorized to view this reservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update reservation
 *     description: Update an existing reservation. Only the reservation owner or admin can update.
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               agenda:
 *                 type: string
 *                 description: Meeting agenda or purpose
 *               startTime:
 *                 type: string
 *                 format: date-time
 *                 description: Reservation start date and time
 *               endTime:
 *                 type: string
 *                 format: date-time
 *                 description: Reservation end date and time
 *               internalAttendees:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 description: Array of user IDs who are internal attendees
 *     responses:
 *       200:
 *         description: Reservation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid input or room conflict
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Not authorized to update this reservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Cancel reservation
 *     description: Cancel an existing reservation. Only the reservation owner or admin can cancel.
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     responses:
 *       200:
 *         description: Reservation cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - Not authorized to cancel this reservation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:reservationId", asyncErrorHandler(reservationController.getReservationById.bind(reservationController)));
router.put("/:reservationId", asyncErrorHandler(reservationController.updateReservation.bind(reservationController)));
router.delete("/:reservationId", asyncErrorHandler(reservationController.deleteReservation.bind(reservationController)));

/**
 * @swagger
 * /reservations/{reservationId}/status:
 *   patch:
 *     summary: Update reservation status
 *     description: Update the status of a reservation (confirm, cancel, etc.). Admin only operation.
 *     tags: [Reservations]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, cancelled]
 *                 description: New reservation status
 *     responses:
 *       200:
 *         description: Reservation status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Reservation'
 *       400:
 *         description: Invalid status value
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reservation not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:reservationId/status", asyncErrorHandler(reservationController.updateReservationStatus.bind(reservationController)));

// Nested external attendees routes
router.use("/:reservationId/attendees", externalAttendeesRoutes);

module.exports = router;