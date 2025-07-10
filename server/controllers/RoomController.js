const RoomRepo = require("../repos/RoomRepo");
const BaseController = require("./BaseController");

class RoomController extends BaseController {
    constructor() {
        super();
        this.roomRepo = new RoomRepo();
    }
}

module.exports = RoomController;
