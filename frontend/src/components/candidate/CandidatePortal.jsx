import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ResumeUploader from './ResumeUploader';
import ATSScoreCard from './ATSScoreCard';
import SkillGapRadar from './SkillGapRadar';
import BulletRewriter from './BulletRewriter';
import MockInterview from './MockInterview';
import AICareerCoach from './AICareerCoach';
import { clearCandidate } from '../../store/candidateSlice';
import { RotateCcw, Sparkles } from 'lucide-react';

export const CandidatePortal = () => {
  const dispatch = useDispatch();
  const { activeCandidate } = useSelector((state) => state.candidate);

  return (
    <div>
      {/* Top Controls when candidate is loaded */}
      {activeCandidate && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
          <button 
            onClick={() => dispatch(clearCandidate())}
            className="btn-secondary"
            style={{ fontSize: '0.82rem', padding: '0.45rem 0.9rem' }}
          >
            <RotateCcw size={14} />
            Screen Another Resume
          </button>
        </div>
      )}

      {/* Input Section */}
      <div id="step-1">
        <ResumeUploader />
      </div>

      {/* Results Section when evaluated */}
      {activeCandidate && (
        <>
          <div id="scorecard"><ATSScoreCard candidate={activeCandidate} /></div>
          <div id="skill-gaps"><SkillGapRadar skillGaps={activeCandidate.skill_gap_analysis} /></div>
          <div id="bullet-rewriter"><BulletRewriter improvements={activeCandidate.resume_improvements} /></div>
          <div id="mock-interview"><MockInterview questions={activeCandidate.interview_questions} /></div>
          <div id="career-coach"><AICareerCoach candidate={activeCandidate} /></div>
        </>
      )}
    </div>
  );
};

export default CandidatePortal;
