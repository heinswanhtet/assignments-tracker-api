const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const testUser = require('../middleware/test-user')
const { register, login, updateUser } = require('../controllers/auth')

const rateLimiter = require('express-rate-limit')

const apiLimiter = rateLimiter({
    windowMs: 10 * 60 * 1000,
    max: 5,
    message: {
        msg: 'Too many requests from this IP, please try again after 10 minutes',
    },
})

router.route('/register').post(apiLimiter, register)
router.route('/login').post(apiLimiter, login)
router.route('/update-user').patch(authenticateUser, testUser, updateUser)

module.exports = router