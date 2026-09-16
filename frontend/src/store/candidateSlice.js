import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';
import confetti from 'canvas-confetti';

export const fetchSampleJobs = createAsyncThunk(
  'candidate/fetchSampleJobs',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getSampleJobs();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const screenCandidateResume = createAsyncThunk(
  'candidate/screenCandidateResume',
  async (formData, { rejectWithValue }) => {
    try {
      return await api.screenResume(formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const sendAdvisorMessage = createAsyncThunk(
  'candidate/sendAdvisorMessage',
  async (payload, { rejectWithValue }) => {
    try {
      return await api.chatAdvisor(payload);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  activeCandidate: null,
  isScreening: false,
  screeningError: null,
  sampleJobs: [],
  selectedJobId: 'job-1',
  customJob: {
    title: '',
    description: '',
    skills: '',
  },
  useCustomJob: false,
  chatMessages: [
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: "Hello! I am your AI Career Advisor & Resume Coach. Once your resume is screened, I can help you tailor project descriptions, rewrite bullet points with the STAR method, or prepare for technical interviews. How can I help you today?",
      suggestedPrompts: [
        "How can I optimize my resume for ATS parsers?",
        "What are the top 3 technical interview questions I should prepare for?",
        "How should I explain my missing skills in an interview?"
      ]
    }
  ],
  isChatLoading: false,
};

const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setSelectedJobId(state, action) {
      state.selectedJobId = action.payload;
      state.useCustomJob = false;
    },
    setCustomJob(state, action) {
      state.customJob = { ...state.customJob, ...action.payload };
    },
    setUseCustomJob(state, action) {
      state.useCustomJob = action.payload;
    },
    clearCandidate(state) {
      state.activeCandidate = null;
      state.screeningError = null;
    },
    addChatMessage(state, action) {
      state.chatMessages.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSampleJobs.fulfilled, (state, action) => {
        state.sampleJobs = action.payload;
        if (!state.selectedJobId && action.payload.length > 0) {
          state.selectedJobId = action.payload[0].id;
        }
      })
      .addCase(screenCandidateResume.pending, (state) => {
        state.isScreening = true;
        state.screeningError = null;
      })
      .addCase(screenCandidateResume.fulfilled, (state, action) => {
        state.isScreening = false;
        state.activeCandidate = action.payload;
        if (action.payload && (action.payload.overall_suitability_score >= 80 || action.payload.recommendation === 'Strong Match')) {
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {
            // gracefully ignore if canvas context unavailable
          }
        }
      })
      .addCase(screenCandidateResume.rejected, (state, action) => {
        state.isScreening = false;
        state.screeningError = action.payload || 'Failed to screen resume';
      })
      .addCase(sendAdvisorMessage.pending, (state) => {
        state.isChatLoading = true;
      })
      .addCase(sendAdvisorMessage.fulfilled, (state, action) => {
        state.isChatLoading = false;
        state.chatMessages.push({
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: action.payload.reply,
          suggestedPrompts: action.payload.suggested_prompts || []
        });
      })
      .addCase(sendAdvisorMessage.rejected, (state, action) => {
        state.isChatLoading = false;
        state.chatMessages.push({
          id: `msg-${Date.now()}`,
          role: 'assistant',
          content: "I'm having trouble connecting to the advisory service right now. Please verify backend connectivity.",
          suggestedPrompts: []
        });
      });
  }
});

export const {
  setSelectedJobId,
  setCustomJob,
  setUseCustomJob,
  clearCandidate,
  addChatMessage
} = candidateSlice.actions;

export default candidateSlice.reducer;
