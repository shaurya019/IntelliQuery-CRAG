import { createSlice } from "@reduxjs/toolkit";
import { clearAccessToken, setAccessToken } from "../../services/apiClient.js";

const STORAGE_KEY = "iqcrag.auth.user";

function readSession() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const persistedSession = readSession();
const hasValidPersistedSession = Boolean(
  persistedSession?.user && persistedSession?.accessToken
);

const initialState = {
  user: hasValidPersistedSession ? persistedSession.user : null,
  accessToken: hasValidPersistedSession ? persistedSession.accessToken : null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken || null;
      setAccessToken(state.accessToken);
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          user: state.user,
          accessToken: state.accessToken
        })
      );
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
      clearAccessToken();
      localStorage.removeItem(STORAGE_KEY);
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) =>
  Boolean(state.auth.user && state.auth.accessToken);

export default authSlice.reducer;
