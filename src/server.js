const http = require("http");
const fs = require("fs").promises;

const server = http.createServer(async (request, response) => {

  if (request.method === "POST" && request.url === "/tasks") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", async () => {
      try {
        const task = JSON.parse(body);

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
          title: task.title,
          completed: task.completed
        };

        tasks.push(newTask);

        const updatedTasks = JSON.stringify(tasks);

        await fs.writeFile("tasks.json", updatedTasks, "utf8");

        response.statusCode = 201;
        response.setHeader("Content-Type", "application/json");
        response.end(JSON.stringify(newTask));

      } catch (error) {
        response.statusCode = 500;
        response.end("Error processing task");
      }
    });

    return;
  }

  if (request.method === "GET" && request.url === "/tasks") {
    try {
      const data = await fs.readFile("tasks.json", "utf8");

      const tasks = JSON.parse(data);

      response.setHeader("Content-Type", "application/json");
      response.end(JSON.stringify(tasks));

    } catch (error) {
      response.statusCode = 500;
      response.end("Could not read tasks");
    }

    return;
  }

  response.statusCode = 404;
  response.end("Not Found");
});

const port = Number(process.env.PORT) || 4000;

console.log(port);

server.listen(port);
