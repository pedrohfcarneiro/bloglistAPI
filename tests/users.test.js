const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

beforeEach(async () => {
    await User.deleteMany({})

    const initializeUser = helper.initialUser
    const passwordHash = await bcrypt.hash(initializeUser.password, 10)
    const userToSave = new User({...initializeUser, password: passwordHash})

    await userToSave.save()
})

describe('creation of users', () => {
    test('creation with fresh username', async () => {
        const usersBefore = await helper.usersInDb()

        const testUser = {
            username: 'newUser',
            name: 'newUserName',
            password: 'senha'
        }

        await api
            .post('/api/users')
            .send(testUser)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toHaveLength(usersBefore.length + 1)

        const usernames = usersAfter.map(user => user.username)
        expect(usernames).toContain(testUser.username)
    }, 100000)

    test('creation fails if username already exists', async () => {
        const usersBefore = await helper.usersInDb()
        const takenUsername = usersBefore[0].username
        const userWithSameUsername = {
            username: takenUsername,
            name: 'nameNew',
            password: 'anyPassword'
        }

        const result = await api
            .post('/api/users')
            .send(userWithSameUsername)
            .expect(400)
            .expect('Content-Type', /application\/json/)
            
        expect(result.body.error).toContain('username taken')

        const usersAfter = await helper.usersInDb()
        expect(usersAfter).toEqual(usersBefore)
    })
})