# AI-Powered Resume Screening and Candidate Intelligence System

**Academic Degree:** Master of Technology (M.Tech) / MS in Computer Science & Engineering  
**Capstone Category:** Artificial Intelligence, Natural Language Processing, Large Language Models, & Full-Stack Systems  

### Project Members:
- **B. Sri Lakshmi Durga** — `233B1A0411`
- **M. Karunya Durga Lakshmi** — `233B1A0461`
- **V. BVS Durgaprasad** — `233B1A0438`
- **Y. Tataji** — `233B1A0404`
- **M. MSS Prasad** — `233B1A0450`

---

## 1. Project Abstract
The **AI-Powered Resume Screening and Candidate Intelligence System** uses Artificial Intelligence (AI), Natural Language Processing (NLP), Machine Learning (ML), and Large Language Models (LLMs) to automate resume evaluation. It extracts education, skills, projects, certifications, and experience from resumes and compares them with job descriptions using semantic matching to generate an accurate candidate suitability score.

The system provides ATS compatibility analysis, skill-gap identification, resume improvement suggestions, candidate ranking, interview question generation, portfolio analysis, and recruitment analytics. Separate dashboards for candidates, recruiters, and administrators improve hiring efficiency while supporting intelligent recruitment decisions.

---

## 2. System Architecture & Tech Stack

```
+---------------------------------------------------------------------------------------------------+
|                                      FRONTEND: REACT 19 + REDUX                                   |
|  +---------------------------+  +---------------------------+  +-------------------------------+  |
|  |    Candidate Dashboard    |  |    Recruiter Dashboard    |  |    Administrator Dashboard    |  |
|  | - Upload Resume (PDF/DOCX)|  | - Batch Resume Screening  |  | - System Telemetry & Audits   |  |
|  | - ATS Health & Parsability|  | - Candidate Ranking Table |  | - Gemini LLM Config & Model   |  |
|  | - Skill-Gap Breakdown     |  | - Head-to-Head Compare    |  | - Latency & Cost Metrics      |  |
|  | - AI Bullet Point Rewrite |  | - Interview Question Gen  |  | - Academic Benchmarks & Demos |  |
|  | - Interactive AI Advisor  |  | - Analytics Funnel & Chart|  | - API Key Management         |  |
|  +---------------------------+  +---------------------------+  +-------------------------------+  |
|                                                |                                                  |
|                   Redux Toolkit Store (candidateSlice, recruiterSlice, adminSlice, uiSlice)       |
+------------------------------------------------+--------------------------------------------------+
                                                 | REST API / Multipart Form Data
+------------------------------------------------v--------------------------------------------------+
|                                    BACKEND: PYTHON 3.13 (FASTAPI)                                 |
|  +--------------------------+  +--------------------------+  +---------------------------------+  |
|  | Document Ingestion & NLP |  | Semantic Matching Engine |  |      Gemini Intelligence        |  |
|  | - PyPDF & python-docx    |  | - TF-IDF Vectorization   |  | - Google GenAI SDK              |  |
|  | - Section Segmenter      |  | - Cosine Similarity      |  | - Structured JSON Outputs       |  |
|  | - Skill Taxonomy (NER)   |  | - Multi-Factor Scoring   |  | - Tailored Interview Gen        |  |
|  | - ATS Rule Checker       |  | - Skill-Gap Classifier   |  | - Career Coach Chatbot          |  |
|  +--------------------------+  +--------------------------+  +---------------------------------+  |
|                                                |                                                  |
|                       In-Memory / Telemetry Store & Preloaded Academic Benchmark Datasets         |
+---------------------------------------------------------------------------------------------------+
```

### Core Technologies:
- **Backend:** Python 3.13, FastAPI, Uvicorn, Pydantic v2, scikit-learn (TF-IDF, Cosine Similarity), PyPDF, python-docx.
- **AI & LLM Engine:** Google Gemini (`gemini-2.5-flash` / `gemini-3.7-flash` via official `google-genai` SDK) + Deterministic Fallback Engine.
- **Frontend:** React 19, Vite, Redux Toolkit (`@reduxjs/toolkit`, `react-redux`), Lucide Icons.
- **Design System:** Glassmorphism UI tokens, radial SVG gauge meters, dark/light theme switching.

