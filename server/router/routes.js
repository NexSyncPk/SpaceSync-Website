const express = require("express");
const router = express.Router();
const organizationRoutes = require("./organization.route.js");
const userRoutes = require("./user.route.js");
const adminRoutes = require("./admin.route.js");
const externalAttendeeRoutes = require("./externalAttendees.route.js");
const roomRoutes = require("./room.route.js");
const reservationRoutes = require("./reservation.route.js");

/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: API health check endpoints
 *   - name: Users
 *     description: User management and authentication
 *   - name: Organizations
 *     description: Organization management
 *   - name: Admin
 *     description: Administrative functions (admin role required)
 *   - name: Rooms
 *     description: Room management and availability
 *   - name: Reservations
 *     description: Room reservation management
 *   - name: External Attendees
 *     description: External attendee management for reservations
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns the current status of the SpaceSync API
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "SpaceSync API is running"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: "2024-01-15T10:30:00.000Z"
 *                 version:
 *                   type: string
 *                   example: "1.0.0"
 */
// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'SpaceSync API is running',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

router.use("/organization", organizationRoutes);
router.use("/user", userRoutes);
router.use("/admin", adminRoutes);
router.use("/external-attendees", externalAttendeeRoutes);

// Global room and reservation routes (for admin/cross-org access)
router.use("/rooms", roomRoutes);
router.use("/reservations", reservationRoutes);

module.exports = router;