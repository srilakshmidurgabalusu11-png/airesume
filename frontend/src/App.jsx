import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePortal } from './store/uiSlice';
import Header from './components/common/Header';
import CandidatePortal from './components/candidate/CandidatePortal';
import RecruiterPortal from './components/recruiter/RecruiterPortal';
import { Sparkles, GraduationCap } from 'lucide-react';

export const App = () => {
  const dispatch = useDispatch();
  const activePortal = useSelector((state) => state.ui.activePortal);
  const theme = useSelector((state) => state.ui.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Ensure activePortal is always valid
  useEffect(() => {
    if (activePortal !== 'candidate' && activePortal !== 'recruiter') {
      dispatch(setActivePortal('candidate'));
    }
  }, [activePortal, dispatch]);

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Top Universal Header (Full Width Edge-to-Edge) */}
      <Header />

      {/* Main Content Area */}
      <div className="app-container" style={{ paddingTop: '1.5rem' }}>
        <main style={{ minHeight: 'calc(100vh - 240px)' }}>
          {activePortal === 'recruiter' ? <RecruiterPortal /> : <CandidatePortal />}
        </main>

      {/* Application Footer */}
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
          <Sparkles size={16} color="var(--accent-primary)" />
          <span>AI-Powered Resume Screening and Candidate Intelligence System</span>
        </div>
        <div style={{ fontSize: '0.75rem', marginTop: '0.2rem' }}>
          Project Authors: B. Sri Lakshmi Durga • M. Karunya Durga Lakshmi • V. BVS Durgaprasad • Y. Tataji • M. MSS Prasad
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Tech Stack: Python 3.13 (FastAPI, scikit-learn, PyPDF) • Google Gemini LLM • React 19 • Redux Toolkit
        </div>
      </footer>
      </div>
    </div>
  );
};

export default App;
