import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setActivePortal, toggleTheme } from '../../../store/uiSlice';
import { 
  UserCheck, 
  Briefcase, 
  Sparkles, 
  Sun, 
  Moon, 
  Search, 
  Bell, 
  Activity, 
  ChevronDown, 
  X, 
  Users, 
  FileText, 
  CheckCircle2, 
  Command, 
  Plus, 
  ShieldCheck, 
  HelpCircle,
  Menu
} from 'lucide-react';
import CommandPaletteModal from './CommandPaletteModal';
import NotificationsPopover from './NotificationsPopover';
import UserProfileMenu from './UserProfileMenu';

export const HeaderNavigationBase = ({
  activeUrl,
  items: propItems,
  subItems: propSubItems,
  brandName = "AI Candidate Intelligence",
  onNavigate
}) => {
  const dispatch = useDispatch();
  const reduxActivePortal = useSelector((state) => state.ui.activePortal);
  const theme = useSelector((state) => state.ui.theme);
  
  // Interactive UI Popover and Modal states
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [activeSubItem, setActiveSubItem] = useState(0);

  // Global Keyboard Shortcut: ⌘K or Ctrl+K to trigger Command Palette
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Primary portal navigation items
  const defaultItems = [
    { label: "Candidate Intelligence", href: "/candidate", id: "candidate", icon: UserCheck },
    { label: "Recruiter ATS Pipeline", href: "/recruiter", id: "recruiter", icon: Briefcase },
  ];

  const items = propItems || defaultItems;

  const currentActiveId = activeUrl 
    ? (items.find(item => item.href === activeUrl || item.id === activeUrl)?.id || reduxActivePortal)
    : reduxActivePortal;

  // Contextual Sub-Navigation items based on active portal
  const portalSubItemsMap = {
    candidate: [
      { label: "1. Upload & Target Job", href: "#step-1" },
      { label: "2. ATS Diagnostic Scorecard", href: "#scorecard" },
      { label: "3. Skill-Gap Matrix", href: "#skill-gaps" },
      { label: "4. STAR Bullet Optimizer", href: "#bullet-rewriter" },
      { label: "5. Mock Interview Rubrics", href: "#mock-interview" },
      { label: "6. AI Career Coach", href: "#career-coach" },
    ],
    recruiter: [
      { label: "Batch File Screening", href: "#batch-upload" },
      { label: "Candidate Leaderboard", href: "#rankings" },
      { label: "Side-by-Side Comparison", href: "#compare" },
      { label: "Active Requisitions", href: "#requisitions" },
    ],
  };

  const subItems = propSubItems || portalSubItemsMap[currentActiveId] || [];

  const handleItemClick = (item) => {
    if (onNavigate) {
      onNavigate(item);
    }
    if (item.id) {
      dispatch(setActivePortal(item.id));
    }
    setActiveSubItem(0);
  };

  const handleSubItemClick = (subItem, index) => {
    setActiveSubItem(index);
    if (subItem.href && subItem.href.startsWith('#')) {
      const targetEl = document.querySelector(subItem.href);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const teamMembers = [
    { name: "B. Sri Lakshmi Durga", reg: "233B1A0411", role: "AI & Full Stack Architect" },
    { name: "M. Karunya Durga Lakshmi", reg: "233B1A0461", role: "NLP & ML Engineer" },
    { name: "V. BVS Durgaprasad", reg: "233B1A0438", role: "DevOps & Cloud Engineer" },
    { name: "Y. Tataji", reg: "233B1A0404", role: "Backend Systems Developer" },
    { name: "M. MSS Prasad", reg: "233B1A0450", role: "Frontend & UI Developer" }
  ];

  return (
    <>
      {/* Full-Width Edge-to-Edge Header */}
      <header 
        style={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 50,
          width: '100%',
          background: '#ffffff',
          borderBottom: '1px solid #18181b',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
          margin: 0,
          padding: 0
        }}
      >
        {/* Tier 1: Primary Enterprise Command Bar (Height ~58px) */}
        <div 
          style={{ 
            width: '100%',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '0.65rem 1rem',
            gap: '1rem',
            borderBottom: subItems.length > 0 ? '1px solid #e4e4e7' : 'none',
            flexWrap: 'nowrap',
            boxSizing: 'border-box'
          }}
        >
          {/* Left Zone: Brand Identity + Workspace Selector + Portal Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
            {/* Enterprise Logo Monogram */}
            <div 
              style={{ 
                width: '36px', 
                height: '36px', 
                borderRadius: '8px', 
                background: '#09090b',
                color: '#ffffff',
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                border: '1px solid #18181b',
                flexShrink: 0
              }}
            >
              <Sparkles size={18} color="#ffffff" />
            </div>

            {/* Brand Title + Enterprise Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span style={{ fontSize: '0.98rem', fontWeight: 800, color: '#09090b', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                {brandName}
              </span>
              <span style={{
                fontSize: '0.66rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                background: '#f4f4f5',
                color: '#71717a',
                padding: '0.15rem 0.4rem',
                borderRadius: '4px',
                border: '1px solid #e4e4e7',
                letterSpacing: '0.04em'
              }}>
                Enterprise
              </span>
            </div>

            <div style={{ width: '1px', height: '22px', background: '#e4e4e7', margin: '0 0.35rem' }} />

            {/* Segmented Portal Switcher */}
            <nav 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem',
                background: '#f4f4f5',
                padding: '0.2rem',
                borderRadius: '8px',
                border: '1px solid #e4e4e7'
              }}
              className="desktop-nav"
            >
              {items.map((item) => {
                const isActive = (item.id && item.id === currentActiveId) || (item.href && item.href === activeUrl);
                const ItemIcon = item.icon;
                return (
                  <button
                    key={item.id || item.label}
                    onClick={() => handleItemClick(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.35rem 0.75rem',
                      borderRadius: '6px',
                      border: isActive ? '1px solid #18181b' : '1px solid transparent',
                      fontSize: '0.78rem',
                      fontWeight: isActive ? 700 : 500,
                      cursor: 'pointer',
                      background: isActive ? '#09090b' : 'transparent',
                      color: isActive ? '#ffffff' : '#52525b',
                      transition: 'all 0.15s ease',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {ItemIcon && <ItemIcon size={14} />}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Zone: Notifications + Theme Toggle + User Profile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
            {/* Notifications Center Trigger */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setNotificationsOpen(!notificationsOpen);
                  setUserMenuOpen(false);
                }}
                style={{
                  position: 'relative',
                  width: '34px',
                  height: '34px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: notificationsOpen ? '#f4f4f5' : '#ffffff',
                  border: '1px solid #18181b',
                  color: '#09090b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="System Telemetry & Alerts"
              >
                <Bell size={15} />
                <span style={{
                  position: 'absolute',
                  top: '-3px',
                  right: '-3px',
                  width: '14px',
                  height: '14px',
                  borderRadius: '50%',
                  background: '#09090b',
                  color: '#ffffff',
                  fontSize: '0.62rem',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1.5px solid #ffffff'
                }}>
                  3
                </span>
              </button>
              <NotificationsPopover 
                isOpen={notificationsOpen} 
                onClose={() => setNotificationsOpen(false)} 
              />
            </div>

            {/* Theme Toggle Button */}
            <button
              onClick={() => dispatch(toggleTheme())}
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#ffffff',
                border: '1px solid #18181b',
                color: '#09090b',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
            >
              {theme === 'dark' ? <Sun size={15} color="#d97706" /> : <Moon size={15} color="#09090b" />}
            </button>

            {/* Enterprise User Profile Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => {
                  setUserMenuOpen(!userMenuOpen);
                  setNotificationsOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.2rem 0.45rem 0.2rem 0.2rem',
                  borderRadius: '20px',
                  background: userMenuOpen ? '#f4f4f5' : '#ffffff',
                  border: '1px solid #18181b',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                title="User Profile & Organization"
              >
                <div 
                  style={{ 
                    width: '28px', 
                    height: '28px', 
                    borderRadius: '50%', 
                    background: '#09090b', 
                    color: '#ffffff', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    fontSize: '0.72rem', 
                    fontWeight: 700 
                  }}
                >
                  SL
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#09090b' }}>
                  Sri Lakshmi
                </span>
                <ChevronDown size={12} color="#71717a" style={{ transform: userMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s ease' }} />
              </button>
              <UserProfileMenu 
                isOpen={userMenuOpen} 
                onClose={() => setUserMenuOpen(false)}
                onOpenTeamModal={() => setShowTeamModal(true)}
                onOpenCommandPalette={() => setCommandPaletteOpen(true)}
              />
            </div>
          </div>
        </div>

        {/* Tier 2: Secondary Contextual Action Bar (Height ~42px) */}
        {subItems.length > 0 && (
          <div 
            style={{ 
              width: '100%',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              padding: '0.4rem 1rem', 
              background: '#fafafa',
              borderTop: '1px solid #e4e4e7',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
              gap: '1rem',
              boxSizing: 'border-box'
            }}
          >
            {/* Context Navigation Tabs */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.7rem', color: '#71717a', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginRight: '0.25rem' }}>
                Workflow Sections:
              </span>
              {subItems.map((sub, sIdx) => {
                const isSubActive = activeSubItem === sIdx;
                return (
                  <button
                    key={sIdx}
                    onClick={() => handleSubItemClick(sub, sIdx)}
                    style={{
                      padding: '0.22rem 0.65rem',
                      borderRadius: '6px',
                      border: isSubActive ? '1px solid #18181b' : '1px solid transparent',
                      background: isSubActive ? '#ffffff' : 'transparent',
                      color: isSubActive ? '#09090b' : '#71717a',
                      fontSize: '0.74rem',
                      fontWeight: isSubActive ? 700 : 500,
                      cursor: 'pointer',
                      boxShadow: isSubActive ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                      transition: 'all 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSubActive) {
                        e.currentTarget.style.color = '#09090b';
                        e.currentTarget.style.background = '#f4f4f5';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSubActive) {
                        e.currentTarget.style.color = '#71717a';
                        e.currentTarget.style.background = 'transparent';
                      }
                    }}
                  >
                    {sub.label}
                  </button>
                );
              })}
            </div>

            {/* Contextual Quick Actions */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
              {currentActiveId === 'candidate' ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 500 }}>
                    Mode: <strong style={{ color: '#09090b' }}>Diagnostic Screening</strong>
                  </span>
                </div>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.72rem', color: '#71717a', fontWeight: 500 }}>
                    Active Pool: <strong style={{ color: '#09090b' }}>6 Candidates Ranked</strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Global Command Palette Modal (⌘K) */}
      <CommandPaletteModal 
        isOpen={commandPaletteOpen} 
        onClose={() => setCommandPaletteOpen(false)}
        onOpenTeamModal={() => setShowTeamModal(true)}
      />

      {/* Project Team & Architecture Modal */}
      {showTeamModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 150,
          padding: '1.5rem'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '1.75rem', position: 'relative', background: '#ffffff', border: '1px solid #18181b' }}>
            <button 
              onClick={() => setShowTeamModal(false)}
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: '#09090b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={22} color="#fff" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#09090b' }}>Project Team & Architecture</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>AI-Powered Resume Screening & Candidate Intelligence System</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '1rem', marginBottom: '1.25rem' }}>
              <h4 style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Project Members (Authors)
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
                {teamMembers.map((m, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-elevated)', padding: '0.65rem 0.9rem', borderRadius: '8px', border: '1px solid var(--border-glass)' }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.88rem', color: '#09090b' }}>{m.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{m.role}</div>
                    </div>
                    <span className="badge badge-indigo" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>{m.reg}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: '#f4f4f5', padding: '0.85rem', borderRadius: '8px', border: '1px solid #18181b', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <strong>System Highlights:</strong> Engineered with Python FastAPI, TF-IDF Vector Space Modeling, Google Gemini LLM reasoning, and React Redux Toolkit state architecture.
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const HeaderNavigationSimpleDemo = () => {
  const defaultItems = [
    { label: "Candidate Intelligence", href: "/candidate", id: "candidate" },
    { label: "Recruiter ATS Pipeline", href: "/recruiter", id: "recruiter" },
  ];
  return <HeaderNavigationBase activeUrl="/candidate" items={defaultItems} />;
};

export default HeaderNavigationBase;
