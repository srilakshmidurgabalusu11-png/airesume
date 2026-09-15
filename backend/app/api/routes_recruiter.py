import uuid
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from ..models.schemas import (
    CandidateScreeningResult, JobDescription, BatchScreeningResponse
)
from ..services.parser_service import DocumentParserService
from ..api.routes_candidate import run_candidate_screening_pipeline
from ..data.sample_jobs import SAMPLE_JOBS
from ..data.sample_resumes import SAMPLE_RESUMES

router = APIRouter(prefix="/recruiter", tags=["Recruiter"])

# In-memory store for active job openings
JOBS_STORE: List[JobDescription] = list(SAMPLE_JOBS)

@router.get("/jobs", response_model=List[JobDescription])
async def list_jobs():
    return JOBS_STORE

@router.post("/jobs", response_model=JobDescription)
async def create_job(job: JobDescription):
    if not job.id:
        job.id = f"job-{uuid.uuid4().hex[:6]}"
    JOBS_STORE.insert(0, job)
    return job

@router.post("/batch-screen", response_model=BatchScreeningResponse)
async def batch_screen_resumes(
    files: List[UploadFile] = File(...),
    job_id: Optional[str] = Form("job-1"),
    custom_job_description: Optional[str] = Form(None),
    custom_job_title: Optional[str] = Form(None)
):
    # Resolve Job Description
    target_jd = None
    if custom_job_description and custom_job_description.strip():
        target_jd = JobDescription(
            id="custom-job",
            title=custom_job_title or "Requisition Role",
            full_text=custom_job_description
        )
    else:
        for j in JOBS_STORE:
            if j.id == job_id:
                target_jd = j
                break
        if not target_jd:
            target_jd = JOBS_STORE[0]

    screened_candidates: List[CandidateScreeningResult] = []
    
    for uploaded_file in files:
        content = await uploaded_file.read()
        extracted_text = DocumentParserService.parse_file(uploaded_file.filename, content)
        if extracted_text.strip():
            result = run_candidate_screening_pipeline(extracted_text, target_jd)
            screened_candidates.append(result)

    # Sort candidates by overall suitability score descending
    screened_candidates.sort(key=lambda c: c.overall_suitability_score, reverse=True)

    # Generate batch analytics
    scores = [c.overall_suitability_score for c in screened_candidates]
    avg_score = round(sum(scores) / max(1, len(scores)), 1)
    
    # Skill frequency across candidates
    skill_counts: Dict[str, int] = {}
    missing_skill_counts: Dict[str, int] = {}
    for c in screened_candidates:
        for s in c.skill_gap_analysis.matched_hard_skills:
            skill_counts[s] = skill_counts.get(s, 0) + 1
        for s in c.skill_gap_analysis.missing_critical_skills:
            missing_skill_counts[s] = missing_skill_counts.get(s, 0) + 1

    analytics = {
        "total_screened": len(screened_candidates),
        "average_score": avg_score,
        "strong_matches": sum(1 for c in screened_candidates if c.recommendation == "Strong Match"),
        "shortlisted": sum(1 for c in screened_candidates if c.recommendation == "Shortlist"),
        "consider": sum(1 for c in screened_candidates if c.recommendation == "Consider"),
        "not_recommended": sum(1 for c in screened_candidates if c.recommendation == "Not Recommended"),
        "top_skills_in_pool": sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:6],
        "top_missing_skills": sorted(missing_skill_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    }

    return BatchScreeningResponse(
        job_id=target_jd.id,
        job_title=target_jd.title,
        total_screened=len(screened_candidates),
        ranked_candidates=screened_candidates,
        analytics=analytics
    )

@router.get("/sample-candidates", response_model=BatchScreeningResponse)
async def screen_benchmark_candidates(job_id: Optional[str] = "job-1"):
    """
    Screens the preloaded academic benchmark candidates against the target job requisition.
    Ideal for instant demonstration during CSE Masters project defense.
    """
    target_jd = next((j for j in JOBS_STORE if j.id == job_id), JOBS_STORE[0])
    
    screened: List[CandidateScreeningResult] = []
    for cand_meta in SAMPLE_RESUMES:
        res = run_candidate_screening_pipeline(
            raw_text=cand_meta["text"],
            jd=target_jd,
            candidate_id=cand_meta["id"]
        )
        screened.append(res)

    # Sort descending
    screened.sort(key=lambda c: c.overall_suitability_score, reverse=True)

    scores = [c.overall_suitability_score for c in screened]
    avg_score = round(sum(scores) / max(1, len(scores)), 1)

    skill_counts: Dict[str, int] = {}
    missing_skill_counts: Dict[str, int] = {}
    for c in screened:
        for s in c.skill_gap_analysis.matched_hard_skills:
            skill_counts[s] = skill_counts.get(s, 0) + 1
        for s in c.skill_gap_analysis.missing_critical_skills:
            missing_skill_counts[s] = missing_skill_counts.get(s, 0) + 1

    analytics = {
        "total_screened": len(screened),
        "average_score": avg_score,
        "strong_matches": sum(1 for c in screened if c.recommendation == "Strong Match"),
        "shortlisted": sum(1 for c in screened if c.recommendation == "Shortlist"),
        "consider": sum(1 for c in screened if c.recommendation == "Consider"),
        "not_recommended": sum(1 for c in screened if c.recommendation == "Not Recommended"),
        "top_skills_in_pool": sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:6],
        "top_missing_skills": sorted(missing_skill_counts.items(), key=lambda x: x[1], reverse=True)[:6]
    }

    return BatchScreeningResponse(
        job_id=target_jd.id,
        job_title=target_jd.title,
        total_screened=len(screened),
        ranked_candidates=screened,
        analytics=analytics
    )

@router.post("/compare")
async def compare_candidates(candidate_ids: List[str], screened_list: List[CandidateScreeningResult]):
    """
    Extracts selected candidates from current batch for side-by-side comparative analysis.
    """
    selected = [c for c in screened_list if c.candidate_id in candidate_ids]
    if not selected:
        raise HTTPException(status_code=404, detail="Selected candidates not found.")
    return {
        "compared_candidates": selected,
        "metrics_comparison": {
            "names": [c.candidate_name for c in selected],
            "overall_scores": [c.overall_suitability_score for c in selected],
            "technical_scores": [c.technical_fit_score for c in selected],
            "ats_scores": [c.ats_analysis.overall_ats_score for c in selected],
            "experience_scores": [c.experience_fit_score for c in selected]
        }
    }
