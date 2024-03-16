const Assignment = require('../models/Assignment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllAssignments = async (req, res) => {
    const assignments = await Assignment.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ total: assignments.length, assignments })
}

const getAssignment = async (req, res) => {
    const {
        user: { userId },
        params: { id: assignmentId }
    } = req

    const assignment = await Assignment.findById({
        _id: assignmentId,
        createdBy: userId
    })

    if (!assignment) {
        throw new NotFoundError(`No job with id: ${assignmentId}`)
    }

    res.status(StatusCodes.OK).json({ assignment })
}

const createAssignment = async (req, res) => {
    req.body.createdBy = req.user.userId
    const assignment = await Assignment.create(req.body)
    res.status(StatusCodes.CREATED).json({ assignment })
}

const updateAssignment = async (req, res) => {
    res.send('Update the assignment')
}

const deleteAssignment = async (req, res) => {
    res.send('Delete the assignment')
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}