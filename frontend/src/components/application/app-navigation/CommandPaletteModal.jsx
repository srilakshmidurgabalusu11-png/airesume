import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { setActivePortal, toggleTheme } from '../../../store/uiSlice';
import { 
  Search, 
  UserCheck, 
  Briefcase, 
  Sparkles, 
  ArrowRight, 
  Terminal, 
  FileText, 
  CheckCircle2, 
  Layers, 
  Users, 
  X,
  Command
} from 'lucide-react';

export const CommandPaletteModal = ({ isOpen, onClose, onOpenTeamModal }) => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const commandItems = [
    // Navigation / Portals
    {
      id: 'portal-candidate',
      title: 'Switch to Candidate Intelligence Portal',
      category: 'Portals',
      icon: UserCheck,
      action: () => {
        dispatch(setActivePortal('candidate'));
        onClose();
      }
    },
    {
      id: 'portal-recruiter',
      title: 'Switch to Recruiter ATS Pipeline',
      category: 'Portals',
      icon: Briefcase,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
      }
    },
    // Sections
    {
      id: 'sec-scorecard',
      title: 'Jump to ATS Diagnostic Scorecard',
      category: 'Sections',
      icon: CheckCircle2,
      action: () => {
        dispatch(setActivePortal('candidate'));
        onClose();
        setTimeout(() => document.querySelector('#scorecard')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'sec-skill-gaps',
      title: 'Jump to Skill-Gap Matrix',
      category: 'Sections',
      icon: Layers,
      action: () => {
        dispatch(setActivePortal('candidate'));
        onClose();
        setTimeout(() => document.querySelector('#skill-gaps')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'sec-bullet-rewriter',
      title: 'Jump to STAR Bullet Optimizer',
      category: 'Sections',
      icon: Sparkles,
      action: () => {
        dispatch(setActivePortal('candidate'));
        onClose();
        setTimeout(() => document.querySelector('#bullet-rewriter')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'sec-mock-interview',
      title: 'Jump to Mock Interview Rubrics',
      category: 'Sections',
      icon: Terminal,
      action: () => {
        dispatch(setActivePortal('candidate'));
        onClose();
        setTimeout(() => document.querySelector('#mock-interview')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'sec-career-coach',
      title: 'Jump to AI Career Coach & Advisor',
      category: 'Sections',
      icon: Sparkles,
      action: () => {
        dispatch(setActivePortal('candidate'));
        onClose();
        setTimeout(() => document.querySelector('#career-coach')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'sec-batch-upload',
      title: 'Jump to Batch File Screening',
      category: 'Sections',
      icon: FileText,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
        setTimeout(() => document.querySelector('#batch-upload')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'sec-rankings',
      title: 'Jump to Candidate Leaderboard & Rankings',
      category: 'Sections',
      icon: Users,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
        setTimeout(() => document.querySelector('#rankings')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    // Quick Actions
    {
      id: 'act-team-modal',
      title: 'View Project Authors & Architecture',
      category: 'Actions',
      icon: Users,
      action: () => {
        onClose();
        if (onOpenTeamModal) onOpenTeamModal();
      }
    },
    {
      id: 'act-theme',
      title: 'Toggle Theme (Light / Dark Mode)',
      category: 'Actions',
      icon: Sparkles,
      action: () => {
        dispatch(toggleTheme());
        onClose();
      }
    },
    // Benchmark Candidates
    {
      id: 'cand-durga',
      title: 'B. Sri Lakshmi Durga — 92% Match (Senior AI & Full Stack Architect)',
      category: 'Benchmark Candidates',
      icon: UserCheck,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
        setTimeout(() => document.querySelector('#rankings')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'cand-karunya',
      title: 'M. Karunya Durga Lakshmi — 88% Match (NLP & Machine Learning Specialist)',
      category: 'Benchmark Candidates',
      icon: UserCheck,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
        setTimeout(() => document.querySelector('#rankings')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'cand-prasad',
      title: 'V. BVS Durgaprasad — 85% Match (DevOps & Cloud Systems Engineer)',
      category: 'Benchmark Candidates',
      icon: UserCheck,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
        setTimeout(() => document.querySelector('#rankings')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'cand-tataji',
      title: 'Y. Tataji — 81% Match (FastAPI & Backend Systems Developer)',
      category: 'Benchmark Candidates',
      icon: UserCheck,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
        setTimeout(() => document.querySelector('#rankings')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    },
    {
      id: 'cand-mss-prasad',
      title: 'M. MSS Prasad — 83% Match (React & Frontend Systems Developer)',
      category: 'Benchmark Candidates',
      icon: UserCheck,
      action: () => {
        dispatch(setActivePortal('recruiter'));
        onClose();
        setTimeout(() => document.querySelector('#rankings')?.scrollIntoView({ behavior: 'smooth' }), 100);
      }
    }
  ];

  const filteredItems = commandItems.filter(item => 
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.45)',
        backdropFilter: 'blur(6px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '10vh',
        animation: 'fadeIn 0.15s ease-out'
      }}
      onClick={onClose}
    >
      <div 
        style={{
          width: '100%',
          maxWidth: '640px',
          background: '#ffffff',
          borderRadius: '12px',
          border: '1px solid #18181b',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.18)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.85rem 1.25rem',
          borderBottom: '1px solid #e4e4e7',
          gap: '0.75rem'
        }}>
          <Search size={18} color="#71717a" />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Type a command, search candidates, sections, or actions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '0.95rem',
              color: '#09090b',
              background: 'transparent',
              fontFamily: 'inherit'
            }}
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              style={{ background: 'transparent', border: 'none', color: '#a1a1aa', cursor: 'pointer', padding: 0 }}
            >
              <X size={16} />
            </button>
          )}
          <span style={{
            fontSize: '0.7rem',
            padding: '0.2rem 0.45rem',
            background: '#f4f4f5',
            border: '1px solid #e4e4e7',
            borderRadius: '4px',
            color: '#71717a',
            fontWeight: 600
          }}>
            ESC
          </span>
        </div>

        {/* Results List */}
        <div 
          ref={listRef}
          style={{
            maxHeight: '380px',
            overflowY: 'auto',
            padding: '0.5rem'
          }}
        >
          {filteredItems.length === 0 ? (
            <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: '#71717a', fontSize: '0.85rem' }}>
              No commands or candidates found matching "{query}".
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              const ItemIcon = item.icon;
              return (
                <div
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    background: isSelected ? '#f4f4f5' : 'transparent',
                    border: isSelected ? '1px solid #18181b' : '1px solid transparent',
                    transition: 'all 0.1s ease',
                    marginBottom: '0.2rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: isSelected ? '#09090b' : '#f4f4f5',
                      color: isSelected ? '#ffffff' : '#09090b',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid #e4e4e7'
                    }}>
                      <ItemIcon size={14} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#09090b' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#71717a' }}>
                        {item.category}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: isSelected ? '#09090b' : '#a1a1aa' }}>
                    <span style={{ fontSize: '0.72rem', fontWeight: 500 }}>Select</span>
                    <ArrowRight size={13} />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Keyboard Navigation Footer */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.65rem 1.25rem',
          borderTop: '1px solid #e4e4e7',
          background: '#fafafa',
          fontSize: '0.72rem',
          color: '#71717a'
        }}>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <span><kbd style={{ background: '#fff', border: '1px solid #d4d4d8', borderRadius: '3px', padding: '0.1rem 0.35rem' }}>↑↓</kbd> Navigate</span>
            <span><kbd style={{ background: '#fff', border: '1px solid #d4d4d8', borderRadius: '3px', padding: '0.1rem 0.35rem' }}>↵</kbd> Select</span>
            <span><kbd style={{ background: '#fff', border: '1px solid #d4d4d8', borderRadius: '3px', padding: '0.1rem 0.35rem' }}>Esc</kbd> Close</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontWeight: 600, color: '#09090b' }}>
            <Command size={12} />
            <span>Omnibox</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPaletteModal;
