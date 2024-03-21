const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
    const user = await User.create(req.body)
    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email, university: user.university, token } })
}

const login = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        throw new BadRequestError('Please provide email and password to login')
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError('Invalid Credentials')
    }
    const isPasswordCorrect = await user.comparePassword(password)
    if (!isPasswordCorrect) {
        throw new UnauthenticatedError('Invalid Credentials')
    }

    const token = user.createJWT()
    res.status(StatusCodes.OK).json({ user: { name: user.name, email: user.email, university: user.university, token } })
}

const updateUser = async (req, res) => {
    const { name, email, university } = req.body

    if (!name || !email || !university) {
        throw new BadRequestError('Please provide required values')
    }

    const user = await User.findOne({ _id: req.user.userId })

    user.name = name
    user.email = email
    user.university = university

    await user.save()

    const token = user.createJWT()
    res.status(StatusCodes.CREATED).json({ user: { name: user.name, email: user.email, university: user.university, token } })
}

module.exports = {
    register,
    login,
    updateUser
}