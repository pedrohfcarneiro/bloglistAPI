const blog = require('../models/blog')
const Note = require('../models/blog')

const initialBlogs = [
    {
        title: 'titulo1',
        author: 'autor1',
        url: 'url1',
        likes: 1
    },
    {
        title: 'titulo2',
        author: 'autor2',
        url: 'url2',
        likes: 2
    }
]

const nonExistingId = async () => {
    const blog = new blog({title:'willremovethissoon', author:'none', url:'none', likes:0})
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const reducer = (sum, blog) => {
        return sum + blog.likes
    }

    let sum = blogs.reduce(reducer, 0)
    return sum
}

const favoriteBlog = (blogs) => {
    const reducer = (mostLiked, currentBlog) => {
        if(mostLiked.likes < currentBlog.likes || !mostLiked.likes) {
            return currentBlog
        }
        else {
            return mostLiked
        }
    }

    let mostLiked = blogs.reduce(reducer, {})
    return {
        title: mostLiked.title,
        author: mostLiked.author,
        likes: mostLiked.likes
    }
}

module.exports = {
    dummy, totalLikes, favoriteBlog, nonExistingId, blogsInDb, initialBlogs
}