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
    dummy, totalLikes, favoriteBlog
}