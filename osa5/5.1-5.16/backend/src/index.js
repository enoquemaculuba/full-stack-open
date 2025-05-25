require("dotenv").config();
const express = require("express");
require("express-async-errors");
const app = express();
const cors = require("cors");
const { PORT } = require("./utils/config");
const middleware = require("./middlewares/token");

const loginRouter = require("./controllers/login");
const usersRouter = require("./controllers/users");
const blogsRouter = require("./controllers/blog");

app.use(cors());
app.use(express.json());

app.use(middleware.tokenExtractor);

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/blogs", blogsRouter);

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing");
  app.use("/api/testing", testingRouter);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
