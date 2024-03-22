const CustomAPIError = require('./custom-api')
const BadRequestError = require('./bad-request')
const UnauthenticatedError = require('./unauthenticated')
const NotFoundError = require('./not-found')
const PermissionDeniedError = require('./permission-denied')

module.exports = {
    CustomAPIError,
    BadRequestError,
    UnauthenticatedError,
    NotFoundError,
    PermissionDeniedError
}