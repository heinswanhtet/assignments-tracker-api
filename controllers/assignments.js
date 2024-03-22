const Assignment = require('../models/Assignment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllAssignments = async (req, res) => {
    const { title, subject, instructor, status, sort } = req.query

    const queryObject = {
        createdBy: req.user.userId
    }

    if (title) {
        queryObject.title = { $regex: title, $options: 'i' }
    }

    if (subject) {
        queryObject.subject = { $regex: subject, $options: 'i' }
    }

    if (instructor) {
        queryObject.instructor = { $regex: instructor, $options: 'i' }
    }

    if (status && status !== 'all') {
        queryObject.status = status
    }

    let result = Assignment.find(queryObject)

    if (sort === 'latest') {
        result = result.sort('-createdAt')
    }

    if (sort === 'oldest') {
        result = result.sort('createdAt')
    }

    if (sort === 'a-z') {
        result = result.sort('title')
    }

    if (sort === 'z-a') {
        result = result.sort('-title')
    }

    // limiting & pagination
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit

    result = result.skip(skip).limit(limit)

    const assignments = await result

    const totalAssignments = await Assignment.countDocuments(queryObject)

    res.status(StatusCodes.OK).json({
        total: totalAssignments,
        total_in_current_page: assignments.length,
        page,
        hasNextPage: totalAssignments > (page * limit) ? true : false,
        assignments,
    })
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
    const {
        user: { userId },
        params: { id: assignmentId },
        body: { title, subject, instructor }
    } = req

    if (!(title || subject || instructor)) {
        throw new BadRequestError('title or subject or instructor: at least one field must be provided')
    }

    const assignment = await Assignment.findByIdAndUpdate(
        { _id: assignmentId, createdBy: userId },
        req.body,
        { new: true, runValidators: true }
    )

    if (!assignment) {
        throw new NotFoundError(`No job with id: ${assignmentId}`)
    }

    res.status(StatusCodes.OK).json({ assignment })
}

const deleteAssignment = async (req, res) => {
    const {
        user: { userId },
        params: { id: assignmentId }
    } = req

    const assignment = await Assignment.findByIdAndDelete({ _id: assignmentId, createdBy: userId })
    if (!assignment) {
        throw new NotFoundError(`No job with id: ${assignmentId}`)
    }

    res.status(StatusCodes.OK).send()
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
}