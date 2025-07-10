const CustomError = require("../utils/CustomError");
const { generateResponse } = require("../utils/responseHelper");

class BaseController {
    successResponse(response, message = "Success", data = null, status = 200) {
        return response.status(status).json(generateResponse(true, message, data));
    }

    failureResponse(message = "Failed", next, status = 400) {
        const error = new CustomError(message, status);
        return next(error);
    }
}

module.exports = BaseController;
