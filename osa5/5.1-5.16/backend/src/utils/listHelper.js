const dummy = () => {
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  const likes = blogs.map((blog) => blog.likes);
  const maxLikes = Math.max(...likes);
  const mostLikedBlog = blogs.find((blog) => blog.likes === maxLikes);
  return mostLikedBlog;
};

const mostBlogs = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const uniqueAuthors = [...new Set(authors)];
  const authorBlogs = uniqueAuthors.map((author) => {
    const authorBlogs = blogs.filter((blog) => blog.author === author);
    return {
      author,
      blogs: authorBlogs.length,
    };
  });
  const maxBlogs = Math.max(...authorBlogs.map((author) => author.blogs));
  const mostBlogsAuthor = authorBlogs.find(
    (author) => author.blogs === maxBlogs
  );
  return mostBlogsAuthor;
};

const mostLikes = (blogs) => {
  const authors = blogs.map((blog) => blog.author);
  const uniqueAuthors = [...new Set(authors)];
  const authorLikes = uniqueAuthors.map((author) => {
    const authorBlogs = blogs.filter((blog) => blog.author === author);
    const authorLikes = authorBlogs.reduce((sum, blog) => sum + blog.likes, 0);
    return {
      author,
      likes: authorLikes,
    };
  });
  const maxLikes = Math.max(...authorLikes.map((author) => author.likes));
  const mostLikesAuthor = authorLikes.find(
    (author) => author.likes === maxLikes
  );
  return mostLikesAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
