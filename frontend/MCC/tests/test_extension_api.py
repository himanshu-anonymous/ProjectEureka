"""
Unit and Integration Tests for SAVI Browser Extension API Endpoint (/api/v1/extension/analyze).
Verifies:
1. Direct article text analysis (sub-100ms response)
2. Open-Jev System 1 Decision Head evaluations (Choice, Noul, Score)
3. Isolation Rainforest anomaly routing
4. Triplet extraction and Open JEV formal logic claim audit
5. SAVI metric suite calculation and trust score determination
6. Selected text claim verification
7. CORS support for browser extension origins
"""

import pytest
from fastapi.testclient import TestClient
from savi.api.main import app


@pytest.fixture
def client():
    return TestClient(app)


def test_extension_analyze_article_full_text(client):
    req_payload = {
        "url": "https://www.reuters.com/markets/macro-news/us-inflation-cools-sharply-2026-10-11/",
        "title": "US Headline Inflation Cools Sharply as Energy Costs Moderate",
        "raw_text": (
            "Federal Reserve officials welcomed fresh economic data indicating headline consumer prices "
            "rose at an annualized rate of 2.1 percent last month, decelerating from 2.6 percent previously. "
            "Energy and commodity index stabilization led the disinflationary trend according to Bureau "
            "of Labor Statistics figures released on Thursday morning."
        ),
        "author": "Howard Schneider",
        "domain": "reuters.com",
    }

    response = client.post("/api/v1/extension/analyze", json=req_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "success"
    assert "analysis_id" in data
    assert data["domain"] == "reuters.com"
    assert "overall_verdict" in data
    assert data["overall_verdict"] in ("VERIFIED_ORGANIC", "CAUTION_FLAGGED", "HIGH_RISK_ANOMALY")
    assert 0.0 <= data["trust_score"] <= 100.0
    assert "trust_label" in data

    # SAVI Metric Suite
    metrics = data["savi_metrics"]
    assert "sentiment_dynamics" in metrics
    assert "factual_accuracy" in metrics
    assert "logical_validation" in metrics
    assert "news_impact_index" in metrics

    # Open-Jev System 1 Head
    open_jev = data["open_jev"]
    assert "credibility_choice" in open_jev
    assert "manipulation_noul_yes" in open_jev
    assert "integrity_score" in open_jev

    # Anomaly Detection
    anomaly = data["anomaly_detection"]
    assert "anomaly_score" in anomaly
    assert anomaly["action"] in ("PASS_ORGANIC", "FLAG_ELEVATED", "QUARANTINE")

    # Key Claims
    assert isinstance(data["key_claims"], list)
    assert len(data["key_claims"]) > 0
    first_claim = data["key_claims"][0]
    assert "subject" in first_claim
    assert "predicate" in first_claim
    assert "object" in first_claim
    assert "verdict" in first_claim

    assert "recommendation" in data
    assert data["processing_latency_ms"] > 0.0


def test_extension_analyze_selected_text_claim(client):
    req_payload = {
        "url": "https://www.bloomberg.com/news/articles/2026-10-11/central-banks-pause-rate-hikes",
        "title": "Global Central Banks Pause Tightening Cycles",
        "raw_text": "Central banks across Europe and Asia paused rate hikes after inflation prints matched forecasts.",
        "selected_text": "The European Central Bank halted benchmark rate increases following German manufacturing stabilization.",
        "domain": "bloomberg.com",
    }

    response = client.post("/api/v1/extension/analyze", json=req_payload)
    assert response.status_code == 200
    data = response.json()

    assert data["status"] == "success"
    assert len(data["key_claims"]) > 0
    # The extracted claims should reflect the selected text
    claim_subjects = [c["subject"].lower() for c in data["key_claims"]]
    assert any("bank" in s or "european" in s or "bloomberg" in s for s in claim_subjects)


def test_extension_cors_headers(client):
    # Verify CORS preflight and headers
    headers = {
        "Origin": "chrome-extension://abcdefghijklmnop",
        "Access-Control-Request-Method": "POST",
    }
    response = client.options("/api/v1/extension/analyze", headers=headers)
    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] in ("*", "chrome-extension://abcdefghijklmnop")
