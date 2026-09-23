import { createTodoSchema, updateTodosSchema } from "@/plugin-host/todo";
import { createTodo } from "@/plugin-host/todo/server/requests/create";
import { getTodos } from "@/plugin-host/todo/server/requests/get";
import { updateTodos } from "@/plugin-host/todo/server/requests/update";
import { apiHandler } from "@/shared/lib/server/apiHandler/apiHandler";

export async function GET(request: Request) {
  return apiHandler(async () => {
    return getTodos({});
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const { text, priority } = createTodoSchema.parse(await request.json());

    return createTodo({ text, priority });
  });
}

export async function PATCH(request: Request) {
  return apiHandler(async () => {
    const body = updateTodosSchema.parse(await request.json());

    return updateTodos(body);
  });
}
