import re
from typing import List, Dict, Set, Tuple
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from ..models.schemas import SkillGapAnalysis

# Comprehensive Industry Skill Taxonomy
HARD_SKILLS_TAXONOMY = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "golang", "rust", "c",
    "ruby", "php", "swift", "kotlin", "scala", "r", "dart", "sql", "bash", "shell",
    # Frontend & Web
    "react", "react.js", "redux", "redux toolkit", "next.js", "vue", "vue.js", "angular", "html5", "css3",
    "tailwind", "tailwindcss", "sass", "bootstrap", "webpack", "vite", "graphql", "rest api", "websockets",
    # Backend & Frameworks
    "fastapi", "flask", "django", "node.js", "express", "express.js", "spring boot", "asp.net",
    "nest.js", "microservices", "grpc", "celery", "rabbitmq", "kafka",
    # Databases & Caching
    "postgresql", "postgres", "mysql", "mongodb", "sqlite", "redis", "elasticsearch", "cassandra",
    "dynamodb", "neo4j", "supabase", "firebase", "prisma", "sqlalchemy",
    # Cloud, DevOps & Infrastructure
    "aws", "amazon web services", "azure", "gcp", "google cloud", "docker", "kubernetes",
    "ci/cd", "github actions", "gitlab ci", "jenkins", "terraform", "ansible", "linux", "nginx",
    # AI, ML, Data Science & Big Data
    "machine learning", "deep learning", "nlp", "natural language processing", "llm",
    "large language models", "generative ai", "computer vision", "pytorch", "tensorflow",
    "scikit-learn", "keras", "pandas", "numpy", "opencv", "hugging face", "transformers",
    "langchain", "llamaindex", "rag", "vector databases", "pinecone", "chromadb", "spark", "hadoop"
}

SOFT_SKILLS_TAXONOMY = {
    "communication", "team leadership", "problem solving", "critical thinking", "agile",
    "scrum", "project management", "collaboration", "adaptability", "time management",
    "mentorship", "code review", "system design", "analytical thinking", "stakeholder management"
}

# Skill synonyms & mappings for semantic normalization
SYNONYM_MAP = {
    "reactjs": "react",
    "react.js": "react",
    "nodejs": "node.js",
    "vuejs": "vue",
    "golang": "go",
    "postgres": "postgresql",
    "k8s": "kubernetes",
    "tailwind": "tailwindcss",
    "tf": "tensorflow",
    "sk-learn": "scikit-learn",
    "sklearn": "scikit-learn",
    "natural language processing": "nlp",
    "large language models": "llm",
    "genai": "generative ai",
    "aws": "amazon web services",
    "gcp": "google cloud"
}

class NLPEngine:
    @staticmethod
    def normalize_skill(skill: str) -> str:
        s = skill.strip().lower()
        return SYNONYM_MAP.get(s, s)

    @staticmethod
    def extract_skills(text: str) -> Tuple[List[str], List[str]]:
        text_lower = text.lower()
        found_hard: Set[str] = set()
        found_soft: Set[str] = set()

        # Word boundary search for taxonomy items
        for skill in HARD_SKILLS_TAXONOMY:
            pattern = r'(?:\b|_)' + re.escape(skill) + r'(?:\b|_)'
            if re.search(pattern, text_lower):
                found_hard.add(NLPEngine.normalize_skill(skill))

        for skill in SOFT_SKILLS_TAXONOMY:
            pattern = r'(?:\b|_)' + re.escape(skill) + r'(?:\b|_)'
            if re.search(pattern, text_lower):
                found_soft.add(skill)

        return sorted(list(found_hard)), sorted(list(found_soft))

    @staticmethod
    def compute_tfidf_cosine_similarity(resume_text: str, jd_text: str) -> float:
        try:
            vectorizer = TfidfVectorizer(ngram_range=(1, 2), stop_words='english', max_features=1500)
            tfidf_matrix = vectorizer.fit_transform([resume_text, jd_text])
            similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
            # In text retrieval, raw cosine similarity of 0.35-0.5 is exceptionally high for multi-section text
            # Calibrate: map 0.05 - 0.45 range to 25% - 95%
            normalized_score = 25.0 + (similarity / 0.45) * 70.0
            return round(min(98.0, max(20.0, float(normalized_score))), 1)
        except Exception:
            return 65.0

    @staticmethod
    def analyze_skill_gaps(resume_text: str, required_skills: List[str], preferred_skills: List[str], jd_text: str) -> SkillGapAnalysis:
        res_hard, res_soft = NLPEngine.extract_skills(resume_text)
        res_all_skills = set(res_hard + res_soft)

        # If job description didn't pass explicit lists, extract from jd_text
        if not required_skills and not preferred_skills:
            jd_hard, jd_soft = NLPEngine.extract_skills(jd_text)
            required_skills = jd_hard[:10]
            preferred_skills = jd_hard[10:] + jd_soft[:5]

        norm_req = {NLPEngine.normalize_skill(s) for s in required_skills}
        norm_pref = {NLPEngine.normalize_skill(s) for s in preferred_skills}

        matched_hard = [s for s in res_hard if s in norm_req or s in norm_pref or any(s in x for x in norm_req)]
        matched_soft = [s for s in res_soft if s in norm_req or s in norm_pref or any(s in x for x in norm_soft)]

        # If no explicit matches from strict set, find overlap with all extracted skills
        missing_critical = [s for s in norm_req if not any(NLPEngine.normalize_skill(r) == s or s in r for r in res_all_skills)]
        missing_preferred = [s for s in norm_pref if not any(NLPEngine.normalize_skill(r) == s or s in r for r in res_all_skills)]

        # Transferable skills: present in resume that are complementary
        transferable = [s for s in res_hard if s not in norm_req and s not in norm_pref][:5]

        total_req_count = max(1, len(norm_req))
        matched_req_count = len(norm_req) - len(missing_critical)
        skill_match_pct = round((matched_req_count / total_req_count) * 100, 1)

        return SkillGapAnalysis(
            matched_hard_skills=matched_hard,
            matched_soft_skills=matched_soft,
            missing_critical_skills=missing_critical,
            missing_preferred_skills=missing_preferred,
            transferable_skills=transferable,
            skill_match_percentage=skill_match_pct
        )
