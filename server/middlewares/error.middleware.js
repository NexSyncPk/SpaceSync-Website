const CustomError = require("../utils/CustomError");

const devError = (response, error) => {
    response.status(error.statusCode || 500).json({
        success: false,
        message: error.message,
        stackTrace: error.stack,
        error: {
            name: error.name,
            message: error.message,
            statusCode: error.statusCode,
            status: error.status
        },
    });
};

const prodError = (response, error) => {
    if (error.isOperational) {
        response.status(error.statusCode || 500).json({
            success: false,
            message: error.message,
        });
    } else {
        console.error('Non-operational error:', error);
        response.status(500).json({
            success: false,
            message: "Something went wrong! Please try again later.",
        });
    }
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = `Invalid input data. ${errors.join(". ")}`;
    const validationError = new CustomError(message, 400);
    validationError.isOperational = true;
    return validationError;
};

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new CustomError(message, 400);
};

const handleDuplicateKey = (err) => {
    const field = Object.keys(err.keyPattern)[0];
    const value = err.keyValue[field];
    let message = `${
        field.charAt(0).toUpperCase() + field.slice(1)
    } already exists: ${value}`;
    return new CustomError(message, 400);
};

const handleSequelizeValidationError = (err) => {
    const errors = err.errors.map(e => e.message);
    const message = `Validation failed: ${errors.join(', ')}`;
    return new CustomError(message, 400);
};

const handleSequelizeUniqueConstraintError = (err) => {
    const field = err.errors[0].path;
    const value = err.errors[0].value;
    const message = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists: ${value}`;
    return new CustomError(message, 400);
};

module.exports = (err, request, response, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (process.env.NODE_ENV === "development") {
        devError(response, err);
    } else if (process.env.NODE_ENV === "production") {
        let error = { ...err };
        error.message = err.message;

        if (error.name === "CastError") error = handleCastErrorDB(error);
        if (error.name === "ValidationError") error = handleValidationErrorDB(error);
        if (error.name === "SequelizeValidationError") error = handleSequelizeValidationError(error);
        if (error.name === "SequelizeUniqueConstraintError") error = handleSequelizeUniqueConstraintError(error);
        if (error.code === 11000) error = handleDuplicateKey(error);

        prodError(response, error);
    }
};
