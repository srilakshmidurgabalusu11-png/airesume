from fastapi import APIRouter
from typing import Dict, Any
from ..data.sample_resumes import SAMPLE_RESUMES
from ..data.sample_jobs import SAMPLE_JOBS
from ..services.nlp_engine import NLPEngine

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
async def get_analytics_overview():
    # Calculate baseline academic benchmark statistics
    all_skills = []
    for r in SAMPLE_RESUMES:
        hard, _ = NLPEngine.extract_skills(r["text"])
        all_skills.extend(hard)
    
    skill_dist = {}
    for s in all_skills:
        skill_dist[s] = skill_dist.get(s, 0) + 1

    top_skills = sorted([{"skill": k.title(), "count": v} for k, v in skill_dist.items()], key=lambda x: x["count"], reverse=True)[:8]

    return {
        "pipeline_funnel": [
            {"stage": "Total Applied", "count": 142, "percentage": 100},
            {"stage": "Parsed & Screened", "count": 138, "percentage": 97},
            {"stage": "ATS Passed (>75)", "count": 86, "percentage": 60},
            {"stage": "Shortlisted", "count": 34, "percentage": 24},
            {"stage": "Technical Interview", "count": 14, "percentage": 10},
            {"stage": "Offer Extended", "count": 5, "percentage": 3.5}
        ],
        "top_market_skills": top_skills,
        "score_distribution": [
            {"score_range": "90-100 (Strong)", "count": 18},
            {"score_range": "80-89 (High)", "count": 42},
            {"score_range": "70-79 (Moderate)", "count": 48},
            {"score_range": "60-69 (Borderline)", "count": 22},
            {"score_range": "<60 (Reject)", "count": 12}
        ],
        "common_candidate_gaps": [
            {"gap": "Docker & Containerization", "frequency": 42},
            {"gap": "Production CI/CD Pipelines", "frequency": 38},
            {"gap": "Redis & Distributed Caching", "frequency": 31},
            {"gap": "System Architecture / Microservices", "frequency": 27},
            {"gap": "Kubernetes Orchestration", "frequency": 24}
        ]
    }
