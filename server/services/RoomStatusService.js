const { notifyRoomStatusChange } = require('./SocketService');
const { Reservation, Room } = require('../models');
const { Op } = require('sequelize');

class RoomStatusService {
    constructor() {
        this.checkInterval = 60000;
        this.intervalId = null;
    }

    startMonitoring() {
        console.log('Starting room status monitoring...');
        this.intervalId = setInterval(() => {
            this.checkAndUpdateRoomStatuses();
        }, this.checkInterval);
    }

    stopMonitoring() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('Room status monitoring stopped');
        }
    }

    async checkAndUpdateRoomStatuses() {
        try {
            const now = new Date();
            const startingReservations = await Reservation.findAll({
                where: {
                    status: 'confirmed',
                    startTime: {
                        [Op.between]: [new Date(now.getTime() - 60000), now]
                    }
                },
                include: [{
                    model: Room,
                    include: ['Organization']
                }]
            });

            const endingReservations = await Reservation.findAll({
                where: {
                    status: 'confirmed',
                    endTime: {
                        [Op.between]: [new Date(now.getTime() - 60000), now]
                    }
                },
                include: [{
                    model: Room,
                    include: ['Organization']
                }]
            });

            for (const reservation of startingReservations) {
                try {
                    notifyRoomStatusChange(
                        reservation.roomId, 
                        'occupied', 
                        reservation.Room.organizationId
                    );
                    console.log(`Room ${reservation.roomId} is now occupied`);
                } catch (error) {
                    console.error('Error notifying room occupied:', error);
                }
            }

            for (const reservation of endingReservations) {
                try {
                    const activeReservations = await Reservation.count({
                        where: {
                            roomId: reservation.roomId,
                            status: 'confirmed',
                            startTime: { [Op.lte]: now },
                            endTime: { [Op.gte]: now },
                            id: { [Op.ne]: reservation.id }
                        }
                    });

                    if (activeReservations === 0) {
                        notifyRoomStatusChange(
                            reservation.roomId, 
                            'free', 
                            reservation.Room.organizationId
                        );
                        console.log(`Room ${reservation.roomId} is now free`);
                    }
                } catch (error) {
                    console.error('Error notifying room free:', error);
                }
            }

        } catch (error) {
            console.error('Error checking room statuses:', error);
        }
    }

    async getRoomStatus(roomId) {
        try {
            const now = new Date();
            
            const activeReservation = await Reservation.findOne({
                where: {
                    roomId: roomId,
                    status: 'confirmed',
                    startTime: { [Op.lte]: now },
                    endTime: { [Op.gte]: now }
                }
            });

            return activeReservation ? 'occupied' : 'free';
        } catch (error) {
            console.error('Error getting room status:', error);
            return 'unknown';
        }
    }

    async getOrganizationRoomStatuses(organizationId) {
        try {
            const rooms = await Room.findAll({
                where: { organizationId },
                attributes: ['id', 'name']
            });

            const roomStatuses = [];
            for (const room of rooms) {
                const status = await this.getRoomStatus(room.id);
                roomStatuses.push({
                    roomId: room.id,
                    roomName: room.name,
                    status: status
                });
            }

            return roomStatuses;
        } catch (error) {
            console.error('Error getting organization room statuses:', error);
            return [];
        }
    }
}

const roomStatusService = new RoomStatusService();

module.exports = roomStatusService;
