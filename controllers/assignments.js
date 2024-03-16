const Assignment = require('../models/Assignment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllAssignments = async (req, res) => {
    const assignments = await Assignment.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ total: assignments.length, assignments })
}

const getAssignment = async (req, res) => {
    res.send('Get a single assignment')
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