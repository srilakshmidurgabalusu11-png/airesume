from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.routes_candidate import router as candidate_router
from .api.routes_recruiter import router as recruiter_router
from .api.routes_admin import router as admin_router
from .api.routes_analytics import router as analytics_router

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="""
    ## AI-Powered Resume Screening and Candidate Intelligence System
    **CSE Master's Final Year Project (M.Tech / MS CSE)**
    
    ### Project Members:
    - B. Sri Lakshmi Durga (233B1A0411)
    - M. Karunya Durga Lakshmi (233B1A0461)
    - V. BVS Durgaprasad (233B1A0438)
    - Y. Tataji (233B1A0404)
    - M. MSS Prasad (233B1A0450)
    
    ### Technologies:
    - **Natural Language Processing**: TF-IDF, Cosine Similarity, Named Entity Extraction, Heuristics
    - **Large Language Models**: Google Gemini (gemini-2.5-flash / gemini-3.7-flash)
    - **ATS Diagnostics**: Section health, keyword density, quantifiable impact metrics
    - **Dashboards**: Candidate Portal, Recruiter Portal, Admin Portal, Recruitment Analytics
    """
)

# Enable CORS for frontend integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(candidate_router, prefix=settings.API_PREFIX)
app.include_router(recruiter_router, prefix=settings.API_PREFIX)
app.include_router(admin_router, prefix=settings.API_PREFIX)
app.include_router(analytics_router, prefix=settings.API_PREFIX)

@app.get("/")
async def root():
    return {
        "project": settings.PROJECT_NAME,
        "status": "ONLINE",
        "version": settings.VERSION,
        "docs_url": "/docs",
        "api_prefix": settings.API_PREFIX
    }

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "AI Resume Intelligence Engine"}
