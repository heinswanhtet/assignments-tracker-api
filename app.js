require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()

// security packages
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')

// database
const connectDB = require('./db/connection')

// routers
const authRouter = require('./routes/auth')
const assignmentsRouter = require('./routes/assignments')

// middleware
const notFoundMiddleware = require('./middleware/not-found')
const errorHandlerMiddleWare = require('./middleware/error-handler')
const authenticateUser = require('./middleware/authentication')

// Swagger
const swaggerUI = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./swagger.yaml')
// const swaggerDocument = require('./swagger.json')

app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60
    })
)
app.use(helmet())
app.use(xss())
app.use(cors())

app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Assignments Tracker API</h1><a href="/api-docs">Documentation</a>')
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocument))

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/assignments', authenticateUser, assignmentsRouter)

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