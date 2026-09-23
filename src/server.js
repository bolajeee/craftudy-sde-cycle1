const http = require("http");

const server = http.createServer((request, response) => {
  if (request.method === "POST" && request.url === "/tasks") {
    let body = "";

    request.on("data", (chunk) => {
      body += chunk;
    });

    request.on("end", () => {

      const task = JSON.parse(body);

      console.log("Task:", task);
      console.log("Title:", task.title);

    response.end("Task received");
  
  });

    return;
  }

  if (request.method === "GET" && request.url === "/tasks") {
    response.end("Here are the tasks");
    return;
  }

  response.statusCode = 404;
  response.end("Not Found");
});

server.listen(4000);
