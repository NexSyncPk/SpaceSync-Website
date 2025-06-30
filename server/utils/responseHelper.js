const generateResponse = (success, message, data = undefined) => {
    const response = { success, message };
    if (data !== undefined) response.data = data;
    return response;
};

module.exports = { generateResponse };