---

## 3. Key Functional Modules

1. **Multi-Format Document Parsing:** Ingests PDF, DOCX, and TXT files, extracting contact details, degrees, experience tenures, skills, and projects.
2. **Hybrid Semantic Matching:** Combines mathematical Cosine Similarity over TF-IDF n-gram vectors with Google Gemini qualitative scoring:
   $$\text{Suitability Score} = 0.40 \cdot \text{SkillMatch} + 0.30 \cdot \text{SemanticSimilarity} + 0.20 \cdot \text{ExpFit} + 0.10 \cdot \text{EduFit}$$
3. **ATS Compatibility Diagnostics:** Evaluates parsability, formatting structure, keyword density against Job Description, and presence of quantifiable metrics.
4. **Skill-Gap Identification:** Categorizes skills into Matched Hard Skills, Matched Soft Skills, Missing Critical Skills, and Missing Preferred Skills.
5. **AI Resume Improvements:** Suggests STAR-method bullet point rewrites with metrics and action verbs.
6. **Candidate Ranking & Leaderboard:** Recruiter batch screening with comparative rankings, filtering, and side-by-side comparison.
7. **Tailored Interview Question Generation:** Formulates Technical, System Design, Resume Gap Probing, and Behavioral questions with evaluator guides.
8. **Portfolio & GitHub Intelligence:** Analyzes GitHub, LinkedIn, and live project deployments.
9. **Recruitment Analytics:** Charts showing score distributions, applicant funnel, and market skill demands.
10. **Administrator Hub:** Live telemetry tracking latency, token usage, cost, and model configurations.

---

## 4. Setup & Running Instructions

### Prerequisites
- Python 3.10+ (tested on Python 3.13)
- Node.js LTS (v20+ or v22+)

### One-Click Launch

#### Windows:
Double-click:
```bat
run_project.bat
```

#### macOS / Linux:
Make executable and run:
```bash
chmod +x run_project.sh
./run_project.sh
```

### Manual Launch

#### Step 1: Start Python FastAPI Backend
```bash
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS / Linux:
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Backend API will be available at: `http://localhost:8000`  
Swagger / OpenAPI Docs: `http://localhost:8000/docs`

#### Step 2: Start React Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend Web Portal will be available at: `http://localhost:5173`

### Automated API Verification Suite
Run the end-to-end automated test suite:
```bash
cd backend
python test_api_suite.py
```

---

## 5. Demonstration Guide for Project Viva / Presentation
1. Open `http://localhost:5173`.
2. **Candidate Portal**:
   - Click **"Load Strong Profile"** or **"Load Gap Profile"**.
   - Click **"Analyze Resume with Gemini & ATS Engine"**.
   - Observe the dual radial gauges, ATS scorecards, section health audit, and the **Portfolio & GitHub Open-Source Intelligence** panel with authenticity score, deployment detection, and evidence signals.
   - Test the STAR-method bullet rewrites, tailored mock interview rubric, interactive AI Career Coach, and click **"Export Report"** to download the diagnostic report.
3. **Recruiter Portal**:
   - Click **"+ Post New Requisition"** to define a custom job opening, or choose a preset requisition.
   - Click **"Run Master's Benchmark Evaluation"** to screen all 6 preloaded candidates.
   - View the Leaderboard ranking (#1, #2, #3), select candidates to compare side-by-side in the Comparison Matrix, and inspect individual candidates via **"Dossier"** with full evaluation rubrics and **"Export Dossier"** download.
4. **Analytics Portal**: Review the recruitment funnel, score distribution histograms, top market skills, and prevalent skill gaps.
5. **Admin Portal**: Inspect live LLM latency, token counts, configure Gemini API keys, select active Gemini models, and review audit trails.

