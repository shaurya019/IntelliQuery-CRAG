/**
 * Future FastAPI integration client.
 *
 * The current app uses mockApi.js so the frontend runs independently.
 * When the backend is ready, replace the hook mutation/query functions
 * with these real HTTP calls.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "API request failed");
  }

  return response.json();
}
