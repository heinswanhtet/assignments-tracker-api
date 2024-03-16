require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// database
const connectDB = require('./db/connection')

// routers
const authRouter = require('./routes/auth')
const assignmentsRouter = require('./routes/assignments')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleWare = require('./middleware/error-handler')

app.use(express.json())

app.get('/', (req, res) => res.send('Welcome! This is the assignments tracker.'))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/assignments', assignmentsRouter)

app.use(notFoundMiddleware)
app.use(errorHandlerMiddleWare)

const port = process.env.PORT || 3000
const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI)
        app.listen(port, () => {
            console.log(`Server is listening: http://localhost:${port}/`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()