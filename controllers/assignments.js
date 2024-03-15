const getAllAssignments = async (req, res) => {
    res.send('Get all assignments')
}

const getAssignment = async (req, res) => {
    res.send('Get a single assignment')
}

const createAssignment = async (req, res) => {
    res.send('Create an assignment')
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