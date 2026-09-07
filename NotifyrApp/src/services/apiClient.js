// Development server URL.
// Change this if your PC's IP changes.

// const BASE_URL = "http://192.168.10.3:4000";
// const BASE_URL = "http://192.168.2.56:4000";
const BASE_URL = "http://192.168.1.104:4000";


export async function request(
  path,
  { method = "GET", body, headers = {} } = {}
) {
  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch (e) {
    // some responses (e.g. 204) have no body
  }

  if (!response.ok) {
const message =
  (data && data.error && data.error.message) ||
  (data && data.message) ||
  `Request failed (${response.status})`;
    throw new Error(message);
  }

  return data;
}