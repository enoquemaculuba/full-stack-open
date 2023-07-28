const listHelper = require("../../utils/listHelper");
const { blogs } = require("../../lib/mockData");

test("dummy returns one", () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  expect(result).toBe(1);
});

describe("total likes", () => {
  test("empty list should total should be 0", () => {
    const result = listHelper.totalLikes([]);
    expect(result).toBe(0);
  });

  test("when list has only one blog equals the likes of that", () => {
    const result = listHelper.totalLikes(blogs.slice(0, 1));
    expect(result).toBe(7);
  });

  test("when list has multiple blogs the likes should be sum of those blogs likes", () => {
    const result = listHelper.totalLikes(blogs);
    expect(result).toBe(36);
  });
});

describe("favorite blog", () => {
  test("should find the most liked blog", () => {
    const result = listHelper.favoriteBlog(blogs);
    expect(result._id).toBe("5a422b3a1b54a676234d17f9");
  });
});

describe("most blogs", () => {
  test("should find the author with the most blogs", () => {
    const result = listHelper.mostBlogs(blogs);
    expect(result).toEqual({
      author: "Robert C. Martin",
      blogs: 3,
    });
  });
});

describe("most likes", () => {
  test("should find the author with the most likes", () => {
    const result = listHelper.mostLikes(blogs);
    expect(result).toEqual({
      author: "Edsger W. Dijkstra",
      likes: 17,
    });
  });
});
