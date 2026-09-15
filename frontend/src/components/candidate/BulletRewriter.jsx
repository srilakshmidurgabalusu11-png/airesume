import React, { useState } from 'react';
import { 
  Wand2, 
  Copy, 
  Check, 
  ArrowRight, 
  Sparkles, 
  TrendingUp,
  FileEdit
} from 'lucide-react';

export const BulletRewriter = ({ improvements = [] }) => {
  const [copiedId, setCopiedId] = useState(null);

  if (!improvements || improvements.length === 0) return null;

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Wand2 size={18} color="var(--accent-primary)" />
            Step 3: AI Resume Improvement & Bullet Point Optimizer (STAR Formula)
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Google X-Y-Z formula applied: Transforms generic descriptions into quantified, high-impact accomplishment bullets.
          </p>
        </div>
        <span className="badge badge-indigo">
          <Sparkles size={13} />
          {improvements.length} AI Suggestions
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {improvements.map((item, idx) => (
          <div key={item.id || idx} className="glass-card" style={{ padding: '1.25rem' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--accent-secondary)' }}>
                Target Section: {item.section}
              </span>
              <span className={`badge ${item.priority === 'HIGH' ? 'badge-rose' : 'badge-amber'}`}>
                {item.priority} PRIORITY
              </span>
            </div>

            {/* Before vs After Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.25fr', gap: '1rem', marginBottom: '0.85rem' }}>
              
              {/* Original Weak Bullet */}
              <div style={{ background: 'rgba(244, 63, 94, 0.05)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f43f5e', marginBottom: '0.35rem', textTransform: 'uppercase' }}>
                  Original Bullet (Weak / Passive):
                </div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', fontStyle: 'italic', lineHeight: 1.4 }}>
                  "{item.original_text}"
                </div>
              </div>

              {/* Rewritten STAR Bullet */}
              <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '0.85rem', borderRadius: '8px', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#10b981', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <Sparkles size={13} />
                    Gemini Optimized (Quantified Impact):
                  </div>
                  <button
                    onClick={() => handleCopy(item.id, item.rewritten_text)}
                    style={{
                      background: copiedId === item.id ? '#10b981' : 'var(--bg-elevated)',
                      color: copiedId === item.id ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '6px',
                      padding: '0.2rem 0.6rem',
                      fontSize: '0.72rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s ease'
                    }}
                    title="Copy optimized text to clipboard"
                  >
                    {copiedId === item.id ? <Check size={12} /> : <Copy size={12} />}
                    {copiedId === item.id ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 500, lineHeight: 1.45 }}>
                  {item.rewritten_text}
                </div>
              </div>

            </div>

            {/* Impact Rationale */}
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', background: 'var(--bg-elevated)', padding: '0.6rem 0.85rem', borderRadius: '6px', borderLeft: '3px solid var(--accent-primary)' }}>
              <strong>Executive Impact Rationale:</strong> {item.impact_rationale}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default BulletRewriter;
