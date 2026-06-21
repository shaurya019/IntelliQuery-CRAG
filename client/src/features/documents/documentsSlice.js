import { createSlice } from "@reduxjs/toolkit";

const STORAGE_KEY = "iqcrag.documents.ui";

function readPersistedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persistState(state) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      searchTerm: state.searchTerm,
      statusFilter: state.statusFilter,
      lastOpenedDocumentId: state.lastOpenedDocumentId,
      recentDocumentIds: state.recentDocumentIds
    })
  );
}

const persistedState = readPersistedState();

const initialState = {
  searchTerm: persistedState?.searchTerm || "",
  statusFilter: persistedState?.statusFilter || "all",
  lastOpenedDocumentId: persistedState?.lastOpenedDocumentId || null,
  recentDocumentIds: persistedState?.recentDocumentIds || []
};

const documentsSlice = createSlice({
  name: "documents",
  initialState,
  reducers: {
    setDocumentSearch(state, action) {
      state.searchTerm = action.payload;
      persistState(state);
    },
    setDocumentStatusFilter(state, action) {
      state.statusFilter = action.payload;
      persistState(state);
    },
    markDocumentOpened(state, action) {
      const documentId = action.payload;
      state.lastOpenedDocumentId = documentId;
      state.recentDocumentIds = [
        documentId,
        ...state.recentDocumentIds.filter((id) => id !== documentId)
      ].slice(0, 8);
      persistState(state);
    }
  }
});

export const {
  setDocumentSearch,
  setDocumentStatusFilter,
  markDocumentOpened
} = documentsSlice.actions;

export const selectDocumentSearch = (state) => state.documents.searchTerm;
export const selectDocumentStatusFilter = (state) => state.documents.statusFilter;
export const selectLastOpenedDocumentId = (state) => state.documents.lastOpenedDocumentId;
export const selectRecentDocumentIds = (state) => state.documents.recentDocumentIds;

export default documentsSlice.reducer;
