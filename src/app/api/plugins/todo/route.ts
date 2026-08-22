import { IUpdateTodoInput } from "@/plugins/todo/entities/todo";
import { createTodo } from "@/plugins/todo/server/create";
import { getTodos } from "@/plugins/todo/server/get";
import { updateTodos } from "@/plugins/todo/server/update";
import { apiHandler } from "@/shared/lib/server/apiHandler/apiHandler";

export async function GET(request: Request) {
  return apiHandler(async () => {
    return getTodos({});
  });
}

export async function POST(request: Request) {
  return apiHandler(async () => {
    const { text, priority } = await request.json();

    return createTodo({ text, priority });
  });
}

export async function PATCH(request: Request) {
  return apiHandler(async () => {
    const body = (await request.json()) as IUpdateTodoInput[];

    return updateTodos(body);
  });
}
