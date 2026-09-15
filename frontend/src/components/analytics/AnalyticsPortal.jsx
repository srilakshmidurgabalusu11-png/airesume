import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Award, 
  Target, 
  PieChart, 
  AlertCircle,
  Activity,
  Layers
} from 'lucide-react';

export const AnalyticsPortal = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        const res = await api.getAnalyticsOverview();
        setData(res);
      } catch (err) {
        console.error("Failed to load analytics", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAnalytics();
  }, []);

  if (isLoading) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
        <Activity size={32} className="animate-spin" color="var(--accent-primary)" style={{ margin: '0 auto 1rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Aggregating talent intelligence telemetry...</p>
      </div>
    );
  }

  const { pipeline_funnel = [], top_market_skills = [], score_distribution = [], common_candidate_gaps = [] } = data || {};

  return (
    <div>
      
      {/* Top Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <BarChart3 size={24} color="var(--accent-primary)" />
              Recruitment Intelligence & Talent Market Analytics
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Macro-level analytics across candidate applicant pools, skill supply/demand ratios, and recruitment qualification funnels.
            </p>
          </div>
          <div className="badge badge-indigo" style={{ padding: '0.4rem 0.85rem' }}>
            <Activity size={14} />
            CSE Master's Research Telemetry
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Total Applicants Evaluated</span>
            <Users size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>142</div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
            <TrendingUp size={12} /> +18% compared to last cycle
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Average ATS Parsability</span>
            <Target size={18} color="#06b6d4" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#06b6d4' }}>78.4%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            60% pass threshold (&gt;75 ATS score)
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Interview Shortlist Rate</span>
            <Award size={18} color="#10b981" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#10b981' }}>23.9%</div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            34 candidates qualified for tech rounds
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Screening Cycle Reduction</span>
            <Activity size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>-64%</div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.2rem' }}>
            Down from 4.2 days to 1.5 hours
          </div>
        </div>
      </div>

      {/* Funnel & Score Distribution Grid */}
      <div className="grid-two-cols" style={{ gap: '1.5rem', marginBottom: '1.5rem' }}>
        
        {/* Talent Funnel */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} color="var(--accent-primary)" />
            Recruitment Conversion Funnel
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {pipeline_funnel.map((item, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 600 }}>{item.stage}</span>
                  <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
                    {item.count} candidates ({item.percentage}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '10px', background: 'var(--bg-elevated)', borderRadius: '5px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${item.percentage}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, #6366f1, ${idx === pipeline_funnel.length - 1 ? '#10b981' : '#06b6d4'})`,
                      borderRadius: '5px',
                      transition: 'width 1s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Score Distribution */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <PieChart size={18} color="var(--accent-secondary)" />
            Applicant Suitability Score Distribution
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {score_distribution.map((dist, idx) => {
              const maxCount = 50;
              const barWidth = Math.round((dist.count / maxCount) * 100);
              const color = idx === 0 ? '#10b981' : idx === 1 ? '#6366f1' : idx === 2 ? '#06b6d4' : idx === 3 ? '#f59e0b' : '#f43f5e';
              return (
                <div key={idx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 600 }}>{dist.score_range}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', color }}>
                      {dist.count} candidates
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '10px', background: 'var(--bg-elevated)', borderRadius: '5px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${barWidth}%`,
                        height: '100%',
                        background: color,
                        borderRadius: '5px',
                        transition: 'width 1s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Market Skills & Common Gaps Grid */}
      <div className="grid-two-cols" style={{ gap: '1.5rem' }}>
        
        {/* Top Market Skills */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <TrendingUp size={18} />
            Top Sourced Skills in Applicant Pool
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
            {top_market_skills.map((item, idx) => (
              <div 
                key={idx} 
                className="glass-card" 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.6rem', 
                  padding: '0.6rem 0.9rem',
                  borderRadius: '8px'
                }}
              >
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{item.skill}</span>
                <span className="badge badge-emerald" style={{ fontFamily: 'var(--font-mono)' }}>{item.count} profiles</span>
              </div>
            ))}
          </div>
        </div>

        {/* Common Candidate Skill Gaps */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1.25rem', color: '#f43f5e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertCircle size={18} />
            Most Prevalent Skill Gaps in Market
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {common_candidate_gaps.map((gap, idx) => (
              <div 
                key={idx}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  background: 'var(--bg-elevated)',
                  padding: '0.65rem 0.9rem',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)'
                }}
              >
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{gap.gap}</span>
                <span className="badge badge-rose">
                  Missing in {gap.frequency} candidates
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default AnalyticsPortal;
