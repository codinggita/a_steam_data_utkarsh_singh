import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebarOpen: false,
  darkMode: localStorage.getItem('theme') === 'dark',
  systemLogs: [
    `MOMENTUM OS v4.0.12 INITIALIZED.`,
    `SECURE CHANNEL ACCESSED VIA LOCALHOST.`,
    `INTEGRITY CHECK: OK.`
  ],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action) => {
      state.sidebarOpen = action.payload;
    },
    toggleDarkMode: (state) => {
      state.darkMode = !state.darkMode;
      localStorage.setItem('theme', state.darkMode ? 'dark' : 'light');
      if (state.darkMode) {
        document.documentElement.classList.add('dark');
        document.documentElement.classList.remove('light');
      } else {
        document.documentElement.classList.add('light');
        document.documentElement.classList.remove('dark');
      }
    },
    addSystemLog: (state, action) => {
      const timestamp = new Date().toISOString().slice(11, 19);
      state.systemLogs.unshift(`[${timestamp}] ${action.payload.toUpperCase()}`);
      // Keep only last 30 logs
      if (state.systemLogs.length > 30) {
        state.systemLogs.pop();
      }
    },
    clearSystemLogs: (state) => {
      state.systemLogs = [];
    }
  },
});

export const { toggleSidebar, setSidebarOpen, toggleDarkMode, addSystemLog, clearSystemLogs } = uiSlice.actions;
export default uiSlice.reducer;
