const blogsRouter = require('express').Router()
const Blog = require('../models/blog')



blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
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
    const blog = new Blog(request.body)
    if(blog.title || blog.url){
      const savedBlog = await blog.save()
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
    const result = await Blog.findByIdAndDelete(request.params.id)
    response.status(204).end(JSON.stringify(result))
  } catch (error) {
    next(error)
  }
})

module.exports = blogsRouter