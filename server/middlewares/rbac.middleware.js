const CustomError = require("../utils/CustomError");

const rbac = (...allowed) => {
    return (request, response, next) => {
        if (!allowed.includes(request.user.role)) {
            const error = new CustomError("You do not have permission to perform this action", 403);
            return next(error);
        }
        next();
    };
};

module.exports = rbac;