import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isMobileLibraryOpen: false
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
    }
  }
});

export const { openMobileLibrary, closeMobileLibrary } = uiSlice.actions;

export const selectIsMobileLibraryOpen = (state) => state.ui.isMobileLibraryOpen;

export default uiSlice.reducer;
