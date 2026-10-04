const fs = require("fs").promises;

async function readTasks() {
  const data = await fs.readFile("tasks.json", "utf8");

  console.log(data);
}

readTasks();
