import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('<Blog />', () => {
  let container
  const blog = {
    title: 'Component testing is done with react-testing-library',
    author: 'Test Author',
    url: 'http://example.com',
    likes: 5,
    user: '507f1f77bcf86cd799439011'
  }

  const user = {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjUwN2YxZjc3YmNmODZjZDc5OTQzOTAxMSIsImlhdCI6MTY3NDU2NzE3OH0.test',
    username: 'testuser',
    name: 'Test User'
  }

  const mockUpdateBlog = vi.fn()
  const mockDeleteBlog = vi.fn()

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        updateBlog={mockUpdateBlog}
        deleteBlog={mockDeleteBlog}
        user={user}
      />
    ).container
  })

  test('renders title and author but not URL or likes by default', () => {
    const titleAuthorElement = container.querySelector('.blogTitleAuthor')
    expect(titleAuthorElement).toHaveTextContent('Component testing is done with react-testing-library')
    expect(titleAuthorElement).toHaveTextContent('Test Author')

    const detailsElement = container.querySelector('.blogDetails')
    expect(detailsElement).not.toBeInTheDocument()
  })

  test('URL and likes are shown when the view button is clicked', async () => {
    const user = userEvent.setup()
    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const detailsElement = container.querySelector('.blogDetails')
    expect(detailsElement).toBeInTheDocument()

    expect(screen.getByText('http://example.com')).toBeInTheDocument()
    expect(screen.getByText('likes 5')).toBeInTheDocument()
  })

  test('if like button is clicked twice, event handler is called twice', async () => {
    const user = userEvent.setup()

    const viewButton = screen.getByText('view')
    await user.click(viewButton)

    const likeButton = screen.getByText('like')
    await user.click(likeButton)
    await user.click(likeButton)

    expect(mockUpdateBlog.mock.calls).toHaveLength(2)
  })
})