import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobileLibraryOpen: false,
  documentSearch: "",
  selectedDocumentId: null
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    openMobileLibrary(state) {
      state.isMobileLibraryOpen = true;
    },
    closeMobileLibrary(state) {
      state.isMobileLibraryOpen = false;
    },
    setDocumentSearch(state, action) {
      state.documentSearch = action.payload;
    },
    setSelectedDocumentId(state, action) {
      state.selectedDocumentId = action.payload;
    }
  }
});

export const {
  openMobileLibrary,
  closeMobileLibrary,
  setDocumentSearch,
  setSelectedDocumentId
} = uiSlice.actions;

export const selectIsMobileLibraryOpen = (state) => state.ui.isMobileLibraryOpen;
export const selectDocumentSearch = (state) => state.ui.documentSearch;
export const selectSelectedDocumentId = (state) => state.ui.selectedDocumentId;

export default uiSlice.reducer;
