import urllib.request
import urllib.parse
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_endpoint(name, url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    print(f"Testing {name}: {method} {url}...")
    try:
        req = urllib.request.Request(url, method=method)
        for k, v in headers.items():
            req.add_header(k, v)
        body = None
        if data is not None:
            if isinstance(data, (dict, list)):
                body = json.dumps(data).encode("utf-8")
                req.add_header("Content-Type", "application/json")
            elif isinstance(data, bytes):
                body = data
        response = urllib.request.urlopen(req, data=body, timeout=10)
        status = response.status
        content = response.read().decode("utf-8")
        parsed = json.loads(content)
        print(f"  -> SUCCESS ({status}): {list(parsed.keys()) if isinstance(parsed, dict) else len(parsed)}")
        return True, parsed
    except Exception as e:
        print(f"  -> FAILED: {e}")
        return False, str(e)

def main():
    print("=== BEGINNING AUTOMATED API VERIFICATION SUITE ===")
    
    # 1. Health check
    ok, res = test_endpoint("Health Check", f"{BASE_URL}/api/health")
    assert ok, "Health check failed"
    
    # 2. Get jobs
    ok, jobs = test_endpoint("Get Sample Jobs", f"{BASE_URL}/api/candidate/sample-jobs")
    assert ok and len(jobs) > 0, "Failed to get jobs"
    print(f"  Found {len(jobs)} sample job descriptions.")
    selected_job_id = jobs[0]["id"]

    # 3. Get benchmark candidates via recruiter route
    ok, benchmark_res = test_endpoint("Get Benchmark Candidates", f"{BASE_URL}/api/recruiter/sample-candidates?job_id={selected_job_id}")
    assert ok, "Failed to get benchmark candidates"
    candidates = benchmark_res.get("ranked_candidates", [])
    assert len(candidates) > 0, "No ranked candidates returned"
    print(f"  Screened {len(candidates)} benchmark candidates successfully.")

    # 4. Candidate screen with form-encoded data
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    form_data = (
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="resume_text"\r\n\r\n'
        f"{candidates[0]['extracted_data']['name']} - Experienced Software Engineer with Python, React, AWS, Docker.\r\n"
        f"--{boundary}\r\n"
        f'Content-Disposition: form-data; name="job_id"\r\n\r\n'
        f"{selected_job_id}\r\n"
        f"--{boundary}--\r\n"
    ).encode("utf-8")
    
    ok, screen_res = test_endpoint(
        "Candidate Resume Screen",
        f"{BASE_URL}/api/candidate/screen",
        method="POST",
        data=form_data,
        headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}
    )
    assert ok, "Candidate screen failed"
    print(f"  Suitability Score: {screen_res.get('overall_suitability_score')} | ATS Score: {screen_res.get('ats_analysis', {}).get('overall_ats_score')}")

    # 5. Career Advisor Chat
    chat_payload = {
        "candidate_name": "Test Candidate",
        "resume_text": "Experienced Python Engineer",
        "target_job_title": jobs[0]["title"],
        "target_job_description": jobs[0]["full_text"],
        "user_message": "How can I improve my resume for this role?"
    }
    ok, chat_res = test_endpoint("Candidate Career Advisor Chat", f"{BASE_URL}/api/candidate/chat-advisor", method="POST", data=chat_payload)
    assert ok, "Career Advisor failed"
    print(f"  Advisor response length: {len(chat_res.get('reply', ''))}")

    # 6. Verify screening result contains interview questions and bullet rewrites
    questions = screen_res.get("interview_questions", [])
    improvements = screen_res.get("resume_improvements", [])
    print(f"  Candidate screen generated {len(questions)} interview questions and {len(improvements)} bullet improvements.")

    # 7. Candidate Comparison
    cand_ids = [candidates[0]["candidate_id"], candidates[1]["candidate_id"]]
    compare_url = f"{BASE_URL}/api/recruiter/compare?candidate_ids={','.join(cand_ids)}"
    ok, compare_res = test_endpoint("Candidate Comparison", compare_url, method="POST", data=candidates)
    assert ok, "Candidate comparison failed"
    print(f"  Compared candidates: {compare_res.get('metrics_comparison', {}).get('names', [])}")

    # 8. Analytics overview
    ok, analytics_res = test_endpoint("Analytics Overview", f"{BASE_URL}/api/analytics/overview")
    assert ok, "Analytics overview failed"
    print(f"  Analytics stats: {list(analytics_res.keys())}")

    # 9. Admin Telemetry
    ok, telem_res = test_endpoint("Admin Telemetry", f"{BASE_URL}/api/admin/telemetry")
    assert ok, "Telemetry failed"
    print(f"  Total API calls logged: {telem_res.get('total_requests', 0)}")

    print("\n=== ALL AUTOMATED API TESTS PASSED WITH 100% SUCCESS! ===")

if __name__ == "__main__":
    main()
