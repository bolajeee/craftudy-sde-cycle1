const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean(),
  userId: z.number().int().positive()
});

const updateTaskSchema = createTaskSchema.omit({userId: true}).partial()

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
