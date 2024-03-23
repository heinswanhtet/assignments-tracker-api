const Assignment = require('../models/Assignment')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError, PermissionDeniedError } = require('../errors')
const mongoose = require('mongoose')
const moment = require('moment')

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

    let assignment = await Assignment.findById(
        { _id: assignmentId }
    )

    if (!assignment) {
        throw new NotFoundError(`No job with id: ${assignmentId}`)
    }

    if (assignment.createdBy.toString() !== userId) {
        throw new PermissionDeniedError(`You do not have the right to access the assignment id: ${assignmentId}`)
    }

    assignment = await Assignment.findByIdAndUpdate(
        { _id: assignmentId },
        req.body,
        { new: true, runValidators: true }
    )

    res.status(StatusCodes.OK).json({ assignment })
}

const deleteAssignment = async (req, res) => {
    const {
        user: { userId },
        params: { id: assignmentId }
    } = req

    let assignment = await Assignment.findById(
        { _id: assignmentId }
    )

    if (!assignment) {
        throw new NotFoundError(`No job with id: ${assignmentId}`)
    }

    if (assignment.createdBy.toString() !== userId) {
        throw new PermissionDeniedError(`You do not have the right to access the assignment id: ${assignmentId}`)
    }

    assignment = await Assignment.findByIdAndDelete({ _id: assignmentId })
    if (!assignment) {
        throw new NotFoundError(`No job with id: ${assignmentId}`)
    }

    res.status(StatusCodes.OK).send()
}

const aggregateProperty = async (property, userId) => {
    let stats = await Assignment.aggregate([
        { $match: { createdBy: new mongoose.Types.ObjectId(userId) } },
        { $group: { _id: `$${property}`, count: { $sum: 1 } } }
    ])

    stats = stats.reduce((acc, curr) => {
        const { _id: title, count } = curr
        acc[title] = count
        return acc
    }, {})

    return stats
}

const showStats = async (req, res) => {
    const { property } = req.params
    let stats = {}

    if (property === 'status') {
        groupedStats = await aggregateProperty(property, req.user.userId)

        stats['not started'] = groupedStats['not started'] || 0
        stats['working'] = groupedStats['working'] || 0
        stats['hiatus'] = groupedStats['hiatus'] || 0
        stats['finished'] = groupedStats['finished'] || 0
    }
    else if (property === 'subject' || property === 'instructor') {
        stats = await aggregateProperty(property, req.user.userId)
    }
    else if (property === 'monthly') {
        let monthlyAssignments = await Assignment.aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': -1, '_id.month': -1 } },
            { $limit: 6 }
        ])

        stats = monthlyAssignments.map(item => {
            const { _id: { year, month }, count } = item
            const date = moment()
                .month(month - 1)
                .year(year)
                .format('MMM Y')
            return { date, count }
        }).reverse()
    }
    else {
        throw new BadRequestError(`There no property: ${property}`)
    }

    res.status(StatusCodes.OK).json({ stats })
}

module.exports = {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    showStats
}