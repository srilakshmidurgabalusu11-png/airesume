import time
from datetime import datetime
from typing import Dict, Any, List

class TelemetryTracker:
    def __init__(self):
        self.start_time = time.time()
        self.total_resumes_screened: int = 0
        self.total_batch_runs: int = 0
        self.total_gemini_calls: int = 0
        self.estimated_input_tokens: int = 0
        self.estimated_output_tokens: int = 0
        self.total_latency_seconds: float = 0.0
        self.active_model: str = "gemini-2.5-flash"
        self.api_key_configured: bool = False
        self.audit_logs: List[Dict[str, Any]] = []

    def record_screening(self, resume_count: int, latency: float, used_gemini: bool, prompt_tokens: int = 0, completion_tokens: int = 0, status: str = "SUCCESS", details: str = ""):
        self.total_resumes_screened += resume_count
        if resume_count > 1:
            self.total_batch_runs += 1
        if used_gemini:
            self.total_gemini_calls += 1
            self.estimated_input_tokens += prompt_tokens
            self.estimated_output_tokens += completion_tokens
        self.total_latency_seconds += latency

        log_entry = {
            "id": f"log-{len(self.audit_logs) + 1}",
            "timestamp": datetime.now().isoformat(),
            "action": f"Screened {resume_count} resume(s)",
            "status": status,
            "latency_ms": round(latency * 1000, 2),
            "engine": self.active_model if used_gemini else "Hybrid NLP (TF-IDF + Heuristics)",
            "details": details
        }
        # Keep last 100 audit logs
        self.audit_logs.insert(0, log_entry)
        if len(self.audit_logs) > 100:
            self.audit_logs.pop()

    def get_metrics(self) -> Dict[str, Any]:
        uptime_seconds = round(time.time() - self.start_time, 1)
        avg_latency_ms = round((self.total_latency_seconds / max(1, self.total_resumes_screened)) * 1000, 1)
        
        return {
            "total_resumes_screened": self.total_resumes_screened,
            "total_batch_runs": self.total_batch_runs,
            "total_gemini_calls": self.total_gemini_calls,
            "estimated_tokens_used": self.estimated_input_tokens + self.estimated_output_tokens,
            "estimated_cost_usd": round((self.estimated_input_tokens * 0.00000015) + (self.estimated_output_tokens * 0.0000006), 4),
            "avg_latency_ms": avg_latency_ms,
            "uptime_seconds": uptime_seconds,
            "active_model": self.active_model,
            "api_key_configured": self.api_key_configured,
            "recent_audit_logs": self.audit_logs[:20]
        }

telemetry = TelemetryTracker()
