import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "iqcrag.auth.user";

function readUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = {
  user: readUser()
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload));
    },
    clearCredentials(state) {
      state.user = null;
      localStorage.removeItem(STORAGE_KEY);
    }
  }
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => Boolean(state.auth.user);

export default authSlice.reducer;
