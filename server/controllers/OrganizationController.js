const BaseController = require('./BaseController');
const OrganizationRepo = require('../repos/OrganizationRepo');
const UserRepo = require('../repos/UserRepo');
const OrganizationValidator = require('../validators/OrganizationValidator');

class OrganizationController extends BaseController {
    constructor() {
        super();
        this.organizationRepo = new OrganizationRepo();
        this.userRepo = new UserRepo();
        this.organizationValidator = new OrganizationValidator();
    }

    getAllOrganizations = async (req, res, next) => {
        const organizations = await this.organizationRepo.getAllOrganizations();

        return this.successResponse(res, 'Organizations retrieved successfully', organizations);
    };

    getOrganizationById = async (req, res, next) => {
        const { orgId } = req.params;
        const requestingUser = req.user;

        console.log(`Organization request - orgId: ${orgId}, requestingUser.organizationId: ${requestingUser.organizationId}, requestingUser.role: ${requestingUser.role}`);

        if (requestingUser.organizationId !== orgId && requestingUser.role !== 'admin') {
            return this.failureResponse('Access denied', next, 403);
        }

        const organization = await this.organizationRepo.getOrganizationById(orgId);
        if (!organization) {
            return this.failureResponse('Organization not found', next, 404);
        }

        // Enhanced logging for debugging member count issue
        console.log(`✅ Fetched organization ${orgId}:`, {
            id: organization.id,
            name: organization.name,
            userCount: organization.Users ? organization.Users.length : 0,
            roomCount: organization.Rooms ? organization.Rooms.length : 0,
            users: organization.Users ? organization.Users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role })) : [],
            timestamp: new Date().toISOString()
        });

        return this.successResponse(res, 'Organization retrieved successfully', organization);
    };

    updateOrganization = async (req, res, next) => {
        const { orgId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.organizationId !== orgId || requestingUser.role !== 'admin') {
            return this.failureResponse('Only organization admins can update organization', next, 403);
        }

        const validationResult = this.organizationValidator.validateUpdateOrganization(req.body);
        if (!validationResult.success) {
            return this.failureResponse('Validation failed', next, 422);
        }

        const organization = await this.organizationRepo.updateOrganization(orgId, validationResult.data);

        return this.successResponse(res, 'Organization updated successfully', organization);
    };

    deleteOrganization = async (req, res, next) => {
        const { orgId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.organizationId !== orgId || requestingUser.role !== 'admin') {
            return this.failureResponse('Only organization admins can delete organization', next, 403);
        }

        const organization = await this.organizationRepo.getOrganizationById(orgId);
        if (!organization) {
            return this.failureResponse('Organization not found', next, 404);
        }

        await this.organizationRepo.deleteOrganization(orgId);

        return this.successResponse(res, 'Organization deleted successfully');
    };

    getOrganizationStats = async (req, res, next) => {
        const { orgId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.organizationId !== orgId || requestingUser.role !== 'admin') {
            return this.failureResponse('Only organization admins can view organization stats', next, 403);
        }

        const result = await this.organizationRepo.getOrganizationStats(orgId);
        if (!result) {
            return this.failureResponse('Organization not found', next, 404);
        }

        return this.successResponse(res, 'Organization stats retrieved successfully', result);
    };

    getOrganizationUsers = async (req, res, next) => {
        const { orgId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.organizationId !== orgId || requestingUser.role !== 'admin') {
            return this.failureResponse('Only organization admins can view organization users', next, 403);
        }

        const users = await this.organizationRepo.getOrganizationUsers(orgId);

        return this.successResponse(res, 'Organization users retrieved successfully', users);
    };

    regenerateInviteKey = async (req, res, next) => {
        const { orgId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.organizationId !== orgId || requestingUser.role !== 'admin') {
            return this.failureResponse('Only organization admins can regenerate invite key', next, 403);
        }

        const organization = await this.organizationRepo.regenerateInviteKey(orgId);

        return this.successResponse(res, 'Invite key regenerated successfully', {
            inviteKey: organization.inviteKey
        });
    };

    getInviteKey = async (req, res, next) => {
        const { orgId } = req.params;
        const requestingUser = req.user;

        if (requestingUser.organizationId !== orgId || requestingUser.role !== 'admin') {
            return this.failureResponse('Only organization admins can view invite key', next, 403);
        }

        const organization = await this.organizationRepo.getOrganizationById(orgId);
        if (!organization) {
            return this.failureResponse('Organization not found', next, 404);
        }

        return this.successResponse(res, 'Invite key retrieved successfully', {
            inviteKey: organization.inviteKey
        });
    };

    validateInviteKey = async (req, res, next) => {
        const { inviteKey } = req.body;

        if (!inviteKey) {
            return this.failureResponse('Invite key is required', next, 422);
        }

        const organization = await this.organizationRepo.getOrganizationByInviteKey(inviteKey);
        
        if (!organization) {
            return this.failureResponse('Invalid invite key', next, 404);
        }

        return this.successResponse(res, 'Invite key is valid', {
            organizationName: organization.name,
            memberCount: organization.Users.length
        });
    };
}

module.exports = new OrganizationController();