const ReservationRepo = require("../repos/ReservationRepo");
const BaseController = require("./BaseController");

class ReservationController extends BaseController {
    constructor() {
        super();
        this.reservationRepo = new ReservationRepo();
    }

    async getAllReservations(request, response, next) {
        const reservations = await this.reservationRepo.getAllReservations();
        if (!reservations.length) {
            return this.failureResponse("Reservations not found!", next, 404);
        }

        return this.successResponse("Reservations retrieved successfully!", reservations);
    }

    async getReservationById(request, response, next){
      const { reservationId, roomId } = request.params;
      const reservation = await this.reservationRepo.getReservationById(id);
      if(!reservation){
        return this.failureResponse("Reservation not found!", next, 404);
      }

      return this.successResponse("Reservation retrieved successfully!", reservation);
    }

    async getReservationsByStatus(request, response, next){
        const { status } = request.params;
        
    }
}

module.exports = ReservationController;
