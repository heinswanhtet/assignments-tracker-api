const Assignment = require('../models/Assignment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllAssignments = async (req, res) => {
    res.send('Get all assignments')
}

const getAssignment = async (req, res) => {
    res.send('Get a single assignment')
}

const createAssignment = async (req, res) => {
    console.log(req.user)
    res.send('hi')

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