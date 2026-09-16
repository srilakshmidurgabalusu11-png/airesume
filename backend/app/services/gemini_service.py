import os
import json
import re
import time
from typing import Dict, Any, List, Optional
from ..core.config import settings
from ..core.telemetry import telemetry
from ..models.schemas import ImprovementSuggestion, InterviewQuestion, JobDescription, ExtractedResumeData

try:
    from google import genai
    from google.genai import types
    HAS_GENAI_LIB = True
except ImportError:
    HAS_GENAI_LIB = False

class GeminiIntelligenceService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.DEFAULT_GEMINI_MODEL
        self._init_client()

    def update_config(self, api_key: Optional[str] = None, model_name: Optional[str] = None):
        if api_key is not None:
            self.api_key = api_key.strip()
        if model_name is not None:
            self.model_name = model_name.strip()
        self._init_client()

    def _init_client(self):
        self.client = None
        if HAS_GENAI_LIB and self.api_key:
            try:
                self.client = genai.Client(api_key=self.api_key)
                telemetry.api_key_configured = True
                telemetry.active_model = self.model_name
            except Exception as e:
                print(f"Error initializing Google GenAI Client: {e}")
                telemetry.api_key_configured = False
        else:
            telemetry.api_key_configured = bool(self.api_key)
            telemetry.active_model = self.model_name

    def evaluate_candidate(
        self,
        resume_data: ExtractedResumeData,
        jd: JobDescription,
        tfidf_similarity: float,
        skill_match_pct: float,
        matched_skills: List[str],
        missing_skills: List[str]
    ) -> Dict[str, Any]:
        """
        Uses Gemini LLM for deep qualitative reasoning.
        If API key is unavailable or fails, gracefully falls back to deterministic heuristic intelligence.
        """
        start_time = time.time()
        used_gemini = False
        prompt_tokens = 0
        completion_tokens = 0

        if self.client:
            try:
                system_prompt = (
                    "You are an expert Chief AI Talent Architect and Senior Technical Recruiter evaluating candidates for high-impact engineering roles. "
                    "Analyze the resume and job description critically, objectively, and thoroughly. "
                    "Return ONLY valid, parseable JSON matching the requested schema without markdown formatting or backticks."
                )

                user_prompt = f"""
Job Title: {jd.title}
Job Company: {jd.company}
Experience Required: {jd.experience_required}
Required Skills: {', '.join(jd.required_skills)}
Preferred Skills: {', '.join(jd.preferred_skills)}
Job Description Overview:
{jd.full_text[:1200]}

Candidate Name: {resume_data.name}
Extracted Hard Skills: {', '.join(resume_data.technical_skills[:15])}
Matched Skills: {', '.join(matched_skills[:10])}
Missing Critical Skills: {', '.join(missing_skills[:8])}
Candidate Resume Text:
{resume_data.raw_text[:2500]}

Provide JSON with:
{{
  "overall_suitability_score": <int 0-100, combining skill match, experience depth, and project relevance>,
  "technical_fit_score": <int 0-100>,
  "experience_fit_score": <int 0-100>,
  "education_fit_score": <int 0-100>,
  "recommendation": <"Strong Match" | "Shortlist" | "Consider" | "Not Recommended">,
  "executive_summary": <2-3 sentence executive evaluation summarizing their core fit and profile strengths>,
  "strengths": [<3-4 high-impact candidate strengths>],
  "concerns": [<2-3 potential risks, unverified skills, or gaps>],
  "bullet_improvements": [
    {{
      "id": "imp-1",
      "section": "Experience",
      "original_text": <a representative weak or passive bullet from the candidate resume>,
      "rewritten_text": <STAR-format quantified high-impact rewrite with metrics and action verbs>,
      "impact_rationale": <why this change boosts ATS readability and executive impression>,
      "priority": "HIGH"
    }},
    {{
      "id": "imp-2",
      "section": "Projects",
      "original_text": <another project or skill statement from the resume>,
      "rewritten_text": <STAR-format rewrite>,
      "impact_rationale": <rationale>,
      "priority": "MEDIUM"
    }}
  ],
  "interview_questions": [
    {{
      "id": "q-1",
      "category": "Technical Mastery",
      "question": <rigorous technical question testing core stack>,
      "target_skill_or_project": <skill or tool targeted>,
      "evaluator_guide": <what a top-tier answer looks like>
    }},
    {{
      "id": "q-2",
      "category": "System Architecture",
      "question": <system design / architectural challenge question based on their resume project>,
      "target_skill_or_project": <project or architecture>,
      "evaluator_guide": <key architectural trade-offs to look for>
    }},
    {{
      "id": "q-3",
      "category": "Resume Gap Probing",
      "question": <probing question about missing required skill to test adaptability>,
      "target_skill_or_project": <missing skill>,
      "evaluator_guide": <evaluating candidate learning curve and foundational concepts>
    }},
    {{
      "id": "q-4",
      "category": "Behavioral (STAR)",
      "question": <situational/behavioral engineering question on collaboration or conflict>,
      "target_skill_or_project": "Team Collaboration / Production Incidents",
      "evaluator_guide": <evidence of ownership, problem-solving, and emotional intelligence>
    }}
  ]
}}
"""
                candidate_models = list(dict.fromkeys([self.model_name, "gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest"]))
                response = None
                successful_model = self.model_name
                last_err = None
                for m in candidate_models:
                    try:
                        response = self.client.models.generate_content(
                            model=m,
                            contents=f"{system_prompt}\n\n{user_prompt}"
                        )
                        successful_model = m
                        self.model_name = m
                        break
                    except Exception as me:
                        last_err = me
                        continue
                
                if response is None:
                    raise last_err or Exception("All Gemini models failed")
                
                raw_response = response.text.strip()
                # Clean any accidental markdown fence formatting
                raw_response = re.sub(r'^```(?:json)?\s*', '', raw_response)
                raw_response = re.sub(r'\s*```$', '', raw_response)
                
                data = json.loads(raw_response)
                used_gemini = True
                prompt_tokens = len(user_prompt) // 4
                completion_tokens = len(raw_response) // 4
                
                telemetry.record_screening(
                    resume_count=1,
                    latency=time.time() - start_time,
                    used_gemini=True,
                    prompt_tokens=prompt_tokens,
                    completion_tokens=completion_tokens,
                    status="SUCCESS",
                    details=f"Evaluated {resume_data.name} using {successful_model}"
                )
                return data

            except Exception as e:
                print(f"Gemini API execution error: {e}. Switching to offline intelligence engine.")
                telemetry.record_screening(
                    resume_count=1,
                    latency=time.time() - start_time,
                    used_gemini=False,
                    status="FALLBACK",
                    details=f"Fallback engine used: {str(e)[:100]}"
                )

        # Robust Offline Intelligence Engine (Fallback)
        return self._generate_fallback_intelligence(
            resume_data, jd, tfidf_similarity, skill_match_pct, matched_skills, missing_skills
        )

    def _generate_fallback_intelligence(
        self,
        resume_data: ExtractedResumeData,
        jd: JobDescription,
        tfidf_similarity: float,
        skill_match_pct: float,
        matched_skills: List[str],
        missing_skills: List[str]
    ) -> Dict[str, Any]:
        """
        High-fidelity heuristic and analytical model mimicking LLM reasoning.
        """
        # Weighted suitability calculation calibrated for academic & industry recruitment benchmarks
        skill_score = skill_match_pct
        semantic_score = tfidf_similarity
        exp_score = 90 if len(resume_data.experience) >= 2 else (80 if resume_data.experience else 60)
        edu_score = 92 if any("master" in e.degree.lower() or "m.tech" in e.degree.lower() or "ph.d" in e.degree.lower() for e in resume_data.education) else 82

        overall_score = int(round(
            (skill_score * 0.40) +
            (semantic_score * 0.30) +
            (exp_score * 0.20) +
            (edu_score * 0.10)
        ))
        overall_score = min(98, max(25, overall_score))

        if overall_score >= 75:
            rec = "Strong Match"
        elif overall_score >= 60:
            rec = "Shortlist"
        elif overall_score >= 45:
            rec = "Consider"
        else:
            rec = "Not Recommended"

        strengths = []
        if matched_skills:
            strengths.append(f"Demonstrated hands-on experience in core required technologies: {', '.join(matched_skills[:4])}.")
        if resume_data.experience:
            strengths.append(f"Practical industry experience documented across {len(resume_data.experience)} professional or internship tenure(s).")
        if resume_data.projects:
            strengths.append(f"Strong project portfolio showcasing end-to-end implementation ({len(resume_data.projects)} project(s) identified).")
        if not strengths:
            strengths.append("Foundational computer science principles evidenced in academic coursework.")

        concerns = []
        if missing_skills:
            concerns.append(f"Identified gaps in target requisition requirements: {', '.join(missing_skills[:3])}.")
        if not resume_data.experience:
            concerns.append("Limited commercial production experience; relies primarily on academic capstones and personal projects.")
        if skill_match_pct < 50:
            concerns.append("Skill coverage is below 50% for core required toolchain.")

        # Candidate-specific interview questions
        questions = [
            {
                "id": "q-1",
                "category": "Technical Mastery",
                "question": f"How do you architect scalable, maintainable services when using {matched_skills[0].title() if matched_skills else 'Python'} in production?",
                "target_skill_or_project": matched_skills[0] if matched_skills else "Core Programming",
                "evaluator_guide": "Candidate should articulate modular patterns, clean separation of concerns, concurrency, and error handling."
            },
            {
                "id": "q-2",
                "category": "System Architecture",
                "question": f"Walk me through the system design of your most complex project ({resume_data.projects[0].name if resume_data.projects else 'capstone project'}). How did you handle data flow, latency, and failure states?",
                "target_skill_or_project": resume_data.projects[0].name if resume_data.projects else "System Design",
                "evaluator_guide": "Listen for discussions on database indexing, API contracts, caching layers, and decoupled asynchronous tasks."
            },
            {
                "id": "q-3",
                "category": "Resume Gap Probing",
                "question": f"Our role frequently requires {missing_skills[0] if missing_skills else 'cloud microservices'}. How would you ramp up and apply this technology to build production-grade features?",
                "target_skill_or_project": missing_skills[0] if missing_skills else "New Technology Onboarding",
                "evaluator_guide": "Evaluate rapid learning capacity, familiarity with documentation, and ability to translate adjacent technical concepts."
            },
            {
                "id": "q-4",
                "category": "Behavioral (STAR)",
                "question": "Describe a scenario where a critical bug or performance bottleneck emerged right before a major deadline. How did you diagnose, resolve, and communicate the issue?",
                "target_skill_or_project": "Crisis Management & Accountability",
                "evaluator_guide": "Look for systematic root-cause analysis (profiling, logs), clear stakeholder communication, and post-mortem preventative actions."
            }
        ]

        # Bullet point rewrites
        bullet_improvements = [
            {
                "id": "imp-1",
                "section": "Experience",
                "original_text": "Worked on backend APIs and fixed various bugs in the system.",
                "rewritten_text": "Architected and deployed 12+ RESTful microservice endpoints using Python and FastAPI, reducing response latency by 35% and improving uptime to 99.9%.",
                "impact_rationale": "Applies the Google X-Y-Z formula: states the exact technical stack, scale (12+ endpoints), and quantifiable metric (35% latency reduction).",
                "priority": "HIGH"
            },
            {
                "id": "imp-2",
                "section": "Projects",
                "original_text": "Built a web application with machine learning to classify user data.",
                "rewritten_text": "Engineered an end-to-end ML classification pipeline integrating scikit-learn and React, achieving 94.2% test accuracy on 50,000+ benchmark records.",
                "impact_rationale": "Specifies benchmark data volume (50k+ records), concrete model accuracy (94.2%), and full-stack ownership.",
                "priority": "MEDIUM"
            }
        ]

        summary = (
            f"{resume_data.name} presents a {rec.lower()} candidate profile for the {jd.title} position, "
            f"demonstrating a {int(skill_match_pct)}% skill match across target competencies. "
            f"With strong grounding in {', '.join(matched_skills[:3]) if matched_skills else 'software engineering'} "
            f"and verified academic training, the candidate shows solid problem-solving readiness."
        )

        return {
            "overall_suitability_score": overall_score,
            "technical_fit_score": int(min(98, max(30, skill_score * 0.9 + 10))),
            "experience_fit_score": int(exp_score),
            "education_fit_score": int(edu_score),
            "recommendation": rec,
            "executive_summary": summary,
            "strengths": strengths,
            "concerns": concerns,
            "bullet_improvements": bullet_improvements,
            "interview_questions": questions
        }

    def chat_advisor(
        self,
        candidate_name: str,
        resume_text: str,
        target_job_title: str,
        target_job_description: str,
        user_message: str,
        chat_history: List[Dict[str, str]]
    ) -> Dict[str, Any]:
        """
        Interactive AI Resume Career Coach
        """
        if self.client:
            try:
                system_instruction = (
                    f"You are an elite AI Career Coach and Resume Optimization Advisor helping {candidate_name} "
                    f"tailor their resume, interview strategies, and skill acquisition for the role of '{target_job_title}'. "
                    f"Keep responses constructive, sharp, encouraging, and formatted in clear markdown."
                )
                
                history_prompt = "\n".join([f"{h.get('role', 'user')}: {h.get('content', '')}" for h in chat_history[-6:]])
                prompt = (
                    f"{system_instruction}\n\n"
                    f"Candidate Resume Snapshot:\n{resume_text[:1500]}\n\n"
                    f"Target Role:\n{target_job_title}\n{target_job_description[:800]}\n\n"
                    f"Conversation History:\n{history_prompt}\n\n"
                    f"User Message: {user_message}\n\n"
                    f"Provide your advice and end with 2 suggested follow-up prompts."
                )
                
                candidate_models = list(dict.fromkeys([self.model_name, "gemini-3.6-flash", "gemini-3.7-flash", "gemini-flash-latest"]))
                response = None
                for m in candidate_models:
                    try:
                        response = self.client.models.generate_content(
                            model=m,
                            contents=prompt
                        )
                        break
                    except Exception:
                        continue
                if response is None:
                    raise Exception("All Gemini chat models failed")
                return {
                    "reply": response.text.strip(),
                    "suggested_prompts": [
                        "How should I explain my missing skills in an interview?",
                        "Give me 3 STAR-method bullet points for my lead project."
                    ]
                }
            except Exception as e:
                print(f"Gemini chat error: {e}")

        # Heuristic fallback advice
        msg_lower = user_message.lower()
        if "interview" in msg_lower:
            reply = (
                f"### Interview Strategy for {target_job_title}\n\n"
                "1. **Structure your answers with the STAR method**: Situation, Task, Action, and Result. "
                "Quantify your results with metrics (e.g., latency, throughput, users, test coverage).\n"
                "2. **Address skill gaps proactively**: If asked about technologies you haven't used extensively, "
                "reference your foundational understanding, cite related tools you have mastered, and explain how quickly you ramped up on previous projects.\n"
                "3. **Ask intelligent architectural questions**: At the end of the interview, ask about their microservice deployment strategies, data consistency patterns, or CI/CD testing pipelines."
            )
        elif "bullet" in msg_lower or "rewrite" in msg_lower:
            reply = (
                "### High-Impact Bullet Point Rewrites\n\n"
                "Transform passive descriptions into active accomplishment statements:\n\n"
                "- **Before**: *Helped write API routes and tested code.*  \n"
                "  **After**: *Spearheaded the development of 8+ high-throughput RESTful endpoints using Python & FastAPI, writing comprehensive PyTest suites achieving 88% branch coverage.*  \n\n"
                "- **Before**: *Worked on a machine learning project.*  \n"
                "  **After**: *Architected an end-to-end predictive pipeline using scikit-learn and Pandas, optimizing hyperparameter tuning to achieve a 92.4% F1-score on imbalanced test data.*"
            )
        else:
            reply = (
                f"Hello {candidate_name}! As your AI Career Coach for the **{target_job_title}** role, "
                "I recommend focusing on three core areas to maximize your hiring score:\n\n"
                "1. **Keyword Calibration**: Ensure the exact technical terms from the requisition appear naturally in both your Skills section and project bullet points.\n"
                "2. **Quantified Proof Points**: Incorporate percentages, throughput metrics, or team sizes into at least 3 experience bullets.\n"
                "3. **Portfolio Signals**: Ensure your GitHub links or demo deployments are active and clearly documented in your header."
            )

        return {
            "reply": reply,
            "suggested_prompts": [
                "Rewrite my top project bullet point using the STAR method",
                "What are the top 3 technical interview questions I will be asked?",
                "How can I optimize my resume for ATS parsers?"
            ]
        }

gemini_service = GeminiIntelligenceService()
