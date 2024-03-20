const express = require('express')
const router = express.Router()
const authenticateUser = require('../middleware/authentication')
const { register, login, updateUser } = require('../controllers/auth')

router.route('/register').post(register)
router.route('/login').post(login)
router.route('/update-user').patch(authenticateUser, updateUser)

module.exports = router