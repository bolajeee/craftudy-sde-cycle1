const express = require("express");
const fs = require("fs").promises;
const validateTask = require("./middleware/validateTask.js");

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

app.post("/tasks", validateTask , async (request, response) => {

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
      title: request.task.title,
      completed: request.task.completed
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


