const BaseController = require('./BaseController.js');
const UserRepo = require('../repos/UserRepo.js');
const AdminRepo = require('../repos/AdminRepo.js');
const UserValidator = require('../validators/UserValidator.js');

class AdminController extends BaseController {
    constructor() {
        super();
        this.userRepo = new UserRepo();
        this.adminRepo = new AdminRepo();
        this.userValidator = new UserValidator();
    }

    getAllUsers = async (req, res, next) => {
        const { role, organizationId } = req.user;

        if (role !== 'admin') {
            return this.failureResponse('Only admins can view all users', next, 403);
        }

        if (!organizationId) {
            return this.failureResponse('You must be part of an organization to perform this action', next, 403);
        }

        const users = await this.adminRepo.getAllUsersInOrganization(organizationId);

        return this.successResponse(res, 'Users retrieved successfully', users);
    }

    getUserStats = async (req, res, next) => {
        const { role, organizationId } = req.user;

        if (role !== 'admin') {
            return this.failureResponse('Only admins can view user statistics', next, 403);
        }

        if (!organizationId) {
            return this.failureResponse('You must be part of an organization to perform this action', next, 403);
        }

        const stats = await this.adminRepo.getUserStatistics(organizationId);

        return this.successResponse(res, 'User statistics retrieved successfully', stats);
    }

    promoteToAdmin = async (req, res, next) => {
        const { userId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.role !== 'admin') {
            return this.failureResponse('Only admins can promote users', next, 403);
        }

        if (!requestingUser.organizationId) {
            return this.failureResponse('You must be part of an organization to perform this action', next, 403);
        }

        const targetUser = await this.userRepo.getUserById(userId);
        if (!targetUser || targetUser.organizationId !== requestingUser.organizationId) {
            return this.failureResponse('User not found in your organization', next, 404);
        }

        if (targetUser.role === 'admin') {
            return this.failureResponse('User is already an admin', next, 400);
        }

        await this.adminRepo.promoteUserToAdmin(userId);
        const updatedUser = await this.userRepo.getUserById(userId);

        return this.successResponse(res, 'User promoted to admin successfully', updatedUser);
    }

    demoteToEmployee = async (req, res, next) => {
        const { userId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.role !== 'admin') {
            return this.failureResponse('Only admins can demote users', next, 403);
        }

        if (!requestingUser.organizationId) {
            return this.failureResponse('You must be part of an organization to perform this action', next, 403);
        }

        if (requestingUser.userId === userId) {
            return this.failureResponse('You cannot demote yourself', next, 400);
        }

        const targetUser = await this.userRepo.getUserById(userId);
        if (!targetUser || targetUser.organizationId !== requestingUser.organizationId) {
            return this.failureResponse('User not found in your organization', next, 404);
        }

        if (targetUser.role !== 'admin') {
            return this.failureResponse('User is not an admin', next, 400);
        }

        await this.adminRepo.demoteUserToEmployee(userId);
        const updatedUser = await this.userRepo.getUserById(userId);

        return this.successResponse(res, 'User demoted to employee successfully', updatedUser);
    }

    removeUserFromOrganization = async (req, res, next) => {
        const { userId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.role !== 'admin') {
            return this.failureResponse('Only admins can remove users from organization', next, 403);
        }

        if (requestingUser.userId === userId) {
            return this.failureResponse('You cannot remove yourself from the organization', next, 400);
        }

        const targetUser = await this.userRepo.getUserById(userId);
        if (!targetUser || targetUser.organizationId !== requestingUser.organizationId) {
            return this.failureResponse('User not found in your organization', next, 404);
        }

        await this.adminRepo.removeUserFromOrganization(userId);

        return this.successResponse(res, 'User removed from organization successfully');
    }

    getOrganizationDashboard = async (req, res, next) => {
        const { role, organizationId } = req.user;

        if (role !== 'admin') {
            return this.failureResponse('Only admins can view organization dashboard', next, 403);
        }

        const dashboardData = await this.adminRepo.getOrganizationDashboard(organizationId);

        return this.successResponse(res, 'Organization dashboard data retrieved successfully', dashboardData);
    }

    updateUserProfile = async (req, res, next) => {
        const { userId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.role !== 'admin') {
            return this.failureResponse('Only admins can update user profiles', next, 403);
        }

        const targetUser = await this.userRepo.getUserById(userId);
        if (!targetUser || targetUser.organizationId !== requestingUser.organizationId) {
            return this.failureResponse('User not found in your organization', next, 404);
        }

        const validationResult = this.userValidator.validateUpdateUser(req.body);
        if (!validationResult.success) {
            return this.failureResponse('Validation failed', next, 422);
        }

        const updatedUser = await this.userRepo.updateUser(userId, validationResult.data);

        return this.successResponse(res, 'User profile updated successfully', updatedUser);
    }

    getPendingReservations = async (req, res, next) => {
        const { role, organizationId } = req.user;

        if (role !== 'admin') {
            return this.failureResponse('Only admins can view pending reservations', next, 403);
        }

        const pendingReservations = await this.adminRepo.getPendingReservations(organizationId);

        return this.successResponse(res, 'Pending reservations retrieved successfully', pendingReservations);
    }
}

module.exports = new AdminController();