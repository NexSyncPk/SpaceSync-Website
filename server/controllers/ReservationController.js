const ReservationRepo = require("../repos/ReservationRepo");
const RoomRepo = require("../repos/RoomRepo");
const BaseController = require("./BaseController");
const ReservationValidator = require("../validators/ReservationValidator");
const { notifyAdminNewReservation, notifyEmployeeReservationStatus, notifyReservationUpdated, notifyReservationCancelled } = require("../services/SocketService");

class ReservationController extends BaseController {
    constructor() {
        super();
        this.reservationRepo = new ReservationRepo();
        this.roomRepo = new RoomRepo();
        this.reservationValidator = new ReservationValidator();
    }

    getAllReservations = async (request, response, next) => {
        const { page = 1, limit = 10, status, startDate, endDate } = request.query;
        const organizationId = request.user.organizationId;

        const filters = {};
        if (status) filters.status = status;
        if (startDate && endDate) {
            filters.startTime = {
                [require("sequelize").Op.between]: [new Date(startDate), new Date(endDate)]
            };
        }

        const pagination = {
            limit: parseInt(limit),
            offset: (parseInt(page) - 1) * parseInt(limit)
        };

        const reservations = await this.reservationRepo.getAllReservations(filters, pagination, organizationId);
        
        if (reservations.rows && reservations.rows.length === 0) {
            return this.failureResponse("No reservations found!", next, 404);
        }

        const result = reservations.rows ? {
            reservations: reservations.rows,
            totalCount: reservations.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(reservations.count / parseInt(limit))
        } : reservations;

        return this.successResponse(response, "Reservations retrieved successfully!", result);
    }

    getReservationById = async (request, response, next) => {
        const { reservationId } = request.params;
        const organizationId = request.user.organizationId;

        const reservation = await this.reservationRepo.getReservationById(reservationId, organizationId);
        if (!reservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        return this.successResponse(response, "Reservation retrieved successfully!", reservation);
    }

    createReservation = async (request, response, next) => {
        const organizationId = request.user.organizationId;
        const userId = request.user.userId;

        const validationResult = this.reservationValidator.validateCreateReservation(request.body);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        const room = await this.roomRepo.getRoomById(validationResult.data.roomId, organizationId);
        if (!room) {
            return this.failureResponse("Room not found or doesn't belong to your organization!", next, 404);
        }

        const isAvailable = await this.reservationRepo.checkRoomAvailability(
            validationResult.data.roomId, 
            validationResult.data.startTime, 
            validationResult.data.endTime
        );
        if (!isAvailable) {
            return this.failureResponse("Room is not available for the selected time slot!", next, 409);
        }

        const reservationData = {
            ...validationResult.data,
            userId,
            status: 'pending'
        };

        const reservation = await this.reservationRepo.model.create(reservationData);
        
        const reservationWithUser = await this.reservationRepo.getReservationById(reservation.id, organizationId);
        
        try {
            notifyAdminNewReservation(reservationWithUser, organizationId);
        } catch (socketError) {
            console.warn("Failed to send real-time notification:", socketError);
        }
        
        return this.successResponse(response, "Reservation created successfully!", reservation, 201);
    }

    updateReservation = async (request, response, next) => {
        const { reservationId } = request.params;
        const organizationId = request.user.organizationId;
        const userId = request.user.userId;

        const existingReservation = await this.reservationRepo.getReservationById(reservationId, organizationId);
        if (!existingReservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        if (existingReservation.userId !== userId && request.user.role !== 'admin') {
            return this.failureResponse("You can only update your own reservations!", next, 403);
        }

        const validationResult = this.reservationValidator.validateUpdateReservation(request.body);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        if (validationResult.data.startTime || validationResult.data.endTime) {
            const startTime = validationResult.data.startTime || existingReservation.startTime;
            const endTime = validationResult.data.endTime || existingReservation.endTime;
            
            const isAvailable = await this.reservationRepo.checkRoomAvailability(
                existingReservation.roomId,
                startTime,
                endTime,
                reservationId
            );
            if (!isAvailable) {
                return this.failureResponse("Room is not available for the selected time slot!", next, 409);
            }
        }

        await this.reservationRepo.model.update(validationResult.data, { where: { id: reservationId } });
        const updatedReservation = await this.reservationRepo.getReservationById(reservationId, organizationId);
        
        try {
            notifyReservationUpdated(updatedReservation, organizationId);
        } catch (socketError) {
            console.warn("Failed to send real-time notification:", socketError);
        }
        
        return this.successResponse(response, "Reservation updated successfully!", updatedReservation);
    }

    deleteReservation = async (request, response, next) => {
        const { reservationId } = request.params;
        const organizationId = request.user.organizationId;
        const userId = request.user.userId;

        const existingReservation = await this.reservationRepo.getReservationById(reservationId, organizationId);
        if (!existingReservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        if (existingReservation.userId !== userId && request.user.role !== 'admin') {
            return this.failureResponse("You can only delete your own reservations!", next, 403);
        }

        await this.reservationRepo.model.destroy({ where: { id: reservationId } });
        
        try {
            notifyReservationCancelled({
                ...existingReservation.toJSON(),
                status: 'cancelled'
            }, organizationId);
        } catch (socketError) {
            console.warn("Failed to send real-time notification:", socketError);
        }
        
        return this.successResponse(response, "Reservation deleted successfully!");
    }

    getMyReservations = async (request, response, next) => {
        const userId = request.user.userId;
        const { status } = request.query;

        const filters = { userId };
        if (status) filters.status = status;

        const reservations = await this.reservationRepo.getAllReservations(filters);
        return this.successResponse(response, "Your reservations retrieved successfully!", reservations);
    }

    updateReservationStatus = async (request, response, next) => {
        const { reservationId } = request.params;
        const { status } = request.body;
        const organizationId = request.user.organizationId;

        const validationResult = this.reservationValidator.validateStatusUpdate({ status });
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        const existingReservation = await this.reservationRepo.getReservationById(reservationId, organizationId);
        if (!existingReservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        await this.reservationRepo.updateReservationStatus(reservationId, status);
        
        const updatedReservation = await this.reservationRepo.getReservationById(reservationId, organizationId);
        
        try {
            notifyEmployeeReservationStatus(updatedReservation, organizationId);
        } catch (socketError) {
            console.warn("Failed to send real-time notification:", socketError);
        }
        
        return this.successResponse(response, "Reservation status updated successfully!");
    }

    getUpcomingReservations = async (request, response, next) => {
        const organizationId = request.user.organizationId;
        const { limit = 10 } = request.query;

        const reservations = await this.reservationRepo.getUpcomingReservations(organizationId, parseInt(limit));
        return this.successResponse(response, "Upcoming reservations retrieved successfully!", reservations);
    }
}

module.exports = ReservationController;
