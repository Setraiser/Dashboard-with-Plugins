import { deleteTodo } from "@/plugins/todo/server/delete";
import { apiHandler } from "@/shared/lib/server/apiHandler/apiHandler";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  return apiHandler(async () => {
    const { id } = await params;

    return deleteTodo({ id });
  });
}
