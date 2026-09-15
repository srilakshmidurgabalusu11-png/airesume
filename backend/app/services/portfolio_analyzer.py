import re
from typing import Dict, List
from ..models.schemas import PortfolioIntelligence

class PortfolioAnalyzerService:
    @staticmethod
    def analyze(portfolio_links: Dict[str, str], raw_text: str) -> PortfolioIntelligence:
        github_url = portfolio_links.get("github")
        linkedin_url = portfolio_links.get("linkedin")
        portfolio_url = portfolio_links.get("portfolio")

        insights: List[str] = []
        score = 50

        if github_url:
            score += 20
            insights.append(f"Verified GitHub repository profile link: {github_url}. Validates open-source engineering practices.")
        else:
            insights.append("No public GitHub repository link identified in header. Suggest adding GitHub to showcase code artifacts.")

        if linkedin_url:
            score += 15
            insights.append(f"Professional LinkedIn profile attached: {linkedin_url}. Facilitates recruiter verification.")
        else:
            insights.append("LinkedIn profile not linked in header. Recruiters strongly favor 1-click verification.")

        if portfolio_url:
            score += 15
            insights.append(f"Custom portfolio / deployment domain found: {portfolio_url}. Demonstrates frontend & production deployment skills.")

        # Check for live demo / deployment keywords in text (e.g. vercel.app, heroku, aws, dockerhub)
        deployments = re.findall(r'https?://[a-zA-Z0-9.-]+(?:vercel\.app|netlify\.app|render\.com|fly\.io|pages\.dev)', raw_text, re.IGNORECASE)
        if deployments:
            insights.append(f"Detected {len(deployments)} live web application deployment link(s). Confirms tangible full-stack delivery.")
            score = min(100, score + 10)

        # Check for publication or open source contributions
        if any(k in raw_text.lower() for k in ["ieee", "springer", "arxiv", "acm", "patent", "research paper"]):
            insights.append("Academic research or publication markers detected. Strong intellectual capital signal for Master's candidate.")
            score = min(100, score + 10)

        authenticity_score = min(100, max(40, score))

        return PortfolioIntelligence(
            github_url=github_url,
            linkedin_url=linkedin_url,
            portfolio_url=portfolio_url,
            has_github=bool(github_url),
            has_linkedin=bool(linkedin_url),
            has_portfolio=bool(portfolio_url),
            project_authenticity_score=authenticity_score,
            insights=insights
        )
