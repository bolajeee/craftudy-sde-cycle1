const express = require("express");
const fs = require("fs").promises;
const { createTaskSchema } = require("./validation");

const app = express();

app.use(express.json())

const port = Number(process.env.PORT) || 4000;

app.get("/", (request, response) => {
  response.send("Tasks API is running");
});


app.get("/tasks", async (request, response) => {
  try {
    const data = await fs.readFile("tasks.json", "utf8");

    const tasks = JSON.parse(data);

    response.json(tasks);
  } catch (error) {
    response.status(500).json({
      error: "Could not read tasks"
    });
  }
});

app.post("/tasks", async (request, response) => {
  const result = createTaskSchema.safeParse(request.body);

  if (!result.success) {
    return response.status(400).json({
      error: "Invalid task",
      details: result.error.issues
    });
  }

  try {
    const data = await fs.readFile("tasks.json", "utf8");

    const tasks = JSON.parse(data);

    let highestId = 0;

    for (const existingTask of tasks) {
      if (existingTask.id > highestId) {
        highestId = existingTask.id;
      }
    }

     const newTask = {
      id: highestId + 1,
      title: result.data.title,
      completed: result.data.completed
    };

    tasks.push(newTask);

    await fs.writeFile(
      "tasks.json",
      JSON.stringify(tasks),
      "utf8"
    );

    response.status(201).json(newTask);
  } catch (error) {
    response.status(500).json({
      error: "Could not create task"
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});


