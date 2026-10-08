const express = require("express");
const { createTaskSchema } = require("./validation");

const app = express();
const port = Number(process.env.PORT) || 4000;

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

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
