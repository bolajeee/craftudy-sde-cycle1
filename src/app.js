const express = require("express");
const helmet = require("helmet");
const taskRouter = require("./routes/tasks");
const authRouter = require("./routes/auth");

const app = express();

// Request logging. Silenced in tests so Jest output stays readable
if (process.env.NODE_ENV !== "test") {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

app.use(helmet());
app.use(express.json());

app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/tasks", taskRouter);
app.use("/auth", authRouter);

// Unknown routes. Must come after all real routes
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Central error handler. Must have four parameters and be registered last
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ error: "Malformed JSON request body" });
  }

  if (err.code === "23503") {
    return res.status(400).json({ error: "Referenced user does not exist" });
  }

  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

module.exports = app;
