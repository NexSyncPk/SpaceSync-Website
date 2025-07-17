const BaseRepo = require("./BaseRepo");
const { Room, Organization, Reservation } = require("../models");
const { Op } = require("sequelize");

class RoomRepo extends BaseRepo {
    constructor() {
        super(Room);
    }

    async getAllRooms(organizationId = null, filters = {}) {
        const where = { ...filters };
        
        if (organizationId) {
            where.organizationId = organizationId;
        }

        return await this.model.findAll({
            where,
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name']
                }
            ],
            order: [['name', 'ASC']]
        });
    }

    async toggleRoomStatus(id, organizationId = null) {
        const room = await this.getRoomById(id, organizationId);
        if (!room) return null;
        room.isActive = !room.isActive;
        await room.save();
        return room;
    }

    async getRoomById(id, organizationId = null) {
        const where = { id };
        
        if (organizationId) {
            where.organizationId = organizationId;
        }

        return await this.model.findOne({
            where,
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name']
                }
            ]
        });
    }

    async createRoom(roomData) {
        return await this.model.create(roomData);
    }

    async updateRoom(id, roomData, organizationId = null) {
        const where = { id };
        
        if (organizationId) {
            where.organizationId = organizationId;
        }

        await this.model.update(roomData, { where });
        return await this.getRoomById(id, organizationId);
    }

    async deleteRoom(id, organizationId = null) {
        const where = { id };
        
        if (organizationId) {
            where.organizationId = organizationId;
        }

        return await this.model.destroy({ where });
    }

    async getRoomsByOrganization(organizationId) {
        return await this.getAllRooms(organizationId);
    }

    async searchRooms(organizationId, searchCriteria = {}) {
        const where = { organizationId };
        
        if (searchCriteria.minCapacity) {
            where.capacity = { [Op.gte]: searchCriteria.minCapacity };
        }

        if (searchCriteria.displayProjector === true) {
            where.displayProjector = true;
        }
        if (searchCriteria.displayWhiteboard === true) {
            where.displayWhiteboard = true;
        }
        if (searchCriteria.cateringAvailable === true) {
            where.cateringAvailable = true;
        }
        if (searchCriteria.videoConferenceAvailable === true) {
            where.videoConferenceAvailable = true;
        }

        return await this.model.findAll({
            where,
            include: [
                {
                    model: Organization,
                    attributes: ['id', 'name']
                }
            ],
            order: [['name', 'ASC']]
        });
    }

    async getRoomAvailability(roomId, startTime, endTime) {
        const room = await this.getRoomById(roomId);
        if (!room) return null;

        const conflictingReservations = await Reservation.findAll({
            where: {
                roomId,
                status: { [Op.ne]: 'cancelled' },
                [Op.or]: [
                    {
                        startTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    },
                    {
                        endTime: {
                            [Op.between]: [startTime, endTime]
                        }
                    },
                    {
                        [Op.and]: [
                            { startTime: { [Op.lte]: startTime } },
                            { endTime: { [Op.gte]: endTime } }
                        ]
                    }
                ]
            }
        });

        return {
            room,
            isAvailable: conflictingReservations.length === 0,
            conflictingReservations
        };
    }

    async getRoomStats(roomId, organizationId = null) {
        const room = await this.getRoomById(roomId, organizationId);
        if (!room) return null;

        const totalReservations = await Reservation.count({
            where: { roomId }
        });

        const upcomingReservations = await Reservation.count({
            where: {
                roomId,
                startTime: { [Op.gt]: new Date() },
                status: { [Op.ne]: 'cancelled' }
            }
        });

        const completedReservations = await Reservation.count({
            where: {
                roomId,
                endTime: { [Op.lt]: new Date() },
                status: 'confirmed'
            }
        });

        return {
            room,
            stats: {
                totalReservations,
                upcomingReservations,
                completedReservations
            }
        };
    }
}

module.exports = RoomRepo;