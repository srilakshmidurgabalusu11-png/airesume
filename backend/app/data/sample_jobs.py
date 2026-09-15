from typing import List
from ..models.schemas import JobDescription

SAMPLE_JOBS: List[JobDescription] = [
    JobDescription(
        id="job-1",
        title="Full Stack AI Engineer",
        company="Cognitive Dynamics AI",
        experience_required="2-5 years",
        education_required="Bachelor's or Master's degree in Computer Science, AI, or equivalent",
        required_skills=["python", "fastapi", "react", "redux", "llm", "docker", "postgresql", "rest api"],
        preferred_skills=["tailwind", "redis", "langchain", "aws", "rag", "typescript", "git"],
        full_text="""We are seeking a high-caliber Full Stack AI Engineer to build cutting-edge generative AI applications and candidate intelligence systems.
Responsibilities:
- Architect and develop scalable web applications using React, Redux Toolkit, and Python FastAPI backend services.
- Integrate Large Language Models (Gemini, Claude, GPT) with Retrieval-Augmented Generation (RAG) pipelines and vector embeddings.
- Design relational databases in PostgreSQL and caching layers with Redis.
- Containerize services with Docker and manage deployment pipelines.
Requirements:
- Strong hands-on proficiency in Python, FastAPI, React, Redux, and modern JavaScript/TypeScript.
- Experience with LLM prompt engineering, fine-tuning, or function calling APIs.
- Understanding of microservices, clean RESTful architectures, and software engineering best practices."""
    ),
    JobDescription(
        id="job-2",
        title="Machine Learning & NLP Scientist",
        company="NeuroSemantic Labs",
        experience_required="3-6 years",
        education_required="Master's or Ph.D. in Computer Science, Machine Learning, or Computational Linguistics",
        required_skills=["python", "pytorch", "transformers", "nlp", "scikit-learn", "machine learning", "pandas", "numpy"],
        preferred_skills=["hugging face", "vector databases", "deep learning", "docker", "fastapi", "spark"],
        full_text="""Join our core research team developing next-generation semantic analysis and natural language parsing engines.
Key Duties:
- Design, train, and evaluate state-of-the-art NLP models for text extraction, named entity recognition (NER), and semantic embeddings.
- Build production inference pipelines leveraging PyTorch, Hugging Face Transformers, and scikit-learn.
- Optimize high-throughput document intelligence systems and semantic matching algorithms.
Requirements:
- Master's in CS / Data Science / AI with deep theoretical grounding in machine learning and NLP.
- Proven experience with PyTorch, transformers, embeddings, and mathematical vector space models."""
    ),
    JobDescription(
        id="job-3",
        title="Senior Backend Python Engineer",
        company="Apex Cloud Systems",
        experience_required="4-7 years",
        education_required="Bachelor's or Master's in Computer Science",
        required_skills=["python", "fastapi", "django", "postgresql", "redis", "docker", "microservices", "system design"],
        preferred_skills=["kafka", "kubernetes", "aws", "ci/cd", "celery", "graphql"],
        full_text="""Apex Cloud Systems is looking for a Senior Backend Engineer to architect high-throughput distributed microservices.
Responsibilities:
- Build mission-critical backend systems using Python, FastAPI, and asynchronous concurrency patterns.
- Design scalable database schemas in PostgreSQL with Redis caching.
- Drive system design reviews, automated testing, and CI/CD pipelines.
Requirements:
- 4+ years of backend development experience in Python (FastAPI/Django).
- Deep expertise in distributed systems, RESTful API design, database query optimization, and Docker containerization."""
    ),
    JobDescription(
        id="job-4",
        title="Frontend React & UI/UX Architect",
        company="Vanguard Digital Studio",
        experience_required="3-5 years",
        education_required="Bachelor's in Computer Science, Information Technology, or Design",
        required_skills=["react", "redux", "typescript", "javascript", "tailwind", "html5", "css3", "vite"],
        preferred_skills=["next.js", "websockets", "ui/ux", "jest", "responsive design"],
        full_text="""We are looking for a Frontend Architect passionate about crafting state-of-the-art interactive web applications.
Responsibilities:
- Lead the architecture of enterprise web applications using React, Redux Toolkit, and modern CSS/Tailwind.
- Deliver pixel-perfect, accessible, and responsive user interfaces with smooth micro-animations and rich dashboards.
- Ensure high performance, fast render speeds, and clean component-driven state architecture."""
    )
]
