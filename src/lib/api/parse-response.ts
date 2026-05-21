export async function parseResponsePayload<T>(
  response: Response
) {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  if (!isJson) {
    return null;
  }

  return (await response.json()) as T;
}