from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class EducationItem(BaseModel):
    degree: str = ""
    institution: str = ""
    year: str = ""
    gpa: str = ""

class ExperienceItem(BaseModel):
    title: str = ""
    company: str = ""
    duration: str = ""
    highlights: List[str] = []

class ProjectItem(BaseModel):
    name: str = ""
    technologies: List[str] = []
    description: str = ""
    url: Optional[str] = None

class ExtractedResumeData(BaseModel):
    name: str = "Candidate"
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    summary: Optional[str] = None
    education: List[EducationItem] = []
    experience: List[ExperienceItem] = []
    technical_skills: List[str] = []
    soft_skills: List[str] = []
    projects: List[ProjectItem] = []
    certifications: List[str] = []
    portfolio_links: Dict[str, str] = {}
    raw_text: str = ""

class JobDescription(BaseModel):
    id: Optional[str] = None
    title: str
    company: Optional[str] = "Tech Innovations Inc."
    experience_required: Optional[str] = "2-4 years"
    education_required: Optional[str] = "Bachelor's / Master's in Computer Science or related"
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    full_text: str

class ATSSectionHealth(BaseModel):
    status: str = "PASS" # PASS, WARNING, FAIL
    message: str = ""

class ATSAnalysis(BaseModel):
    overall_ats_score: int = Field(..., ge=0, le=100)
    readability_score: int = Field(..., ge=0, le=100)
    formatting_score: int = Field(..., ge=0, le=100)
    keyword_score: int = Field(..., ge=0, le=100)
    quantifiable_metrics_score: int = Field(..., ge=0, le=100)
    section_health: Dict[str, ATSSectionHealth] = {}
    formatting_issues: List[str] = []
    actionable_fixes: List[str] = []

class SkillGapAnalysis(BaseModel):
    matched_hard_skills: List[str] = []
    matched_soft_skills: List[str] = []
    missing_critical_skills: List[str] = []
    missing_preferred_skills: List[str] = []
    transferable_skills: List[str] = []
    skill_match_percentage: float = 0.0

class ImprovementSuggestion(BaseModel):
    id: str
    section: str # Summary, Experience, Skills, Projects, Education
    original_text: str
    rewritten_text: str
    impact_rationale: str
    priority: str = "HIGH" # HIGH, MEDIUM, LOW

class InterviewQuestion(BaseModel):
    id: str
    category: str # "Technical Mastery", "System Architecture", "Resume Gap Probing", "Behavioral (STAR)"
    question: str
    target_skill_or_project: str
    evaluator_guide: str

class PortfolioIntelligence(BaseModel):
    github_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    has_github: bool = False
    has_linkedin: bool = False
    has_portfolio: bool = False
    project_authenticity_score: int = 75
    insights: List[str] = []

class CandidateScreeningResult(BaseModel):
    candidate_id: str
    candidate_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    overall_suitability_score: int = Field(..., ge=0, le=100)
    technical_fit_score: int = Field(..., ge=0, le=100)
    experience_fit_score: int = Field(..., ge=0, le=100)
    education_fit_score: int = Field(..., ge=0, le=100)
    semantic_similarity_score: int = Field(..., ge=0, le=100)
    recommendation: str # "Strong Match", "Shortlist", "Consider", "Not Recommended"
    executive_summary: str
    strengths: List[str] = []
    concerns: List[str] = []
    ats_analysis: ATSAnalysis
    skill_gap_analysis: SkillGapAnalysis
    resume_improvements: List[ImprovementSuggestion] = []
    interview_questions: List[InterviewQuestion] = []
    portfolio_intelligence: PortfolioIntelligence
    extracted_data: Optional[ExtractedResumeData] = None

class SingleScreenRequest(BaseModel):
    resume_text: Optional[str] = None
    job_description: JobDescription

class BatchScreeningRequest(BaseModel):
    job_description: JobDescription
    candidates: List[Dict[str, Any]] = []

class BatchScreeningResponse(BaseModel):
    job_id: Optional[str] = None
    job_title: str
    total_screened: int
    ranked_candidates: List[CandidateScreeningResult]
    analytics: Dict[str, Any]

class ChatAdvisorRequest(BaseModel):
    candidate_name: str
    resume_text: str
    target_job_title: str
    target_job_description: str
    user_message: str
    chat_history: List[Dict[str, str]] = []

class ChatAdvisorResponse(BaseModel):
    reply: str
    suggested_prompts: List[str] = []

class AdminConfigUpdate(BaseModel):
    gemini_api_key: Optional[str] = None
    gemini_model: Optional[str] = None
    temperature: Optional[float] = None
