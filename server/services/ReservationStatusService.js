const { Reservation, Room } = require("../models");
const { Op } = require("sequelize");
const { notifyReservationCompleted } = require("./SocketService");

class ReservationStatusService {
    constructor() {
        this.isRunning = false;
        this.interval = null;
        this.checkInterval = 60000;
    }

    start() {
        if (this.isRunning) {
            console.log("ReservationStatusService is already running");
            return;
        }

        this.isRunning = true;
        console.log("Starting ReservationStatusService...");
        
        this.updateCompletedReservations();
        
        this.interval = setInterval(() => {
            this.updateCompletedReservations();
        }, this.checkInterval);
    }

    stop() {
        if (!this.isRunning) {
            console.log("ReservationStatusService is not running");
            return;
        }

        this.isRunning = false;
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
        console.log("ReservationStatusService stopped");
    }

    async updateCompletedReservations() {
        try {
            const now = new Date();
            
            const expiredReservations = await Reservation.findAll({
                where: {
                    status: 'confirmed',
                    endTime: {
                        [Op.lt]: now
                    }
                },
                include: [
                    {
                        model: Room,
                        attributes: ['organizationId']
                    }
                ]
            });

            if (expiredReservations.length === 0) {
                return;
            }

            console.log(`Found ${expiredReservations.length} reservations to mark as completed`);

            const reservationIds = expiredReservations.map(r => r.id);
            
            await Reservation.update(
                { status: 'completed' },
                {
                    where: {
                        id: {
                            [Op.in]: reservationIds
                        }
                    }
                }
            );

            // Send notifications for each completed reservation
            for (const reservation of expiredReservations) {
                try {
                    const completedReservation = {
                        ...reservation.toJSON(),
                        status: 'completed'
                    };
                    
                    await notifyReservationCompleted(
                        completedReservation, 
                        reservation.Room.organizationId
                    );
                } catch (notificationError) {
                    console.warn(`Failed to send notification for reservation ${reservation.id}:`, notificationError);
                }
            }

            console.log(`Successfully updated ${expiredReservations.length} reservations to completed status`);

        } catch (error) {
            console.error("Error updating completed reservations:", error);
        }
    }

    // Manually complete a specific reservation (admin override)
    async completeReservation(reservationId) {
        try {
            const reservation = await Reservation.findByPk(reservationId, {
                include: [
                    {
                        model: Room,
                        attributes: ['organizationId']
                    }
                ]
            });

            if (!reservation) {
                throw new Error("Reservation not found");
            }

            if (reservation.status === 'completed') {
                throw new Error("Reservation is already completed");
            }

            if (reservation.status === 'cancelled') {
                throw new Error("Cannot complete a cancelled reservation");
            }

            await reservation.update({ status: 'completed' });

            try {
                await notifyReservationCompleted(
                    reservation.toJSON(), 
                    reservation.Room.organizationId
                );
            } catch (notificationError) {
                console.warn(`Failed to send notification for reservation ${reservationId}:`, notificationError);
            }

            console.log(`Manually completed reservation ${reservationId}`);
            return reservation;

        } catch (error) {
            console.error(`Error manually completing reservation ${reservationId}:`, error);
            throw error;
        }
    }

    getStatus() {
        return {
            isRunning: this.isRunning,
            checkInterval: this.checkInterval,
            nextCheck: this.interval ? new Date(Date.now() + this.checkInterval) : null
        };
    }
}

const reservationStatusService = new ReservationStatusService();
module.exports = reservationStatusService;