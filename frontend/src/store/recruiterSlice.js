import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../services/api';

export const fetchRecruiterJobs = createAsyncThunk(
  'recruiter/fetchRecruiterJobs',
  async (_, { rejectWithValue }) => {
    try {
      return await api.getRecruiterJobs();
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const batchScreenResumes = createAsyncThunk(
  'recruiter/batchScreenResumes',
  async (formData, { rejectWithValue }) => {
    try {
      return await api.batchScreenResumes(formData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const loadBenchmarkCandidates = createAsyncThunk(
  'recruiter/loadBenchmarkCandidates',
  async (jobId, { rejectWithValue }) => {
    try {
      return await api.getBenchmarkCandidates(jobId);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

export const createJob = createAsyncThunk(
  'recruiter/createJob',
  async (jobData, { rejectWithValue }) => {
    try {
      return await api.createRecruiterJob(jobData);
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  jobs: [],
  selectedJobId: 'job-1',
  batchResults: null,
  isBatchScreening: false,
  batchError: null,
  selectedCandidateModal: null,
  comparedCandidateIds: [],
  searchQuery: '',
  sortBy: 'overall', // 'overall' | 'technical' | 'ats' | 'experience'
  statusFilter: 'ALL', // 'ALL' | 'Strong Match' | 'Shortlist' | 'Consider' | 'Not Recommended'
};

const recruiterSlice = createSlice({
  name: 'recruiter',
  initialState,
  reducers: {
    setSelectedJobId(state, action) {
      state.selectedJobId = action.payload;
    },
    setSelectedCandidateModal(state, action) {
      state.selectedCandidateModal = action.payload;
    },
    toggleCompareCandidate(state, action) {
      const id = action.payload;
      if (state.comparedCandidateIds.includes(id)) {
        state.comparedCandidateIds = state.comparedCandidateIds.filter(cId => cId !== id);
      } else {
        if (state.comparedCandidateIds.length < 4) {
          state.comparedCandidateIds.push(id);
        }
      }
    },
    clearComparison(state) {
      state.comparedCandidateIds = [];
    },
    setSearchQuery(state, action) {
      state.searchQuery = action.payload;
    },
    setSortBy(state, action) {
      state.sortBy = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecruiterJobs.fulfilled, (state, action) => {
        state.jobs = action.payload;
        if (!state.selectedJobId && action.payload.length > 0) {
          state.selectedJobId = action.payload[0].id;
        }
      })
      .addCase(batchScreenResumes.pending, (state) => {
        state.isBatchScreening = true;
        state.batchError = null;
      })
      .addCase(batchScreenResumes.fulfilled, (state, action) => {
        state.isBatchScreening = false;
        state.batchResults = action.payload;
      })
      .addCase(batchScreenResumes.rejected, (state, action) => {
        state.isBatchScreening = false;
        state.batchError = action.payload || 'Batch screening failed';
      })
      .addCase(loadBenchmarkCandidates.pending, (state) => {
        state.isBatchScreening = true;
        state.batchError = null;
      })
      .addCase(loadBenchmarkCandidates.fulfilled, (state, action) => {
        state.isBatchScreening = false;
        state.batchResults = action.payload;
      })
      .addCase(loadBenchmarkCandidates.rejected, (state, action) => {
        state.isBatchScreening = false;
        state.batchError = action.payload || 'Failed to load benchmarks';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.unshift(action.payload);
        state.selectedJobId = action.payload.id;
      });
  }
});

export const {
  setSelectedJobId,
  setSelectedCandidateModal,
  toggleCompareCandidate,
  clearComparison,
  setSearchQuery,
  setSortBy,
  setStatusFilter
} = recruiterSlice.actions;

export default recruiterSlice.reducer;
