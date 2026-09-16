import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedJobId } from '../../../store/candidateSlice';
import { 
  Building2, 
  ChevronDown, 
  Check, 
  Plus, 
  Briefcase,
  Layers
} from 'lucide-react';

export const WorkspaceSwitcher = () => {
  const dispatch = useDispatch();
  const sampleJobs = useSelector((state) => state.candidate.sampleJobs || []);
  const selectedJobId = useSelector((state) => state.candidate.selectedJobId);
  const activePortal = useSelector((state) => state.ui.activePortal);

  const [isOpen, setIsOpen] = useState(false);
  const switcherRef = useRef(null);

  const currentJob = sampleJobs.find(j => j.id === selectedJobId) || sampleJobs[0] || {
    id: 'job-1',
    title: 'Senior Full Stack AI Engineer'
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (switcherRef.current && !switcherRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={switcherRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.45rem',
          padding: '0.35rem 0.65rem',
          borderRadius: '8px',
          background: isOpen ? '#f4f4f5' : '#ffffff',
          border: '1px solid #18181b',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#09090b',
          maxWidth: '220px'
        }}
        title="Active Workspace & Target Requisition"
      >
        <div style={{
          width: '20px',
          height: '20px',
          borderRadius: '5px',
          background: '#09090b',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}>
          <Building2 size={12} />
        </div>
        <div style={{ textAlign: 'left', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          <div style={{ fontSize: '0.78rem', lineHeight: 1.1, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Acme HQ
          </div>
          <div style={{ fontSize: '0.65rem', color: '#71717a', overflow: 'hidden', textOverflow: 'ellipsis', fontWeight: 500 }}>
            {currentJob?.title?.split(' ')[0] || 'Engineering'} Pipeline
          </div>
        </div>
        <ChevronDown size={13} color="#71717a" style={{ flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          width: '280px',
          background: '#ffffff',
          border: '1px solid #18181b',
          borderRadius: '10px',
          boxShadow: '0 12px 28px rgba(0, 0, 0, 0.14)',
          zIndex: 200,
          padding: '0.4rem',
          animation: 'fadeIn 0.12s ease-out'
        }}>
          <div style={{ padding: '0.4rem 0.6rem 0.3rem', fontSize: '0.68rem', fontWeight: 700, color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Active Target Requisition
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
            {sampleJobs.map((job) => {
              const isSelected = job.id === selectedJobId;
              return (
                <div
                  key={job.id}
                  onClick={() => {
                    dispatch(setSelectedJobId(job.id));
                    setIsOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.65rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    background: isSelected ? '#f4f4f5' : 'transparent',
                    border: isSelected ? '1px solid #18181b' : '1px solid transparent',
                    transition: 'all 0.1s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
                    <Briefcase size={14} color={isSelected ? '#09090b' : '#71717a'} style={{ flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.78rem', fontWeight: isSelected ? 700 : 500, color: '#09090b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {job.title}
                      </div>
                      <div style={{ fontSize: '0.66rem', color: '#71717a' }}>
                        {job.experience_required || '2+ years'}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check size={14} color="#09090b" style={{ flexShrink: 0 }} />}
                </div>
              );
            })}
          </div>

          <div style={{ height: '1px', background: '#e4e4e7', margin: '0.35rem 0' }} />

          <div style={{ padding: '0.4rem 0.65rem', fontSize: '0.72rem', color: '#71717a', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={12} />
            <span>Workspace: Production ATS (Live)</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkspaceSwitcher;
