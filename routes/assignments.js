const express = require('express')
const router = express.Router()
const testUser = require('../middleware/test-user')

const {
    getAllAssignments,
    getAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    showStats
} = require('../controllers/assignments')

router.route('/').get(getAllAssignments).post(testUser, createAssignment)
router.route('/:id').get(getAssignment).patch(testUser, updateAssignment).delete(testUser, deleteAssignment)
router.route('/stats/:property').get(showStats)

module.exports = router