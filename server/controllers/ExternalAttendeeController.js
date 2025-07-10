const BaseController = require('./BaseController');
const ExternalAttendeeValidator = require('../validators/ExternalAttendeeValidator');
const { ExternalAttendee, Reservation, Room } = require('../models');

class ExternalAttendeeController extends BaseController {
    constructor() {
        super();
        this.externalAttendeeValidator = new ExternalAttendeeValidator();
    }

    getAllExternalAttendees = async (request, response, next) => {
        const { reservationId } = request.params;
        const organizationId = request.user.organizationId;

        // If reservationId is provided (nested route), get attendees for specific reservation
        if (reservationId) {
            // Verify reservation belongs to user's organization
            const reservation = await Reservation.findOne({
                where: { id: reservationId },
                include: [{
                    model: Room,
                    where: { organizationId }
                }]
            });

            if (!reservation) {
                return this.failureResponse("Reservation not found!", next, 404);
            }

            const externalAttendees = await ExternalAttendee.findAll({
                where: { reservationId },
                include: [{
                    model: Reservation,
                    attributes: ['id', 'agenda', 'startTime', 'endTime'],
                    include: [{
                        model: Room,
                        attributes: ['id', 'name']
                    }]
                }]
            });

            return this.successResponse(response, "External attendees retrieved successfully!", externalAttendees);
        } else {
            // No reservationId (standalone route), get all external attendees for organization
            const externalAttendees = await ExternalAttendee.findAll({
                include: [{
                    model: Reservation,
                    attributes: ['id', 'agenda', 'startTime', 'endTime'],
                    include: [{
                        model: Room,
                        where: { organizationId },
                        attributes: ['id', 'name']
                    }]
                }]
            });

            return this.successResponse(response, "External attendees retrieved successfully!", externalAttendees);
        }
    }

    getExternalAttendeeById = async (request, response, next) => {
        const { reservationId, attendeeId } = request.params;
        const organizationId = request.user.organizationId;

        // Verify reservation belongs to user's organization
        const reservation = await Reservation.findOne({
            where: { id: reservationId },
            include: [{
                model: Room,
                where: { organizationId }
            }]
        });

        if (!reservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        const externalAttendee = await ExternalAttendee.findOne({
            where: { 
                id: attendeeId,
                reservationId 
            }
        });

        if (!externalAttendee) {
            return this.failureResponse("External attendee not found!", next, 404);
        }

        return this.successResponse(response, "External attendee retrieved successfully!", externalAttendee);
    }

    createExternalAttendee = async (request, response, next) => {
        const { reservationId } = request.params;
        const organizationId = request.user.organizationId;
        const userId = request.user.userId;

        // Verify reservation belongs to user's organization
        const reservation = await Reservation.findOne({
            where: { id: reservationId },
            include: [{
                model: Room,
                where: { organizationId }
            }]
        });

        if (!reservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        // Check if user owns the reservation or is admin
        if (reservation.userId !== userId && request.user.role !== 'admin') {
            return this.failureResponse("You can only add attendees to your own reservations!", next, 403);
        }

        // Validate input
        const attendeeData = { ...request.body, reservationId };
        const validationResult = this.externalAttendeeValidator.validateCreateExternalAttendee(attendeeData);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        const externalAttendee = await ExternalAttendee.create(validationResult.data);
        return this.successResponse(response, "External attendee created successfully!", externalAttendee, 201);
    }

    updateExternalAttendee = async (request, response, next) => {
        const { reservationId, attendeeId } = request.params;
        const organizationId = request.user.organizationId;
        const userId = request.user.userId;

        // Verify reservation belongs to user's organization
        const reservation = await Reservation.findOne({
            where: { id: reservationId },
            include: [{
                model: Room,
                where: { organizationId }
            }]
        });

        if (!reservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        // Check if user owns the reservation or is admin
        if (reservation.userId !== userId && request.user.role !== 'admin') {
            return this.failureResponse("You can only update attendees for your own reservations!", next, 403);
        }

        // Check if attendee exists
        const existingAttendee = await ExternalAttendee.findOne({
            where: { 
                id: attendeeId,
                reservationId 
            }
        });

        if (!existingAttendee) {
            return this.failureResponse("External attendee not found!", next, 404);
        }

        // Validate input
        const validationResult = this.externalAttendeeValidator.validateUpdateExternalAttendee(request.body);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        await ExternalAttendee.update(validationResult.data, {
            where: { 
                id: attendeeId,
                reservationId 
            }
        });

        const updatedAttendee = await ExternalAttendee.findByPk(attendeeId);
        return this.successResponse(response, "External attendee updated successfully!", updatedAttendee);
    }

    deleteExternalAttendee = async (request, response, next) => {
        const { reservationId, attendeeId } = request.params;
        const organizationId = request.user.organizationId;
        const userId = request.user.userId;

        // Verify reservation belongs to user's organization
        const reservation = await Reservation.findOne({
            where: { id: reservationId },
            include: [{
                model: Room,
                where: { organizationId }
            }]
        });

        if (!reservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        // Check if user owns the reservation or is admin
        if (reservation.userId !== userId && request.user.role !== 'admin') {
            return this.failureResponse("You can only delete attendees from your own reservations!", next, 403);
        }

        const deletedCount = await ExternalAttendee.destroy({
            where: { 
                id: attendeeId,
                reservationId 
            }
        });

        if (deletedCount === 0) {
            return this.failureResponse("External attendee not found!", next, 404);
        }

        return this.successResponse(response, "External attendee deleted successfully!");
    }

    bulkCreateExternalAttendees = async (request, response, next) => {
        const { reservationId } = request.params;
        const organizationId = request.user.organizationId;
        const userId = request.user.userId;

        // Verify reservation belongs to user's organization
        const reservation = await Reservation.findOne({
            where: { id: reservationId },
            include: [{
                model: Room,
                where: { organizationId }
            }]
        });

        if (!reservation) {
            return this.failureResponse("Reservation not found!", next, 404);
        }

        // Check if user owns the reservation or is admin
        if (reservation.userId !== userId && request.user.role !== 'admin') {
            return this.failureResponse("You can only add attendees to your own reservations!", next, 403);
        }

        // Validate input
        const bulkData = { ...request.body, reservationId };
        const validationResult = this.externalAttendeeValidator.validateBulkCreateExternalAttendees(bulkData);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        // Add reservationId to each attendee
        const attendeesWithReservationId = validationResult.data.attendees.map(attendee => ({
            ...attendee,
            reservationId
        }));

        const externalAttendees = await ExternalAttendee.bulkCreate(attendeesWithReservationId);
        return this.successResponse(response, "External attendees created successfully!", externalAttendees, 201);
    }
}

module.exports = ExternalAttendeeController;
