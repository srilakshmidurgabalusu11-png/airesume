import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchRecruiterJobs, 
  batchScreenResumes, 
  loadBenchmarkCandidates,
  createJob,
  setSelectedJobId 
} from '../../store/recruiterSlice';
import { 
  Briefcase, 
  UploadCloud, 
  Files, 
  Sparkles, 
  Play, 
  Users, 
  CheckCircle,
  PlusCircle,
  Layers,
  X
} from 'lucide-react';

export const BatchUploader = () => {
  const dispatch = useDispatch();
  const { jobs, selectedJobId, isBatchScreening, batchError } = useSelector((state) => state.recruiter);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showNewJobModal, setShowNewJobModal] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    company: '',
    experience_required: '2-5 years',
    education_required: "Bachelor's or Master's in CSE",
    required_skills: '',
    preferred_skills: '',
    full_text: ''
  });

  useEffect(() => {
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

  const handleCreateJobSubmit = (e) => {
    e.preventDefault();
    if (!newJob.title.trim() || !newJob.full_text.trim()) {
      alert('Please provide at least a Job Title and Description.');
      return;
    }
    const payload = {
      title: newJob.title.trim(),
      company: newJob.company.trim() || 'Tech Enterprise Inc.',
      experience_required: newJob.experience_required,
      education_required: newJob.education_required,
      required_skills: newJob.required_skills ? newJob.required_skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [],
      preferred_skills: newJob.preferred_skills ? newJob.preferred_skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean) : [],
      full_text: newJob.full_text.trim()
    };
    dispatch(createJob(payload));
    setShowNewJobModal(false);
    setNewJob({
      title: '',
      company: '',
      experience_required: '2-5 years',
      education_required: "Bachelor's or Master's in CSE",
      required_skills: '',
      preferred_skills: '',
      full_text: ''
    });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      setSelectedFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleStartBatchScreening = () => {
    if (selectedFiles.length === 0) {
      alert('Please select or drop at least one resume file.');
      return;
    }
    const formData = new FormData();
    selectedFiles.forEach((file) => {
      formData.append('files', file);
    });
    formData.append('job_id', selectedJobId);
    dispatch(batchScreenResumes(formData));
  };

  const handleLoadAcademicBenchmarks = () => {
    dispatch(loadBenchmarkCandidates(selectedJobId));
  };

  const selectedJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Header and Quick Action */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Briefcase size={20} color="var(--accent-primary)" />
            Recruiter Requisition & Batch Screening
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Batch screen multiple applicant resumes against target requisition competencies with Gemini LLM ranking.
          </p>
        </div>

        {/* 1-Click Master's Thesis Benchmark Runner */}
        <button
          onClick={handleLoadAcademicBenchmarks}
          disabled={isBatchScreening}
          className="btn-primary"
          style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)' }}
          title="Run preloaded benchmark candidate evaluation across all candidate profiles"
        >
          <Sparkles size={16} />
          {isBatchScreening ? 'Screening Pool...' : 'Run Master\'s Benchmark Evaluation (6 Profiles)'}
        </button>
      </div>

      <div className="grid-two-cols" style={{ gap: '1.25rem' }}>
        
        {/* Left: Requisition Picker */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Select Active Job Requisition:
            </label>
            <button
              onClick={() => setShowNewJobModal(true)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--accent-primary)',
                fontSize: '0.78rem',
                cursor: 'pointer',
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <PlusCircle size={14} />
              + Post New Requisition
            </button>
          </div>
          <select
            className="glass-select"
            value={selectedJobId}
            onChange={(e) => dispatch(setSelectedJobId(e.target.value))}
            style={{ marginBottom: '0.75rem', fontWeight: 600 }}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} — {job.company} ({job.experience_required})
              </option>
            ))}
          </select>

          {selectedJob && (
            <div className="glass-card" style={{ padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--accent-secondary)' }}>
                  {selectedJob.title}
                </span>
                <span className="badge badge-indigo">{selectedJob.experience_required}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                <strong>Required Education:</strong> {selectedJob.education_required}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.5rem' }}>
                {selectedJob.required_skills.map((skill, idx) => (
                  <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                    {skill}
                  </span>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                {selectedJob.full_text.slice(0, 180)}...
              </p>
            </div>
          )}
        </div>

        {/* Right: Multi-Resume File Drop */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
              background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-elevated)',
              borderRadius: '12px',
              padding: '1.5rem',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              minHeight: '160px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onClick={() => document.getElementById('batch-files-input').click()}
          >
            <input
              id="batch-files-input"
              type="file"
              multiple
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <Files size={22} color="var(--accent-primary)" />
            </div>

            {selectedFiles.length > 0 ? (
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.92rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                  <CheckCircle size={16} />
                  {selectedFiles.length} Resume File(s) Selected
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Click or drop more files to replace
                </div>
              </div>
            ) : (
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>
                  Upload Batch Resumes (PDF / DOCX / TXT)
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Drag & drop 1 to 20+ candidate resumes for instant batch evaluation
                </div>
              </div>
            )}
          </div>

          <div style={{ marginTop: '0.75rem' }}>
            <button
              onClick={handleStartBatchScreening}
              disabled={isBatchScreening || selectedFiles.length === 0}
              className="btn-primary"
              style={{ width: '100%', padding: '0.75rem' }}
            >
              {isBatchScreening ? (
                <>
                  <div className="radial-progress-circle" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Processing Batch Screening...
                </>
              ) : (
                <>
                  <Play size={16} />
                  Screen {selectedFiles.length > 0 ? selectedFiles.length : ''} Uploaded Resumes
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Post New Job Requisition Modal */}
      {showNewJobModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 120,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '640px', maxHeight: '90vh', overflowY: 'auto', padding: '1.75rem', position: 'relative' }}>
            <button
              onClick={() => setShowNewJobModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <PlusCircle size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Post New Job Requisition</h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Create a vacancy against which applicant resumes will be screened.</p>
              </div>
            </div>

            <form onSubmit={handleCreateJobSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="grid-two-cols" style={{ gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Job Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Machine Learning Engineer"
                    className="glass-input"
                    value={newJob.title}
                    onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Hiring Company</label>
                  <input
                    type="text"
                    placeholder="e.g. Cognitive Systems Lab"
                    className="glass-input"
                    value={newJob.company}
                    onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid-two-cols" style={{ gap: '0.85rem' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Experience Required</label>
                  <input
                    type="text"
                    placeholder="e.g. 3-5 years"
                    className="glass-input"
                    value={newJob.experience_required}
                    onChange={(e) => setNewJob({ ...newJob, experience_required: e.target.value })}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Education Requirement</label>
                  <input
                    type="text"
                    placeholder="e.g. Master's / B.Tech in CSE"
                    className="glass-input"
                    value={newJob.education_required}
                    onChange={(e) => setNewJob({ ...newJob, education_required: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Required Skills (comma-separated) *</label>
                <input
                  type="text"
                  placeholder="e.g. python, pytorch, transformers, nlp, docker, fastapi"
                  className="glass-input"
                  value={newJob.required_skills}
                  onChange={(e) => setNewJob({ ...newJob, required_skills: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Preferred / Secondary Skills (comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. kubernetes, redis, aws, scikit-learn"
                  className="glass-input"
                  value={newJob.preferred_skills}
                  onChange={(e) => setNewJob({ ...newJob, preferred_skills: e.target.value })}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.3rem' }}>Job Description & Responsibilities *</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Paste detailed responsibilities and requirements..."
                  className="glass-textarea"
                  value={newJob.full_text}
                  onChange={(e) => setNewJob({ ...newJob, full_text: e.target.value })}
                  style={{ minHeight: '100px', fontSize: '0.82rem' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.65rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setShowNewJobModal(false)}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ fontSize: '0.82rem' }}
                >
                  Create & Select Requisition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default BatchUploader;
