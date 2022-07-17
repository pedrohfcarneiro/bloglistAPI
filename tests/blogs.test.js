const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('../utils/list_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


//Initialize database before each test
beforeEach(async () => { 
    await Blog.deleteMany({})
    
    const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})

test('correct amount is returned in JSON', async () => {
    const currentBlogs = await helper.blogsInDb()
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
    expect(currentBlogs).toHaveLength(helper.initialBlogs.length)
}, 100000)

test('verify id property', async () => {
    const blogs = await helper.blogsInDb()
    console.log(blogs)
    expect(blogs[0].id).toBeDefined()
}, 100000)

describe('addition of new blog post', () => {
    test('check new blog post added', async () => {
        const testBlogPost = {
            title: 'testNewPost',
            author: 'testAuthor',
            url: 'test',
            likes: 0
        }
        await api
            .post('/api/blogs')
            .send(testBlogPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const afterBlogs = await helper.blogsInDb()
        const afterBlogsWithoutId = afterBlogs.map(({ id, ...rest}) => rest)
        console.log(afterBlogsWithoutId)
        expect(afterBlogs).toHaveLength(helper.initialBlogs.length + 1)
        expect(afterBlogsWithoutId).toContainEqual(testBlogPost)
    }, 100000)
    
    test('check likes default value', async () => {
        const testBlogPost = {
            title: 'testNewPost',
            author: 'testAuthor',
            url: 'test',
        }
        await api
            .post('/api/blogs')
            .send(testBlogPost)
            .expect(201)
            .expect('Content-Type', /application\/json/)
        
        const addedTestBlog = await Blog.find({title: 'testNewPost'})
        console.log(addedTestBlog[0])
        expect(addedTestBlog[0].likes).toEqual(0)
    }, 100000)
    
    test('check title or url missing responds 400 status code', async () => {
        const testBlogPost = {
            author: 'testAuthor',
            likes: 1
        }
        await api
            .post('/api/blogs')
            .send(testBlogPost)
            .expect(400)
        
    }, 100000)
})

describe('deletion of blog post', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const postsAtStart = await helper.blogsInDb()
        //console.log(postsAtStart)
        const postToDelete = postsAtStart[0]
        //console.log(postToDelete)
        await api
            .delete(`/api/blogs/${postToDelete.id}`)
            .expect(204)

        const postsAfter = await helper.blogsInDb()
        expect(postsAfter).toHaveLength(helper.initialBlogs.length - 1)

        const idsOfPosts = postsAfter.map(p => p.id)
        expect(idsOfPosts).not.toContain(postToDelete.id)
    }, 100000)
})

describe('updating a blog post', () => {
    test('succeeds with a status code 200 if id is valid', async () => {
        const postsAtStart = await helper.blogsInDb()
        //const postToUpdate = {id, ...postsAtStart[0]}
        //let {id, ...postToUpdate} = postsAtStart[0]
        //const changedPost = { ...postToUpdate, likes: postToUpdate.likes + 1 }
        const changedPost = { ...postsAtStart[0], likes: postsAtStart[0].likes + 1}
        console.log(changedPost)
        console.log(postsAtStart[0])
        await api
            .put(`/api/blogs/${postsAtStart[0].id}`)
            .send(changedPost)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const postsAfter = await helper.blogsInDb()
        console.log(postsAfter)
        expect(postsAfter).toHaveLength(postsAtStart.length)
        const changedPostAfter = await Blog.findById(postsAtStart[0].id)
        console.log(changedPostAfter.toJSON())
        expect(changedPostAfter.toJSON()).toEqual(changedPost)
        
    })
})


afterAll(() => {
    mongoose.connection.close()
})