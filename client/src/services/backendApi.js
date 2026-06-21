import {
  apiRequest,
  clearAccessToken,
  ensureArray,
  normalizeDocument,
  normalizeMessage,
  normalizeSession,
  normalizeUser,
  setAccessToken
} from "./apiClient.js";
import { mockApi } from "./mockApi.js";

function normalizeAuthPayload(payload) {
  const accessToken =
    payload?.access_token ||
    payload?.accessToken ||
    payload?.token ||
    payload?.data?.access_token ||
    null;

  if (accessToken) {
    setAccessToken(accessToken);
  }

  return {
    user: normalizeUser(payload),
    accessToken
  };
}

export const backendApi = {
  async register(input) {
    const payload = await apiRequest("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(input)
    });

    return normalizeAuthPayload(payload);
  },

  async login(input) {
    const payload = await apiRequest("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(input)
    });

    return normalizeAuthPayload(payload);
  },

  async getCurrentUser() {
    const payload = await apiRequest("/api/v1/auth/me");
    return normalizeUser(payload);
  },

  async registerS3AndIngest(files) {
    return mockApi.uploadDocuments(files);
  },

  async getDocuments() {
    return mockApi.getDocuments();
  },

  async getDocument(documentId) {
    const documents = await mockApi.getDocuments();
    const document = documents.find((item) => item.id === documentId);

    if (!document) {
      throw new Error("Document not found");
    }

    return normalizeDocument(document);
  },

  async getIngestionJob(jobId) {
    return apiRequest(`/api/v1/ingestion/jobs/${jobId}`);
  },

  async createSession(title = "New Chat") {
    return mockApi.createSession(title);
  },

  async getSessions() {
    return mockApi.getSessions();
  },

  async sendMessage({ sessionId, content }) {
    const payload = await mockApi.sendMessage({ sessionId, content });

    return {
      userMessage: normalizeMessage(payload.userMessage),
      assistantMessage: normalizeMessage(payload.assistantMessage)
    };
  },

  async getSessionMessages(sessionId) {
    const payload = await mockApi.getMessages(sessionId);
    return ensureArray(payload, ["messages", "items", "data"]).map(normalizeMessage);
  },

  async healthCheck() {
    return apiRequest("/api/v1/health");
  },

  logout() {
    clearAccessToken();
  }
};
