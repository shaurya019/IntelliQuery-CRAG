const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
const ACCESS_TOKEN_KEY = "iqcrag.auth.token";
const SESSION_KEY = "iqcrag.auth.user";

export function getAccessToken() {
  const directToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (directToken) return directToken;

  try {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (!rawSession) return null;

    const parsedSession = JSON.parse(rawSession);
    return parsedSession?.accessToken || null;
  } catch {
    return null;
  }
}

export function setAccessToken(token) {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
  }
}

export function clearAccessToken() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { detail: text } : null;
}

function getErrorMessage(payload) {
  if (!payload) return "API request failed";
  if (typeof payload === "string") return payload;
  if (typeof payload.detail === "string") return payload.detail;
  if (Array.isArray(payload.detail)) {
    return payload.detail.map((item) => item.msg || item.message || String(item)).join(", ");
  }
  if (typeof payload.message === "string") return payload.message;
  return "API request failed";
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers || {});
  const token = options.token ?? getAccessToken();

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  if (!(options.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(getErrorMessage(payload));
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export function toIsoDateLabel(value) {
  if (!value) return "Recently";

  return new Date(value).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric"
  });
}

export function getFileType(name = "", mimeType = "") {
  if (mimeType) {
    const subtype = mimeType.split("/").pop();
    if (subtype) return subtype.toUpperCase();
  }

  const extension = name.split(".").pop();
  return extension ? extension.toUpperCase() : "DOC";
}

export function normalizeUser(payload) {
  if (!payload) return null;

  const rawUser = payload.user || payload.data || payload.profile || payload;
  const userId = rawUser.user_id || rawUser.id || rawUser.email;
  const fullName = rawUser.full_name || rawUser.displayName || rawUser.name || rawUser.email || "User";

  return {
    id: userId,
    userId,
    name: fullName,
    displayName: fullName,
    fullName,
    email: rawUser.email,
    role: rawUser.role || "User",
    plan: rawUser.plan || "Workspace"
  };
}

export function normalizeSession(payload) {
  return {
    id: payload.id || payload.session_id,
    title: payload.title || payload.name || "New Chat",
    createdAt: payload.created_at || payload.createdAt || new Date().toISOString(),
    updatedAt: payload.updated_at || payload.updatedAt || payload.created_at || new Date().toISOString()
  };
}

export function normalizeDocument(payload) {
  const name = payload.name || payload.filename || payload.title || "Untitled Document";
  return {
    id: payload.id || payload.document_id,
    name,
    type: payload.type || getFileType(name, payload.mime_type),
    size: payload.size || payload.file_size || 0,
    date: toIsoDateLabel(payload.created_at || payload.uploaded_at || payload.updated_at),
    createdAt: payload.created_at || payload.uploaded_at || payload.updated_at || null,
    active: Boolean(payload.active),
    status: payload.status || payload.ingestion_status || "Processing",
    summary: payload.summary || "",
    content: payload.content || payload.text || "",
    mimeType: payload.mime_type || payload.content_type || "",
    previewUrl: payload.preview_url || payload.url || payload.file_url || payload.s3_url || "",
    raw: payload
  };
}

export function normalizeMessage(payload) {
  return {
    id: payload.id || payload.message_id || crypto.randomUUID(),
    role: payload.role || (payload.answer ? "assistant" : "user"),
    content: payload.content || payload.message || payload.answer || "",
    createdAt: payload.created_at || payload.createdAt || new Date().toISOString(),
    confidence: payload.confidence || 0,
    usedFallback: Boolean(payload.used_fallback || payload.usedFallback),
    sources: payload.sources || [],
    pipeline: payload.pipeline || []
  };
}

export function ensureArray(payload, keys = []) {
  if (Array.isArray(payload)) return payload;

  for (const key of keys) {
    if (Array.isArray(payload?.[key])) return payload[key];
  }

  return [];
}
