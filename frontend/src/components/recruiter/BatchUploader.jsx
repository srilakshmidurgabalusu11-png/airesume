import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchRecruiterJobs, 
  batchScreenResumes, 
  loadBenchmarkCandidates,
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
  Layers
} from 'lucide-react';

export const BatchUploader = () => {
  const dispatch = useDispatch();
  const { jobs, selectedJobId, isBatchScreening, batchError } = useSelector((state) => state.recruiter);

  const [selectedFiles, setSelectedFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(fetchRecruiterJobs());
  }, [dispatch]);

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
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
            Select Active Job Requisition:
          </label>
          <select
            className="glass-select"
            value={selectedJobId}
            onChange={(e) => dispatch(setSelectedJobId(e.target.value))}
            style={{ marginBottom: '0.75rem', fontWeight: 600 }}
          >
            {jobs.map((job) => (
              <option key={job.id} value={job.id} style={{ background: '#1e293b' }}>
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

    </div>
  );
};

export default BatchUploader;
