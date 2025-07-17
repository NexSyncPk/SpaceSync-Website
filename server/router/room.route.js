const express = require("express");
const router = express.Router({ mergeParams: true });
const RoomController = require("../controllers/RoomController");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const authMiddleware = require("../middlewares/auth.middleware");
const reservationRoutes = require("./reservation.route");

const roomController = new RoomController();

// Apply authentication middleware to all room routes
router.use(authMiddleware);

/**
 * @swagger
 * /rooms:
 *   get:
 *     summary: Get all rooms
 *     description: Retrieve all rooms. Admins see all rooms in their organization, employees see available rooms.
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by room active status
 *       - in: query
 *         name: capacity
 *         schema:
 *           type: integer
 *         description: Filter by minimum capacity
 *     responses:
 *       200:
 *         description: Rooms retrieved successfully
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
 *                         $ref: '#/components/schemas/Room'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create a new room
 *     description: Create a new room in the organization. Admin role required.
 *     tags: [Rooms]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *             properties:
 *               name:
 *                 type: string
 *                 description: Room name
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Room capacity (number of people)
 *               displayProjector:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the room has a projector
 *               displayWhiteboard:
 *                 type: boolean
 *                 default: false
 *                 description: Whether the room has a whiteboard
 *               cateringAvailable:
 *                 type: boolean
 *                 default: false
 *                 description: Whether catering is available in the room
 *               videoConferenceAvailable:
 *                 type: boolean
 *                 default: false
 *                 description: Whether video conferencing is available in the room
 *     responses:
 *       201:
 *         description: Room created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input data
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
 */
router.get("/", asyncErrorHandler(roomController.getAllRooms.bind(roomController)));
router.post("/", asyncErrorHandler(roomController.createRoom.bind(roomController)));

/**
 * @swagger
 * /rooms/search:
 *   get:
 *     summary: Search rooms
 *     description: Search for rooms based on various criteria like capacity, amenities, availability
 *     tags: [Rooms]
 *     parameters:
 *       - in: query
 *         name: capacity
 *         schema:
 *           type: integer
 *         description: Minimum room capacity
 *       - in: query
 *         name: displayProjector
 *         schema:
 *           type: boolean
 *         description: Filter rooms with projector
 *       - in: query
 *         name: displayWhiteboard
 *         schema:
 *           type: boolean
 *         description: Filter rooms with whiteboard
 *       - in: query
 *         name: cateringAvailable
 *         schema:
 *           type: boolean
 *         description: Filter rooms with catering available
 *       - in: query
 *         name: videoConferenceAvailable
 *         schema:
 *           type: boolean
 *         description: Filter rooms with video conferencing available
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Start date for availability check
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date-time
 *         description: End date for availability check
 *     responses:
 *       200:
 *         description: Room search results
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
 *                         $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid search parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/search", asyncErrorHandler(roomController.searchRooms.bind(roomController)));

/**
 * @swagger
 * /rooms/statuses:
 *   get:
 *     summary: Get room statuses
 *     description: Get real-time status of all rooms (available, occupied, etc.)
 *     tags: [Rooms]
 *     responses:
 *       200:
 *         description: Room statuses retrieved successfully
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
 *                         type: object
 *                         properties:
 *                           roomId:
 *                             type: string
 *                             format: uuid
 *                           name:
 *                             type: string
 *                           status:
 *                             type: string
 *                             enum: [available, occupied, maintenance]
 *                           currentReservation:
 *                             $ref: '#/components/schemas/Reservation'
 *                           nextReservation:
 *                             $ref: '#/components/schemas/Reservation'
 */
router.get("/statuses", asyncErrorHandler(roomController.getRoomStatuses.bind(roomController)));

/**
 * @swagger
 * /rooms/{roomId}:
 *   get:
 *     summary: Get room by ID
 *     description: Retrieve a specific room by its ID
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Room'
 *       404:
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update room
 *     description: Update an existing room. Admin role required.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Room name
 *               capacity:
 *                 type: integer
 *                 minimum: 1
 *                 description: Room capacity (number of people)
 *               displayProjector:
 *                 type: boolean
 *                 description: Whether the room has a projector
 *               displayWhiteboard:
 *                 type: boolean
 *                 description: Whether the room has a whiteboard
 *               cateringAvailable:
 *                 type: boolean
 *                 description: Whether catering is available in the room
 *               videoConferenceAvailable:
 *                 type: boolean
 *                 description: Whether video conferencing is available in the room
 *     responses:
 *       200:
 *         description: Room updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Room'
 *       400:
 *         description: Invalid input data
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
 *         description: Room not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete room
 *     description: Delete an existing room. Admin role required.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - Admin role required
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
router.get("/:roomId", asyncErrorHandler(roomController.getRoomById.bind(roomController)));
router.put("/:roomId", asyncErrorHandler(roomController.updateRoom.bind(roomController)));
router.delete("/:roomId", asyncErrorHandler(roomController.deleteRoom.bind(roomController)));

/**
 * @swagger
 * /rooms/{roomId}/status:
 *   patch:
 *     summary: Toggle room status
 *     description: Toggle the active status of a room (active/inactive). Admin role required.
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *     responses:
 *       200:
 *         description: Room status toggled successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Room'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:roomId/status", asyncErrorHandler(roomController.toggleRoomStatus.bind(roomController)));

/**
 * @swagger
 * /rooms/{roomId}/availability:
 *   get:
 *     summary: Get room availability
 *     description: Check room availability for a specific date range
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for availability check
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for availability check
 *     responses:
 *       200:
 *         description: Room availability retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         available:
 *                           type: boolean
 *                           description: Whether the room is available in the specified time range
 *                         conflicts:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Reservation'
 *                           description: Conflicting reservations
 *                         availableSlots:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               start:
 *                                 type: string
 *                                 format: date-time
 *                               end:
 *                                 type: string
 *                                 format: date-time
 *       400:
 *         description: Invalid date parameters
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
router.get("/:roomId/availability", asyncErrorHandler(roomController.getRoomAvailability.bind(roomController)));

/**
 * @swagger
 * /rooms/{roomId}/stats:
 *   get:
 *     summary: Get room statistics
 *     description: Get usage statistics for a specific room
 *     tags: [Rooms]
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Room ID
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, quarter, year]
 *           default: month
 *         description: Time period for statistics
 *     responses:
 *       200:
 *         description: Room statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       type: object
 *                       properties:
 *                         totalReservations:
 *                           type: integer
 *                           description: Total number of reservations
 *                         utilization:
 *                           type: number
 *                           format: float
 *                           description: Utilization percentage
 *                         averageDuration:
 *                           type: number
 *                           description: Average reservation duration in hours
 *                         peakHours:
 *                           type: array
 *                           items:
 *                             type: integer
 *                           description: Most popular booking hours
 *                         frequentUsers:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               userId:
 *                                 type: string
 *                               name:
 *                                 type: string
 *                               reservationCount:
 *                                 type: integer
 *       403:
 *         description: Forbidden - Admin role required
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
router.get("/:roomId/stats", asyncErrorHandler(roomController.getRoomStats.bind(roomController)));

// Nested reservation routes
router.use("/:roomId/reservations", reservationRoutes);

module.exports = router;