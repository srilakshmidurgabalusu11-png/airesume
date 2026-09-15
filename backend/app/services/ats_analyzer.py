import re
from typing import List, Dict
from ..models.schemas import ATSAnalysis, ATSSectionHealth, ExtractedResumeData, JobDescription

class ATSAnalyzerService:
    @staticmethod
    def evaluate(resume_data: ExtractedResumeData, jd: JobDescription, skill_match_pct: float) -> ATSAnalysis:
        raw_text = resume_data.raw_text
        issues: List[str] = []
        fixes: List[str] = []
        section_health: Dict[str, ATSSectionHealth] = {}

        # 1. Contact & Header Inspection
        has_email = bool(resume_data.email)
        has_phone = bool(resume_data.phone)
        has_name = bool(resume_data.name and resume_data.name != "Candidate")
        
        if has_email and has_phone and has_name:
            section_health["Contact Information"] = ATSSectionHealth(status="PASS", message="Complete contact details found.")
        elif has_email or has_phone:
            section_health["Contact Information"] = ATSSectionHealth(status="WARNING", message="Incomplete contact info. Make sure phone and professional email are included.")
            issues.append("Missing phone number or email header.")
            fixes.append("Add a clear header with Name, Phone Number, Professional Email, and LinkedIn/GitHub links.")
        else:
            section_health["Contact Information"] = ATSSectionHealth(status="FAIL", message="No contact information detected in resume text.")
            issues.append("No email or phone number found.")
            fixes.append("Include prominent contact details at the very top of your resume.")

        # 2. Section Headings Check
        text_lower = raw_text.lower()
        has_exp = any(k in text_lower for k in ["experience", "employment", "work history", "internship"])
        has_edu = any(k in text_lower for k in ["education", "academic", "degree", "university", "college"])
        has_skills = any(k in text_lower for k in ["skills", "technologies", "competencies", "tools"])
        has_proj = any(k in text_lower for k in ["projects", "personal projects", "portfolio"])
        has_summary = any(k in text_lower for k in ["summary", "profile", "objective", "about me"])

        formatting_deductions = 0
        if has_exp:
            section_health["Experience Section"] = ATSSectionHealth(status="PASS", message="Standard work experience section detected.")
        else:
            section_health["Experience Section"] = ATSSectionHealth(status="WARNING", message="Standard 'Experience' heading not clearly identified.")
            formatting_deductions += 15
            issues.append("Unstandardized Experience heading.")
            fixes.append("Use standard heading 'Professional Experience' or 'Work Experience'.")

        if has_edu:
            section_health["Education Section"] = ATSSectionHealth(status="PASS", message="Education section detected.")
        else:
            section_health["Education Section"] = ATSSectionHealth(status="WARNING", message="Education section heading missing or unparsed.")
            formatting_deductions += 10
            issues.append("Education section not clearly demarcated.")
            fixes.append("Label your academic credentials under a clean 'Education' heading.")

        if has_skills:
            section_health["Skills Section"] = ATSSectionHealth(status="PASS", message="Dedicated skills section detected.")
        else:
            section_health["Skills Section"] = ATSSectionHealth(status="WARNING", message="No dedicated 'Skills' or 'Technical Competencies' section.")
            formatting_deductions += 15
            issues.append("No explicit Skills heading.")
            fixes.append("Add a categorized 'Technical Skills' section for ATS parsers.")

        if has_proj:
            section_health["Projects Section"] = ATSSectionHealth(status="PASS", message="Projects section found.")
        else:
            section_health["Projects Section"] = ATSSectionHealth(status="WARNING", message="Projects section could not be isolated.")
            formatting_deductions += 5

        # 3. Quantifiable Metrics & Action Verbs Check
        # Search for metrics (e.g., 30%, $10k, 5x, 15ms, 100k, 20 users)
        metric_matches = re.findall(r'\b(?:\d+[\d,.]*\%|\$\d+[\d,.]*|\d+\+?\s*(?:users|clients|engineers|team members|requests|ms|seconds|x|million|k))\b', raw_text, re.IGNORECASE)
        metric_count = len(metric_matches)
        
        if metric_count >= 5:
            quant_score = 92
        elif metric_count >= 2:
            quant_score = 75
            fixes.append("Add more quantifiable impact metrics (e.g., 'Improved latency by 40%', 'Handled 10k daily requests').")
        else:
            quant_score = 50
            issues.append("Lack of quantifiable results in bullet points.")
            fixes.append("Every experience bullet should feature a metric using the Google X-Y-Z formula: 'Accomplished [X] as measured by [Y] by doing [Z]'.")

        # 4. Readability & Length Check
        word_count = len(raw_text.split())
        readability_score = 90
        if word_count < 200:
            readability_score = 60
            issues.append("Resume is too brief (< 200 words).")
            fixes.append("Expand on project contributions, responsibilities, and system architectures.")
        elif word_count > 1200:
            readability_score = 70
            issues.append("Resume is lengthy (> 1200 words).")
            fixes.append("Keep resume concise, preferably 1-2 pages maximum for ATS readability.")

        # Formatting score calculation
        formatting_score = max(40, 100 - formatting_deductions)
        
        # Keyword score aligned with skill match & JD keywords
        keyword_score = int(min(100, max(30, skill_match_pct * 0.95 + 10)))

        # Overall ATS Compatibility Score (Weighted Average)
        overall_ats = int(round(
            (readability_score * 0.20) +
            (formatting_score * 0.30) +
            (keyword_score * 0.30) +
            (quant_score * 0.20)
        ))

        return ATSAnalysis(
            overall_ats_score=overall_ats,
            readability_score=readability_score,
            formatting_score=formatting_score,
            keyword_score=keyword_score,
            quantifiable_metrics_score=quant_score,
            section_health=section_health,
            formatting_issues=issues,
            actionable_fixes=fixes
        )
