const jwt = requestuire("jsonwebtoken");
const CustomError = require("../utils/CustomError");

const authenticate = function (request, response, next) {
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        const error = new CustomError("Authorization header missing or invalid", 401);
        return next(error);
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.admin = decoded;
        next();
    } catch (err) {
        const error = new CustomError("Invalid token", 401);
        return next(error);
    }
};

module.exports = authenticate;