const express = require("express");
const taskRouter = require("./routes/tasks")
const authRouter = require("./routes/auth")
const helmet = require("helmet");


const port = Number(process.env.PORT) || 4000;
const app = express();


//route logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());
app.use(helmet());
app.use("/tasks", taskRouter);
app.use("/auth", authRouter);

// Handle requests to routes that don't exist
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// Central error handler — must have four parameters
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({
      error: "Malformed JSON request body"
    });
  }

  if (err.code === "23503") {
    return res.status(400).json({
      error: "Referenced user does not exist"
    });
  }

  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
