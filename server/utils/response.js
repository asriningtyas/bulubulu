// set a template response
module.exports = ({
    res, statusCode, message, data, type, name,
}) => {
    return res.status(statusCode).json({
        name,
        message,
        statusCode,
        type,
        data,
    })
};