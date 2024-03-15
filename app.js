require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// database
const connectDB = require('./db/connection')

// middleware
const notFoundMiddleware = require('./middleware/not-found')

app.get('/', (req, res) => res.send('Welcome! This is the assignments tracker.'))

app.use(notFoundMiddleware)

const port = process.env.PORT || 3000
const start = async () => {
    try {
        app.listen(port, () => {
            console.log(`Server is listening: http://localhost:${port}/`)
        })
    } catch (error) {
        console.log(error)
    }
}

start()