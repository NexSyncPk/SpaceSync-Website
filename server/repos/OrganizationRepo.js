const BaseRepo = require("./BaseRepo");
const { Organization, User, Room } = require("../models");
const crypto = require('crypto');

class OrganizationRepo extends BaseRepo {
    constructor() {
        super(Organization);
    }

    async getAllOrganizations() {
        return await this.model.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'role']
                }
            ]
        });
    }

    async getOrganizationById(id) {
        return await this.model.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'role']
                },
                {
                    model: Room,
                    attributes: ['id', 'name', 'capacity']
                }
            ]
        });
    }

    async createOrganization(organizationData) {
        organizationData.inviteKey = this.generateInviteKey();
        
        return await this.model.create(organizationData);
    }

    async updateOrganization(id, organizationData) {
        await this.update(organizationData, { id });
        return await this.getOrganizationById(id);
    }

    async getOrganizationByInviteKey(inviteKey) {
        return await this.model.findOne({
            where: { inviteKey },
            include: [
                {
                    model: User,
                    attributes: ['id', 'name', 'email', 'role']
                }
            ]
        });
    }

    async regenerateInviteKey(id) {
        const newInviteKey = this.generateInviteKey();
        
        await this.update({ inviteKey: newInviteKey }, { id });
        return await this.getOrganizationById(id);
    }

    async getOrganizationStats(id) {
        const organization = await this.model.findByPk(id, {
            include: [
                {
                    model: User,
                    attributes: ['id', 'role']
                },
                {
                    model: Room,
                    attributes: ['id']
                }
            ]
        });

        if (!organization) return null;

        const stats = {
            totalUsers: organization.Users.length,
            adminUsers: organization.Users.filter(user => user.role === 'admin').length,
            employeeUsers: organization.Users.filter(user => user.role === 'employee').length,
            totalRooms: organization.Rooms.length
        };

        return { organization, stats };
    }

    async getOrganizationUsers(id, role = null) {
        const where = role ? { organizationId: id, role } : { organizationId: id };
        
        return await User.findAll({
            where,
            attributes: { exclude: ['password'] }
        });
    }

    async getOrganizationAdmins(id) {
        return await this.getOrganizationUsers(id, 'admin');
    }

    async deleteOrganization(id) {
        await User.update(
            { organizationId: null, role: 'employee' },
            { where: { organizationId: id } }
        );
        
        return await this.delete(id);
    }

    generateInviteKey() {
        return crypto.randomBytes(16).toString('hex').toUpperCase();
    }

    async validateInviteKey(inviteKey) {
        const organization = await this.getOrganizationByInviteKey(inviteKey);
        return organization !== null;
    }
}

module.exports = OrganizationRepo;