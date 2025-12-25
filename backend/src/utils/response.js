// Ensure consistent response format (success, message, data) [cite: 64]
exports.sendResponse = (res, statusCode, success, message, data = null) => {
    res.status(statusCode).json({
        success,
        message,
        data
    });
};