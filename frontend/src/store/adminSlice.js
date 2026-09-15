import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const fetchTelemetry = createAsyncThunk(
  'admin/fetchTelemetry',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getTelemetry();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const updateGeminiConfig = createAsyncThunk(
  'admin/updateGeminiConfig',
  async (config, { rejectWithValue }) => {
    try {
      return await api.updateAdminConfig(config);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const resetSystemTelemetry = createAsyncThunk(
  'admin/resetSystemTelemetry',
  async (_, { rejectWithValue }) => {
    try {
      return await api.resetTelemetry();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  telemetry: null,
  isLoading: false,
  error: null,
  activeModel: 'gemini-2.5-flash',
  apiKeyInput: '',
  saveStatus: null
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setApiKeyInput(state, action) {
      state.apiKeyInput = action.payload;
    },
    setActiveModel(state, action) {
      state.activeModel = action.payload;
    },
    clearSaveStatus(state) {
      state.saveStatus = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTelemetry.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTelemetry.fulfilled, (state, action) => {
        state.isLoading = false;
        state.telemetry = action.payload;
        state.activeModel = action.payload.active_model || state.activeModel;
      })
      .addCase(fetchTelemetry.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateGeminiConfig.fulfilled, (state, action) => {
        state.saveStatus = 'Settings updated successfully';
        state.activeModel = action.payload.active_model;
      })
      .addCase(updateGeminiConfig.rejected, (state, action) => {
        state.saveStatus = 'Failed to update settings';
      })
      .addCase(resetSystemTelemetry.fulfilled, (state) => {
        if (state.telemetry) {
          state.telemetry.total_resumes_screened = 0;
          state.telemetry.total_batch_runs = 0;
          state.telemetry.total_gemini_calls = 0;
          state.telemetry.estimated_tokens_used = 0;
          state.telemetry.recent_audit_logs = [];
        }
      });
  }
});

export const { setApiKeyInput, setActiveModel, clearSaveStatus } = adminSlice.actions;
export default adminSlice.reducer;
