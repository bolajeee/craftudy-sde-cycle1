const { createTaskSchema } = require("../validation"); 
 
const validateTask = (request, response, next) => { 
    const result = createTaskSchema.safeParse(request.body); 
 
    if (result.success == false) { 
        response.statusCode = 400; 
        response.end("Invalid task format, unable to create task"); 
        return; 
    } 
 
    request.task = result.data; 
 
    next(); 
};

module.exports = validateTask;
