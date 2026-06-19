import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice.js";
import chatReducer from "../features/chat/chatSlice.js";
import uiReducer from "../features/ui/uiSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chat: chatReducer,
    ui: uiReducer
  }
});
