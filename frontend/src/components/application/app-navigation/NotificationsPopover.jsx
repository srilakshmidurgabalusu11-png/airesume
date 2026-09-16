import React, { useState, useEffect, useRef } from 'react';
import { 
  Bell, 
  Check, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  FileText, 
  Layers, 
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export const NotificationsPopover = ({ isOpen, onClose }) => {
  const popoverRef = useRef(null);
  
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Gemini LLM Engine Online',
      description: 'Connected to Gemini reasoning engine via FastAPI backend (200 OK).',
      time: 'Just now',
      read: false,
      icon: Cpu,
      category: 'System'
    },
    {
      id: 2,
      title: 'Hybrid Match Formula Calibrated',
      description: 'Suitability weights verified: 40% Skills, 30% Similarity, 20% Exp, 10% Edu.',
      time: '2m ago',
      read: false,
      icon: Layers,
      category: 'Algorithm'
    },
    {
      id: 3,
      title: 'Candidate Benchmark Pool Ready',
      description: '6 candidate profiles indexed and pre-evaluated for instant recruiter review.',
      time: '5m ago',
      read: false,
      icon: FileText,
      category: 'Pipeline'
    },
    {
      id: 4,
      title: 'ATS Parser Accuracy Verified',
      description: '94.6% extraction precision achieved across PDF, DOCX, and raw text structures.',
      time: '12m ago',
      read: true,
      icon: ShieldCheck,
      category: 'Diagnostics'
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const markItemAsRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? ({ ...n, read: true }) : n));
  };

  if (!isOpen) return null;

  return (
    <div 
      ref={popoverRef}
      style={{
        position: 'absolute',
        top: 'calc(100% + 8px)',
        right: '0',
        width: '360px',
        background: '#ffffff',
        border: '1px solid #18181b',
        borderRadius: '12px',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.14)',
        zIndex: 200,
        overflow: 'hidden',
        animation: 'fadeIn 0.15s ease-out'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0.85rem 1rem',
        borderBottom: '1px solid #e4e4e7',
        background: '#fafafa'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={16} color="#09090b" />
          <span style={{ fontWeight: 700, fontSize: '0.88rem', color: '#09090b' }}>
            System Telemetry & Alerts
          </span>
          {unreadCount > 0 && (
            <span style={{
              fontSize: '0.7rem',
              fontWeight: 700,
              background: '#09090b',
              color: '#fff',
              padding: '0.1rem 0.45rem',
              borderRadius: '9999px'
            }}>
              {unreadCount}
            </span>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.74rem',
              fontWeight: 600,
              color: '#71717a',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem'
            }}
          >
            <Check size={12} />
            Mark all read
          </button>
        )}
      </div>

      {/* Notifications List */}
      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
        {notifications.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => markItemAsRead(item.id)}
              style={{
                display: 'flex',
                gap: '0.75rem',
                padding: '0.8rem 1rem',
                borderBottom: '1px solid #f4f4f5',
                background: item.read ? '#ffffff' : '#fcfcfc',
                cursor: 'pointer',
                transition: 'background 0.15s ease'
              }}
            >
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '8px',
                background: item.read ? '#f4f4f5' : '#09090b',
                color: item.read ? '#71717a' : '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Icon size={15} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.2rem' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: item.read ? 600 : 700, color: '#09090b' }}>
                    {item.title}
                  </span>
                  <span style={{ fontSize: '0.68rem', color: '#a1a1aa' }}>
                    {item.time}
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: '#71717a', margin: 0, lineHeight: 1.4 }}>
                  {item.description}
                </p>
              </div>
              {!item.read && (
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#2563eb',
                  alignSelf: 'center',
                  flexShrink: 0
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div style={{
        padding: '0.6rem 1rem',
        background: '#fafafa',
        borderTop: '1px solid #e4e4e7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        fontSize: '0.72rem',
        color: '#71717a'
      }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#15803d', fontWeight: 600 }}>
          <CheckCircle2 size={13} color="#16a34a" />
          All Services Operational
        </span>
        <span style={{ color: '#a1a1aa' }}>
          Latency: 18ms
        </span>
      </div>
    </div>
  );
};

export default NotificationsPopover;
