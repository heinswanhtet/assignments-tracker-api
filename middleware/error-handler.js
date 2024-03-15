const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleWare = (err, req, res, next) => {
    let customError = {
        statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg: err.message || 'Oops! Something went wrong. Please try again later.'
    }

    return res.status(customError.statusCode).json({ msg: customError.msg })
}

module.exports = errorHandlerMiddleWare