const mongoose = require('mongoose')

const AssignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please provide assignment title'],
        maxlength: 80
    },
    subject: {
        type: String,
        required: [true, 'Please provide subject'],
        maxlength: 50
    },
    instructor: {
        type: String,
        required: [true, 'Please provide instructor'],
        maxlength: 50
    },
    status: {
        type: String,
        enum: ['not started', 'working', 'hiatus', 'finished'],
        default: 'not started'
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'Please provide user']
    }
}, { timestamps: true })

module.exports = mongoose.model('Assignment', AssignmentSchema)