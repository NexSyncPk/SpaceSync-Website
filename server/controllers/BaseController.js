const { generateResponse } = require("../utils/responseHelper");

class BaseController {
    successResponse(response, data, message = "Success") {
        return response.status(200).json(generateResponse(true, message, data));
    }

    sendResponse(response, status = 200, message = "Success", data = null) {
        return response
            .status(status)
            .json(generateResponse(true, message, data));
    }
}

module.exports = BaseController;
