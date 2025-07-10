const BaseRepo = require("./BaseRepo");
const Room = require("../models/room");

class RoomRepo extends BaseRepo {
    constructor() {
        super(Room);
    }

    async getAllRooms(){
        return await this.model.findAll();
    }

    async getRoomById(id){
        return await this.model.findById(id);
    }

    async createRoom(roomData){
        return await this.model.create(roomData);
    }

    async updateRoom(roomData, id){
        return await this.model.update(roomData, id);
    }

    async deleteRoom(id){
        return await this.model.delete(id);
    }
}

module.exports = RoomRepo;
