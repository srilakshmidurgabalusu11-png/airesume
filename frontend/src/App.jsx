import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import Header from './components/common/Header';
import CandidatePortal from './components/candidate/CandidatePortal';
import RecruiterPortal from './components/recruiter/RecruiterPortal';
import AnalyticsPortal from './components/analytics/AnalyticsPortal';
import AdminPortal from './components/admin/AdminPortal';
import { Sparkles, GraduationCap } from 'lucide-react';

export const App = () => {
  const activePortal = useSelector((state) => state.ui.activePortal);
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-container">
      {/* Top Universal Header */}
      <Header />

      {/* Main Content Area */}
      <main style={{ minHeight: 'calc(100vh - 240px)' }}>
        {activePortal === 'candidate' && <CandidatePortal />}
        {activePortal === 'recruiter' && <RecruiterPortal />}
        {activePortal === 'analytics' && <AnalyticsPortal />}
        {activePortal === 'admin' && <AdminPortal />}
      </main>

      {/* Academic Capstone Footer */}
      <footer style={{ 
        marginTop: '3rem', 
        borderTop: '1px solid var(--border-glass)', 
        paddingTop: '1.5rem', 
        textAlign: 'center', 
        color: 'var(--text-muted)', 
        fontSize: '0.8rem',
        lineHeight: 1.6
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '0.4rem', color: 'var(--text-primary)', fontWeight: 600 }}>
          <GraduationCap size={16} color="var(--accent-primary)" />
          <span>CSE Master's Final Year Capstone Project</span>
        </div>
        <div>
          <strong>AI-Powered Resume Screening and Candidate Intelligence System</strong>
        </div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
          Project Members: B. Sri Lakshmi Durga (233B1A0411) • M. Karunya Durga Lakshmi (233B1A0461) • V. BVS Durgaprasad (233B1A0438) • Y. Tataji (233B1A0404) • M. MSS Prasad (233B1A0450)
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Tech Stack: Python 3.13 (FastAPI, scikit-learn, PyPDF) • Google Gemini LLM • React 19 • Redux Toolkit
        </div>
      </footer>
    </div>
  );
};

export default App;
