const express = require("express");
const router = express.Router({ mergeParams: true });
const ExternalAttendeeController = require("../controllers/ExternalAttendeeController");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const authMiddleware = require("../middlewares/auth.middleware");

const externalAttendeeController = new ExternalAttendeeController();

// Apply authentication middleware to all external attendee routes
router.use(authMiddleware);

/**
 * @swagger
 * /external-attendees:
 *   get:
 *     summary: Get all external attendees
 *     description: Retrieve all external attendees. When accessed via /reservations/{reservationId}/attendees, returns attendees for specific reservation.
 *     tags: [External Attendees]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID (when accessed via reservation nested route)
 *     responses:
 *       200:
 *         description: External attendees retrieved successfully
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
 *                         $ref: '#/components/schemas/ExternalAttendee'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Cannot access other reservations' attendees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Create external attendee
 *     description: Add a new external attendee to a reservation
 *     tags: [External Attendees]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID (when accessed via reservation nested route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 description: External attendee's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: External attendee's email address
 *               phone:
 *                 type: string
 *                 description: External attendee's phone number (optional)
 *               reservationId:
 *                 type: string
 *                 format: uuid
 *                 description: Reservation ID (required when not using nested route)
 *     responses:
 *       201:
 *         description: External attendee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExternalAttendee'
 *       400:
 *         description: Invalid input data or duplicate email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Cannot add attendees to other reservations
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
router.get("/", asyncErrorHandler(externalAttendeeController.getAllExternalAttendees.bind(externalAttendeeController)));
router.post("/", asyncErrorHandler(externalAttendeeController.createExternalAttendee.bind(externalAttendeeController)));

/**
 * @swagger
 * /external-attendees/bulk:
 *   post:
 *     summary: Create multiple external attendees
 *     description: Add multiple external attendees to a reservation in a single operation
 *     tags: [External Attendees]
 *     parameters:
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID (when accessed via reservation nested route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - attendees
 *             properties:
 *               attendees:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - name
 *                     - email
 *                   properties:
 *                     name:
 *                       type: string
 *                       description: External attendee's name
 *                     email:
 *                       type: string
 *                       format: email
 *                       description: External attendee's email address
 *                     phone:
 *                       type: string
 *                       description: External attendee's phone number (optional)
 *               reservationId:
 *                 type: string
 *                 format: uuid
 *                 description: Reservation ID (required when not using nested route)
 *     responses:
 *       201:
 *         description: External attendees created successfully
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
 *                         $ref: '#/components/schemas/ExternalAttendee'
 *       400:
 *         description: Invalid input data or duplicate emails
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Cannot add attendees to other reservations
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
router.post("/bulk", asyncErrorHandler(externalAttendeeController.bulkCreateExternalAttendees.bind(externalAttendeeController)));

/**
 * @swagger
 * /external-attendees/{attendeeId}:
 *   get:
 *     summary: Get external attendee by ID
 *     description: Retrieve a specific external attendee by their ID
 *     tags: [External Attendees]
 *     parameters:
 *       - in: path
 *         name: attendeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: External attendee ID
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID (when accessed via reservation nested route)
 *     responses:
 *       200:
 *         description: External attendee retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExternalAttendee'
 *       403:
 *         description: Forbidden - Cannot access other reservations' attendees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: External attendee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update external attendee
 *     description: Update an existing external attendee's information
 *     tags: [External Attendees]
 *     parameters:
 *       - in: path
 *         name: attendeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: External attendee ID
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID (when accessed via reservation nested route)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: External attendee's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: External attendee's email address
 *     responses:
 *       200:
 *         description: External attendee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/ExternalAttendee'
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Forbidden - Cannot update other reservations' attendees
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: External attendee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Remove external attendee
 *     description: Remove an external attendee from a reservation
 *     tags: [External Attendees]
 *     parameters:
 *       - in: path
 *         name: attendeeId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: External attendee ID
 *       - in: path
 *         name: reservationId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Reservation ID (when accessed via reservation nested route)
 *     responses:
 *       200:
 *         description: External attendee removed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       403:
 *         description: Forbidden - Cannot remove attendees from other reservations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: External attendee not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:attendeeId", asyncErrorHandler(externalAttendeeController.getExternalAttendeeById.bind(externalAttendeeController)));
router.put("/:attendeeId", asyncErrorHandler(externalAttendeeController.updateExternalAttendee.bind(externalAttendeeController)));
router.delete("/:attendeeId", asyncErrorHandler(externalAttendeeController.deleteExternalAttendee.bind(externalAttendeeController)));

module.exports = router;