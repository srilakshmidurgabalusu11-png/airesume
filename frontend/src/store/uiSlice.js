import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activePortal: 'candidate', // 'candidate' | 'recruiter' | 'admin' | 'analytics'
  theme: 'light', // 'light' | 'dark'
  notification: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setActivePortal(state, action) {
      state.activePortal = action.payload;
    },
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark';
    },
    setTheme(state, action) {
      state.theme = action.payload;
    },
    showNotification(state, action) {
      state.notification = action.payload;
    },
    clearNotification(state) {
      state.notification = null;
    }
  }
});

export const { setActivePortal, toggleTheme, setTheme, showNotification, clearNotification } = uiSlice.actions;
export default uiSlice.reducer;
