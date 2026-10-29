# Project EUREKA: Autonomous Narrative Governance & Predictive Media Intelligence Platform
### Directorate General of Information and Public Relations (DGIPR), Government of Maharashtra

[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-009688?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.1-black?style=flat&logo=next.js&logoColor=white)](https://nextjs.org)
[![PostgreSQL 16](https://img.shields.io/badge/PostgreSQL-16--alpine-336791?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Neo4j 5.x](https://img.shields.io/badge/Neo4j-5.18-008CC1?style=flat&logo=neo4j&logoColor=white)](https://neo4j.com)
[![Nirdeshak Copilot](https://img.shields.io/badge/Nirdeshak_Copilot-Thesys_C1_%7C_Gemma-FF6F00?style=flat)](context.md)
[![Mem0 Memory](https://img.shields.io/badge/Mem0-Qdrant_Vector_Store-red?style=flat)](context.md)
[![Hermes Agent](https://img.shields.io/badge/Hermes-Nous_Research-8A2BE2?style=flat)](https://hermes-agent.nousresearch.com)
[![Tests Passing](https://img.shields.io/badge/Tests-102_Backend_%7C_22_Frontend_Passed-brightgreen?style=flat)](tests/)

---

## 1. Executive Concept & System Overview

**Project EUREKA** is an autonomous, real-time media intelligence and narrative governance engine engineered for the **Directorate General of Information and Public Relations (DGIPR)**. 

Across Maharashtra's 112+ million citizens and 36 administrative districts, EUREKA functions as an automated "air traffic control system" for public information. It ingests thousands of multi-channel communication events, normalizes regional Indic dialects (Marathi, colloquial Hindi, mixed scripts), correlates them on an interconnected knowledge graph, forecasts where rumors will spread 6 hours in advance, and computes a **rigorous 100-Point District Governance Index**.

```
+---------------------------------------------------------------------------------------------------------------------+
|                                            PROJECT EUREKA HIGH-LEVEL FLOW                                           |
+---------------------------------------------------------------------------------------------------------------------+
|  [Raw Data Inputs]            [Autonomous NLP & Scraper Layer]       [Dual-Engine Brain & Tasks]     [4 Core Pillars]
|  • NewsAPI & Web Crawl4AI --> • Language Detection (MR/HI/EN)    --> • Celery + Redis Task Queue  -> • Volume (25%)
|  • Press Releases & Clippings • Devanagari Normalization (IRF)       • PostgreSQL 16 ACID Store      • TAT Speed (30%)
|  • Fact-Check Tickets         • Google AI Studio Gemini Flash        • Neo4j 5.x Cypher Graph Net    • Sentiment (25%)
|  • Social & Public Discourse  • Hermes Autonomous Agent (RBAC)       • StGNN (6-Hour AI Radar)       • Crisis SLA (20%)
|                               • Triton / INT8 PTQ Inference          • Transactional Outbox Worker   (100-Pt Index)
+---------------------------------------------------------------------------------------------------------------------+
```

### The 4 Core Governance Pillars (100 Points Total)
1. **Information Volume & Saturation (25 Points):** S-curve logistic modeling evaluating proactive government announcements and communications without rewarding spam.
2. **Turnaround Time / Speed of Response (30 Points):** Logarithmic decay penalty grading how quickly administrative rebuttals address emerging issues (Gold standard: $\le$ 45 minutes).
3. **Multilingual Sentiment / Net Sentiment Index (25 Points):** MuRIL neural embeddings and Devanagari NLP evaluating genuine public tone and perception across regional dialects.
4. **Crisis SLA & Rumor Mitigation (20 Points):** Strict binary threshold enforcing zero unrefuted rumors. Lingering rumors beyond 90 minutes immediately drop the score to 0 and trigger state escalation.

---

## 2. Repository Structure

```text
.
├── backend/                             # Project EUREKA FastAPI & AI Engine
│   ├── src/eureka/
│   │   ├── api/                         # FastAPI application & REST routers
│   │   ├── copilot/                     # Governed Nirdeshak Copilot, Thesys C1, Fast-Path Router & Mem0
│   │   │   ├── tools.py                 # 10 governed read-only domain tools
│   │   │   ├── memory.py                # Mem0 + Qdrant with HMAC user pseudonymization
│   │   │   ├── viewspec.py              # Canonical Pydantic ViewSpec builder
│   │   │   ├── openui_generator.py      # Language detection & number grounder
│   │   │   └── router.py                # SSE streaming /api/v1/copilot/query endpoint
│   │   ├── conclusion/                  # 100-point scoring engine & outbox worker
│   │   ├── core/                        # Database engines, Celery app, security config
│   │   ├── hermes/                      # Nous Research Hermes Agent client & tools
│   │   ├── llm/                         # Cloud evaluators & Google AI Studio translator
│   │   ├── models/                      # SQLAlchemy relational models & schemas
│   │   └── stgnn/                       # Spatio-Temporal Graph Neural Network (A3TGCN)
│   ├── tests/                           # Pytest suite (102 passed, 0 failed)
│   └── docker-compose.yml               # Backend multi-profile compose (includes Qdrant)
├── frontend/
│   └── MCC/                             # Maha-Command Center (Next.js 16 App Router)
│       ├── src/
│       │   ├── app/                     # Next.js routes, layouts, and API proxy handlers
│       │   ├── components/copilot/      # CopilotDrawer & OpenUILibrary components
│       │   ├── components/shared/       # GIGW 3.0 & UX4G government HUD components
│       │   └── lib/backendClient.ts     # Resilient bridge between Next.js & FastAPI
│       └── tests/                       # Node test suite (22 passed, 0 failed)
├── docs/                                # Technical decision logs & feature guides
│   ├── COPILOT.md                       # Open UI Copilot technical guide
│   └── DECISIONS.md                     # Pinned dependencies, licenses & probe results
├── docker/                              # Primary infrastructure definitions (Postgres, Neo4j, Qdrant)
├── REPORT.md                            # End-to-end verification and execution evidence
├── context.md                           # Exhaustive technical and architectural manifesto
└── README.md                            # Primary documentation entrypoint
```

---

## 3. Quickstart: Running End-to-End

### Prerequisites
- **Python**: 3.11+ with [`uv`](https://github.com/astral-sh/uv) installed
- **Node.js**: 18+ (Node 20/22 LTS recommended) and `npm`
- **Docker**: Docker Desktop (or Linux Docker engine with Compose v2)

---

### Step 1: Start Database Infrastructure (PostgreSQL 16 & Neo4j 5.x)

Boot the production-configured database containers:

```bash
docker compose -f docker/docker-compose.yml up -d
```

Verify container status:
```bash
docker compose -f docker/docker-compose.yml ps
```
- **PostgreSQL 16**: Port `5433` (DB: `savi_master`, User: `savi_admin`)
- **Neo4j 5.18**: Port `7474` (HTTP Browser) and `7687` (Bolt)

---

### Step 2: Configure Environment Variables

Copy the example configuration files and add your API keys:

```bash
# Root / Backend configuration
cp .env.example backend/.env

# Frontend configuration
cp frontend/MCC/.env.example frontend/MCC/.env.local
```

Required keys in `backend/.env`:
- `GOOGLE_STUDIO_API_KEY`: Google AI Studio API key for Gemini Flash Indic translation.
- `POSTGRES_PORT`: `5433`
- `NEO4J_URI`: `bolt://127.0.0.1:7687`

---

### Step 3: Start the FastAPI Backend Engine

From the `backend` directory:

```powershell
# Windows PowerShell
cd backend
$env:PYTHONPATH="src"
uv run uvicorn eureka.api.main:app --host 127.0.0.1 --port 8000 --reload
```

```bash
# Linux / macOS
cd backend
PYTHONPATH=src uv run uvicorn eureka.api.main:app --host 127.0.0.1 --port 8000 --reload
```

Interactive Documentation:
- **Swagger UI:** [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **Health Check:** [http://127.0.0.1:8000/api/v1/health](http://127.0.0.1:8000/api/v1/health)

---

### Step 4: Start the Next.js Maha-Command Center (MCC)

From the `frontend/MCC` directory:

```bash
cd frontend/MCC
npm install
npm run build
npm start
```

Access the command center portal:
- **MCC Command Center HUD:** [http://localhost:3000](http://localhost:3000)
- **District Performance League Table:** [http://localhost:3000/districts](http://localhost:3000/districts)
- **Crisis 90-Minute SLA War Room:** [http://localhost:3000/crisis](http://localhost:3000/crisis)
- **Executive Operations HUD:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)

---

## 4. Neo4j Spatio-Temporal Knowledge Graph & Web Explorer

Project EUREKA maintains a rich spatio-temporal knowledge graph with **17,020+ active nodes** and **1,500+ relationships** linking canonical events, misinformation claims, government departments, and Maharashtra's 36 districts.

### Accessing the Neo4j Browser
1. Open your browser and navigate to: **[http://localhost:7474](http://localhost:7474)**
2. Connection URL: `bolt://localhost:7687`
3. Username: `neo4j`
4. Password: `savi_graph_secret` *(configured in `docker/docker-compose.yml`)*

### Authoritative Cypher Exploration Queries

#### A. Spatio-Temporal Events & Claims affecting Districts
Visualizes canonical incidents and misinformation claims mapped across Maharashtra:
```cypher
MATCH (d:District)<-[a:AFFECTS]-(e:CanonicalEvent)
OPTIONAL MATCH (e)-[c:CONTAINS_CLAIM]->(claim:Claim)
RETURN d, a, e, c, claim
LIMIT 120;
```

#### B. Inter-District Geographic Border Adjacencies (152 Edges)
Displays the spatial physical border contagion mesh:
```cypher
MATCH (d1:District)-[r:BORDERS]->(d2:District)
RETURN d1, r, d2;
```

#### C. Social Media Provenance & Content Distribution
Displays authors, publications, and social media platforms:
```cypher
MATCH (a:Author)-[r1:AUTHORED]->(c:Content)-[r2:PUBLISHED_ON]->(p:Platform)
RETURN a, r1, c, r2, p
LIMIT 150;
```

#### D. Metamodel Graph Schema
Displays the complete node labels and relationship hierarchy:
```cypher
CALL db.schema.visualization();
```

---

## 5. Hermes Agent & Indic Translation Engine

Project EUREKA integrates the **Hermes Agent** (Nous Research) via its official **API Server protocol** (`/v1/chat/completions`) paired with Google AI Studio's **Gemini Flash** for native Indic dialect processing.

### Sandboxed Deterministic Tools (`agent_tools.py`)
1. `tool_query_all_36_districts(division, include_metrics, sort_by)`: Queries PostgreSQL for all 36 Maharashtra districts (`MH-01` to `MH-36`) with bilingual English/Marathi metadata and computes live 100-Point Composite Governance Scores.
2. `tool_translate_and_normalize(raw_text)`: Calls Gemini Flash to detect regional Indic dialects (Ahirani, Varhadi, Malvani, Dangi, Deshi) and returns deterministic JSON schemas (`marathi_text`, `english_text`, `detected_dialect`, `extracted_district_code`).
3. `tool_stage_dm_rebuttal(ticket_id, district_code, draft_text)`: Stages draft rebuttals in PostgreSQL under `pending_review` status.
4. `tool_execute_dm_signoff(ticket_id, reviewer_id, role, district_code, action)`: Validates that only authenticated District Collectors (`ROLE_DISTRICT_COLLECTOR`) matching the ticket's district can execute sign-offs within the 90-minute SLA window.
5. `tool_sync_neo4j_nodes(district_code, event_id, claim_text)`: Merges District, CanonicalEvent, and Claim nodes into Neo4j via idempotent Cypher transactions.

### System Prompts, RAG & Embeddings Status
- **System Prompts:** Standardized across Hermes Orchestrator (DGIPR executive mandate across 36 districts and 4 pillars), Gemini Flash (Indic dialect taxonomy and GIGW 3.0 formatting), and Groq (sentiment and crisis refutation verification).
- **Graph-RAG:** Implemented via Neo4j 5.18 (17,020+ nodes, 1,500+ edges) traversing spatial district boundaries, events, and claims. Dense vector RAG (e.g., pgvector) is currently inactive.
- **Embeddings:** Multi-representation pipeline comprising MuRIL 768-dim INT8 Indic embeddings, FANG 816-dim multimodal context embeddings, STGNN graph node Laplacian embeddings, and continuous sentiment $[-1.0, 1.0]$ mappings.

### Non-Bypassable Human-in-the-Loop Governance
The autonomous agent is **architecturally prohibited** from autonomously approving or signing off on rebuttals. Autonomous sign-off attempts are intercepted and rejected with HTTP 403 Forbidden.

---

## 6. Automated Testing Suite

The system is validated through automated test suites spanning backend neural pipelines, database outbox workers, RBAC authorization, and frontend security.

### Run Backend Test Suite (Pytest)
```bash
cd backend
uv run pytest tests/ -v
```
**Results:** **86 passed, 1 skipped** across 14 test modules (100% passing):
- `test_hermes_integration.py`: API Server contracts, 409 conflict handling, timeouts, RBAC blocks autonomous signoff.
- `test_hermes_pipeline.py`: 36 districts database querying, Gemini Flash Indic translation, 90m SLA window, Neo4j idempotency, DM queue & router.
- `test_multilingual_translator.py`: Google AI Studio mocked and fallback Indic extraction.
- `test_outbox_worker.py`: PostgreSQL `FOR UPDATE SKIP LOCKED` transactional projection to Neo4j.
- `test_scoring_engine.py`: 100-point composite scoring across Volume, TAT, Sentiment, and Crisis SLA.
- `test_stgnn_pipeline.py`: 36-district graph topology and A3TGCN neural diffusion forecasting.
- `test_triton_inference.py`: INT8 PTQ dynamic batching and zero-PyTorch client.

### Run Frontend Test Suite (Node.js Test Runner)
```bash
cd frontend/MCC
npm test
```
**Results:** **18 passed, 0 failed** across 6 test suites:
- JWT Authentication & 12-Hour TTL Security Suite (Tamper rejection, expiration checks, claim extraction).
- Maha Government Command Center Suite (Fictional officer personas, GIGW 3.0 styling, Konkan data, modular navigation).

### Run Frontend Production Build
```bash
cd frontend/MCC
npm run build
```
**Results:** **29 routes compiled cleanly** in 18.7s with zero TypeScript or webpack errors.

---

## 7. Security & Governance Compliance

- **GIGW 3.0 & UX4G**: Complete compliance with Government of India website design standards and light-theme administrative ergonomics.
- **Role-Based Access Control (RBAC)**: Partitioned across 4 official personas (`ROLE_STATE_ADMIN`, `ROLE_DISTRICT_COLLECTOR`, `ROLE_DIO_DESK`, `ROLE_CABINET_OBSERVER`) with 12-hour cryptographically signed JWTs.
- **Audit Logging**: All human and agent actions write immutable records to `human_review_actions` and `outbox_events`.
- **Zero Real Secret Storage in Code**: All API keys, database credentials, and session secrets are managed strictly through environment variables.

---

## 8. Complete Frontend Endpoints & Route Reference

The Maha-Connect Centre frontend is built with **Next.js 16 (App Router)** and serves **41 compiled routes** with precision component-level skeletons, zero cumulative layout shifts (CLS), and reverse-proxy bridges to the Project EUREKA FastAPI backend (`http://127.0.0.1:8000`).

### 8.1 App Router Pages & Navigation Directory

| Route Path | Page Title / Purpose | Core Components & Responsibilities |
| :--- | :--- | :--- |
| **`/dashboard`** | **State Operations Command Cockpit** | Full 3-Column executive dashboard: Maharashtra GIS Map, District KRA Leaderboard, Omni-Channel News Wire, and 4 KPI telemetry cards. |
| **`/`** | **Root Redirection** | Redirects authenticated sessions directly to `/dashboard`. |
| **`/command-center`** | **Command Center Console** | Executive intelligence command center with multi-stream split monitoring. |
| **`/command-center/pipeline-flow`** | **Real-Time Pipeline Flow** | Live 4-stage pipeline telemetry diagram, throughput velocity, and latency tracking. |
| **`/command-center/raw-ingestion`** | **Raw Media Ingestion** | Live unfiltered ingestion wire across print, social listening, and TV broadcasts. |
| **`/crisis`** | **Crisis Operations & SLA Desk** | 90-Minute statutory Crisis SLA countdown, incident triage, and Collector rebuttal authorization. |
| **`/districts`** | **36 Districts Performance Matrix** | Comprehensive district directory with CPI scores, grievance resolution, and DIO contact details. |
| **`/konkan-index`** | **Konkan Division Specialized Desk** | High-density regional monitoring for Thane, Palghar, Raigad, Ratnagiri, and Sindhudurg. |
| **`/media`** | **Live Broadcast Media Desk** | Live TV news broadcasts, multi-channel media player, and press relays. |
| **`/media-intelligence`** | **Media Intelligence & Sentiment** | AI-driven sentiment trend analysis, topic word clouds, and sentiment channel mix. |
| **`/live-events`** | **Live Event Streaming Desk** | Live streaming relays for CMO briefings, cabinet announcements, and district press meets. |
| **`/live-news`** | **Omni-Channel News Queue** | Searchable real-time wirefeed with platform filters (Twitter/X, Newspaper, WhatsApp, FB, Reddit). |
| **`/press-releases`** | **Press Releases & Lokrajya Vault** | Official press release archive and 5-language Lokrajya digital magazine repository (1-year archive). |
| **`/newspaper`** | **Regional Newspaper Clipping Desk** | Daily regional press clippings across 18 publications with digitized OCR summaries. |
| **`/advertisements`** | **Outdoor Hoardings & Geo-Tag Map** | Statewide outdoor hoardings GIS map, campaign compliance audit, and geotagged impressions. |
| **`/publications`** | **Government Publications Vault** | Gazette notifications, official policy booklets, and government periodicals. |
| **`/reports`** | **Executive Intelligence Reports** | Daily executive performance dossiers, division benchmarks, and exportable PDF reports. |
| **`/fact-check`** | **Fact-Check & Misinformation Desk** | Viral claim verification unit, debunking repository, and official rebuttal bulletins. |
| **`/attendance`** | **DIO Staff Attendance & Presence** | Daily attendance tracking and field readiness for all 36 District Information Offices. |
| **`/activities`** | **District Outreach Activities** | Grassroots outreach campaigns, voter awareness drives, and public field activities. |
| **`/notifications`** | **Alerts & Advisories Hub** | Institutional notification tray, priority advisories, and system broadcast alerts. |
| **`/profile`** | **Officer Profile & Credentials** | Officer administrative credentials, clearance tier, designation, and security tokens. |
| **`/settings`** | **System Configuration & Simulator** | Platform settings, bilingual English-Marathi localization toggle, and RBAC persona switcher. |
| **`/system-monitoring`** | **System Health & Infrastructure** | Uptime monitoring, API latency benchmarks, and background daemon status. |
| **`/system-monitoring/pipeline-flow`** | **Pipeline Architecture Monitor** | Deep pipeline execution metrics, stage latency, and broker queue status. |
| **`/system-monitoring/raw-ingestion`** | **Raw Ingestion Health Desk** | Source health, crawler success rates, and scrapers telemetry. |
| **`/login`** | **Institutional Authentication Gateway** | Dual-mode PIN / Password login, anti-automation security challenge, and 12-hour signed JWT cookies. |

---

### 8.2 Frontend Internal API Endpoints (BFF Layer)

All internal API routes are implemented as Next.js Route Handlers (`src/app/api/`) providing server-side filtering, role validation, and sanitized data delivery:

| Method | Endpoint Path | Functionality & Output |
| :---: | :--- | :--- |
| `GET` | **`/api/dashboard/overview`** | Returns Core KPI Ribbon data: Total Releases, Average Response TAT, Sentiment Index, and Misinformation Tickets. Supports `?role=`, `?district=`, and `?division=` query filters. |
| `GET` | **`/api/districts`** | Returns all 36 Maharashtra districts with CPI rankings, volume scores, crisis SLA scores, and KRA In-Charge officer designations. |
| `GET` | **`/api/districts/points-lost`** | Returns penalty deduction telemetry and SLA points lost per district with root cause audit logs. |
| `GET` | **`/api/crisis/incidents`** | Returns active emergency incidents and misinformation alerts with district-level scoping. |
| `POST` | **`/api/crisis/incidents/[id]/action`** | Executes operational incident action (`authorize`, `issue_advisory`, `request_edits`) with audit logging. |
| `GET` | **`/api/news`** | Returns paginated omni-channel media queue items with filters for `?district=`, `?sentiment=`, `?channel=`, and `?search=`. |
| `POST` | **`/api/news`** | Ingests a new verified news wire item into the live operations stream. |
| `GET` | **`/api/ocr/stream`** | Returns real-time newspaper clipping OCR records with sentiment classifications. |
| `GET` | **`/api/departments/daily-report`** | Returns departmental SLA compliance metrics and response turnaround times. |
| `POST` | **`/api/auth/login`** | Validates officer credentials or security PIN (`8842`) and issues a cryptographically signed 12-hour JWT cookie (`maha_auth_token`). |
| `POST` | **`/api/auth/logout`** | Clears session cookies and invalidates the officer authentication session. |
| `GET` | **`/api/auth/me`** | Validates active JWT cookie/header and returns the authenticated officer's profile, role, and clearance scope. |

---

### 8.3 Backend Reverse Proxy Endpoints (`next.config.mjs` Rewrites)

The Next.js frontend transparently proxies all `/api/v1/*` and `/eureka/*` requests directly to the Project EUREKA FastAPI backend on `http://127.0.0.1:8000`:

| Method | Proxied Path | Target Backend URL | Functionality |
| :---: | :--- | :--- | :--- |
| `GET` | **`/eureka/health`** | `http://127.0.0.1:8000/health` | Project EUREKA subsystem health check (PostgreSQL 16, Neo4j 5.x, Copilot status). |
| `GET` | **`/api/v1/health`** | `http://127.0.0.1:8000/api/v1/health` | Detailed telemetry & microservice health status. |
| `GET` | **`/api/v1/scoring/leaderboard`** | `http://127.0.0.1:8000/api/v1/scoring/leaderboard` | Live 100-Point Composite Governance Index across all 36 Maharashtra districts. |
| `GET` | **`/api/v1/scoring/district/{id}`** | `http://127.0.0.1:8000/api/v1/scoring/district/{id}` | Full 4-pillar score breakdown for a specific district. |
| `GET` | **`/api/v1/scoring/latest`** | `http://127.0.0.1:8000/api/v1/scoring/latest` | Most recent composite index snapshot with pillar decomposition. |
| `POST` | **`/api/v1/auth/token`** | `http://127.0.0.1:8000/api/v1/auth/token` | Generates signed backend JWT token with RBAC role claims. |
| `GET` | **`/api/v1/graph/narrative-clusters`** | `http://127.0.0.1:8000/api/v1/graph/narrative-clusters` | Queries Neo4j narrative knowledge graph clusters and entity triplets. |
| `POST` | **`/api/v1/conclusions/resolve`** | `http://127.0.0.1:8000/api/v1/conclusions/resolve` | Records cross-desk consensus and concludes verified event investigations. |
| `GET` | **`/eureka/docs`** | `http://127.0.0.1:8000/docs` | Interactive Swagger UI API documentation for Project EUREKA. |
