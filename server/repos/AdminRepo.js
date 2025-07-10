const BaseRepo = require("./BaseRepo");
const UserRepo = require("./UserRepo");
const OrganizationRepo = require("./OrganizationRepo");
const RoomRepo = require("./RoomRepo");
const ReservationRepo = require("./ReservationRepo");

class AdminRepo extends BaseRepo {
    constructor() {
        super();
        this.userRepo = new UserRepo();
        this.organizationRepo = new OrganizationRepo();
        this.roomRepo = new RoomRepo();
        this.reservationRepo = new ReservationRepo();
    }

    async getAllUsersInOrganization(organizationId) {
        return await this.userRepo.getAllUsers(organizationId);
    }

    async getUserStatistics(organizationId) {
        return await this.userRepo.getUserStatistics(organizationId);
    }

    async promoteUserToAdmin(userId) {
        return await this.userRepo.updateUser(userId, { role: "admin" });
    }

    async demoteUserToEmployee(userId) {
        return await this.userRepo.updateUser(userId, { role: "employee" });
    }

    async removeUserFromOrganization(userId) {
        return await this.userRepo.updateUser(userId, {
            organizationId: null,
            role: "unassigned",
        });
    }

    async getOrganizationDashboard(organizationId) {
        const organization = await this.organizationRepo.getOrganizationById(organizationId);
        if (!organization) {
            throw new Error('Organization not found');
        }

        const userStats = await this.getUserStatistics(organizationId);

        const rooms = await this.roomRepo.getAllRooms(organizationId);
        const roomCount = rooms.length;

        const totalReservations = await this.reservationRepo.getReservationCountForOrganization(organizationId);
        const pendingReservations = await this.reservationRepo.getReservationCountForOrganization(organizationId, "pending");
        const confirmedReservations = await this.reservationRepo.getReservationCountForOrganization(organizationId, "confirmed");
        const cancelledReservations = await this.reservationRepo.getReservationCountForOrganization(organizationId, "cancelled");

        return {
            organization: {
                id: organization.id,
                name: organization.name,
                createdAt: organization.createdAt
            },
            userStats,
            roomStats: {
                totalRooms: roomCount,
            },
            reservationStats: {
                total: totalReservations,
                pending: pendingReservations,
                confirmed: confirmedReservations,
                cancelled: cancelledReservations,
            },
        };
    }

    async getPendingReservations(organizationId) {
        return await this.reservationRepo.getPendingReservationsForOrganization(organizationId);
    }
}

module.exports = AdminRepo;