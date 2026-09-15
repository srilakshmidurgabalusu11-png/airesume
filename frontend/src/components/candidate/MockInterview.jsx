import React, { useState } from 'react';
import { 
  HelpCircle, 
  Terminal, 
  Layers, 
  AlertCircle, 
  UserCheck, 
  ChevronDown, 
  ChevronUp, 
  Lightbulb,
  Sparkles
} from 'lucide-react';

export const MockInterview = ({ questions = [] }) => {
  const [expandedId, setExpandedId] = useState(questions[0]?.id || null);

  if (!questions || questions.length === 0) return null;

  const getCategoryBadge = (category) => {
    switch (category) {
      case 'Technical Mastery': return 'badge-indigo';
      case 'System Architecture': return 'badge-cyan';
      case 'Resume Gap Probing': return 'badge-rose';
      case 'Behavioral (STAR)': return 'badge-emerald';
      default: return 'badge-amber';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Technical Mastery': return <Terminal size={15} />;
      case 'System Architecture': return <Layers size={15} />;
      case 'Resume Gap Probing': return <AlertCircle size={15} />;
      default: return <UserCheck size={15} />;
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HelpCircle size={18} color="var(--accent-primary)" />
            Step 4: Tailored Interview Questions & Evaluator Rubric
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Gemini generated questions tailored directly to your resume strengths, listed projects, and identified skill gaps.
          </p>
        </div>
        <span className="badge badge-indigo">
          <Sparkles size={13} />
          {questions.length} Tailored Questions
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        {questions.map((q, idx) => {
          const isExpanded = expandedId === (q.id || idx);
          return (
            <div 
              key={q.id || idx} 
              className="glass-card" 
              style={{ 
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                borderLeft: isExpanded ? '4px solid var(--accent-primary)' : '1px solid var(--border-glass)'
              }}
              onClick={() => setExpandedId(isExpanded ? null : (q.id || idx))}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span className={`badge ${getCategoryBadge(q.category)}`} style={{ fontSize: '0.72rem' }}>
                      {getCategoryIcon(q.category)}
                      {q.category}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Target Context: <strong style={{ color: 'var(--text-secondary)' }}>{q.target_skill_or_project}</strong>
                    </span>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.4 }}>
                    {q.question}
                  </div>
                </div>

                <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', paddingTop: '0.2rem' }}>
                  {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              </div>

              {isExpanded && (
                <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px solid var(--border-glass)' }}>
                  <div style={{ background: 'var(--bg-elevated)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 700, color: '#f59e0b', marginBottom: '0.35rem' }}>
                      <Lightbulb size={14} />
                      Evaluator Rubric / Ideal Response Strategy:
                    </div>
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {q.evaluator_guide}
                    </div>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MockInterview;
