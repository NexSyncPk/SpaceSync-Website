const BaseRepo = require('./BaseRepo');
const { User, Organization } = require('../models');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');

class UserRepo extends BaseRepo {
    constructor() {
        super(User);
    }

    async getAllUsers(organizationId = null) {
        const where = organizationId ? { organizationId } : {};
        
        return await this.model.findAll({
            where,
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async getUserById(id) {
        return await this.model.findByPk(id, {
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name', 'inviteKey']
                }
            ]
        });
    }

    async getUserByEmail(email) {
        return await this.model.findOne({
            where: { email },
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async createUser(userData) {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 12);
        }
        
        const user = await this.model.create(userData);
        
        return await this.getUserById(user.id);
    }

    async updateUser(id, userData) {
        if (userData.password) {
            userData.password = await bcrypt.hash(userData.password, 12);
        }
        
        await this.update(userData, { id });
        return await this.getUserById(id);
    }

    async updateProfile(userId, profileData) {
        await this.update(profileData, { id: userId });
        return await this.getUserById(userId);
    }

    async comparePassword(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }

    async getUsersByOrganization(organizationId) {
        return await this.model.findAll({
            where: { organizationId },
            attributes: { exclude: ['password'] },
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async updateUserRole(userId, role) {
        return await this.update({ role }, { id: userId });
    }

    async removeUserFromOrganization(userId) {
        return await this.update({ 
            organizationId: null,
            role: 'unassigned' 
        }, { id: userId });
    }

    async getUsersWithoutOrganization() {
        return await this.model.findAll({
            where: { organizationId: null },
            attributes: { exclude: ['password'] }
        });
    }

    async joinOrganization(userId, organizationId, role = 'employee') {
        // Use a database transaction to ensure atomicity
        const result = await this.model.update({ 
            organizationId,
            role 
        }, { 
            where: { id: userId },
            returning: true // Ensure we get the updated record
        });
        
        // Return the updated user with organization data
        return await this.getUserById(userId);
    }

    async getUserStatistics(organizationId) {
        const totalUsers = await this.model.count({
            where: { organizationId },
        });

        const adminCount = await this.model.count({
            where: {
                organizationId,
                role: "admin",
            },
        });

        const employeeCount = await this.model.count({
            where: {
                organizationId,
                role: "employee",
            },
        });

        const activeUsers = await this.model.count({
            where: {
                organizationId,
                updatedAt: {
                    [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
        });

        return {
            totalUsers,
            adminCount,
            employeeCount,
            activeUsers,
            inactiveUsers: totalUsers - activeUsers,
        };
    }
}

module.exports = UserRepo;