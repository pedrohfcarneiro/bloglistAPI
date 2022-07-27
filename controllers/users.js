const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const helper = require('../utils/list_helper')

usersRouter.post('/', async (request,response,next) => {
    try {
        const { username, name, password } = request.body
        
        //forbids taken username
        const existingUser = await User.findOne({ username })
        if(existingUser) {
            return response.status(400).json({
                error: 'username taken'
            })
        }

        //validate password
        if(!(/(?=.{3,})/.test(password))) {
            return response.status(400).json({
                error: 'password must be at least 3 characters long'
            })
        }

        if(username && name && password) {
            const saltRounds = 10
            const passwordHash = await bcrypt.hash(password, saltRounds)

            const user = new User({
                username,
                name,
                passwordHash 
            })

            const savedUser = await user.save()

            response.status(201).json(savedUser)
        }
        else {
            return response.status(400).json({
                error: 'all values must be inserted'
              })
        }
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/', async (request, response, next) => {
    try {
        const currentUsers = await helper.usersInDb()
        if(currentUsers)
            response.json(currentUsers)
        else
            response.status(404).end()
    } catch (error) {
        next(error)
    }
})

usersRouter.get('/getByUsername/:username', async (request, response, next) => {
    console.log(request.params.username)
    try {
        const userList = await User.find({'username': request.params.username})
        const user = userList[0]
        console.log(user.toJSON())
        if(user)
            response.json(user.toJSON())
        else
            response.status(404).end()
    } catch (error) {
        next(error)
    }
})

module.exports = usersRouter