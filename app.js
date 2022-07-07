require('dotenv').config()
const express = require('express')
const app = express()
const cors = require('cors')
const blogsRouter = require('./controllers/blogs')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')


app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/blogs', blogsRouter)

app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app