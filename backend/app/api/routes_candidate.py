import uuid
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..models.schemas import CandidateScreeningResult, JobDescription, ChatAdvisorRequest, ChatAdvisorResponse
from ..services.parser_service import DocumentParserService
from ..services.nlp_engine import NLPEngine
from ..services.ats_analyzer import ATSAnalyzerService
from ..services.portfolio_analyzer import PortfolioAnalyzerService
from ..services.gemini_service import gemini_service
from ..data.sample_jobs import SAMPLE_JOBS

router = APIRouter(prefix="/candidate", tags=["Candidate"])

def run_candidate_screening_pipeline(
    raw_text: str,
    jd: JobDescription,
    candidate_id: Optional[str] = None
) -> CandidateScreeningResult:
    if not candidate_id:
        candidate_id = f"cand-{uuid.uuid4().hex[:8]}"

    # 1. Structure extraction
    resume_data = DocumentParserService.extract_structured_data(raw_text)
    
    # 2. NLP Taxonomy & Skill extraction
    hard_skills, soft_skills = NLPEngine.extract_skills(raw_text)
    resume_data.technical_skills = hard_skills
    resume_data.soft_skills = soft_skills

    # 3. TF-IDF Cosine Similarity
    tfidf_sim = NLPEngine.compute_tfidf_cosine_similarity(raw_text, jd.full_text)

    # 4. Skill Gap Analysis
    skill_gaps = NLPEngine.analyze_skill_gaps(
        resume_text=raw_text,
        required_skills=jd.required_skills,
        preferred_skills=jd.preferred_skills,
        jd_text=jd.full_text
    )

    # 5. ATS Compatibility Evaluation
    ats_result = ATSAnalyzerService.evaluate(
        resume_data=resume_data,
        jd=jd,
        skill_match_pct=skill_gaps.skill_match_percentage
    )

    # 6. Portfolio & Online Presence Intelligence
    portfolio_intel = PortfolioAnalyzerService.analyze(
        portfolio_links=resume_data.portfolio_links,
        raw_text=raw_text
    )

    # 7. Gemini Intelligence Deep-Dive
    gemini_eval = gemini_service.evaluate_candidate(
        resume_data=resume_data,
        jd=jd,
        tfidf_similarity=tfidf_sim,
        skill_match_pct=skill_gaps.skill_match_percentage,
        matched_skills=skill_gaps.matched_hard_skills,
        missing_skills=skill_gaps.missing_critical_skills
    )

    exp_fit = gemini_eval.get("experience_fit_score", 70)
    edu_fit = gemini_eval.get("education_fit_score", 80)
    
    # Hybrid Matching Formula: 0.40 * SkillMatch + 0.30 * SemanticSim + 0.20 * ExpFit + 0.10 * EduFit
    calculated_suitability = int(round(
        (0.40 * skill_gaps.skill_match_percentage) +
        (0.30 * tfidf_sim) +
        (0.20 * exp_fit) +
        (0.10 * edu_fit)
    ))
    overall_suitability = min(98, max(25, calculated_suitability))

    if overall_suitability >= 75:
        final_recommendation = "Strong Match"
    elif overall_suitability >= 60:
        final_recommendation = "Shortlist"
    elif overall_suitability >= 45:
        final_recommendation = "Consider"
    else:
        final_recommendation = "Not Recommended"

    return CandidateScreeningResult(
        candidate_id=candidate_id,
        candidate_name=resume_data.name,
        email=resume_data.email,
        phone=resume_data.phone,
        overall_suitability_score=overall_suitability,
        technical_fit_score=gemini_eval.get("technical_fit_score", int(min(98, max(30, skill_gaps.skill_match_percentage * 0.9 + 10)))),
        experience_fit_score=exp_fit,
        education_fit_score=edu_fit,
        semantic_similarity_score=int(tfidf_sim),
        recommendation=final_recommendation,
        executive_summary=gemini_eval.get("executive_summary", "Candidate displays solid technical foundational readiness."),
        strengths=gemini_eval.get("strengths", []),
        concerns=gemini_eval.get("concerns", []),
        ats_analysis=ats_result,
        skill_gap_analysis=skill_gaps,
        resume_improvements=gemini_eval.get("bullet_improvements", []),
        interview_questions=gemini_eval.get("interview_questions", []),
        portfolio_intelligence=portfolio_intel,
        extracted_data=resume_data
    )

@router.post("/screen", response_model=CandidateScreeningResult)
async def screen_resume(
    file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_id: Optional[str] = Form("job-1"),
    custom_job_title: Optional[str] = Form(None),
    custom_job_description: Optional[str] = Form(None),
    custom_required_skills: Optional[str] = Form(None)
):
    # Extract text from file or form
    extracted_text = ""
    if file:
        content = await file.read()
        extracted_text = DocumentParserService.parse_file(file.filename, content)
    elif resume_text:
        extracted_text = resume_text.strip()
    else:
        raise HTTPException(status_code=400, detail="Please upload a resume file (PDF/DOCX) or paste resume text.")

    if not extracted_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract readable text from the provided document.")

    # Determine Job Description
    target_jd = None
    if custom_job_description and custom_job_description.strip():
        req_skills = [s.strip().lower() for s in custom_required_skills.split(",") if s.strip()] if custom_required_skills else []
        if not req_skills:
            extracted_hard, _ = NLPEngine.extract_skills(custom_job_description)
            req_skills = extracted_hard
        target_jd = JobDescription(
            id="custom-job",
            title=custom_job_title.strip() if custom_job_title else "Target Technical Role",
            company="Target Enterprise",
            required_skills=req_skills,
            preferred_skills=[],
            full_text=custom_job_description.strip()
        )
    else:
        # Match with sample jobs
        for j in SAMPLE_JOBS:
            if j.id == job_id:
                target_jd = j
                break
        if not target_jd:
            target_jd = SAMPLE_JOBS[0]

    return run_candidate_screening_pipeline(extracted_text, target_jd)

@router.post("/chat-advisor", response_model=ChatAdvisorResponse)
async def chat_with_advisor(request: ChatAdvisorRequest):
    res = gemini_service.chat_advisor(
        candidate_name=request.candidate_name,
        resume_text=request.resume_text,
        target_job_title=request.target_job_title,
        target_job_description=request.target_job_description,
        user_message=request.user_message,
        chat_history=request.chat_history
    )
    return ChatAdvisorResponse(
        reply=res["reply"],
        suggested_prompts=res.get("suggested_prompts", [])
    )

@router.get("/sample-jobs", response_model=List[JobDescription])
async def get_sample_jobs():
    return SAMPLE_JOBS
