import { TodoPriority } from "@/plugins/todo";
import z from "zod";

const todoPrioritySchema = z.enum(TodoPriority);

const todoFieldsSchema = {
  text: z.string().min(1).max(500),
  priority: todoPrioritySchema,
  completed: z.boolean(),
};

const createTodoSchema = z.object({
  text: todoFieldsSchema.text,
  priority: todoFieldsSchema.priority,
});

const updateTodoItemSchema = z.object({
  id: z.string(),
  text: todoFieldsSchema.text.optional(),
  priority: todoFieldsSchema.priority.optional(),
  completed: todoFieldsSchema.completed.optional(),
});

const updateTodosSchema = z.array(updateTodoItemSchema);

export { createTodoSchema, updateTodosSchema };
