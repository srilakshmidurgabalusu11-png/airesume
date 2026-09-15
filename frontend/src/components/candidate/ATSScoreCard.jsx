import React from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Target, 
  FileCheck, 
  Hash, 
  Activity, 
  ExternalLink, 
  Code, 
  Globe, 
  Mail, 
  Phone, 
  Sparkles, 
  Award 
} from 'lucide-react';

export const ATSScoreCard = ({ candidate }) => {
  if (!candidate) return null;

  const {
    candidate_name,
    email,
    phone,
    overall_suitability_score,
    technical_fit_score,
    experience_fit_score,
    education_fit_score,
    semantic_similarity_score,
    recommendation,
    executive_summary,
    strengths,
    concerns,
    ats_analysis,
    portfolio_intelligence
  } = candidate;

  // Score color helper
  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981'; // Emerald
    if (score >= 65) return '#6366f1'; // Indigo
    if (score >= 45) return '#f59e0b'; // Amber
    return '#f43f5e'; // Rose
  };

  const getScoreBadge = (rec) => {
    switch (rec) {
      case 'Strong Match': return 'badge-emerald';
      case 'Shortlist': return 'badge-indigo';
      case 'Consider': return 'badge-amber';
      default: return 'badge-rose';
    }
  };

  const atsScore = ats_analysis.overall_ats_score;
  const circumference = 2 * Math.PI * 46; // radius 46
  const strokeDashoffset = circumference - (overall_suitability_score / 100) * circumference;
  const atsStrokeDashoffset = circumference - (atsScore / 100) * circumference;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', marginBottom: '1.5rem' }}>
      
      {/* Candidate Dossier Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1.25rem', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{candidate_name}</h2>
            <span className={`badge ${getScoreBadge(recommendation)}`} style={{ fontSize: '0.82rem', padding: '0.3rem 0.75rem' }}>
              <Award size={14} />
              {recommendation}
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            {email && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Mail size={14} color="var(--accent-primary)" />
                {email}
              </span>
            )}
            {phone && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Phone size={14} color="var(--accent-primary)" />
                {phone}
              </span>
            )}
            {portfolio_intelligence?.github_url && (
              <a 
                href={portfolio_intelligence.github_url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-secondary)', textDecoration: 'none' }}
              >
                <Code size={14} /> GitHub Profile
              </a>
            )}
            {portfolio_intelligence?.linkedin_url && (
              <a 
                href={portfolio_intelligence.linkedin_url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-secondary)', textDecoration: 'none' }}
              >
                <ExternalLink size={14} /> LinkedIn Profile
              </a>
            )}
            {portfolio_intelligence?.portfolio_url && (
              <a 
                href={portfolio_intelligence.portfolio_url} 
                target="_blank" 
                rel="noreferrer" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-secondary)', textDecoration: 'none' }}
              >
                <Globe size={14} /> Live Portfolio
              </a>
            )}
          </div>
        </div>

        {/* Executive Summary Callout */}
        <div style={{ maxWidth: '420px', background: 'var(--bg-elevated)', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid var(--border-glass)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Sparkles size={14} color="var(--accent-primary)" />
            AI Executive Evaluation:
          </div>
          {executive_summary}
        </div>
      </div>

      {/* Dual Gauges: Overall Suitability + ATS Parsability */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.75rem' }}>
        
        {/* Gauge 1: Candidate Suitability Score */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="radial-progress-wrapper" style={{ width: '100px', height: '100px' }}>
            <svg width="100" height="100" className="radial-progress-circle">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={getScoreColor(overall_suitability_score)}
                strokeWidth="9"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 - (overall_suitability_score / 100) * (2 * Math.PI * 42)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="radial-progress-value" style={{ fontSize: '1.35rem', color: getScoreColor(overall_suitability_score) }}>
              {overall_suitability_score}%
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Overall Suitability</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Synthesized ML & Gemini Fit
            </div>
            <span className={`badge ${getScoreBadge(recommendation)}`} style={{ fontSize: '0.7rem' }}>
              {recommendation}
            </span>
          </div>
        </div>

        {/* Gauge 2: ATS Compatibility Score */}
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div className="radial-progress-wrapper" style={{ width: '100px', height: '100px' }}>
            <svg width="100" height="100" className="radial-progress-circle">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="9" />
              <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke={getScoreColor(atsScore)}
                strokeWidth="9"
                strokeDasharray={2 * Math.PI * 42}
                strokeDashoffset={2 * Math.PI * 42 - (atsScore / 100) * (2 * Math.PI * 42)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)' }}
              />
            </svg>
            <div className="radial-progress-value" style={{ fontSize: '1.35rem', color: getScoreColor(atsScore) }}>
              {atsScore}%
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>ATS Compatibility</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Parsability & Layout Health
            </div>
            <span className="badge badge-indigo" style={{ fontSize: '0.7rem' }}>
              {atsScore >= 80 ? 'ATS Friendly' : atsScore >= 65 ? 'Minor ATS Warnings' : 'ATS Risk'}
            </span>
          </div>
        </div>

        {/* Breakdown Metric Stats */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '0.65rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Technical Skill Fit:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: getScoreColor(technical_fit_score) }}>{technical_fit_score}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>TF-IDF Semantic Match:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>{semantic_similarity_score}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Experience Depth Fit:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{experience_fit_score}%</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Portfolio Authenticity:</span>
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)' }}>{portfolio_intelligence?.project_authenticity_score || 75}%</span>
          </div>
        </div>

      </div>

      {/* Section Health Check Row */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={16} color="var(--accent-primary)" />
          ATS Section Parsability Audit:
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.75rem' }}>
          {Object.entries(ats_analysis.section_health).map(([section, info], idx) => (
            <div key={idx} style={{ background: 'var(--bg-elevated)', padding: '0.75rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{section}</span>
                {info.status === 'PASS' ? (
                  <CheckCircle2 size={16} color="#10b981" />
                ) : info.status === 'WARNING' ? (
                  <AlertTriangle size={16} color="#f59e0b" />
                ) : (
                  <XCircle size={16} color="#f43f5e" />
                )}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                {info.message}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & Actionable Fixes Grid */}
      <div className="grid-two-cols" style={{ gap: '1.25rem' }}>
        
        {/* Candidate Strengths */}
        <div className="glass-card">
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#10b981', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CheckCircle2 size={16} />
            Verified Profile Strengths ({strengths.length})
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {strengths.map((s, idx) => (
              <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#10b981', fontWeight: 700 }}>•</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Actionable ATS Improvements */}
        <div className="glass-card">
          <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertTriangle size={16} />
            ATS Recommendations & Fixes ({ats_analysis.actionable_fixes.length})
          </h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {ats_analysis.actionable_fixes.map((fix, idx) => (
              <li key={idx} style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>→</span>
                <span>{fix}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

    </div>
  );
};

export default ATSScoreCard;
