import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sendAdvisorMessage, addChatMessage } from '../../store/candidateSlice';
import { 
  Bot, 
  User, 
  Send, 
  Sparkles, 
  MessageSquare, 
  HelpCircle,
  Lightbulb
} from 'lucide-react';

export const AICareerCoach = ({ candidate }) => {
  const dispatch = useDispatch();
  const { chatMessages, isChatLoading, selectedJobId, sampleJobs, customJob, useCustomJob } = useSelector(
    (state) => state.candidate
  );

  const [inputMessage, setInputMessage] = useState('');

  const targetJob = useCustomJob 
    ? { title: customJob.title || 'Technical Role', full_text: customJob.description || '' }
    : (sampleJobs.find(j => j.id === selectedJobId) || { title: 'Technical Role', full_text: '' });

  const handleSend = (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim()) return;

    const userMsg = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: query.trim()
    };

    dispatch(addChatMessage(userMsg));
    setInputMessage('');

    dispatch(sendAdvisorMessage({
      candidate_name: candidate?.candidate_name || 'Candidate',
      resume_text: candidate?.extracted_data?.raw_text || '',
      target_job_title: targetJob.title,
      target_job_description: targetJob.full_text,
      user_message: query.trim(),
      chat_history: chatMessages.map(m => ({ role: m.role, content: m.content }))
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={18} color="var(--accent-primary)" />
            Interactive AI Resume Advisor & Career Coach
          </h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Powered by Google Gemini: Ask questions about resume tailoring, interview strategies, or bridging skill gaps.
          </p>
        </div>
        <span className="badge badge-indigo">
          <Sparkles size={13} />
          Gemini Intelligence
        </span>
      </div>

      {/* Chat Messages Container */}
      <div 
        style={{ 
          background: 'var(--bg-elevated)', 
          borderRadius: '12px', 
          border: '1px solid var(--border-glass)', 
          padding: '1rem', 
          minHeight: '260px', 
          maxHeight: '400px', 
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem',
          marginBottom: '1rem'
        }}
      >
        {chatMessages.map((msg) => (
          <div 
            key={msg.id}
            style={{ 
              display: 'flex', 
              gap: '0.75rem',
              alignItems: 'flex-start',
              flexDirection: msg.role === 'user' ? 'row-reverse' : 'row'
            }}
          >
            <div 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: msg.role === 'user' ? 'var(--accent-secondary)' : 'linear-gradient(135deg, var(--accent-primary), #4338ca)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}
            >
              {msg.role === 'user' ? <User size={16} color="#fff" /> : <Bot size={16} color="#fff" />}
            </div>

            <div 
              style={{ 
                maxWidth: '80%', 
                background: msg.role === 'user' ? 'rgba(6, 182, 212, 0.12)' : 'var(--bg-card)', 
                border: `1px solid ${msg.role === 'user' ? 'rgba(6, 182, 212, 0.3)' : 'var(--border-glass)'}`,
                padding: '0.75rem 1rem', 
                borderRadius: '10px',
                fontSize: '0.85rem',
                lineHeight: 1.5,
                color: 'var(--text-primary)'
              }}
            >
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {msg.content}
              </div>

              {/* Suggested Follow-up Prompts if present */}
              {msg.suggestedPrompts && msg.suggestedPrompts.length > 0 && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-glass)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Lightbulb size={12} color="#f59e0b" /> Suggested next questions:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {msg.suggestedPrompts.map((p, pIdx) => (
                      <button
                        key={pIdx}
                        onClick={() => handleSend(p)}
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-glass)',
                          color: 'var(--accent-secondary)',
                          fontSize: '0.72rem',
                          borderRadius: '6px',
                          padding: '0.2rem 0.55rem',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        {p} →
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isChatLoading && (
          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bot size={16} color="#fff" />
            </div>
            <div style={{ background: 'var(--bg-card)', padding: '0.5rem 0.9rem', borderRadius: '10px', fontSize: '0.82rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={14} className="animate-spin" color="var(--accent-primary)" />
              Gemini is reasoning and formulating response...
            </div>
          </div>
        )}
      </div>

      {/* Input Bar */}
      <div style={{ display: 'flex', gap: '0.65rem' }}>
        <input
          type="text"
          placeholder="Ask AI Career Coach (e.g. 'How can I improve my project bullets?')..."
          className="glass-input"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyPress}
          disabled={isChatLoading}
          style={{ minWidth: 0 }}
        />
        <button
          onClick={() => handleSend()}
          disabled={isChatLoading || !inputMessage.trim()}
          className="btn-primary"
          style={{ padding: '0.65rem 1.25rem', flexShrink: 0 }}
        >
          <Send size={16} />
          Send
        </button>
      </div>

    </div>
  );
};

export default AICareerCoach;
