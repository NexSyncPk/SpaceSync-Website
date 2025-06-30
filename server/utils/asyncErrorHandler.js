module.exports = function asyncErrorHandler(fn) {
    return function (request, response, next) {
        Promise.resolve(fn(request, response, next)).catch(next);
    };
};