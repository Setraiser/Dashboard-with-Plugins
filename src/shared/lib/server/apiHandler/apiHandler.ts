export async function apiHandler<T>(
  handler: () => Promise<T>
): Promise<Response> {
  try {
    const data = await handler();

    return Response.json(data);
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
