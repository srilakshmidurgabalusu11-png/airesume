import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  screenCandidateResume, 
  fetchSampleJobs, 
  setSelectedJobId
} from '../../store/candidateSlice';
import { 
  UploadCloud, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Layers, 
  Edit3,
  Flame,
  Briefcase,
  Check,
  RotateCcw
} from 'lucide-react';

export const ResumeUploader = () => {
  const dispatch = useDispatch();
  const { sampleJobs, selectedJobId, isScreening, screeningError } = useSelector(
    (state) => state.candidate
  );

  const [uploadMode, setUploadMode] = useState('file'); // 'file' | 'text'
  const [selectedFile, setSelectedFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [dragActive, setDragActive] = useState(false);

  // Manual Job Name and Description State
  const [jobTitle, setJobTitle] = useState('Senior Full Stack AI Engineer');
  const [jobDescription, setJobDescription] = useState(
`We are seeking a Senior Full Stack AI Engineer to design and deploy state-of-the-art candidate screening architectures, interactive React/Redux user interfaces, and FastAPI microservices.

Key Responsibilities:
- Design and integrate Google Gemini LLM reasoning and semantic matching pipelines.
- Build high-performance frontend interfaces using React, Redux Toolkit, and modern CSS.
- Optimize backend REST APIs, document parsers, and caching layers for sub-200ms latency.
- Collaborate with recruiting leaders to establish automated ATS evaluation rubrics.

Required Qualifications:
- Proficiency in Python, FastAPI, React, JavaScript/TypeScript, and SQL.
- Practical experience with NLP, TF-IDF vector similarity, and LLM prompt engineering.
- Solid understanding of relational database schemas, REST APIs, and containerized deployments.`
  );
  const [jobSkills, setJobSkills] = useState('python, fastapi, react, redux, gemini, nlp, tf-idf, sql');

  const jobTemplates = [
    {
      label: 'Full Stack AI Engineer',
      title: 'Senior Full Stack AI Engineer',
      skills: 'python, fastapi, react, redux, gemini, nlp, tf-idf, sql',
      description: `We are seeking a Senior Full Stack AI Engineer to design and deploy state-of-the-art candidate screening architectures, interactive React/Redux user interfaces, and FastAPI microservices.

Key Responsibilities:
- Design and integrate Google Gemini LLM reasoning and semantic matching pipelines.
- Build high-performance frontend interfaces using React, Redux Toolkit, and modern CSS.
- Optimize backend REST APIs, document parsers, and caching layers for sub-200ms latency.
- Collaborate with recruiting leaders to establish automated ATS evaluation rubrics.

Required Qualifications:
- Proficiency in Python, FastAPI, React, JavaScript/TypeScript, and SQL.
- Practical experience with NLP, TF-IDF vector similarity, and LLM prompt engineering.
- Solid understanding of relational database schemas, REST APIs, and containerized deployments.`
    },
    {
      label: 'NLP Research Scientist',
      title: 'Lead NLP & Machine Learning Research Scientist',
      skills: 'python, pytorch, transformers, nlp, gemini, huggingface, llm, bert',
      description: `Join our AI Research division to build semantic evaluation models, LLM grounding mechanisms, and custom NLP entity extractors.

Key Responsibilities:
- Lead R&D on document parsing, tokenization, semantic similarity metrics, and hallucination reduction.
- Benchmark and fine-tune open-source and proprietary foundation models for HR tech domains.
- Publish and document technical research findings and evaluation rubrics.

Required Qualifications:
- Strong mathematical grounding in Machine Learning, Deep Learning, and NLP architectures.
- Expertise with PyTorch, HuggingFace, Transformers, and LLM evaluation frameworks.`
    },
    {
      label: 'Cloud DevOps & MLOps',
      title: 'Cloud Infrastructure & MLOps Platform Engineer',
      skills: 'docker, kubernetes, aws, gcp, terraform, ci/cd, linux, monitoring',
      description: `Looking for a Senior DevOps & MLOps Platform Engineer to automate CI/CD delivery pipelines, manage containerized microservices, and optimize cloud infrastructure.

Key Responsibilities:
- Design scalable Docker and Kubernetes deployment topologies for FastAPI and Vite services.
- Establish automated testing, telemetry monitoring, and zero-downtime rolling releases.
- Manage secure environment secrets, IAM roles, and cloud resource provisioning.

Required Qualifications:
- Proven experience with Docker, Kubernetes, Linux, Terraform, and CI/CD pipelines.
- Familiarity with monitoring stacks (Prometheus, Grafana) and cloud providers (AWS, GCP).`
    }
  ];

  const handleSelectTemplate = (tpl) => {
    setJobTitle(tpl.title);
    setJobDescription(tpl.description);
    setJobSkills(tpl.skills);
  };

  const handleClearJob = () => {
    setJobTitle('');
    setJobDescription('');
    setJobSkills('');
  };

  const handleJdFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      if (typeof content === 'string') {
        const cleanContent = content.replace(/[^\x20-\x7E\t\r\n]/g, ' ').trim();
        setJobDescription(cleanContent);
        if (!jobTitle) {
          const guessedTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
          setJobTitle(guessedTitle);
        }
      }
    };
    reader.readAsText(file);
  };

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

    if (!jobTitle.trim() || !jobDescription.trim()) {
      alert('Please enter both the Job Title and Job Description to screen the resume against.');
      return;
    }

    formData.append('custom_job_title', jobTitle.trim());
    formData.append('custom_job_description', jobDescription.trim());
    if (jobSkills.trim()) {
      formData.append('custom_required_skills', jobSkills.trim());
    }

    dispatch(screenCandidateResume(formData));
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="var(--accent-primary)" />
            Step 1: Input Resume & Target Role
          </h2>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Upload or paste your resume and define your target job name & description to initiate ATS and Gemini LLM screening.
          </p>
        </div>

        {/* 1-Click Profile Benchmark Loaders */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={() => handleLoadSample('senior')}
            className="btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
            title="Load high-scoring candidate profile"
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
              Paste Plain Text
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
                minHeight: '260px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onClick={() => document.getElementById('candidate-resume-file').click()}
            >
              <input
                id="candidate-resume-file"
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <FileText size={24} color="var(--accent-primary)" />
              </div>
              
              {selectedFile ? (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                    <CheckCircle size={16} />
                    {selectedFile.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop to replace
                  </div>
                </div>
              ) : (
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.25rem' }}>
                    Click to browse or drag & drop resume file
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    Supports PDF, DOCX, DOC, and TXT (Max 15MB)
                  </div>
                </div>
              )}
            </div>
          ) : (
            <textarea
              className="glass-textarea"
              placeholder="Paste raw candidate resume text here (include sections like Experience, Education, Technical Skills)..."
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              style={{ minHeight: '260px', fontSize: '0.85rem', fontFamily: 'var(--font-mono)' }}
            />
          )}
        </div>

        {/* Right: Target Job Name & Description (Manual Upload / Text) */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: '0.4rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Briefcase size={16} color="var(--accent-primary)" />
                <label style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Target Job Specification:
                </label>
                <span className="badge badge-indigo" style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem' }}>
                  Manual Text / Upload
                </span>
              </div>

              {/* Upload JD File Button */}
              <div>
                <input
                  id="jd-file-input"
                  type="file"
                  accept=".txt,.md,.pdf,.docx,.doc"
                  onChange={handleJdFileUpload}
                  style={{ display: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('jd-file-input').click()}
                  className="btn-secondary"
                  style={{ fontSize: '0.74rem', padding: '0.25rem 0.55rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                  title="Upload Job Description document (.txt, .md, .docx, .pdf)"
                >
                  <UploadCloud size={13} />
                  Upload JD File
                </button>
              </div>
            </div>

            {/* Manual Job Title / Name Input */}
            <div style={{ marginBottom: '0.65rem' }}>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Job Title / Name:
              </label>
              <input
                type="text"
                placeholder="Enter Target Job Title (e.g. Senior Full Stack AI Engineer)"
                className="glass-input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                style={{ width: '100%', fontWeight: 600 }}
              />
            </div>

            {/* Manual Job Description Textarea */}
            <div style={{ marginBottom: '0.65rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Job Description & Responsibilities:
                </label>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  {jobDescription.length} characters
                </span>
              </div>
              <textarea
                placeholder="Paste or manually type complete Job Description requirements, qualifications, and role responsibilities here..."
                className="glass-textarea"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                style={{ width: '100%', minHeight: '125px', fontSize: '0.82rem', lineHeight: 1.45 }}
              />
            </div>

            {/* Optional Required Skills */}
            <div style={{ marginBottom: '0.65rem' }}>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                Key Required Skills (Optional — leave blank to auto-extract with NLP):
              </label>
              <input
                type="text"
                placeholder="e.g. Python, FastAPI, React, Redux, Gemini, NLP, SQL"
                className="glass-input"
                value={jobSkills}
                onChange={(e) => setJobSkills(e.target.value)}
                style={{ width: '100%', fontSize: '0.8rem' }}
              />
            </div>

            {/* Quick-Fill Preset Template Chips */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                Templates:
              </span>
              {jobTemplates.map((tpl, tIdx) => (
                <button
                  key={tIdx}
                  type="button"
                  onClick={() => handleSelectTemplate(tpl)}
                  style={{
                    fontSize: '0.7rem',
                    padding: '0.15rem 0.45rem',
                    background: '#f4f4f5',
                    border: '1px solid #18181b',
                    borderRadius: '4px',
                    color: '#09090b',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#e4e4e7'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#f4f4f5'}
                >
                  {tpl.label}
                </button>
              ))}
              <button
                type="button"
                onClick={handleClearJob}
                style={{
                  fontSize: '0.7rem',
                  padding: '0.15rem 0.45rem',
                  background: 'transparent',
                  border: '1px dashed #d4d4d8',
                  borderRadius: '4px',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
                title="Clear Job Name and Description"
              >
                Clear
              </button>
            </div>
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
