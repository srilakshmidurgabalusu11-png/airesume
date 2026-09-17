import React from 'react';
import { 
  Check, 
  AlertCircle, 
  Zap, 
  HelpCircle, 
  Cpu, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const SkillGapRadar = ({ skillGaps }) => {
  if (!skillGaps) return null;

  const {
    matched_hard_skills = [],
    matched_soft_skills = [],
    missing_critical_skills = [],
    missing_preferred_skills = [],
    transferable_skills = [],
    skill_match_percentage = 0
  } = skillGaps;

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu size={18} color="var(--accent-primary)" />
            Step 2: Skill-Gap Identification & Taxonomy Alignment
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Comparing extracted candidate skills with Target Job Requisition competencies via NLP Taxonomy.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Target Skill Match</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: skill_match_percentage >= 70 ? '#10b981' : skill_match_percentage >= 50 ? '#f59e0b' : '#f43f5e' }}>
              {skill_match_percentage}%
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div style={{ width: '100%', height: '8px', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden', marginBottom: '1.5rem' }}>
        <div
          style={{
            height: '100%',
            width: `${skill_match_percentage}%`,
            background: skill_match_percentage >= 70 ? 'linear-gradient(90deg, #10b981, #06b6d4)' : 'linear-gradient(90deg, #f59e0b, #f43f5e)',
            borderRadius: '4px',
            transition: 'width 1s ease'
          }}
        />
      </div>

      {/* Skills Classification Matrix */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 250px), 1fr))', gap: '1rem' }}>
        
        {/* 1. Matched Hard Skills */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Check size={15} />
              Matched Core Hard Skills ({matched_hard_skills.length})
            </span>
            <span className="badge badge-emerald">Verified</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {matched_hard_skills.length > 0 ? (
              matched_hard_skills.map((skill, idx) => (
                <span key={idx} className="badge badge-emerald" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                  <Check size={12} /> {skill}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No direct hard skill overlap detected.</span>
            )}
          </div>
        </div>

        {/* 2. Missing Critical Skills (The Gaps) */}
        <div className="glass-card" style={{ borderColor: missing_critical_skills.length > 0 ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-glass)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <AlertCircle size={15} />
              Missing Critical Skills ({missing_critical_skills.length})
            </span>
            <span className="badge badge-rose">Attention</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {missing_critical_skills.length > 0 ? (
              missing_critical_skills.map((skill, idx) => (
                <span key={idx} className="badge badge-rose" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                  ! {skill}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: '#10b981' }}>Outstanding! All mandatory requisition skills present.</span>
            )}
          </div>
        </div>

        {/* 3. Missing Preferred / Bonus Skills */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Zap size={15} />
              Missing Secondary / Preferred ({missing_preferred_skills.length})
            </span>
            <span className="badge badge-amber">Optional</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {missing_preferred_skills.length > 0 ? (
              missing_preferred_skills.map((skill, idx) => (
                <span key={idx} className="badge badge-amber" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                  {skill}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No secondary gaps identified.</span>
            )}
          </div>
        </div>

        {/* 4. Transferable & Soft Skills */}
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#818cf8', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={15} />
              Transferable & Soft Skills ({matched_soft_skills.length + transferable_skills.length})
            </span>
            <span className="badge badge-indigo">Bonus</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {matched_soft_skills.map((skill, idx) => (
              <span key={`soft-${idx}`} className="badge badge-cyan" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                {skill}
              </span>
            ))}
            {transferable_skills.map((skill, idx) => (
              <span key={`trans-${idx}`} className="badge badge-indigo" style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
                {skill}
              </span>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default SkillGapRadar;
