const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('../utils/list_helper')
const jwt = require('jsonwebtoken')


blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await helper.blogsInDb()
    if(blogs)
      response.json(blogs)
    else
      response.status(404).end()
  } catch(error) {
    next(error)
  }
    
})

blogsRouter.post('/', async (request, response, next) => {
  try {
    const body = request.body
    
    const user = request.user
    
    //if passed a valid user authentication token -> continues with adding blog

    const blog = new Blog(body)
    if(blog.title || blog.url){
      const blogToSave = new Blog({
        title: blog.title,
        author: blog.author,
        url: blog.url,
        user: user._id,
        likes: blog.likes
      })
      const savedBlog = await blogToSave.save()
      user.blogs = user.blogs.concat(savedBlog._id)
      await user.save()

      response.status(201).json(savedBlog)
    }
    else {
      return response.status(400).json({
        error: 'title and url not inserted'
      })
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.put('/:id', async (request, response, next) => {
  try {
    const changedPost = request.body
    if(changedPost.title || changedPost.url){
      const updatedContact = await Blog.findByIdAndUpdate(request.params.id, changedPost, {new:true, runValidators: true, context: 'query'})
      response.json(updatedContact)
    }
  } catch (error) {
    next(error)
  }
})

blogsRouter.delete('/:id', async (request, response, next) => {
    try {
      const user = request.user
      
      //validate if the user is the owner
      const blogToDelete = await Blog.findById(request.params.id)
      if(!(blogToDelete.user.toString() === user.id.toString())) {
        return response.status(401).json({ error: 'user is not owner of this blog' })
      }
      const result = await Blog.findByIdAndDelete(request.params.id)
      response.status(204).end(JSON.stringify(result))
    } catch (error) {
      next(error)
    }
})


module.exports = blogsRouter