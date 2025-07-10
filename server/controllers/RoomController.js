const RoomRepo = require("../repos/RoomRepo");
const BaseController = require("./BaseController");
const RoomValidator = require("../validators/RoomValidator");
const CustomError = require("../utils/CustomError");
const roomStatusService = require("../services/RoomStatusService");
const { notifyRoomUpdated } = require("../services/SocketService");

class RoomController extends BaseController {
    constructor() {
        super();
        this.roomRepo = new RoomRepo();
        this.roomValidator = new RoomValidator();
    }

    getAllRooms = async (request, response, next) => {
        const organizationId = request.user.organizationId;
        const { capacity, displayProjector, displayWhiteboard, cateringAvailable, videoConferenceAvailable } = request.query;

        // Build filters
        const filters = {};
        if (capacity) filters.capacity = { [require("sequelize").Op.gte]: parseInt(capacity) };
        if (displayProjector === 'true') filters.displayProjector = true;
        if (displayWhiteboard === 'true') filters.displayWhiteboard = true;
        if (cateringAvailable === 'true') filters.cateringAvailable = true;
        if (videoConferenceAvailable === 'true') filters.videoConferenceAvailable = true;

        const rooms = await this.roomRepo.getAllRooms(organizationId, filters);
        return this.successResponse(response, "Rooms retrieved successfully!", rooms);
    }

    getRoomById = async (request, response, next) => {
        const { roomId } = request.params;
        const organizationId = request.user.organizationId;

        const room = await this.roomRepo.getRoomById(roomId, organizationId);
        if (!room) {
            return this.failureResponse("Room not found!", next, 404);
        }

        return this.successResponse(response, "Room retrieved successfully!", room);
    }

    createRoom = async (request, response, next) => {
        const organizationId = request.user.organizationId;

        // Only admins can create rooms
        if (request.user.role !== 'admin') {
            return this.failureResponse("Only administrators can create rooms!", next, 403);
        }

        console.log(request.body);

        // Validate input
        const validationResult = this.roomValidator.validateCreateRoom(request.body);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        const roomData = {
            ...validationResult.data,
            organizationId
        };

        const room = await this.roomRepo.createRoom(roomData);
        
        try {
            notifyRoomUpdated(room, organizationId);
        } catch (socketError) {
            console.warn("Failed to send real-time notification:", socketError);
        }
        
        return this.successResponse(response, "Room created successfully!", room, 201);
    }

    updateRoom = async (request, response, next) => {
        const { roomId } = request.params;
        const organizationId = request.user.organizationId;

        if (request.user.role !== 'admin') {
            return this.failureResponse("Only administrators can update rooms!", next, 403);
        }

        const existingRoom = await this.roomRepo.getRoomById(roomId, organizationId);
        if (!existingRoom) {
            return this.failureResponse("Room not found!", next, 404);
        }

        const validationResult = this.roomValidator.validateUpdateRoom(request.body);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        const updatedRoom = await this.roomRepo.updateRoom(roomId, validationResult.data, organizationId);
        
        try {
            notifyRoomUpdated(updatedRoom, organizationId);
        } catch (socketError) {
            console.warn("Failed to send real-time notification:", socketError);
        }
        
        return this.successResponse(response, "Room updated successfully!", updatedRoom);
    }

    deleteRoom = async (request, response, next) => {
        const { roomId } = request.params;
        const organizationId = request.user.organizationId;

        if (request.user.role !== 'admin') {
            return this.failureResponse("Only administrators can delete rooms!", next, 403);
        }

        const existingRoom = await this.roomRepo.getRoomById(roomId, organizationId);
        if (!existingRoom) {
            return this.failureResponse("Room not found!", next, 404);
        }

        const deletedCount = await this.roomRepo.deleteRoom(roomId, organizationId);
        if (deletedCount === 0) {
            return this.failureResponse("Room not found!", next, 404);
        }

        return this.successResponse(response, "Room deleted successfully!");
    }

    searchRooms = async (request, response, next) => {
        const organizationId = request.user.organizationId;
        const { minCapacity, displayProjector, displayWhiteboard, cateringAvailable, videoConferenceAvailable } = request.query;

        const validationResult = this.roomValidator.validateSearchRooms(request.query);
        if (!validationResult.success) {
            return this.failureResponse(validationResult.message[0], next, 400);
        }

        const searchCriteria = {
            minCapacity: validationResult.data.minCapacity,
            displayProjector: validationResult.data.displayProjector,
            displayWhiteboard: validationResult.data.displayWhiteboard,
            cateringAvailable: validationResult.data.cateringAvailable,
            videoConferenceAvailable: validationResult.data.videoConferenceAvailable
        };

        const rooms = await this.roomRepo.searchRooms(organizationId, searchCriteria);
        return this.successResponse(response, "Room search completed successfully!", rooms);
    }

    getRoomAvailability = async (request, response, next) => {
        const { roomId } = request.params;
        const { startTime, endTime } = request.query;
        const organizationId = request.user.organizationId;

        if (!startTime || !endTime) {
            return this.failureResponse("Start time and end time are required!", next, 400);
        }

        const room = await this.roomRepo.getRoomById(roomId, organizationId);
        if (!room) {
            return this.failureResponse("Room not found!", next, 404);
        }

        const availability = await this.roomRepo.getRoomAvailability(roomId, new Date(startTime), new Date(endTime));
        return this.successResponse(response, "Room availability retrieved successfully!", availability);
    }

    getRoomStats = async (request, response, next) => {
        const { roomId } = request.params;
        const organizationId = request.user.organizationId;

        if (request.user.role !== 'admin') {
            return this.failureResponse("Only administrators can view room statistics!", next, 403);
        }

        const stats = await this.roomRepo.getRoomStats(roomId, organizationId);
        if (!stats) {
            return this.failureResponse("Room not found!", next, 404);
        }

        return this.successResponse(response, "Room statistics retrieved successfully!", stats);
    }

    getRoomStatuses = async (request, response, next) => {
        const organizationId = request.user.organizationId;

        const roomStatuses = await roomStatusService.getOrganizationRoomStatuses(organizationId);
        return this.successResponse(response, "Room statuses retrieved successfully!", roomStatuses);
    }
}

module.exports = RoomController;
