const { z } = require("zod");

const createTaskSchema = z.object({
  title: z.string().min(1),
  completed: z.boolean(),
});

const updateTaskSchema = createTaskSchema.partial()

const signupSchema = z.object({
  name: z.string().min(3),
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine(
  (data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
})

const loginSchema = z.object({
  email: z.email(),
  password: z.string()
})

module.exports = {
  createTaskSchema,
  updateTaskSchema,
  signupSchema,
  loginSchema
};
