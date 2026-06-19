import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "iqcrag.chat.activeSessionId";

const initialState = {
  activeSessionId: localStorage.getItem(STORAGE_KEY) || null,
  inputDraft: ""
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveSessionId(state, action) {
      state.activeSessionId = action.payload;
      if (action.payload) {
        localStorage.setItem(STORAGE_KEY, action.payload);
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    },
    setInputDraft(state, action) {
      state.inputDraft = action.payload;
    },
    clearInputDraft(state) {
      state.inputDraft = "";
    }
  }
});

export const { setActiveSessionId, setInputDraft, clearInputDraft } = chatSlice.actions;
export const selectActiveSessionId = (state) => state.chat.activeSessionId;
export const selectInputDraft = (state) => state.chat.inputDraft;

export default chatSlice.reducer;
