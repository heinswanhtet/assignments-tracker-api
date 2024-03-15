const express = require('express')
const router = express.Router()

const {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignments')

router.route('/').get(getAllAssignments).post(createAssignment)
router.route('/:id').get(getAssignment).patch(updateAssignment).delete(deleteAssignment)

module.exports = router