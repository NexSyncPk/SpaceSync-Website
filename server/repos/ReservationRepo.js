const BaseRepo = require("./BaseRepo");
const Reservation = require("../models/reservation");

class ReservationRepo extends BaseRepo {
    constructor() {
        super(Reservation);
    }

    async getAllReservations() {
        return await this.model.findAll();
    }

    async getReservationsByStatus(status) {
        return await this.model.findAll({
            where: {
                status,
            },
        });
    }

    async getReservationById(id) {
        return await this.model.findById(id);
    }

    async createReservation(reservationData) {
      return await this.model.create(reservationData);
    }

    async updateReservation(id, reservationData) {
        return await this.model.update(
            reservationData,
            id
        );
    }

    async deleteReservation(id) {
      return await this.model.delete(id);
    }
}

module.exports = ReservationRepo;
