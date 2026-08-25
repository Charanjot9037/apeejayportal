// app/projectDetail/handlers/utils/safeJson.js
export async function safeJson(response) {
  const text = await response.text();

  if (!text) {
    return null; // empty body, e.g. 204 No Content or a crashed response
  }

  try {
    return JSON.parse(text);
  } catch {
    // response wasn't JSON at all (HTML error page, etc.)
    return null;
  }
}