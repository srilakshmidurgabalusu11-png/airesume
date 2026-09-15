import { configureStore } from '@reduxjs/toolkit';
import candidateReducer from './candidateSlice';
import recruiterReducer from './recruiterSlice';
import adminReducer from './adminSlice';
import uiReducer from './uiSlice';

export const store = configureStore({
  reducer: {
    candidate: candidateReducer,
    recruiter: recruiterReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;
