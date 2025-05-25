const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../index");
const Blog = require("../models/blog");

const api = supertest(app);

let token = null;

beforeAll(async () => {
  await Blog.deleteMany({});
  await api.post("/api/users").send({
    username: "testuser",
    name: "Test User",
    password: "testpassword",
  });
  const login = await api.post("/api/login").send({
    username: "testuser",
    password: "testpassword",
  });
  token = login.body.token;
});

describe("Users API", () => {
  test("Should create a new user", async () => {
    const newUser = {
      username: "testuser2",
      name: "Test User 2",
      password: "testpassword2",
    };
    await api.post("/api/users").send(newUser).expect(201);
  });

  test("Should login", async () => {
    const login = await api.post("/api/login").send({
      username: "testuser2",
      password: "testpassword2",
    });
    expect(login.body.token).toBeDefined();
  });
});

describe("Blogs API", () => {
  test("blogs are returned as json", async () => {
    await api
      .get("/api/blogs")
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });

  test("Should create a new blog post", async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "http://testurl.com",
      likes: 0,
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(201)
      .expect("Content-Type", /application\/json/);

    const response = await api.get("/api/blogs");
    expect(response.body).toHaveLength(1);
  });

  test("Should fail creating blog when the token is missing", async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "http://testurl.com",
      likes: 0,
    };
    await api.post("/api/blogs").send(newBlog).expect(401);
  });

  test("Should return the newly created blog post", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].title).toBe("Test blog");
  });

  test("Should have id property", async () => {
    const response = await api.get("/api/blogs");
    expect(response.body[0].id).toBeDefined();
  });

  test("Likes default value should be 0 when submitted", async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
      url: "http://testurl.com",
    };
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);

    expect(response.body.likes).toBe(0);
  });
});

describe("When body is missing title or url the request should fail", () => {
  test("Should fail when title is missing", async () => {
    const newBlog = {
      author: "Test author",
      url: "http://testurl.com",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });

  test("Should fail when url is missing", async () => {
    const newBlog = {
      title: "Test blog",
      author: "Test author",
    };
    await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(400);
  });
});

describe("When deleting a blog post", () => {
  test("Should delete the blog post", async () => {
    const newBlog = {
      title: "Test blog",
      url: "http://testurl.com",
      author: "Test author",
    };
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);
    const id = response.body.id;
    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${token}`)
      .expect(204);
  });

  test("Should fail when the user is not the creator of the blog post", async () => {
    const newUser = {
      username: "testuser3",
      name: "Test User 3",
      password: "testpassword3",
    };
    await api.post("/api/users").send(newUser).expect(201);
    const login = await api.post("/api/login").send({
      username: "testuser3",
      password: "testpassword3",
    });
    const newToken = login.body.token;
    const newBlog = {
      title: "Test blog",
      url: "http://testurl.com",
      author: "Test author",
    };
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);
    const id = response.body.id;
    await api
      .delete(`/api/blogs/${id}`)
      .set("Authorization", `Bearer ${newToken}`)
      .expect(401);
  });
});

describe("When updating a blog post", () => {
  test("Should update the blog post", async () => {
    const newBlog = {
      title: "Test blog",
      url: "http://testurl.com",
      author: "Test author",
    };
    const response = await api
      .post("/api/blogs")
      .send(newBlog)
      .set("Authorization", `Bearer ${token}`);
    const id = response.body.id;
    const updatedBlog = {
      likes: 10,
    };
    await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .set("Authorization", `Bearer ${token}`)
      .expect(200);
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});
