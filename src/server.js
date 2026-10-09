const express = require("express");
const { createTaskSchema, updateTaskSchema } = require("./validation");

const app = express();
const port = Number(process.env.PORT) || 4000;

//route logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

let nextId = 1;
const tasks = [];

// GET /tasks — retrieve all tasks
app.get("/tasks", (req, res) => {
res.status(200).json(tasks);
});

// POST /tasks — create a task
app.post("/tasks", (req, res) => {
const result = createTaskSchema.safeParse(req.body);

if (!result.success) {
 return res.status(400).json({
   error: "Invalid task",
   details: result.error.issues
 });
}

const newTask = {
  id: nextId++,
  title: result.data.title,
  completed: result.data.completed
};

 tasks.push(newTask);

 res.status(201).json(newTask);
});

// GET /tasks/:id — retrieve one task
app.get("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  res.status(200).json(task);
});

// PATCH /tasks/:id — update selected task fields
app.patch("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return res.status(404).json({ error: "Task not found" });
  }

  const result = updateTaskSchema.safeParse(req.body);

  if (!result.success || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      error: "Invalid task update",
      details: result.success ? "Provide at least one field" : result.error.issues
    });
  }

  Object.assign(task, result.data);

  res.status(200).json(task);
});

// DELETE /tasks/:id — delete a task
app.delete("/tasks/:id", (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id < 1) {
    return res.status(400).json({ error: "Invalid task ID" });
  }

  const taskIndex = tasks.findIndex((task) => task.id === id);

  if (taskIndex === -1) {
    return res.status(404).json({ error: "Task not found" });
  }

  tasks.splice(taskIndex, 1);

  return res.status(204).send();
});

// Handle requests to routes that don't exist
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
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

  console.error(err);

  res.status(500).json({
    error: "Internal server error"
  });
});

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
