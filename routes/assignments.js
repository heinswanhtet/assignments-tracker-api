const express = require('express')
const router = express.Router()
const testUser = require('../middleware/test-user')

const {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment
} = require('../controllers/assignments')

router.route('/').get(getAllAssignments).post(testUser, createAssignment)
router.route('/:id').get(getAssignment).patch(testUser, updateAssignment).delete(testUser, deleteAssignment)

module.exports = router