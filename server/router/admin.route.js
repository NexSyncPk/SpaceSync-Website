const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const asyncErrorHandler = require('../utils/asyncErrorHandler');
const authenticateToken = require('../middlewares/auth.middleware');

router.use(authenticateToken);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users in organization
 *     description: Retrieve all users belonging to the admin's organization. Requires admin role.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users', asyncErrorHandler(AdminController.getAllUsers));

/**
 * @swagger
 * /admin/users/stats:
 *   get:
 *     summary: Get user statistics
 *     description: Retrieve user statistics for the organization including counts by role, activity metrics, etc.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: User statistics retrieved successfully
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
 *                           description: Total number of users in organization
 *                         usersByRole:
 *                           type: object
 *                           properties:
 *                             admin:
 *                               type: integer
 *                             employee:
 *                               type: integer
 *                         activeUsers:
 *                           type: integer
 *                           description: Number of active users
 *                         newUsersThisMonth:
 *                           type: integer
 *                           description: Number of users who joined this month
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/users/stats', asyncErrorHandler(AdminController.getUserStats));

/**
 * @swagger
 * /admin/users/{userId}/promote:
 *   put:
 *     summary: Promote user to admin
 *     description: Promote an employee to admin role within the organization.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to promote
 *     responses:
 *       200:
 *         description: User promoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid operation (user not in organization or already admin)
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/users/:userId/promote', asyncErrorHandler(AdminController.promoteToAdmin));

/**
 * @swagger
 * /admin/users/{userId}/demote:
 *   put:
 *     summary: Demote admin to employee
 *     description: Demote an admin to employee role within the organization.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to demote
 *     responses:
 *       200:
 *         description: User demoted successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid operation (user not admin or last admin in organization)
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/users/:userId/demote', asyncErrorHandler(AdminController.demoteToEmployee));

/**
 * @swagger
 * /admin/users/{userId}:
 *   delete:
 *     summary: Remove user from organization
 *     description: Remove a user from the organization, setting their role to 'unassigned'.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to remove
 *     responses:
 *       200:
 *         description: User removed from organization successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       400:
 *         description: Invalid operation (cannot remove last admin)
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
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/users/:userId', asyncErrorHandler(AdminController.removeUserFromOrganization));

/**
 * @swagger
 * /admin/users/{userId}/profile:
 *   put:
 *     summary: Update user profile (admin)
 *     description: Update any user's profile information. Admin version with elevated permissions.
 *     tags: [Admin]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: User's full name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/ApiResponse'
 *                 - type: object
 *                   properties:
 *                     data:
 *                       $ref: '#/components/schemas/User'
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/users/:userId/profile', asyncErrorHandler(AdminController.updateUserProfile));

/**
 * @swagger
 * /admin/dashboard:
 *   get:
 *     summary: Get organization dashboard data
 *     description: Retrieve comprehensive dashboard data for the organization including user stats, room utilization, recent activity, etc.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Dashboard data retrieved successfully
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
 *                         userStats:
 *                           type: object
 *                         roomStats:
 *                           type: object
 *                         reservationStats:
 *                           type: object
 *                         recentActivity:
 *                           type: array
 *                           items:
 *                             type: object
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/dashboard', asyncErrorHandler(AdminController.getOrganizationDashboard));

/**
 * @swagger
 * /admin/reservations/pending:
 *   get:
 *     summary: Get pending reservations
 *     description: Retrieve all pending reservations that require admin approval within the organization.
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Pending reservations retrieved successfully
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
 *       403:
 *         description: Forbidden - Admin role required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/reservations/pending', asyncErrorHandler(AdminController.getPendingReservations));

module.exports = router;