const express = require("express");
const { createTaskSchema, updateTaskSchema } = require("./validation");
const pool = require("./db");

const app = express();
const port = Number(process.env.PORT) || 4000;

//route logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.originalUrl}`);
  next();
});

app.use(express.json());

// GET /tasks — retrieve all tasks
app.get("/tasks", async (req, res) => {
  const result = await pool.query(
    "SELECT id, title, completed FROM tasks ORDER BY id"
  );

  const tasks = result.rows.map((task) => ({
    ...task,
    id: Number(task.id)
  }));

  res.status(200).json(tasks);
});


// POST /tasks — create a task
app.post("/tasks", async (req, res, next) => {
  try {
    const result = createTaskSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        error: "Invalid task",
        details: result.error.issues
      });
    }

    const { title, completed, userId } = result.data;

    const dbResult = await pool.query(
      `INSERT INTO tasks (title, completed, user_id)
       VALUES ($1, $2, $3)
       RETURNING id, title, completed`,
      [title, completed, userId]
    );

    const newTask = {
      ...dbResult.rows[0],
      id: Number(dbResult.rows[0].id)
    };

    return res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
});


// GET /tasks/:id — retrieve one task
app.get("/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const result = await pool.query(
      "SELECT id, title, completed FROM tasks WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = {
      ...result.rows[0],
      id: Number(result.rows[0].id)
    };

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// PATCH /tasks/:id — update selected task fields
app.patch("/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const result = updateTaskSchema.safeParse(req.body);

    if (!result.success || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Invalid task update",
        details: result.success
          ? "Provide at least one field"
          : result.error.issues
      });
    }

    const fields = [];
    const values = [];
    let position = 1;

    for (const [key, value] of Object.entries(result.data)) {
      const column = key === "completed" ? "completed" : "title";
      fields.push(`${column} = $${position}`);
      values.push(value);
      position++;
    }

    values.push(id);

    const dbResult = await pool.query(
      `UPDATE tasks
       SET ${fields.join(", ")}
       WHERE id = $${position}
       RETURNING id, title, completed`,
      values
    );

    if (dbResult.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    const task = {
      ...dbResult.rows[0],
      id: Number(dbResult.rows[0].id)
    };

    return res.status(200).json(task);
  } catch (error) {
    next(error);
  }
});

// DELETE /tasks/:id — delete a task
app.delete("/tasks/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: "Invalid task ID" });
    }

    const result = await pool.query(
      "DELETE FROM tasks WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Task not found" });
    }

    return res.status(204).send();
  } catch (error) {
    next(error);
  }
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
