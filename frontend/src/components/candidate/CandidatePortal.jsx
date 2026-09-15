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
      <ResumeUploader />

      {/* Results Section when evaluated */}
      {activeCandidate && (
        <>
          <ATSScoreCard candidate={activeCandidate} />
          <SkillGapRadar skillGaps={activeCandidate.skill_gap_analysis} />
          <BulletRewriter improvements={activeCandidate.resume_improvements} />
          <MockInterview questions={activeCandidate.interview_questions} />
          <AICareerCoach candidate={activeCandidate} />
        </>
      )}
    </div>
  );
};

export default CandidatePortal;
