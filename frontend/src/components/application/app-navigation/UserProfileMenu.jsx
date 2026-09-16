import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActivePortal, toggleTheme } from '../../../store/uiSlice';
import { 
  Users, 
  Command, 
  Sun, 
  Moon, 
  RotateCcw, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Check
} from 'lucide-react';

export const UserProfileMenu = ({ 
  isOpen, 
  onClose, 
  onOpenTeamModal, 
  onOpenCommandPalette 
}) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const activePortal = useSelector((state) => state.ui.activePortal);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: '0',
        width: '290px',
        background: '#ffffff',
        border: '1px solid #18181b',
        borderRadius: '12px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
        zIndex: 200,
        overflow: 'hidden',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      {/* Identity Card */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e4e4e7',
        background: '#fafafa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div style={{
            position: 'relative',
            width: '38px',
            height: '38px',
            borderRadius: '50%',
            background: '#09090b',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.82rem',
            border: '1px solid #18181b',
            flexShrink: 0
          }}>
            SL
            <span style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: '#22c55e',
              border: '2px solid #ffffff'
            }} />
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#09090b', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
              B. Sri Lakshmi Durga
            </div>
            <div style={{ fontSize: '0.74rem', color: '#71717a' }}>
              Lead AI & Systems Architect
            </div>
          </div>
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.7rem',
          fontWeight: 600,
          color: '#15803d',
          background: '#f0fdf4',
          padding: '0.2rem 0.5rem',
          borderRadius: '4px',
          border: '1px solid #bbf7d0'
        }}>
          <ShieldCheck size={12} />
          Enterprise Tier • Production ATS Active
        </div>
      </div>

      {/* Action Items */}
      <div style={{ padding: '0.4rem' }}>
        <button
          onClick={() => {
            onClose();
            if (onOpenTeamModal) onOpenTeamModal();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.75rem',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.82rem',
            color: '#09090b',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f4f4f5'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Users size={15} color="#71717a" />
            <span>Project Team & Architecture</span>
          </div>
          <ChevronRight size={14} color="#a1a1aa" />
        </button>

        <button
          onClick={() => {
            onClose();
            if (onOpenCommandPalette) onOpenCommandPalette();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.75rem',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.82rem',
            color: '#09090b',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f4f4f5'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Command size={15} color="#71717a" />
            <span>Command Palette</span>
          </div>
          <span style={{ fontSize: '0.68rem', padding: '0.1rem 0.35rem', background: '#f4f4f5', borderRadius: '3px', border: '1px solid #e4e4e7', color: '#71717a' }}>⌘K</span>
        </button>

        <button
          onClick={() => {
            dispatch(toggleTheme());
            onClose();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0.6rem 0.75rem',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.82rem',
            color: '#09090b',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f4f4f5'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            {theme === 'dark' ? <Sun size={15} color="#d97706" /> : <Moon size={15} color="#71717a" />}
            <span>Theme Mode</span>
          </div>
          <span style={{ fontSize: '0.72rem', color: '#71717a', textTransform: 'capitalize' }}>{theme}</span>
        </button>

        <div style={{ height: '1px', background: '#e4e4e7', margin: '0.35rem 0' }} />

        <button
          onClick={() => {
            window.location.reload();
          }}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            padding: '0.6rem 0.75rem',
            background: 'transparent',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.82rem',
            color: '#dc2626',
            fontWeight: 500,
            cursor: 'pointer',
            textAlign: 'left'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#fef2f2'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <RotateCcw size={15} color="#dc2626" />
          <span>Reset Session State</span>
        </button>
      </div>

      {/* Footer Meta */}
      <div style={{
        padding: '0.5rem 0.85rem',
        background: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        fontSize: '0.68rem',
        color: '#a1a1aa',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>Candidate Intelligence Suite</span>
        <span>v2.5.0</span>
      </div>
    </div>
  );
};

export default UserProfileMenu;
