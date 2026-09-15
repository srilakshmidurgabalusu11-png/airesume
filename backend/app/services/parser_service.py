import io
import re
from typing import Dict, List, Any, Optional
import pypdf
import docx
from ..models.schemas import ExtractedResumeData, EducationItem, ExperienceItem, ProjectItem

class DocumentParserService:
    @staticmethod
    def parse_file(filename: str, content_bytes: bytes) -> str:
        ext = filename.lower().split('.')[-1]
        if ext == 'pdf':
            return DocumentParserService._parse_pdf(content_bytes)
        elif ext in ['docx', 'doc']:
            return DocumentParserService._parse_docx(content_bytes)
        elif ext in ['txt', 'md']:
            return content_bytes.decode('utf-8', errors='ignore')
        else:
            return content_bytes.decode('utf-8', errors='ignore')

    @staticmethod
    def _parse_pdf(content_bytes: bytes) -> str:
        try:
            reader = pypdf.PdfReader(io.BytesIO(content_bytes))
            text_parts = []
            for page_num, page in enumerate(reader.pages):
                extracted = page.extract_text()
                if extracted:
                    text_parts.append(extracted)
            return "\n\n".join(text_parts)
        except Exception as e:
            return f"Error extracting PDF: {str(e)}"

    @staticmethod
    def _parse_docx(content_bytes: bytes) -> str:
        try:
            doc = docx.Document(io.BytesIO(content_bytes))
            text_parts = [p.text for p in doc.paragraphs if p.text.strip()]
            for table in doc.tables:
                for row in table.rows:
                    row_text = " | ".join(cell.text.strip() for cell in row.cells if cell.text.strip())
                    if row_text:
                        text_parts.append(row_text)
            return "\n".join(text_parts)
        except Exception as e:
            return f"Error extracting DOCX: {str(e)}"

    @staticmethod
    def extract_structured_data(raw_text: str) -> ExtractedResumeData:
        lines = [line.strip() for line in raw_text.split('\n') if line.strip()]
        
        # 1. Contact information
        email_match = re.search(r'[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+', raw_text)
        email = email_match.group(0) if email_match else None
        
        phone_match = re.search(r'(?:(?:\+|0{0,2})91[\s-]?)?[6789]\d{9}|(?:\+?1[\s-]?)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}', raw_text)
        phone = phone_match.group(0) if phone_match else None

        # Links
        portfolio_links: Dict[str, str] = {}
        github_match = re.search(r'https?://(?:www\.)?github\.com/[a-zA-Z0-9_-]+', raw_text, re.IGNORECASE)
        if github_match:
            portfolio_links["github"] = github_match.group(0)
            
        linkedin_match = re.search(r'https?://(?:www\.)?linkedin\.com/in/[a-zA-Z0-9_-]+', raw_text, re.IGNORECASE)
        if linkedin_match:
            portfolio_links["linkedin"] = linkedin_match.group(0)

        portfolio_match = re.search(r'https?://[a-zA-Z0-9.-]+\.(?:vercel\.app|netlify\.app|github\.io|me|dev|io|org|com)/?[^\s]*', raw_text, re.IGNORECASE)
        if portfolio_match and "linkedin" not in portfolio_match.group(0).lower() and "github" not in portfolio_match.group(0).lower():
            portfolio_links["portfolio"] = portfolio_match.group(0)

        # 2. Extract Candidate Name (First 1-3 lines usually contain the candidate's name)
        name = "Candidate"
        for line in lines[:5]:
            cleaned = re.sub(r'[^a-zA-Z\s.]', '', line).strip()
            # If line has 2 to 4 words, no email or url keywords, it's likely the candidate's name
            words = cleaned.split()
            if 1 <= len(words) <= 4 and not any(k in cleaned.lower() for k in ['resume', 'curriculum', 'cv', 'page', 'profile', 'engineer', 'developer', 'contact', 'email', 'phone']):
                name = cleaned
                break

        # 3. Section Segmentation
        sections = DocumentParserService._segment_sections(lines)

        # 4. Extract Education
        education = DocumentParserService._extract_education(sections.get('education', []))

        # 5. Extract Experience
        experience = DocumentParserService._extract_experience(sections.get('experience', []))

        # 6. Extract Projects
        projects = DocumentParserService._extract_projects(sections.get('projects', []))

        # 7. Extract Skills
        skills_text = " ".join(sections.get('skills', []))
        summary_text = " ".join(sections.get('summary', []))

        return ExtractedResumeData(
            name=name,
            email=email,
            phone=phone,
            summary=summary_text if summary_text else None,
            education=education,
            experience=experience,
            technical_skills=[],  # Populated via nlp_engine taxonomy
            soft_skills=[],
            projects=projects,
            certifications=sections.get('certifications', []),
            portfolio_links=portfolio_links,
            raw_text=raw_text
        )

    @staticmethod
    def _segment_sections(lines: List[str]) -> Dict[str, List[str]]:
        header_patterns = {
            'summary': re.compile(r'^(professional\s+)?(summary|profile|about\s+me|objective)', re.IGNORECASE),
            'experience': re.compile(r'^(work\s+)?(experience|employment|work\s+history|career\s+summary|internships)', re.IGNORECASE),
            'education': re.compile(r'^(education|academic\s+background|qualifications|academic\s+credentials)', re.IGNORECASE),
            'skills': re.compile(r'^(technical\s+)?(skills|technologies|core\s+competencies|tools\s+&\s+technologies)', re.IGNORECASE),
            'projects': re.compile(r'^(projects|academic\s+projects|key\s+projects|personal\s+projects)', re.IGNORECASE),
            'certifications': re.compile(r'^(certifications|licenses|courses|achievements)', re.IGNORECASE),
        }

        sections: Dict[str, List[str]] = {
            'header': [],
            'summary': [],
            'experience': [],
            'education': [],
            'skills': [],
            'projects': [],
            'certifications': [],
            'other': []
        }

        current_section = 'header'
        for line in lines:
            line_str = line.strip()
            # Check if line matches a new section header
            matched_section = None
            if len(line_str) < 40:
                for sec_key, pattern in header_patterns.items():
                    if pattern.match(line_str):
                        matched_section = sec_key
                        break
            
            if matched_section:
                current_section = matched_section
            else:
                sections[current_section].append(line_str)

        return sections

    @staticmethod
    def _extract_education(edu_lines: List[str]) -> List[EducationItem]:
        items = []
        edu_text = "\n".join(edu_lines)
        blocks = re.split(r'\n(?=[A-Z0-9])', edu_text)
        
        for block in blocks:
            if not block.strip():
                continue
            deg_match = re.search(r'(B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?|B\.?S\.?|M\.?S\.?|Bachelor|Master|Ph\.?D|Diploma|Higher Secondary)', block, re.IGNORECASE)
            year_match = re.search(r'(20\d{2}\s*[-–to\s]+\s*(?:20\d{2}|Present|Current)|\b20\d{2}\b)', block)
            gpa_match = re.search(r'(?:GPA|CGPA|Percentage|Grade):\s*([0-9.]+(?:%|/\d+)?)', block, re.IGNORECASE)
            
            degree = deg_match.group(0) if deg_match else "Degree / Academic Record"
            year = year_match.group(0) if year_match else ""
            gpa = gpa_match.group(0) if gpa_match else ""
            institution = block.split('\n')[0].strip()
            
            items.append(EducationItem(
                degree=degree,
                institution=institution,
                year=year,
                gpa=gpa
            ))
        return items if items else [EducationItem(degree="Computer Science & Engineering", institution="University / College")]

    @staticmethod
    def _extract_experience(exp_lines: List[str]) -> List[ExperienceItem]:
        items = []
        curr_item: Optional[ExperienceItem] = None
        
        for line in exp_lines:
            # Check if line looks like a title or company
            date_match = re.search(r'(20\d{2}|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s*[-–]\s*(20\d{2}|Present|Current|Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)', line, re.IGNORECASE)
            if date_match or len(items) == 0 and curr_item is None:
                if curr_item:
                    items.append(curr_item)
                curr_item = ExperienceItem(
                    title=line.split('|')[0].strip() if '|' in line else line,
                    company=line.split('|')[1].strip() if '|' in line else "Enterprise / Organization",
                    duration=date_match.group(0) if date_match else "Recent",
                    highlights=[]
                )
            elif curr_item:
                if line.startswith(('-', '•', '*', '–', '>')) or len(line) > 20:
                    curr_item.highlights.append(line.lstrip('-•*–> '))
        if curr_item:
            items.append(curr_item)
        return items

    @staticmethod
    def _extract_projects(proj_lines: List[str]) -> List[ProjectItem]:
        projects = []
        curr_proj: Optional[ProjectItem] = None
        for line in proj_lines:
            if line.startswith(('-', '•', '*', '–')):
                if curr_proj:
                    curr_proj.description += " " + line.lstrip('-•*– ')
            else:
                if curr_proj:
                    projects.append(curr_proj)
                curr_proj = ProjectItem(
                    name=line.split('|')[0].split(':')[0].strip(),
                    technologies=[],
                    description=line
                )
        if curr_proj:
            projects.append(curr_proj)
        return projects
