const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const api = {
  // Candidate API
  async getSampleJobs() {
    const res = await fetch(`${BASE_URL}/candidate/sample-jobs`);
    if (!res.ok) throw new Error('Failed to load job listings');
    return res.json();
  },

  async screenResume(formData) {
    const res = await fetch(`${BASE_URL}/candidate/screen`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Screening request failed');
    }
    return res.json();
  },

  async chatAdvisor(payload) {
    const res = await fetch(`${BASE_URL}/candidate/chat-advisor`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Career advisor request failed');
    return res.json();
  },

  // Recruiter API
  async getRecruiterJobs() {
    const res = await fetch(`${BASE_URL}/recruiter/jobs`);
    if (!res.ok) throw new Error('Failed to fetch job requisitions');
    return res.json();
  },

  async createRecruiterJob(job) {
    const res = await fetch(`${BASE_URL}/recruiter/jobs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(job),
    });
    if (!res.ok) throw new Error('Failed to create job requisition');
    return res.json();
  },

  async batchScreenResumes(formData) {
    const res = await fetch(`${BASE_URL}/recruiter/batch-screen`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || 'Batch screening failed');
    }
    return res.json();
  },

  async getBenchmarkCandidates(jobId = 'job-1') {
    const res = await fetch(`${BASE_URL}/recruiter/sample-candidates?job_id=${jobId}`);
    if (!res.ok) throw new Error('Failed to load benchmark candidates');
    return res.json();
  },

  async compareCandidates(candidateIds, screenedList) {
    const res = await fetch(`${BASE_URL}/recruiter/compare?candidate_ids=${candidateIds.join(',')}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(screenedList),
    });
    if (!res.ok) throw new Error('Candidate comparison failed');
    return res.json();
  },

  // Admin API
  async getTelemetry() {
    const res = await fetch(`${BASE_URL}/admin/telemetry`);
    if (!res.ok) throw new Error('Failed to fetch telemetry');
    return res.json();
  },

  async updateAdminConfig(config) {
    const res = await fetch(`${BASE_URL}/admin/config`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('Failed to update LLM configuration');
    return res.json();
  },

  async resetTelemetry() {
    const res = await fetch(`${BASE_URL}/admin/reset`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to reset telemetry');
    return res.json();
  },

  // Analytics API
  async getAnalyticsOverview() {
    const res = await fetch(`${BASE_URL}/analytics/overview`);
    if (!res.ok) throw new Error('Failed to fetch analytics overview');
    return res.json();
  }
};
