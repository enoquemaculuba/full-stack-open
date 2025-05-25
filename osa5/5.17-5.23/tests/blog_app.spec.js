const { test, expect, beforeEach, describe } = require("@playwright/test");
const { loginWith, createBlog } = require("./helper");

const API_URL = process.env.API_URL || "http://localhost:3001";

describe("Blog app", () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`${API_URL}/api/testing/reset`);
    await request.post(`${API_URL}/api/users`, {
      data: {
        name: "Matti Luukkainen",
        username: "mluukkai",
        password: "salainen",
      },
    });

    await page.goto("/");
  });

  test("Login form is shown", async ({ page }) => {
    await expect(page.getByText("Log in to application")).toBeVisible();
    await expect(page.getByRole("button", { name: "login" })).toBeVisible();
    await expect(page.getByRole("textbox").first()).toBeVisible();
    await expect(page.getByRole("textbox").last()).toBeVisible();
  });

  describe("Login", () => {
    test("succeeds with correct credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "salainen");
      await expect(page.getByText("Matti Luukkainen logged in")).toBeVisible();
    });

    test("fails with wrong credentials", async ({ page }) => {
      await loginWith(page, "mluukkai", "wrong");

      const errorDiv = await page.locator(".error");
      await expect(errorDiv).toContainText("Wrong credentials");
      await expect(errorDiv).toHaveCSS("border-style", "solid");
      await expect(errorDiv).toHaveCSS("color", "rgb(255, 0, 0)");
      await expect(
        page.getByText("Matti Luukkainen logged in")
      ).not.toBeVisible();
    });
  });

  describe("When logged in", () => {
    beforeEach(async ({ page, request }) => {
      await request.post(`${API_URL}/api/testing/reset`);
      await request.post(`${API_URL}/api/users`, {
        data: {
          name: "Matti Luukkainen",
          username: "mluukkai",
          password: "salainen",
        },
      });
      await page.goto("/");
      await loginWith(page, "mluukkai", "salainen");
    });

    test("a new blog can be created", async ({ page }) => {
      await createBlog(page, "Test blog", "Test author", "http://test.com");
      await expect(page.getByText("Test blog Test author")).toBeVisible();
    });

    test("a blog can be liked", async ({ page }) => {
      await createBlog(page, "Test blog", "Test author", "http://test.com");

      await page.getByRole("button", { name: "view" }).first().click();
      await expect(page.getByText("likes 0")).toBeVisible();

      await page.getByRole("button", { name: "like" }).click();
      await expect(page.getByText("likes 1")).toBeVisible();
    });

    test("user who added the blog can delete the blog", async ({ page }) => {
      await createBlog(page, "Test blog", "Test author", "http://test.com");

      await page.getByRole("button", { name: "view" }).first().click();

      page.on("dialog", (dialog) => dialog.accept());
      await page.getByRole("button", { name: "remove" }).click();

      await expect(page.getByText("Test blog Test author")).not.toBeVisible();
    });

    test("only the user who added the blog sees the delete button", async ({
      page,
      request,
    }) => {
      await createBlog(page, "Test blog", "Test author", "http://test.com");

      await page.getByRole("button", { name: "view" }).first().click();
      await expect(page.getByRole("button", { name: "remove" })).toBeVisible();

      await page.getByRole("button", { name: "logout" }).click();

      await request.post(`${API_URL}/api/users`, {
        data: {
          name: "Another User",
          username: "another",
          password: "password",
        },
      });

      await loginWith(page, "another", "password");
      await page.getByRole("button", { name: "view" }).first().click();
      await expect(
        page.getByRole("button", { name: "remove" })
      ).not.toBeVisible();
    });

    test("blogs are arranged in the order according to likes", async ({
      page,
    }) => {
      await createBlog(page, "First blog", "Author 1", "http://first.com");
      await createBlog(page, "Second blog", "Author 2", "http://second.com");
      await createBlog(page, "Third blog", "Author 3", "http://third.com");

      const secondBlog = page.getByText("Second blog Author 2").locator("..");
      await secondBlog.getByRole("button", { name: "view" }).click();
      await secondBlog.getByRole("button", { name: "like" }).click();
      await expect(secondBlog.getByText("likes 1")).toBeVisible();
      await secondBlog.getByRole("button", { name: "like" }).click();
      await expect(secondBlog.getByText("likes 2")).toBeVisible();

      const thirdBlog = page.getByText("Third blog Author 3").locator("..");
      await thirdBlog.getByRole("button", { name: "view" }).click();
      await thirdBlog.getByRole("button", { name: "like" }).click();
      await expect(thirdBlog.getByText("likes 1")).toBeVisible();

      await page.reload();

      const blogs = page.locator(".blog");
      await expect(blogs.nth(0)).toContainText("Second blog Author 2");
      await expect(blogs.nth(1)).toContainText("Third blog Author 3");
      await expect(blogs.nth(2)).toContain;
    });
  });
});
