import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearComparison, toggleCompareCandidate } from '../../store/recruiterSlice';
import { 
  X, 
  Users, 
  Trophy, 
  Check, 
  AlertCircle, 
  Award, 
  Layers,
  Sparkles,
  BarChart2
} from 'lucide-react';

export const CandidateComparisonModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { batchResults, comparedCandidateIds } = useSelector((state) => state.recruiter);

  if (!isOpen || !batchResults) return null;

  const comparedCandidates = batchResults.ranked_candidates.filter((c) =>
    comparedCandidateIds.includes(c.candidate_id)
  );

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 65) return '#6366f1';
    if (score >= 45) return '#f59e0b';
    return '#f43f5e';
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      backdropFilter: 'blur(6px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: '1.5rem'
    }}>
      <div 
        className="glass-panel modal-content" 
        style={{ 
          width: '100%', 
          maxWidth: '1080px', 
          maxHeight: '90vh', 
          overflowY: 'auto', 
          padding: '2rem',
          position: 'relative' 
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <X size={22} />
        </button>

        {/* Modal Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '1rem' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Users size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Side-by-Side Candidate Comparison Matrix</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Comparing {comparedCandidates.length} candidate profile(s) against requisition: <strong>{batchResults.job_title}</strong>
            </p>
          </div>
        </div>

        {/* Comparative Columns Grid */}
        <div 
          className="touch-scroll-container hide-scrollbar"
          style={{ 
            display: 'grid', 
            gridTemplateColumns: `repeat(${Math.max(1, comparedCandidates.length)}, minmax(260px, 1fr))`, 
            gap: '1.25rem',
            overflowX: 'auto',
            paddingBottom: '1rem',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {comparedCandidates.map((cand, idx) => (
            <div key={cand.candidate_id} className="glass-card" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              
              {/* Candidate Info */}
              <div style={{ textAlign: 'center', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.85rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #06b6d4)', margin: '0 auto 0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.1rem', color: '#fff' }}>
                  {cand.candidate_name.charAt(0)}
                </div>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                  {cand.candidate_name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {cand.email || 'Candidate in Pool'}
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  <span className={`badge ${cand.recommendation === 'Strong Match' ? 'badge-emerald' : cand.recommendation === 'Shortlist' ? 'badge-indigo' : 'badge-amber'}`} style={{ fontSize: '0.72rem' }}>
                    {cand.recommendation}
                  </span>
                </div>
              </div>

              {/* Suitability Score Gauge */}
              <div style={{ textAlign: 'center', background: 'var(--bg-elevated)', padding: '0.75rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Overall Suitability</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: getScoreColor(cand.overall_suitability_score) }}>
                  {cand.overall_suitability_score}%
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--bg-card)', borderRadius: '3px', marginTop: '0.4rem', overflow: 'hidden' }}>
                  <div style={{ width: `${cand.overall_suitability_score}%`, height: '100%', background: getScoreColor(cand.overall_suitability_score), borderRadius: '3px' }} />
                </div>
              </div>

              {/* Score Breakdown Bars */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Technical Fit:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cand.technical_fit_score}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>ATS Parsability:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: getScoreColor(cand.ats_analysis.overall_ats_score) }}>{cand.ats_analysis.overall_ats_score}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Semantic Similarity:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>{cand.semantic_similarity_score}%</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Experience Depth:</span>
                  <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{cand.experience_fit_score}%</span>
                </div>
              </div>

              {/* Matched Skills */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Check size={13} /> Matched Skills ({cand.skill_gap_analysis.matched_hard_skills.length}):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {cand.skill_gap_analysis.matched_hard_skills.slice(0, 5).map((s, i) => (
                    <span key={i} className="badge badge-emerald" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills */}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertCircle size={13} /> Missing Requisition Skills:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {cand.skill_gap_analysis.missing_critical_skills.length > 0 ? (
                    cand.skill_gap_analysis.missing_critical_skills.slice(0, 4).map((s, i) => (
                      <span key={i} className="badge badge-rose" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                        {s}
                      </span>
                    ))
                  ) : (
                    <span style={{ fontSize: '0.72rem', color: '#10b981' }}>None (Full Coverage)</span>
                  )}
                </div>
              </div>

              {/* Executive Assessment Snippet */}
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '0.65rem', borderRadius: '6px', fontStyle: 'italic', lineHeight: 1.4 }}>
                "{cand.executive_summary.slice(0, 140)}..."
              </div>

              {/* Remove from comparison */}
              <button
                onClick={() => dispatch(toggleCompareCandidate(cand.candidate_id))}
                className="btn-secondary"
                style={{ fontSize: '0.72rem', padding: '0.35rem', width: '100%' }}
              >
                Remove from Compare
              </button>

            </div>
          ))}
        </div>

        {/* Modal Footer */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-glass)', paddingTop: '1.25rem', marginTop: '1rem' }}>
          <button
            onClick={() => dispatch(clearComparison())}
            className="btn-secondary"
            style={{ fontSize: '0.82rem' }}
          >
            Clear All Selections
          </button>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ fontSize: '0.82rem' }}
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};

export default CandidateComparisonModal;
