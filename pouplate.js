require('dotenv').config()

const connectDB = require('./db/connection')
const Assignment = require('./models/Assignment')

const jsonAssignments = require('./mock-assignment-data.json')

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        await Assignment.create(jsonAssignments)
        console.log('Success of creating json data to the cloud database!')
        process.exit(0)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}

start()