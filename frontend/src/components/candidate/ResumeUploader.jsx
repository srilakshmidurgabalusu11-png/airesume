import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  screenCandidateResume, 
  fetchSampleJobs, 
  setSelectedJobId,
  setUseCustomJob,
  setCustomJob
} from '../../store/candidateSlice';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Edit3,
  Flame
} from 'lucide-react';

export const ResumeUploader = () => {
  const dispatch = useDispatch();
  const { sampleJobs, selectedJobId, isScreening, screeningError, useCustomJob, customJob } = useSelector(
    (state) => state.candidate
  );

  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    dispatch(fetchSampleJobs());
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleLoadSample = (sampleType = 'senior') => {
    // Load a rich sample resume for instant demonstration
    setUploadMode('text');
    if (sampleType === 'senior') {
      setResumeText(`B. Sri Lakshmi Durga
srilakshmi.durga@email.com | +91 98480 12345 | https://github.com/srilakshmidurga | https://linkedin.com/in/srilakshmidurga | https://srilakshmi-portfolio.vercel.app

PROFESSIONAL SUMMARY
Senior Full Stack AI Engineer and Master of Technology candidate in Computer Science & Engineering with 3+ years of experience designing AI-driven web architectures, FastAPI microservices, and reactive user interfaces with React and Redux Toolkit. Proven track record integrating Large Language Models and semantic matching algorithms into production recruiting pipelines.

TECHNICAL SKILLS
- Programming Languages: Python, JavaScript, TypeScript, SQL, Bash
- Frameworks & Libraries: FastAPI, React, Redux Toolkit, Next.js, Flask, PyTorch, scikit-learn, Pandas, NumPy, TailwindCSS
- AI & NLP: Large Language Models (Gemini, GPT), Natural Language Processing, TF-IDF, RAG, Prompt Engineering, Cosine Similarity
- Databases & Cloud: PostgreSQL, MongoDB, Redis, Docker, AWS (S3, EC2), Git, CI/CD, REST APIs

PROFESSIONAL EXPERIENCE
Senior AI Application Developer | Cognizant NextGen Labs | 2023 – Present
- Architected and deployed an AI candidate screening engine using Python FastAPI and Google Gemini API, processing 15,000+ applicant profiles with a 42% reduction in initial recruitment screening cycle time.
- Engineered responsive recruiter and candidate dashboards using React, Redux Toolkit, and TailwindCSS, achieving 99.4% client satisfaction and sub-120ms rendering times.
- Implemented hybrid semantic matching algorithms combining TF-IDF vector embeddings with cosine similarity, improving candidate suitability precision by 28%.
- Designed and optimized PostgreSQL relational database schemas and Redis caching, cutting median API response latency by 35% from 420ms to 270ms.

AI Systems Intern | TCS Research & Innovations | 2022 – 2023
- Developed automated resume information extraction pipelines using PyPDF and regex entity recognizers, achieving 94.6% parsing accuracy across diverse resume formats.
- Collaborated with senior engineers to implement automated ATS compatibility scoring algorithms, reducing unparseable applications by 50%.

EDUCATION
Master of Technology (M.Tech) in Computer Science & Engineering
JNTUK Affiliated Engineering College | 2023 – 2025 | CGPA: 9.2 / 10.0

KEY PROJECTS
AI-Powered Resume Screening & Candidate Intelligence System
- Designed end-to-end multi-role recruitment intelligence platform with React, Redux, FastAPI, and Gemini 2.5 Flash.
- Implemented multi-file batch screening, ATS parsability diagnostic scorecards, STAR-method bullet rewriting, and automated interview question generation.`);
    } else {
      setResumeText(`Rohan Sharma
rohan.sharma@email.com | New Delhi

Objective:
Looking for an entry level software role.

Skills:
HTML, CSS, basic PHP, WordPress.

Experience:
Freelance Website Designer (2023)
- Made 3 simple websites using WordPress templates for local businesses.

Education:
Diploma in Information Technology | 2023`);
    }
  };

  const handleStartScreening = () => {
    const formData = new FormData();

    if (uploadMode === 'file' && selectedFile) {
      formData.append('file', selectedFile);
    } else if (uploadMode === 'text' && resumeText.trim()) {
      formData.append('resume_text', resumeText.trim());
    } else {
      alert('Please upload a resume file or paste resume text.');
      return;
    }

    if (useCustomJob) {
      formData.append('custom_job_title', customJob.title || 'Custom Role');
      formData.append('custom_job_description', customJob.description || '');
      formData.append('custom_required_skills', customJob.skills || '');
    } else {
      formData.append('job_id', selectedJobId);
    }

    dispatch(screenCandidateResume(formData));
  };

  const selectedJob = sampleJobs.find((j) => j.id === selectedJobId) || sampleJobs[0];

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--accent-primary)" />
            Step 1: Input Resume & Target Role
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Upload your resume document (PDF, DOCX, TXT) or paste raw text to initiate ATS and Gemini LLM screening.
          </p>
        </div>

        {/* 1-Click Master's Benchmark Loader */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => handleLoadSample('senior')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            title="Load high-scoring Master's thesis candidate profile"
          >
            <Sparkles size={14} color="#10b981" />
            Load Strong Profile
          </button>
          <button 
            onClick={() => handleLoadSample('junior')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            title="Load borderline candidate profile to observe skill gaps"
          >
            <Flame size={14} color="#f43f5e" />
            Load Gap Profile
          </button>
        </div>
      </div>

      <div className="grid-two-cols" style={{ gap: '1.25rem' }}>
        
        {/* Left: Resume Input */}
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <button
              onClick={() => setUploadMode('file')}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)',
                background: uploadMode === 'file' ? 'var(--bg-elevated)' : 'transparent',
                color: uploadMode === 'file' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <UploadCloud size={16} />
              Upload Document (PDF/DOCX)
            </button>
            <button
              onClick={() => setUploadMode('text')}
              style={{
                flex: 1,
                padding: '0.45rem',
                borderRadius: '6px',
                border: '1px solid var(--border-glass)',
                background: uploadMode === 'text' ? 'var(--bg-elevated)' : 'transparent',
                color: uploadMode === 'text' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.4rem'
              }}
            >
              <Edit3 size={16} />
              Paste Raw Text
            </button>
          </div>

          {uploadMode === 'file' ? (
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              style={{
                border: `2px dashed ${dragActive ? 'var(--accent-primary)' : 'var(--border-glass)'}`,
                background: dragActive ? 'rgba(99, 102, 241, 0.08)' : 'var(--bg-elevated)',
                borderRadius: '12px',
                padding: '2rem 1.5rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minHeight: '190px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => document.getElementById('resume-file-input').click()}
            >
              <input
                id="resume-file-input"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <UploadCloud size={24} color="var(--accent-primary)" />
              </div>

              {selectedFile ? (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                    <FileText size={16} color="var(--accent-emerald)" />
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop another to replace
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.25rem' }}>
                    Drag & Drop your resume here, or <span style={{ color: 'var(--accent-primary)' }}>Browse</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Supported formats: PDF, DOCX, TXT (Max 15MB)
                  </div>
                </div>
              )}
            </div>
          ) : (
            <textarea
              className="glass-textarea"
              placeholder="Paste complete resume text here (Education, Experience, Technical Skills, Projects)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ minHeight: '190px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
            />
          )}
        </div>

        {/* Right: Target Job Description Selector */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                Select Target Job Requisition:
              </label>
              <button
                onClick={() => dispatch(setUseCustomJob(!useCustomJob))}
                style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600 }}
              >
                {useCustomJob ? '← Choose from Preset Jobs' : '+ Enter Custom Job Description'}
              </button>
            </div>

            {!useCustomJob ? (
              <div>
                <select
                  className="glass-select"
                  value={selectedJobId}
                  onChange={(e) => dispatch(setSelectedJobId(e.target.value))}
                  style={{ marginBottom: '0.75rem', fontWeight: 600 }}
                >
                  {sampleJobs.map((job) => (
                    <option key={job.id} value={job.id} style={{ background: '#1e293b' }}>
                      {job.title} — {job.company} ({job.experience_required})
                    </option>
                  ))}
                </select>

                {selectedJob && (
                  <div className="glass-card" style={{ padding: '0.85rem', maxHeight: '135px', overflowY: 'auto' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>
                        {selectedJob.title}
                      </span>
                      <span className="badge badge-indigo">{selectedJob.experience_required}</span>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginBottom: '0.4rem' }}>
                      {selectedJob.required_skills.map((skill, idx) => (
                        <span key={idx} className="badge badge-cyan" style={{ fontSize: '0.68rem', padding: '0.15rem 0.45rem' }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {selectedJob.full_text.slice(0, 160)}...
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input
                  type="text"
                  placeholder="Target Job Title (e.g. Senior Machine Learning Engineer)"
                  className="glass-input"
                  value={customJob.title}
                  onChange={(e) => dispatch(setCustomJob({ title: e.target.value }))}
                />
                <textarea
                  placeholder="Paste Job Description requirements and responsibilities..."
                  className="glass-textarea"
                  value={customJob.description}
                  onChange={(e) => dispatch(setCustomJob({ description: e.target.value }))}
                  style={{ minHeight: '85px', fontSize: '0.82rem' }}
                />
                <input
                  type="text"
                  placeholder="Key required skills comma-separated (e.g. python, fastapi, react, docker)"
                  className="glass-input"
                  value={customJob.skills}
                  onChange={(e) => dispatch(setCustomJob({ skills: e.target.value }))}
                />
              </div>
            )}
          </div>

          {/* Action Trigger */}
          <div style={{ marginTop: '1rem' }}>
            {screeningError && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f43f5e', fontSize: '0.82rem', marginBottom: '0.5rem' }}>
                <AlertCircle size={15} />
                {screeningError}
              </div>
            )}

            <button
              onClick={handleStartScreening}
              disabled={isScreening || (uploadMode === 'file' && !selectedFile) || (uploadMode === 'text' && !resumeText.trim())}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {isScreening ? (
                <>
                  <div className="radial-progress-circle" style={{ width: '16px', height: '16px', border: '2px solid #fff', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                  Extracting NLP Entities & Analyzing with Gemini LLM...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze Resume with Gemini & ATS Engine
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResumeUploader;
