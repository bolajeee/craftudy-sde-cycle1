const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean()
});

const updateTaskSchema = createTaskSchema.partial()

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
