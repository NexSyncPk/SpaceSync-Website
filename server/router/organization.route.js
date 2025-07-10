const express = require("express");
const router = express.Router();
const OrganizationController = require("../controllers/OrganizationController");
const authMiddleware = require("../middlewares/auth.middleware");
const asyncErrorHandler = require("../utils/asyncErrorHandler");
const roomRoutes = require("./room.route");

/**
 * @swagger
 * /organization/validate-invite:
 *   post:
 *     summary: Validate organization invite key
 *     description: Validate an organization invite key to check if it's valid and get basic organization info
 *     tags: [Organizations]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - inviteKey
 *             properties:
 *               inviteKey:
 *                 type: string
 *                 description: Organization invite key to validate
 *     responses:
 *       200:
 *         description: Invite key is valid
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
 *                         valid:
 *                           type: boolean
 *                           example: true
 *                         organization:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                               format: uuid
 *                             name:
 *                               type: string
 *       400:
 *         description: Invalid or expired invite key
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
// Public routes
router.post("/validate-invite", asyncErrorHandler(OrganizationController.validateInviteKey));

// Protected routes (authentication required)
router.use(authMiddleware);

/**
 * @swagger
 * /organization:
 *   get:
 *     summary: Get all organizations
 *     description: Retrieve all organizations. Admins see their own organization, regular users see limited info.
 *     tags: [Organizations]
 *     responses:
 *       200:
 *         description: Organizations retrieved successfully
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
 *                         $ref: '#/components/schemas/Organization'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", asyncErrorHandler(OrganizationController.getAllOrganizations));

/**
 * @swagger
 * /organization/{orgId}:
 *   get:
 *     summary: Get organization by ID
 *     description: Retrieve a specific organization by its ID. Users can only access their own organization.
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Organization'
 *       403:
 *         description: Forbidden - Cannot access other organizations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   put:
 *     summary: Update organization
 *     description: Update organization information. Admin role required.
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Organization name
 *     responses:
 *       200:
 *         description: Organization updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/Organization'
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
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   delete:
 *     summary: Delete organization
 *     description: Delete an organization and all its associated data. Admin role required.
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization deleted successfully
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
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:orgId", asyncErrorHandler(OrganizationController.getOrganizationById));
router.put("/:orgId", asyncErrorHandler(OrganizationController.updateOrganization));
router.delete("/:orgId", asyncErrorHandler(OrganizationController.deleteOrganization));

/**
 * @swagger
 * /organization/{orgId}/stats:
 *   get:
 *     summary: Get organization statistics
 *     description: Retrieve comprehensive statistics for the organization including user counts, room utilization, etc.
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Organization statistics retrieved successfully
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
 *                         totalUsers:
 *                           type: integer
 *                           description: Total number of users
 *                         totalRooms:
 *                           type: integer
 *                           description: Total number of rooms
 *                         totalReservations:
 *                           type: integer
 *                           description: Total number of reservations
 *                         activeReservations:
 *                           type: integer
 *                           description: Number of active reservations
 *                         roomUtilization:
 *                           type: number
 *                           format: float
 *                           description: Overall room utilization percentage
 *       403:
 *         description: Forbidden - Cannot access other organizations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:orgId/stats", asyncErrorHandler(OrganizationController.getOrganizationStats));

/**
 * @swagger
 * /organization/{orgId}/users:
 *   get:
 *     summary: Get organization users
 *     description: Retrieve all users belonging to the organization
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum: [admin, employee]
 *         description: Filter users by role
 *     responses:
 *       200:
 *         description: Organization users retrieved successfully
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
 *                         $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Cannot access other organizations
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:orgId/users", asyncErrorHandler(OrganizationController.getOrganizationUsers));

/**
 * @swagger
 * /organization/{orgId}/invite-key:
 *   get:
 *     summary: Get organization invite key
 *     description: Retrieve the current invite key for the organization. Admin role required.
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Invite key retrieved successfully
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
 *                         inviteKey:
 *                           type: string
 *                           description: Current organization invite key
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:orgId/invite-key", asyncErrorHandler(OrganizationController.getInviteKey));

/**
 * @swagger
 * /organization/{orgId}/regenerate-invite:
 *   post:
 *     summary: Regenerate organization invite key
 *     description: Generate a new invite key for the organization, invalidating the old one. Admin role required.
 *     tags: [Organizations]
 *     parameters:
 *       - in: path
 *         name: orgId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Organization ID
 *     responses:
 *       200:
 *         description: Invite key regenerated successfully
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
 *                         inviteKey:
 *                           type: string
 *                           description: New organization invite key
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Organization not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/:orgId/regenerate-invite", asyncErrorHandler(OrganizationController.regenerateInviteKey));

// Nested routes
router.use("/:orgId/rooms", roomRoutes);

module.exports = router;