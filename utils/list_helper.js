const blog = require('../models/blog')
const user = require('../models/user')

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

const initialUser = {
    username: 'root',
    name: 'Initial user',
    password: 'password'
}


const nonExistingId = async () => {
    const blog = new blog({title:'willremovethissoon', author:'none', url:'none', likes:0})
    await blog.save()
    await blog.remove()

    return blog._id.toString()
}

const blogsInDb = async () => {
    const blogs = await blog.find({}).populate('user', { username: 1, name: 1})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await user.find({}).populate('blogs', { title: 1, author: 1, url: 1})
    return users.map(user => user.toJSON())
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

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if(authorization && authorization.toLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

module.exports = {
    dummy, totalLikes, favoriteBlog, nonExistingId, blogsInDb, usersInDb, initialBlogs, initialUser, getTokenFrom
}