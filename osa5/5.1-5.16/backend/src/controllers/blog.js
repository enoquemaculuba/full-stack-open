const blogRouter = require("express").Router();
const Blog = require("../models/blog");
const { userExtractor } = require("../middlewares/token");

blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({});
  response.json(blogs);
});

blogRouter.post("/", userExtractor, async (request, response) => {
  const user = request.user;
  if (!user) {
    return response.status(401).json({ error: "user not found" });
  }

  const { title, author, url, likes } = request.body;

  if (!title || !url) {
    return response.status(400).json({ error: "title or url missing" });
  }
  const blog = new Blog({
    title,
    author,
    url,
    likes,
    user: user._id,
  });

  const result = await blog.save();

  response.status(201).json(result);
});

blogRouter.delete("/:id", userExtractor, async (request, response) => {
  const user = request.user;

  const blog = await Blog.findById(request.params.id);

  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: "unauthorized" });
  }

  const deletedBlog = await Blog.findByIdAndDelete(request.params.id);
  if (!deletedBlog) {
    return response.status(404).json({ error: "blog not found" });
  }

  response.status(204).end();
});

blogRouter.put("/:id", userExtractor, async (request, response) => {
  const blog = await Blog.findByIdAndUpdate(request.params.id, request.body, {
    new: true,
  });
  if (!blog) {
    return response.status(404).json({ error: "blog not found" });
  }
  response.json(blog);
});

module.exports = blogRouter;
