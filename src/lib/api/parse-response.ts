export async function parseResponsePayload<T>(response: Response): Promise<T> {
  const isJson = response.headers
    .get("content-type")
    ?.includes("application/json");

  if (!isJson) {
    return {} as T;
  }

  return (await response.json()) as T;
}