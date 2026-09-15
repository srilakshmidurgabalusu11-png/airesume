import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePortal, toggleTheme } from '../../store/uiSlice';
import { 
  Briefcase, 
  UserCheck, 
  BarChart3, 
  ShieldCheck, 
  Sun, 
  Moon, 
  GraduationCap, 
  Sparkles, 
  Cpu, 
  Users,
  X
} from 'lucide-react';

export const Header = () => {
  const dispatch = useDispatch();
  const activePortal = useSelector((state) => state.ui.activePortal);
  const theme = useSelector((state) => state.ui.theme);
  const activeModel = useSelector((state) => state.admin.activeModel);
  const [showTeamModal, setShowTeamModal] = useState(false);

  const teamMembers = [
    { name: "B. Sri Lakshmi Durga", reg: "233B1A0411", role: "AI & Full Stack Architect" },
    { name: "M. Karunya Durga Lakshmi", reg: "233B1A0461", role: "NLP & ML Engineer" },
    { name: "V. BVS Durgaprasad", reg: "233B1A0438", role: "DevOps & Cloud Engineer" },
    { name: "Y. Tataji", reg: "233B1A0404", role: "Backend Systems Developer" },
    { name: "M. MSS Prasad", reg: "233B1A0450", role: "Frontend & UI Developer" }
  ];

  return (
    <header className="glass-panel" style={{ padding: '0.85rem 1.5rem', marginBottom: '1.75rem', position: 'sticky', top: '1rem', zIndex: 50 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        {/* Brand & Academic Project Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
          }}>
            <Sparkles size={24} color="#ffffff" />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <h1 style={{ fontSize: '1.15rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #818cf8, #38bdf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI-Powered Candidate Intelligence
              </h1>
              <button 
                onClick={() => setShowTeamModal(true)}
                className="badge badge-indigo"
                style={{ cursor: 'pointer', border: 'none' }}
                title="View Master's Project Team Details"
              >
                <GraduationCap size={13} />
                CSE Master's Final Year
              </button>
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Automated Resume Screening • Hybrid Semantic Matching • Gemini LLM • ATS Analytics
            </p>
          </div>
        </div>

        {/* Portal Navigation Switcher */}
        <nav style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', padding: '0.3rem', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
          <button
            onClick={() => dispatch(setActivePortal('candidate'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activePortal === 'candidate' ? 'var(--accent-primary)' : 'transparent',
              color: activePortal === 'candidate' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <UserCheck size={16} />
            Candidate Portal
          </button>

          <button
            onClick={() => dispatch(setActivePortal('recruiter'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activePortal === 'recruiter' ? 'var(--accent-primary)' : 'transparent',
              color: activePortal === 'recruiter' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <Briefcase size={16} />
            Recruiter Portal
          </button>

          <button
            onClick={() => dispatch(setActivePortal('analytics'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activePortal === 'analytics' ? 'var(--accent-primary)' : 'transparent',
              color: activePortal === 'analytics' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <BarChart3 size={16} />
            Analytics
          </button>

          <button
            onClick={() => dispatch(setActivePortal('admin'))}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.5rem 0.95rem',
              borderRadius: '8px',
              border: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: 'pointer',
              background: activePortal === 'admin' ? 'var(--accent-primary)' : 'transparent',
              color: activePortal === 'admin' ? '#ffffff' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
          >
            <ShieldCheck size={16} />
            Admin & AI Hub
          </button>
        </nav>

        {/* System Engine Status & Theme Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div className="badge badge-emerald" style={{ padding: '0.35rem 0.75rem' }} title="Active Gemini LLM Engine">
            <Cpu size={14} />
            <span>{activeModel}</span>
          </div>

          <button
            onClick={() => dispatch(toggleTheme())}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border-glass)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
          >
            {theme === 'dark' ? <Sun size={17} color="#f59e0b" /> : <Moon size={17} color="#6366f1" />}
          </button>
        </div>

      </div>

      {/* Project Team Modal */}
      {showTeamModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '1.75rem', position: 'relative' }}>
            <button 
              onClick={() => setShowTeamModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>CSE Master's Final Year Project</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI-Powered Resume Screening & Candidate Intelligence System</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Project Members (Authors)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {teamMembers.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '0.65rem 0.9rem', borderRadius: '8px' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role}</div>
                    </div>
                    <span className="badge badge-indigo" style={{ fontFamily: 'var(--font-mono)' }}>{m.reg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: 'rgba(99, 102, 241, 0.08)', padding: '0.85rem', borderRadius: '8px', border: '1px solid rgba(99, 102, 241, 0.2)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>Capstone Highlights:</strong> Engineered with Python FastAPI, TF-IDF Vector Space Modeling, Google Gemini 2.5/3.7 Flash LLM, and React Redux Toolkit state architecture.
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
