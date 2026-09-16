import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchTelemetry, 
  updateGeminiConfig, 
  resetSystemTelemetry,
  setApiKeyInput,
  setActiveModel,
  clearSaveStatus
} from '../../store/adminSlice';
import { 
  ShieldCheck, 
  Cpu, 
  Key, 
  Activity, 
  DollarSign, 
  Zap, 
  RotateCcw, 
  Check, 
  Clock, 
  Database,
  Layers,
  Sparkles,
  Server
} from 'lucide-react';

export const AdminPortal = () => {
  const dispatch = useDispatch();
  const { telemetry, isLoading, activeModel, apiKeyInput, saveStatus } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchTelemetry());
    const interval = setInterval(() => {
      dispatch(fetchTelemetry());
    }, 10000);
    return () => clearInterval(interval);
  }, [dispatch]);

  const handleSaveConfig = (e) => {
    e.preventDefault();
    dispatch(updateGeminiConfig({
      gemini_api_key: apiKeyInput,
      gemini_model: activeModel
    }));
    setTimeout(() => dispatch(clearSaveStatus()), 3500);
  };

  const handleResetTelemetry = () => {
    if (window.confirm("Are you sure you want to reset all operational telemetry counters and logs?")) {
      dispatch(resetSystemTelemetry());
    }
  };

  return (
    <div>
      
      {/* Admin Header */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <ShieldCheck size={24} color="var(--accent-primary)" />
              Administrator Control & AI Intelligence Hub
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Configure Google Gemini API keys, monitor inference latency, inspect live audit logs, and track model telemetry.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => dispatch(fetchTelemetry())}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
            >
              <RotateCcw size={14} />
              Refresh Metrics
            </button>
            <button
              onClick={handleResetTelemetry}
              className="btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem', color: '#f43f5e' }}
            >
              Reset Logs
            </button>
          </div>
        </div>
      </div>

      {/* Operational Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Resumes Screened</span>
            <Layers size={18} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)' }}>
            {telemetry?.total_resumes_screened || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Across {telemetry?.total_batch_runs || 0} batch session(s)
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Gemini LLM Invocations</span>
            <Cpu size={18} color="var(--accent-secondary)" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: 'var(--accent-secondary)' }}>
            {telemetry?.total_gemini_calls || 0}
          </div>
          <div style={{ fontSize: '0.72rem', color: '#10b981', marginTop: '0.2rem' }}>
            Engine: {telemetry?.active_model || activeModel}
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Estimated Tokens</span>
            <Sparkles size={18} color="#a855f7" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#a855f7' }}>
            {(telemetry?.estimated_tokens_used || 0).toLocaleString()}
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Est. Cost: ${telemetry?.estimated_cost_usd || '0.0000'} USD
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Average Inference Latency</span>
            <Zap size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-mono)', color: '#f59e0b' }}>
            {telemetry?.avg_latency_ms || 0} ms
          </div>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Server Uptime: {Math.round((telemetry?.uptime_seconds || 0) / 60)} min
          </div>
        </div>

      </div>

      {/* Model & API Key Configuration Panel */}
      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Key size={18} color="var(--accent-primary)" />
          Google Gemini Model & API Key Configuration
        </h3>

        <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          
          <div className="grid-two-cols" style={{ gap: '1.25rem' }}>
            
            {/* API Key Input */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Google Gemini API Key:
              </label>
              <input
                type="password"
                placeholder={telemetry?.api_key_configured ? "•••••••••••••••••••••••• (Configured)" : "Enter GEMINI_API_KEY..."}
                className="glass-input"
                value={apiKeyInput}
                onChange={(e) => dispatch(setApiKeyInput(e.target.value))}
              />
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Keys are stored in memory or in backend `.env`. The system also features a built-in hybrid fallback engine for offline demonstration.
              </p>
            </div>

            {/* Model Picker */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.4rem' }}>
                Active Gemini Model Selection:
              </label>
              <select
                className="glass-select"
                value={activeModel}
                onChange={(e) => dispatch(setActiveModel(e.target.value))}
              >
                <option value="gemini-2.5-flash">gemini-2.5-flash (Recommended: Fast, Multimodal, 1M Context)</option>
                <option value="gemini-3.7-flash">gemini-3.7-flash (High Performance & Agentic Reasoning)</option>
                <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Lowest Latency High-Throughput)</option>
                <option value="gemini-2.5-pro">gemini-2.5-pro (Complex Research & Coding)</option>
              </select>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                Conforms to latest Google GenAI SDK standards.
              </p>
            </div>

          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className={`badge ${telemetry?.api_key_configured ? 'badge-emerald' : 'badge-amber'}`}>
                {telemetry?.api_key_configured ? 'API Key Active' : 'Offline Intelligent Fallback Ready'}
              </span>
              {saveStatus && (
                <span style={{ fontSize: '0.82rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Check size={14} /> {saveStatus}
                </span>
              )}
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ padding: '0.65rem 1.5rem' }}
            >
              Save Configuration
            </button>
          </div>

        </form>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Activity size={18} color="var(--accent-secondary)" />
          Operational Screening Audit Trail (Last 20 Runs)
        </h3>

        {telemetry?.recent_audit_logs && telemetry.recent_audit_logs.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.82rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Timestamp</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Action</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Inference Engine</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Latency</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Status</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Details</th>
                </tr>
              </thead>
              <tbody>
                {telemetry.recent_audit_logs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: '1px solid var(--border-glass)' }}>
                    <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', fontWeight: 600 }}>
                      {log.action}
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>{log.engine}</span>
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'var(--font-mono)' }}>
                      {log.latency_ms} ms
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem' }}>
                      <span className={`badge ${log.status === 'SUCCESS' ? 'badge-emerald' : 'badge-amber'}`} style={{ fontSize: '0.68rem' }}>
                        {log.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.65rem 0.85rem', color: 'var(--text-secondary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {log.details || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No audit records yet. Screen candidates in the Candidate or Recruiter portal to view live telemetry.
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminPortal;
