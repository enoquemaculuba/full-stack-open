import { useState } from 'react'

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const decodeToken = (token) => {
    try {
      const payload = token.split('.')[1]
      const decoded = JSON.parse(atob(payload))
      return decoded
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const addLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user
    }
    updateBlog(blog.id, updatedBlog)
  }

  const removeBlog = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id)
    }
  }

  const decodedToken = user ? decodeToken(user.token) : null
  const showDelete = user && blog.user && decodedToken && decodedToken.id === blog.user

  return (
    <div style={blogStyle} className="blog">
      <div className="blogTitleAuthor">
        {blog.title} {blog.author}
        <button onClick={toggleVisibility}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className="blogDetails">
          <div className="blogUrl">{blog.url}</div>
          <div className="blogLikes">
            likes {blog.likes}
            <button onClick={addLike}>like</button>
          </div>
          <div>{user.name}</div>
          {showDelete && (
            <button onClick={removeBlog}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

export default Blog