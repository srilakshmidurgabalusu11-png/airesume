import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  setSelectedCandidateModal, 
  toggleCompareCandidate, 
  clearComparison,
  setSearchQuery,
  setSortBy,
  setStatusFilter 
} from '../../store/recruiterSlice';
import { 
  Trophy, 
  Medal, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Eye, 
  CheckSquare, 
  Square, 
  Download, 
  Users, 
  Award,
  Sparkles,
  Layers,
  ChevronRight
} from 'lucide-react';

export const CandidateRankingTable = ({ onOpenCompareModal }) => {
  const dispatch = useDispatch();
  const { 
    batchResults, 
    comparedCandidateIds, 
    searchQuery, 
    sortBy, 
    statusFilter 
  } = useSelector((state) => state.recruiter);

  if (!batchResults || !batchResults.ranked_candidates || batchResults.ranked_candidates.length === 0) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <Users size={28} color="var(--accent-primary)" />
        </div>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>No Screened Candidates Yet</h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '480px', margin: '0 auto 1.5rem' }}>
          Upload applicant resumes above or click <strong>"Run Master's Benchmark Evaluation"</strong> to populate and rank candidate profiles.
        </p>
      </div>
    );
  }

  const { ranked_candidates, analytics, job_title } = batchResults;

  // Filter and Sort
  let filtered = ranked_candidates.filter((cand) => {
    const matchesSearch = 
      cand.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cand.email && cand.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      cand.skill_gap_analysis.matched_hard_skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = statusFilter === 'ALL' || cand.recommendation === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Sort logic
  filtered.sort((a, b) => {
    if (sortBy === 'technical') return b.technical_fit_score - a.technical_fit_score;
    if (sortBy === 'ats') return b.ats_analysis.overall_ats_score - a.ats_analysis.overall_ats_score;
    if (sortBy === 'experience') return b.experience_fit_score - a.experience_fit_score;
    return b.overall_suitability_score - a.overall_suitability_score;
  });

  const getScoreColor = (score) => {
    if (score >= 80) return '#10b981';
    if (score >= 65) return '#6366f1';
    if (score >= 45) return '#f59e0b';
    return '#f43f5e';
  };

  const getStatusBadge = (rec) => {
    switch (rec) {
      case 'Strong Match': return 'badge-emerald';
      case 'Shortlist': return 'badge-indigo';
      case 'Consider': return 'badge-amber';
      default: return 'badge-rose';
    }
  };

  const exportCSV = () => {
    const headers = ["Rank", "Candidate Name", "Email", "Overall Score", "Technical Fit", "ATS Score", "Recommendation", "Matched Skills", "Missing Skills"];
    const rows = filtered.map((c, i) => [
      i + 1,
      `"${c.candidate_name}"`,
      `"${c.email || ''}"`,
      c.overall_suitability_score,
      c.technical_fit_score,
      c.ats_analysis.overall_ats_score,
      `"${c.recommendation}"`,
      `"${c.skill_gap_analysis.matched_hard_skills.join('; ')}"`,
      `"${c.skill_gap_analysis.missing_critical_skills.join('; ')}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Candidate_Screening_Report_${job_title.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      
      {/* Batch Analytics Bar */}
      {analytics && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 140px), 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Screened</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>{analytics.total_screened}</div>
          </div>
          <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Match Score</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-primary)' }}>{analytics.average_score}%</div>
          </div>
          <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Strong Matches</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>{analytics.strong_matches}</div>
          </div>
          <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Shortlisted</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>{analytics.shortlisted}</div>
          </div>
          <div className="glass-card" style={{ padding: '0.85rem 1rem' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Review / Consider</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>{analytics.consider}</div>
          </div>
        </div>
      )}

      {/* Table Toolbar (Search, Filter, Actions) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        
        {/* Search */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: '240px', maxWidth: '380px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search candidate name, email, or skill..."
              className="glass-input"
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              style={{ paddingLeft: '2.2rem', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Sort & Status Selectors */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Sort:</span>
            <select
              className="glass-select"
              value={sortBy}
              onChange={(e) => dispatch(setSortBy(e.target.value))}
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
            >
              <option value="overall">Overall Score</option>
              <option value="technical">Technical Fit</option>
              <option value="ats">ATS Compatibility</option>
              <option value="experience">Experience Depth</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="glass-select"
              value={statusFilter}
              onChange={(e) => dispatch(setStatusFilter(e.target.value))}
              style={{ width: 'auto', padding: '0.45rem 0.75rem', fontSize: '0.8rem' }}
            >
              <option value="ALL">All Recommendations</option>
              <option value="Strong Match">Strong Match</option>
              <option value="Shortlist">Shortlist</option>
              <option value="Consider">Consider</option>
              <option value="Not Recommended">Not Recommended</option>
            </select>
          </div>

          {/* Compare Button */}
          {comparedCandidateIds.length > 1 && (
            <button
              onClick={onOpenCompareModal}
              className="btn-primary"
              style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            >
              <Users size={14} />
              Compare ({comparedCandidateIds.length}) Candidates
            </button>
          )}

          {/* Export Report */}
          <button
            onClick={exportCSV}
            className="btn-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.8rem' }}
            title="Download CSV report of screened candidates"
          >
            <Download size={14} />
            Export CSV
          </button>

        </div>
      </div>

      {/* Candidate Leaderboard Table */}
      <div className="touch-scroll-container" style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              <th style={{ padding: '0.75rem 0.5rem', width: '40px' }}>Select</th>
              <th style={{ padding: '0.75rem 0.5rem', width: '60px' }}>Rank</th>
              <th style={{ padding: '0.75rem 1rem' }}>Candidate</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>Overall Score</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>Technical Fit</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>ATS Score</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>Top Matched Skills</th>
              <th style={{ padding: '0.75rem 0.85rem' }}>Recommendation</th>
              <th style={{ padding: '0.75rem 0.85rem', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((cand, idx) => {
              const isSelected = comparedCandidateIds.includes(cand.candidate_id);
              const rank = idx + 1;
              return (
                <tr 
                  key={cand.candidate_id || idx}
                  style={{ 
                    borderBottom: '1px solid var(--border-glass)',
                    background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent',
                    transition: 'background 0.2s ease'
                  }}
                  className="table-row-hover"
                >
                  {/* Selection Checkbox */}
                  <td style={{ padding: '0.85rem 0.5rem', textAlign: 'center' }}>
                    <button
                      onClick={() => dispatch(toggleCompareCandidate(cand.candidate_id))}
                      style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isSelected ? 'var(--accent-primary)' : 'var(--text-muted)' }}
                      title="Select for Side-by-Side Comparison"
                    >
                      {isSelected ? <CheckSquare size={17} color="var(--accent-primary)" /> : <Square size={17} />}
                    </button>
                  </td>

                  {/* Rank */}
                  <td style={{ padding: '0.85rem 0.5rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
                    {rank === 1 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#f59e0b' }}>
                        <Trophy size={16} /> #1
                      </span>
                    ) : rank === 2 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#94a3b8' }}>
                        <Medal size={15} /> #2
                      </span>
                    ) : rank === 3 ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: '#b45309' }}>
                        <Medal size={15} /> #3
                      </span>
                    ) : (
                      `#${rank}`
                    )}
                  </td>

                  {/* Candidate Name & Contact */}
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                      {cand.candidate_name}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {cand.email || 'Candidate in Pool'}
                    </div>
                  </td>

                  {/* Overall Suitability */}
                  <td style={{ padding: '0.85rem 0.85rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '60px', height: '6px', background: 'var(--bg-elevated)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${cand.overall_suitability_score}%`, height: '100%', background: getScoreColor(cand.overall_suitability_score), borderRadius: '3px' }} />
                      </div>
                      <span style={{ fontWeight: 800, fontFamily: 'var(--font-mono)', color: getScoreColor(cand.overall_suitability_score) }}>
                        {cand.overall_suitability_score}%
                      </span>
                    </div>
                  </td>

                  {/* Technical Fit */}
                  <td style={{ padding: '0.85rem 0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 600 }}>
                    {cand.technical_fit_score}%
                  </td>

                  {/* ATS Score */}
                  <td style={{ padding: '0.85rem 0.85rem', fontFamily: 'var(--font-mono)', fontWeight: 600, color: getScoreColor(cand.ats_analysis.overall_ats_score) }}>
                    {cand.ats_analysis.overall_ats_score}%
                  </td>

                  {/* Top Matched Skills */}
                  <td style={{ padding: '0.85rem 0.85rem' }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: '220px' }}>
                      {cand.skill_gap_analysis.matched_hard_skills.slice(0, 3).map((s, sIdx) => (
                        <span key={sIdx} className="badge badge-cyan" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                          {s}
                        </span>
                      ))}
                      {cand.skill_gap_analysis.matched_hard_skills.length > 3 && (
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                          +{cand.skill_gap_analysis.matched_hard_skills.length - 3}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Recommendation */}
                  <td style={{ padding: '0.85rem 0.85rem' }}>
                    <span className={`badge ${getStatusBadge(cand.recommendation)}`} style={{ fontSize: '0.72rem' }}>
                      {cand.recommendation}
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '0.85rem 0.85rem', textAlign: 'right' }}>
                    <button
                      onClick={() => dispatch(setSelectedCandidateModal(cand))}
                      className="btn-secondary"
                      style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      title="Inspect Candidate Dossier"
                    >
                      <Eye size={13} />
                      Dossier
                    </button>
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default CandidateRankingTable;
