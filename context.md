# Project EUREKA: Executive Concept, Core Pillars & System Architecture
## Autonomous Narrative Governance & Predictive Media Intelligence for Enterprise & State Operations

**Audience:** Venture Capitalists, Executive Stakeholders, Leadership Teams, and Strategic Partners  
**Target Focus:** Conceptual Foundations, 4 Core Analytical Conclusions, System Efficiency, and the Production Ingestion Roadmap  
**Document Purpose:** Clear, non-technical, yet mathematically grounded explanation of how Project EUREKA transforms raw, chaotic public communications into authoritative governance intelligence.

---

## 1. Executive Summary & Investment Thesis

Modern democratic governance and high-stakes enterprise operations face an existential challenge: **the velocity of public narratives vastly outpaces human response capabilities.** 

Across a state like Maharashtra—with 112+ million citizens, 36 diverse districts, and multiple regional languages—a single unverified rumor, local protest, or miscommunicated policy release can trigger statewide unrest, economic panic, or administrative gridlock within minutes. 

Traditional government public relations and corporate media monitoring tools are fundamentally **reactive**:
1. They rely on manual keyword searches and social listening dashboards that report *what already happened*.
2. They cannot correlate physical geography (neighboring borders) with digital information spread.
3. They fail to understand localized linguistic nuances (Marathi, colloquial Hindi, mixed scripts).
4. They provide generic volume graphs rather than an authoritative, auditable score of governance responsiveness.

### The EUREKA Solution
**Project EUREKA** is an autonomous, real-time media intelligence and narrative governance engine designed for the **Directorate General of Information and Public Relations (DGIPR)**, Government of Maharashtra. 

EUREKA acts as an automated "air traffic control system" for public information. It ingests thousands of multi-channel communication events, normalizes Indic regional dialects, correlates them on an interconnected knowledge graph, forecasts where rumors will spread 6 hours in advance, and computes a **rigorous 100-Point District Governance Index**.

```
+---------------------------------------------------------------------------------------------------------------------+
|                                            PROJECT EUREKA HIGH-LEVEL FLOW                                           |
+---------------------------------------------------------------------------------------------------------------------+
|  [Raw Data Inputs]            [Autonomous NLP & Scraper Layer]       [Dual-Engine Brain & Tasks]     [3 Core Pillars]
|  • NewsAPI & Web Crawl4AI --> • Language Detection (MR/HI/EN)    --> • Celery + Redis Task Queue  -> • Volume (35%)
|  • Press Releases & Clippings • Devanagari Normalization (IRF)       • PostgreSQL 16 / SQLite ACID   • Sentiment (35%)
|  • Fact-Check Tickets         • Google AI Studio Gemini Flash        • Neo4j 5.x Cypher Graph Net    • Crisis SLA (30%)
|  • Social & Public Discourse  • Hermes Autonomous Agent (RBAC)       • StGNN (6-Hour AI Radar)       (100-Pt Index)
|                               • Triton / INT8 PTQ Inference          • Transactional Outbox Worker   [TAT Removed (P0)]
+---------------------------------------------------------------------------------------------------------------------+
```

---

## 2. The 3 Core Governance Pillars: What They Are & How EUREKA Concludes Them

At the executive level, leadership does not need raw data dumps; they need **unambiguous, actionable conclusions**. EUREKA synthesizes millions of discrete public signals into **3 Authoritative Governance Pillars** (100 Points Total, following the complete deprecation of the legacy Turnaround Time / TAT parameter per executive directive):

```
+--------------------------------------------------------------------------------------------------+
|                            THE 3 GOVERNANCE PILLARS (100 POINTS TOTAL)                           |
+--------------------------------------------------------------------------------------------------+
|            VOLUME PILLAR (35%)           |                 SENTIMENT PILLAR (35%)                |
|         Proactive Information Flow       |                Public Mood & Tone (NSI)               |
+------------------------------------------+-------------------------------------------------------+
|                                       CRISIS SLA PILLAR (30%)                                    |
|                        Zero-Tolerance Emergency Rebuttal & 90-Min Containment SLA                |
+--------------------------------------------------------------------------------------------------+
```

---

### Pillar 1: Information Volume & Saturation (35 Points)

#### The Plain-English Concept
*Are public administrators proactively communicating government decisions, developmental work, and public notices to the people, or is an information vacuum being left for gossip and speculation?*

#### Why It Matters to Leadership
When public officials do not regularly issue verified releases and factual announcements, alternative or hostile sources fill the void. A high volume of authenticated releases indicates transparent, active governance. However, simply spamming releases without substance must not be rewarded.

#### How EUREKA Concludes This Parameter
1. **Aggregation & Deduplication:** The system captures every official press release, field circular, and media statement generated across a district. It verifies authenticity and eliminates duplicates using cryptographic content fingerprinting.
2. **S-Curve Diminishing Returns Modeling:** Rather than using simple linear counting (where 100 releases would score 10 times higher than 10), EUREKA uses a mathematically tuned **logistic saturation curve (S-Curve)**:
   $$\text{Score} = \text{Minimum}\left(1.0, \; \frac{1}{1 + e^{-k(V - V_{\text{mid}})}}\right)$$
3. **The Executive Outcome:** 
   * A district with low activity (e.g., fewer than 5 releases a month) receives a low score, signaling administrative silence.
   * As releases reach a healthy governance baseline (15 to 30 releases), the score rapidly rises.
   * Beyond an optimal threshold, extra releases offer diminishing returns, ensuring officers focus on meaningful communication rather than artificial inflation.

---

### Historical Note: Removal of TAT (Turnaround Time) Pillar
> [!NOTE]
> Per the executive directive from the DGIPR leadership meeting (Item 11), Turnaround Time (TAT / Speed) has been **completely retired from all scoring calculations, user interface metrics, and copilot intents**.
> 
> To preserve mathematical integrity while summing to 100 points, weights are reallocated to the remaining core governance pillars:
> - **Volume Pillar:** 35 Points (35%)
> - **Sentiment Pillar:** 35 Points (35%)
> - **Crisis SLA Pillar:** 30 Points (30%)
> Database columns (`turnaround_time_mins`) remain non-destructively preserved in schema for historical ingestion audits, but are strictly no longer read by the scoring engine.

---

### Pillar 2: Multilingual Sentiment Analysis & Net Sentiment Index (35 Points)

#### The Plain-English Concept
*What is the genuine mood, tone, and perception of the public regarding government initiatives and local issues in that district?*

#### Why It Matters to Leadership
Standard keyword scrapers look for simple English words like "bad" or "good" and completely fail when handling regional discourse. If rural residents in Marathwada are expressing deep frustration regarding crop insurance delays in colloquial Marathi, central leadership must understand that sentiment immediately, not weeks later after street protests begin.

#### How EUREKA Concludes This Parameter
1. **Indic Language Intelligence (MuRIL):** EUREKA utilizes Google's **MuRIL (Multilingual Representations for Indian Languages)** neural model, specially adapted and quantized for high speed. The engine evaluates Marathi, Hindi, and English text with native understanding of grammar, colloquial expressions, and Devanagari script.
2. **Polarity Scoring:** Every press report, editorial, social post, and citizen comment is assigned an objective polarity score between $-1.0$ (Extremely Critical / Angry) to $+1.0$ (Extremely Positive / Satisfied).
3. **Net Sentiment Index (NSI):** EUREKA normalizes district discourse using the formula:
   $$\text{NSI} = \frac{\text{Positive Mentions} - \text{Negative Mentions}}{\text{Total Mentions}}$$
4. **Governance Pillar Conversion:** An NSI of $+1.0$ translates to the full 35 points; neutral discourse scores around 15–18 points; chronic negative coverage pulls the district score down, signaling a critical communication disconnect.

---

### Pillar 3: Crisis SLA & Rumor Mitigation (30 Points)

#### The Plain-English Concept
*During an emergency or rumor outbreak, did the district administration completely dismantle the misinformation within the mandatory Service Level Agreement (SLA) window?*

#### Why It Matters to Leadership
This is the ultimate test of administrative resilience. A district may have great general news coverage, but if a dangerous rumor (e.g., child kidnapping panic, communal tension, bridge collapse false alarm) goes unverified or unrefuted during a crisis, public safety is compromised.

#### How EUREKA Concludes This Parameter
1. **Fact-Check Ticket Lifecycle:** Whenever an unverified viral claim appears, EUREKA opens a monitored `FactCheck` case tagged to the originating district.
2. **Active Rumor Tracking:** The system monitors the count of pending, unrefuted rumor tickets in that district.
3. **The "Zero Rumors" Critical Rule:** EUREKA enforces a strict, non-negotiable governance condition:
   * **If a district has ZERO unrefuted rumors:** Full 30 points awarded.
   * **If even a single active rumor lingers beyond the SLA window:** The Crisis SLA score drops immediately to **0 points**, and triggers an automated high-priority escalation to the state command center.
4. **No Half-Measures:** By converting crisis handling into an unambiguous binary threshold, EUREKA prevents administrative complacency.

---


---

## 2.1 The 12 Meeting Changes Architecture (Branch `feature/meeting-changes`)

The latest production enhancement sprint addresses twelve critical stakeholder requests in strict priority sequence:

```
+-----------------------------------------------------------------------------------------------------+
|                                 12 MEETING CHANGES DELIVERY MATRIX                                  |
+----+----------+------------------------------------------+------------------------------------------+
| Pr | Item #   | Functionality                            | Implementation Highlights                |
+----+----------+------------------------------------------+------------------------------------------+
| P0 | Item 11  | Remove TAT from Scoring & UI             | 3-pillar model (Vol 35, Sent 35, SLA 30) |
| P1 | Items 4,5| 36 Districts Dummy Data & Positions      | Deterministic seeder, role-scoped APIs   |
| P1 | Item 12  | Live News Ticker                         | Smooth marquee, accessible pause/resume  |
| P1 | Item 9   | Top 5 / Bottom 5 DIO Performance Ranks   | Deterministic sort: CPI > Volume > Name  |
| P2 | Item 1   | DIPR Panel (Nine Dropdowns)              | 9 DGIPR divisions & quick resource links |
| P2 | Item 2,6 | Scheme Hoardings GIS Map & Register      | Census 2011 open-boundary SVG, zero keys |
| P2 | Item 7,8 | In-App Source Detail Viewer              | /sources/[type]/[id] with URL security   |
| P3 | Item 3   | Device Biometric Face Lock               | WebAuthn FIDO2, zero server biometrics   |
| P3 | Item 10  | Live Audio-to-Text Pipeline              | Gemini 2.0 Flash + DemoProvider SSE      |
+----+----------+------------------------------------------+------------------------------------------+
```

## 3. Technology Stack: What We Are Using & Why It Operates So Efficiently

To achieve enterprise-grade scale without runaway cloud infrastructure bills, EUREKA was architected with a strict focus on **cost efficiency, hardware vectorization, and zero-waste asynchronous processing**.

```
+----------------------------------------------------------------------------------------------------+
|                                    TECHNOLOGY & EFFICIENCY MATRIX                                  |
+----------------------------------------------------------------------------------------------------+
| Component             | Technology              | Purpose                     | Operational Edge   |
+-----------------------+-------------------------+-----------------------------+--------------------+
| Relational Storage    | PostgreSQL 16 (ACID)    | Immutable audit ledger      | 100% data integrity|
| Local Datastore       | Embedded SQLite         | Local fallback & dev agility| Zero Docker block  |
| Knowledge Graph       | Neo4j 5.x Graph Engine  | Physical & digital contagion| 17,020+ nodes / ms |
| Graph Ingestion Task  | Asynchronous Cypher     | UNWIND batch graph linking  | Zero lock contention|
| Distributed Queues    | Celery + Redis Streams  | Asynchronous background work| Zero thread blocks |
| Micro-Batching Mesh   | Transactional Outbox    | Syncs Postgres to Graph     | Zero race conditions|
| Autonomous Agent      | Hermes Agent (Nous Res.)| Narrative task planning     | Narrow RBAC sandbox|
| Indic Translation LLM | Google AI Studio Gemini | Devanagari dialect parsing  | Deterministic JSON |
| AI Inference Server   | Triton (NVIDIA Ent.)    | Centralized neural compute  | Dynamic 2ms batch  |
| Model Quantization    | INT8 Post-Training PTQ  | Compresses AI models 75%    | Sub-millisecond CPU|
| Spatio-Temporal AI    | StGNN (A3TGCN Neural)   | 6-hour predictive diffusion | Proactive radar    |
| Indic Language NLP    | MuRIL (Multilingual)    | Marathi/Hindi/English tone  | Native script nuance|
| Cloud NLP & LLM       | Hugging Face & Groq     | Serverless sentiment & SLA  | Zero local weights |
| Autonomous Scraper    | Crawl4AI + NewsAPI v2   | Headless web article ingest | Resilient fallback |
| Frontend Deck (MCC)   | Next.js 16 + Tailwind   | Real-time executive cockpit | GIGW 3.0 / UX4G    |
| Container Platform    | Docker Compose + uv     | Microservices orchestration | Sub-minute builds  |
+----------------------------------------------------------------------------------------------------+
```

### 1. Dual-Engine Brain: PostgreSQL + Neo4j Graph
* **Why Both?** Relational databases (PostgreSQL) are required for strict legal auditing, timestamp logging, user permissions, and tabular scoring. However, relational databases are terrible at asking questions like: *"If a rumor starts in Nashik, how quickly does it hop to Ahmednagar and Pune based on highway corridors and digital share rates?"*
* **The Graph Advantage:** Neo4j models all 36 districts, news sources, government departments, and viral claims as interconnected nodes. EUREKA can traverse 5 degrees of connection across millions of entities in less than 10 milliseconds.
* **Current Operational Topology:**
  * **PostgreSQL 16 Container (`savi-postgres-master` on port 5433):** Houses 26 normalized relational tables (including `canonical_events`, `fact_check_tickets`, `outbox_events`, `media_events`, and `pillar_score_snapshots`).
  * **Neo4j 5.18 Community Container (`savi-neo4j-compute` on ports 7474 HTTP / 7687 Bolt):** Hosts 17,020+ nodes, 1,500+ `AFFECTS` relationships, and 152 `BORDERS` geographic adjacencies with APOC support.
* **Transactional Outbox Architecture:** We eliminated dual-write bugs. The system writes once to PostgreSQL; an automated, lightweight worker (`eureka.conclusion.outbox_worker.py`) polls pending updates using `FOR UPDATE SKIP LOCKED` and streams them into Neo4j in high-speed batches using idempotent Cypher `MERGE` queries.

### 2. Eliminating AI Overhead: Triton Inference Server & INT8 Quantization
* **The Traditional AI Pitfall:** Typical machine learning systems load massive AI models directly into every background worker process. If you run 8 worker threads, you load 8 copies of PyTorch into memory, consuming 16GB+ of RAM and choking server CPUs with idle overhead.
* **The EUREKA Innovation:**
  * **Centralized Triton Engine:** We removed PyTorch execution completely from Celery workers. Workers now act as feather-light clients that pass small NumPy arrays over high-speed gRPC pipelines to a dedicated NVIDIA Triton Inference Server.
  * **INT8 Dynamic Quantization (PTQ):** We converted all our floating-point neural models (MuRIL, FANG Stance Head, and StGNN Forecaster) to 8-bit integers using ONNX Runtime. This slashed model sizes by **75%** (e.g., StGNN is just 142 KB), doubled mathematical throughput, and enables real-time vectorization on commodity CPUs without needing expensive GPUs.
  * **Dynamic Micro-Batching (2ms Window):** Triton holds incoming inference requests for up to 2 milliseconds, bundles them into unified matrix multiplications, and calculates predictions for multiple districts simultaneously.

### 3. Spatio-Temporal Graph AI (StGNN): The 6-Hour Predictive Radar
* Rather than merely analyzing the past, EUREKA's **A3TGCN (Attention Temporal Graph Convolutional Network)** predicts the future.
* It monitors three variables over time across every district:
  1. *Communication Volume*
  2. *Net Sentiment Index*
  3. *Active Rumor Velocity*
* By combining the physical boundary map of Maharashtra (which districts touch each other) with digital narrative sharing patterns, EUREKA alerts the DGIPR command center: *"District X is calm today, but based on contagion from District Y, it has an 82% probability of entering a high-risk rumor escalation within 6 hours."*

### 4. Distributed Task Queue & Asynchronous Chunk Streaming (Celery + Redis)
* **High-Throughput Nervous System:** Configured via `eureka.core.celery_app` with dedicated Redis broker (`redis://127.0.0.1:6379/0`) and result backend (`/1`).
* **Non-Blocking Extreme-Scale Ingestion:** Implements `eureka.workers.ingestion_tasks.process_ingestion_chunk`, enabling 250,000+ synthetic and live records to stream directly into PostgreSQL (or SQLite) in configurable batches without saturating the main FastAPI asynchronous event loop.
* **Swagger/REST Ingestion Trigger:** The platform exposes `POST /api/v1/jobs/trigger-ingestion`, allowing operators to initiate asynchronous chunk streaming and ingest large datasets with direct job ID tracking.

### 5. Serverless Cloud NLP & Crisis SLA Reasoning (Hugging Face + Groq LLaMA 3)
* **Zero Local Weight Overhead:** In place of downloading multi-gigabyte neural checkpoints locally, EUREKA deploys high-speed serverless cloud inference via `eureka.llm.cloud_evaluator`:
  * **Hugging Face Serverless Inference:** Calls `cardiffnlp/twitter-roberta-base-sentiment-latest` to map multilingual civic sentiment into a bounded score between $-1.0$ (Critical) and $+1.0$ (Positive).
  * **Groq Cloud LLaMA 3 (`llama3-8b-8192`):** Executes deterministic ($T=0.0$) zero-shot prompts to evaluate whether published district media explicitly features authorized government refutations or crisis resolutions, directly informing the Crisis SLA Pillar.

### 6. Autonomous Edge Ingestion Node (`NEWS_API.py`)
* **Multi-Stage Autonomous Pipeline:** Operates at the edge to harvest, sanitize, evaluate, and dispatch live public domain information:
  1. *Discovery:* Queries NewsAPI v2 (`/v2/everything`) for real-time district-specific news across Maharashtra (e.g., Thane, Raigad, Palghar, Sindhudurg, Ratnagiri).
  2. *Extraction:* Concurrently scrapes clean markdown body text using Crawl4AI (`AsyncWebCrawler`, `PruningContentFilterLXML`) with automatic headless HTTP fallback.
  3. *Cloud Evaluation:* Executes cloud sentiment and crisis SLA inference on extracted bodies.
  4. *Celery Dispatch:* Formats records into EUREKA's canonical 8-field schema (`record_id`, `district`, `event_type`, `event_timestamp`, `turnaround_time_mins`, `sentiment_score`, `crisis_resolved`, `english_content`) and dispatches directly to `process_ingestion_chunk.delay(records)`.

### 7. Asynchronous Neo4j Cypher Batching Worker (`neo4j_tasks.py`)
* **High-Performance Knowledge Graph Linking:** Implements `ingest_neo4j_batch_task` using parameterized Cypher batching:
  ```cypher
  UNWIND $events AS event
  MERGE (d:District {name: event.district})
  ON CREATE SET d.code = event.district
  MERGE (e:MediaEvent {id: event.record_id})
  SET e.event_type = event.event_type,
      e.turnaround_time_mins = toFloat(event.turnaround_time_mins),
      e.sentiment_score = toFloat(event.sentiment_score),
      e.crisis_resolved = toBoolean(event.crisis_resolved),
      e.timestamp = toString(event.event_timestamp)
  MERGE (d)-[:HAS_EVENT]->(e)
  RETURN count(e) AS events_ingested
  ```
* **Direct Celery Routing:** Routed automatically to the `default` queue, enabling high-speed batch graph synchronization without write deadlocks.

### 8. Containerization & Modular Docker Compose Profiles
* **Unified `uv`-Powered Dockerfile:** Builds the complete Python stack (FastAPI API + Celery workers) using Astral's `uv`, slashing image build and dependency resolution times to under 60 seconds.
* **Modular Service Profiles:** Developers and CI pipelines can spin up isolated slices of the architecture via Docker Compose profiles:
  * `--profile db`: Boots PostgreSQL 16, Neo4j 5.x, and Redis without requiring GPU/Triton containers.
  * `--profile core` / `--profile app`: Boots the core persistence layer and the unified API.
  * `--profile full`: Boots the complete end-to-end mesh including the 7GB NVIDIA Triton Inference Server.

### 9. Maha-Command Center (MCC) Operational Frontend Deck (`frontend/MCC`)
* **Enterprise Government Command Interface:** Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS, and Zustand, adhering strictly to **GIGW 3.0 (Guidelines for Indian Government Websites)** and UX4G accessibility compliance.
* **Synchronized Branch & UI Assets:** Aligned to branch `sarvdny` at commit `cdae6145cbb6dbc40444ac86602944a160ddd038`:
  * `GlobalSearchBar`: Arrow-indicator search navigation and dot-separated category metadata.
  * `Sidebar`: Accessible dynamic `PanelLeftOpenIcon` / `PanelLeftCloseIcon` toggle.
* **Live Backend Proxy Integration (`src/lib/backendClient.ts`):** Directly interfaces Next.js route handlers with Project EUREKA's FastAPI backend (`http://127.0.0.1:8000`):
  * `/api/districts`: Maps live evaluated 100-Point Composite Index across all 36 districts evaluated from PostgreSQL `media_events`.
  * `/api/dashboard/overview`: Statewide aggregated releases, average TAT, Net Sentiment Index, and active rumors.
  * `/api/crisis/incidents`: 90-minute Crisis SLA desk with Gemini-drafted rebuttals.
  * `/api/crisis/incidents/[id]/action`: Strictly enforced RBAC sign-off proxying to `/api/v1/hermes/dm-pipelines/{id}/action`.
  * `/api/auth/login`: Officer persona authentication syncing 12-hour TTL cryptographically signed JWT cookies and backend bearer tokens.
* **Audit Provenance Tagging:** Strict UI data labeling differentiating live engine responses (`source: 'live_backend'`) from simulated demo fixtures (`source: 'demo_fallback'`).

### 10. Autonomous Hermes Agent & Google AI Studio Indic Engine
* **Programmatic Hermes API Client (`eureka.hermes.hermes_client`):** Connects to the local or remote Hermes Agent server over documented HTTP API endpoints (`/v1/chat/completions`, `/v1/responses`, `/v1/models`). Follows the official Nous Research Hermes programmatic integration specification without brittle CLI subprocesses.
* **Narrow Tool Allowlist (`eureka.hermes.agent_tools`):** The agent operates within a strictly sandboxed domain allowlist:
  1. `tool_translate_and_normalize(raw_text)`: Invokes Google AI Studio Gemini Flash for Indic dialect detection and normalization into strict JSON schema (`marathi_text`, `english_text`, `detected_dialect`, `extracted_district_code`).
  2. `tool_stage_dm_rebuttal(ticket_id, district_code, draft_text)`: Stages draft rebuttals in PostgreSQL under `pending_review` status without altering approval flags.
  3. `tool_execute_dm_signoff(ticket_id, reviewer_id, role, district_code, action)`: Validates that only `ROLE_DISTRICT_COLLECTOR` matching the ticket's district can authorize sign-offs within the 90-minute SLA window, writes audit records to `human_review_actions`, and queues transactional outbox events.
  4. `tool_sync_neo4j_nodes(district_code, event_id, claim_text)`: Executes idempotent Cypher statements to connect District, CanonicalEvent, and Claim nodes with `AFFECTS` and `CONTAINS_CLAIM` relationships.
* **Non-Bypassable Human Governance Guardrails:** The agent is strictly prevented from autonomously signing off on rebuttals or publishing claims. Autonomous sign-off attempts are blocked with HTTP 403 Forbidden.
* **Truthful Availability Reporting:** If the Hermes agent daemon is unreachable, the system truthfully returns structured offline diagnostics (`hermes_status: "offline"`) rather than fabricating synthetic completions.

---

## 4. The Testing & Simulation Harness vs. Real-Time Production APIs

A critical concept for investors to understand is **how the system is validated today** versus **how it operates in live production**.

```
+----------------------------------------------------------------------------------------------------+
|                                    HARNESS VS. PRODUCTION ARCHITECTURE                             |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  VALIDATION HARNESS (Extreme-Scale Benchmark)       LIVE PRODUCTION DEPLOYMENT (Operational)       |
|                                                                                                    |
|  +------------------------------------+             +------------------------------------+         |
|  |   DGIPR Benchmark & Scale Dataset  |             |   Live Edge & Streaming Connectors |         |
|  |   • 8,199 Press Releases           |             |   • NewsAPI & Crawl4AI Edge Node   |         |
|  |   • 3,727 Media Clippings          |             |   • Serverless HF & Groq Evaluators|         |
|  |   • 250,000 Extreme-Scale Records  |    ====>    |   • Celery + Redis Chunk Broker    |         |
|  |   • Planted Negative Edge Cases    |             |   • Electronic Paper Scrapers      |         |
|  +------------------------------------+             +------------------------------------+         |
|                   |                                                   |                            |
|                   v                                                   v                            |
|  +-----------------------------------------------------------------------------------------------+ |
|  |                   IDENTICAL CORE EUREKA ENGINE (ZERO CODE CHANGES REQUIRED)                   | |
|  |   • Outbox Transactional Mesh  • Dual Postgres/Neo4j Brain  • 100-Point Scoring Engine        | |
|  |   • Triton INT8 Inference      • StGNN Diffusion Radar      • DGIPR 5-Zone Dashboard          | |
|  +-----------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
```

### What Is the Current "Harness"?
Currently, the system runs against a comprehensive **Simulation & Benchmark Harness** constructed directly from real-world data provided by the DGIPR Maha Command Center:
* **8,199 historical press releases** with precise turnaround minutes.
* **3,727 e-paper and news clippings** with ground-truth sentiment labels.
* **250,000 extreme-scale records (`english_extreme_scale.csv`):** Validating multi-chunk asynchronous ingestion into PostgreSQL and SQLite.
* **100% verified ground-truth scores** for all 36 districts of Maharashtra.
* **Deliberately planted edge cases:** Out-of-sequence records (published before event date), rumor spikes, extreme sentiment drops, and zero-volume districts.

### Why Did We Build the Harness First?
1. **Mathematical Proof & Defensibility:** Before connecting live, volatile internet feeds, we had to mathematically prove that our scoring engine produces 100% accurate, predictable results that match administrative expectations.
2. **Deterministic Stress Testing:** The harness allows us to replay historical crises (e.g., severe flood warnings, election misinformation spikes) at 100x speed to verify that our outbox workers, queue managers, and graph databases never drop a transaction or crash under load.
3. **Zero API Dependency Bottlenecks:** Development, validation, and AI optimization proceeded without being delayed by third-party API rate limits, paywalls, or government network firewall approvals.

### The Live Production Transition: Modular Connector Mesh
In our codebase, the data ingestion interface is built using the **Abstract Adapter Pattern** (`BaseIngestionAdapter`). 

Transitioning from the static benchmark harness to real-time operations requires **zero modifications to the core scoring engine, graph algorithms, or neural models**. We simply swap the data source:

1. **Autonomous Edge Scrapers:** Real-time web discovery (`NEWS_API.py`) queries NewsAPI, extracts clean markdown via Crawl4AI, evaluates sentiment and crisis SLAs in the cloud, and fires structured payloads directly to Celery.
2. **Social & Webhook Ingestion:** Live webhooks from X (Twitter), Facebook Public Pages, WhatsApp Tip Lines, and Telegram channels stream directly into the existing `raw_events` table.
3. **Electronic Media & Web Crawling:** Headless scrapers continuously monitor digital editions of regional newspapers (e.g., Lokmat, Sakal, Pudhari, Maharashtra Times).
4. **Government IPCS / OpenJEV Integration:** Direct API integration with the state's internal PR dispatch software.

The moment a live event arrives via these APIs, it is processed by the exact same pipeline that has already been verified across our automated test suite.

---

## 5. Summary of System Scalability & Verification

The robustness of this backend is demonstrated through our automated testing suite:

```text
======================= Automated Integration & Unit Test Suite =======================
Backend Suite (83 Passed, 1 Skipped in 113.58s):
✓ test_api_endpoints.py           (Health check, JWT security, RBAC guards, StGNN query structure, jobs trigger)
✓ test_benchmark_scores.py       (All 36 Maharashtra district score validations, edge cases, CSV adapters)
✓ test_cloud_evaluator.py        (Hugging Face serverless sentiment, Groq LLaMA 3 crisis SLA, edge schema mapping)
✓ test_e2e_production.py         (End-to-end production data ingestion and scoring pipeline)
✓ test_hermes_integration.py     (Nous Research Hermes client, 409 conflict, timeouts, RBAC blocks autonomous signoff)
✓ test_hermes_pipeline.py        (Indic translation, 90m SLA window, Neo4j idempotency, DM queue & router)
✓ test_irf_binding.py            (Language & script detection for Marathi/Hindi/English, OpenJEV decision logic)
✓ test_models.py                 (Relational tables, foreign key cascades, data schemas, snapshot entities)
✓ test_multilingual_translator.py(Google AI Studio Gemini Flash mocked & fallback Indic extraction)
✓ test_neo4j_tasks.py            (Cypher batch ingestion, UNWIND graph queries, node linking)
✓ test_outbox_worker.py          (Dual-write transactional synchronization to Neo4j via FOR UPDATE SKIP LOCKED)
✓ test_scoring_engine.py         (S-Curve volume, TAT decay, NSI sentiment, Crisis SLA zero-rumor rule)
✓ test_stgnn_pipeline.py          (36-district graph topology, A3TGCN neural diffusion training & inference)
✓ test_triton_inference.py       (INT8 PTQ inference, dynamic batching, zero-PyTorch client)

Frontend Suite (18 Passed, 0 Failed, 29 Production Routes Compiled):
✓ JWT Authentication & 12-Hour TTL Security Suite (Tamper rejection, expiration checks, claim extraction)
✓ Maha Government Command Center Suite (Fictional officer personas, light-theme GIGW 3.0, Konkan data, modular navigation)
```

### Key Commercial Takeaways for Investors
1. **Defensible IP:** EUREKA is not a generic wrapper around OpenAI or commercial LLMs. It possesses proprietary graph architectures, custom Indic sentiment embeddings, and specialized spatio-temporal neural diffusion models tailored specifically for state and enterprise narrative defense.
2. **High Operating Margins:** By utilizing dynamic INT8 quantization, centralized micro-batching on Triton, and serverless cloud evaluation for edge nodes, EUREKA's cloud compute cost is a fraction of legacy AI systems, allowing profitable deployment even at massive public-sector scale.
3. **Infinite Reusability:** While currently deployed for Maharashtra's 36 districts, the underlying engine is completely geography-agnostic. It can be re-targeted to any state, federal agency, disaster management authority, or Fortune 500 brand in the world by updating the boundary map and linguistic dictionary.

---

## 6. Administrative Geography & Regional Narrative Dynamics

To govern narratives effectively across Maharashtra's 112+ million citizens, Project EUREKA maps physical administrative hierarchies to digital information corridors. The state is partitioned into **6 Administrative Revenue Divisions** comprising **36 Districts**. Each region possesses distinct socioeconomic structures, linguistic dialects, media consumption habits, and thematic risk triggers.

```
+----------------------------------------------------------------------------------------------------+
|                             MAHARASHTRA 6 ADMINISTRATIVE DIVISIONS                                 |
+----------------------------------------------------------------------------------------------------+
|  1. KONKAN DIVISION (7)     : Mumbai City, Mumbai Sub, Thane, Palghar, Raigad, Ratnagiri, Sindhudurg|
|  2. PUNE DIVISION (5)       : Pune, Satara, Sangli, Kolhapur, Solapur                              |
|  3. NASHIK DIVISION (5)     : Nashik, Dhule, Nandurbar, Jalgaon, Ahmednagar (Ahilyanagar)          |
|  4. SAMBHAJINAGAR (8)       : Chh. Sambhajinagar, Jalna, Parbhani, Hingoli, Nanded, Beed, Latur,    |
|                               Dharashiv (Osmanabad)                                                |
|  5. AMRAVATI DIVISION (5)   : Amravati, Akola, Buldhana, Washim, Yavatmal                          |
|  6. NAGPUR DIVISION (6)     : Nagpur, Wardha, Bhandara, Gondia, Chandrapur, Gadchiroli             |
+----------------------------------------------------------------------------------------------------+
```

### The 36-District Operational & Risk Matrix

| Division | Code | District Name | Population Baseline | Dominant Dialect / Script | Primary Thematic Triggers | Critical Contagion Borders |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Konkan** | MH-01 | Mumbai City | 3.1M | Marathi / English / Hindi | Urban infrastructure, transport, finance | MH-02, MH-03 |
| **Konkan** | MH-02 | Mumbai Suburban | 9.4M | Marathi / Hindi / Gujarati | Suburban rail disruptions, housing, civic services | MH-01, MH-03, MH-04 |
| **Konkan** | MH-03 | Thane | 11.1M | Marathi (Koli/Agri) / Hindi | Traffic gridlocks, real estate, civic utilities | MH-02, MH-04, MH-05, MH-14 |
| **Konkan** | MH-04 | Palghar | 3.0M | Marathi / Warli Tribal Dialect | Tribal welfare, industrial corridors, coastal weather | MH-03, MH-14, MH-15 |
| **Konkan** | MH-05 | Raigad | 2.6M | Marathi (Agri/Konkani) | Port operations, coastal monsoons, industrial safety | MH-03, MH-06, MH-12, MH-11 |
| **Konkan** | MH-06 | Ratnagiri | 1.6M | Marathi (Malvani/Konkani) | Mango/fisheries subsidies, coastal infrastructure | MH-05, MH-07, MH-11, MH-10 |
| **Konkan** | MH-07 | Sindhudurg | 0.8M | Marathi (Malvani) / Konkani | Eco-tourism, Konkan railway, cross-border Goa trade | MH-06, MH-10 |
| **Pune** | MH-12 | Pune | 9.4M | Marathi (Puneri standard) / English | IT employment, university unrest, water quotas | MH-05, MH-11, MH-13, MH-14 |
| **Pune** | MH-11 | Satara | 3.0M | Marathi (Western Deshi) | Sugarcane pricing, Koyna dam discharge, tourism | MH-05, MH-06, MH-10, MH-12, MH-13 |
| **Pune** | MH-10 | Sangli | 2.8M | Marathi / Kannada border dialect | Krishna flood alerts, grape farming, border disputes | MH-06, MH-07, MH-09, MH-11, MH-13 |
| **Pune** | MH-09 | Kolhapur | 3.9M | Marathi (Kolhapuri) | Sugar mill FRP agitation, flood inundation, textile mills | MH-07, MH-10 |
| **Pune** | MH-13 | Solapur | 4.3M | Marathi / Kannada / Telugu | Textile labor, Ujjani water disputes, drought | MH-10, MH-11, MH-12, MH-14, MH-24 |
| **Nashik** | MH-14 | Ahmednagar | 4.5M | Marathi (Deshi) | Sugar cooperatives, Shirdi pilgrim management, drought | MH-03, MH-12, MH-13, MH-15, MH-19 |
| **Nashik** | MH-15 | Nashik | 6.1M | Marathi (Standard/Khandeshi) | Onion mandi prices, Godavari flooding, Kumbh logistics | MH-04, MH-14, MH-16, MH-18 |
| **Nashik** | MH-16 | Dhule | 2.1M | Ahirani / Marathi | Cotton trade, tribal land rights, highway transit | MH-15, MH-17, MH-18 |
| **Nashik** | MH-17 | Nandurbar | 1.6M | Bhili / Pawri / Ahirani | Tribal malnutrition, forest rights, Satpura cross-border | MH-16 |
| **Nashik** | MH-18 | Jalgaon | 4.2M | Ahirani / Marathi | Banana crop insurance, gold market, irrigation canals | MH-15, MH-16, MH-19, MH-27 |
| **Chh. Sambhajinagar** | MH-19 | Chh. Sambhajinagar | 3.7M | Marathi (Marathwada) / Urdu | Industrial labor, tourism (Ellora), drinking water scarcity | MH-14, MH-15, MH-18, MH-20, MH-23 |
| **Chh. Sambhajinagar** | MH-20 | Jalna | 2.0M | Marathi (Marathwada) | Steel manufacturing, agrarian drought, seed production | MH-18, MH-19, MH-21, MH-23 |
| **Chh. Sambhajinagar** | MH-21 | Parbhani | 1.8M | Marathi (Marathwada) | Cotton procurement, agrarian credit, Godavari basin | MH-20, MH-22, MH-23, MH-25 |
| **Chh. Sambhajinagar** | MH-22 | Hingoli | 1.2M | Marathi (Marathwada) | Turmeric processing, rural connectivity, health facilities | MH-21, MH-25, MH-28, MH-29 |
| **Chh. Sambhajinagar** | MH-23 | Beed | 2.6M | Marathi (Marathwada) | Sugarcane cutter migration, drought distress, crop loss | MH-13, MH-14, MH-19, MH-20, MH-21, MH-24 |
| **Chh. Sambhajinagar** | MH-24 | Latur | 2.5M | Marathi / Kannada border dialect | Summer water trains, education coaching, pulse markets | MH-13, MH-23, MH-25, MH-26 |
| **Chh. Sambhajinagar** | MH-25 | Nanded | 3.4M | Marathi / Telugu / Punjabi | Gurdwara pilgrimage, border transit, Godavari floods | MH-21, MH-22, MH-24, MH-29 |
| **Chh. Sambhajinagar** | MH-26 | Dharashiv | 1.7M | Marathi (Marathwada) | Tuljapur pilgrimage, wind energy, severe drought | MH-13, MH-23, MH-24 |
| **Amravati** | MH-27 | Buldhana | 2.6M | Varhadi / Marathi | Lonar conservation, cotton loan waivers, soybean price | MH-18, MH-20, MH-28, MH-30 |
| **Amravati** | MH-28 | Akola | 1.8M | Varhadi / Marathi | Cotton pulse trade, seed research, summer heatwaves | MH-22, MH-27, MH-29, MH-30 |
| **Amravati** | MH-29 | Washim | 1.2M | Varhadi / Marathi | Soybean procurement, irrigation dams, agrarian health | MH-22, MH-25, MH-28, MH-31 |
| **Amravati** | MH-30 | Amravati | 2.9M | Varhadi / Marathi / Korku | Melghat tribal nutrition, orange farming, textile parks | MH-27, MH-28, MH-31, MH-32 |
| **Amravati** | MH-31 | Yavatmal | 2.8M | Varhadi / Marathi / Gondi | Agrarian crisis hotspots, pesticide safety, cotton pricing | MH-25, MH-29, MH-30, MH-32, MH-34 |
| **Nagpur** | MH-31 | Nagpur | 4.7M | Marathi (Nagpuri) / Hindi | Winter Assembly sessions, cargo hub, logistics, health | MH-32, MH-33, MH-36 |
| **Nagpur** | MH-32 | Wardha | 1.3M | Marathi (Nagpuri) | Cotton spinning, Sevagram heritage, dry farming | MH-31, MH-36 |
| **Nagpur** | MH-33 | Bhandara | 1.2M | Marathi (Nagpuri / Zadi Boli) | Rice paddy procurement, brass industry, Wainganga floods | MH-31, MH-34, MH-36 |
| **Nagpur** | MH-34 | Gondia | 1.3M | Marathi / Hindi / Gondi | LWE border monitoring, rice mills, forest produce | MH-33, MH-35 |
| **Nagpur** | MH-35 | Gadchiroli | 1.1M | Gondi / Madiya / Marathi | Forest rights, mining projects, LWE security logistics | MH-34, MH-36 |
| **Nagpur** | MH-36 | Chandrapur | 2.2M | Marathi (Nagpuri) / Gondi | Thermal power pollution, coal mines, man-animal conflict | MH-31, MH-32, MH-33, MH-35 |

*(Note: Official state administration maps 36 operational collectorates with Mumbai City and Mumbai Suburban handled as twin headquarters for capital media operations).*

---

## 7. The 24-Hour PR & Communications Operational Lifecycle

Project EUREKA synchronizes continuous digital data harvesting with the strict operational battle rhythm of the Maharashtra Directorate General of Information and Public Relations (DGIPR) and District Collectorates.

```mermaid
flowchart TD
    subgraph D1["06:00 - 08:30: Morning Intelligence & CMO Briefing"]
        direction TB
        A1["06:00: Autonomous Edge Scraper (NEWS_API.py + Crawl4AI)"] --> A2["06:45: Cloud NLP Sentiment & StGNN Ingestion"]
        A2 --> A3["07:30: Auto-Generate Dossier 1: Morning Media Intelligence Bulletin"]
        A3 --> A4["08:00: Dispatch to CMO, Chief Secretary, & DG DGIPR"]
    end

    subgraph D2["08:30 - 13:00: Field Alignment & Proactive Saturation"]
        direction TB
        B1["08:30: DIO Morning Tasking (Target Low-Volume Sectors)"] --> B2["10:00: Departmental Press Releases & Field Circulars Issued"]
        B2 --> B3["11:30: Real-time Ingestion via Celery Multi-Queue Mesh"]
    end

    subgraph D3["13:00 - 17:30: Midday Crisis Detection & 90-Min SLA Defense"]
        direction TB
        C1["13:00: StGNN Anomaly Spike / FactCheck Ticket Triggered"] --> C2["13:15: Auto-Generate Dossier 2: Crisis SLA Escalation Alert"]
        C2 --> C3["13:30: District Collector Activates Rebuttal Desk (90m Timer)"]
        C3 --> C4["14:45: Fact-Check Clarification Dispatched across Print/Web/Social"]
    end

    subgraph D4["17:30 - 22:00: Evening Synthesis & Spatio-Temporal Projection"]
        direction TB
        E1["17:30: Evening Media Harvest & Broadcast News Ingestion"] --> E2["19:00: StGNN Computes 6-Hour Forward Diffusion Radar"]
        E2 --> E3["19:30: Auto-Generate Dossier 4: Spatio-Temporal Diffusion Warning"]
        E3 --> E4["20:30: Compute 100-Point Composite Governance Index"]
        E4 --> E5["21:30: Publish Dossier 3: Weekly / Daily Executive Ranking Dossier"]
    end

    D1 --> D2 --> D3 --> D4
```

### Chronological Operational Timeline

| Time Window | Operational Milestone | System Actions & Data Flows | Responsible Bureaucratic Persona | Key System Output |
| :--- | :--- | :--- | :--- | :--- |
| **06:00 - 07:00** | Early Morning Sweep | `NEWS_API.py` queries NewsAPI v2 across 36 district keywords; Crawl4AI scrapes morning e-papers (Lokmat, Sakal, Pudhari). Serverless Hugging Face RoBERTa scores regional sentiment. | Automated Ingestion Worker (`default` queue) | 3,000+ raw news records parsed and normalized into PostgreSQL `raw_events`. |
| **07:00 - 08:00** | Morning Briefing Generation | SemIf-OpenJev correlates raw articles into canonical events. Net Sentiment Index ($NSI$) calculated across all 6 administrative divisions. | Central System Scheduler (`cron`) | **Executive Dossier 1: Daily Morning Media Intelligence Bulletin** delivered via encrypted PDF/REST API. |
| **08:00 - 09:30** | Leadership Review & Strategy | State leadership reviews statewide sentiment trends, identifies at-risk regions, and issues communication directives for the day. | Chief Minister's Office (CMO) & DG DGIPR | Strategic daily guidance notes issued to Divisional Commissioners and District Collectors. |
| **09:30 - 12:30** | Field Communication Push | District Information Officers (DIOs) draft and publish authenticated developmental releases to proactively counter information vacuums. | District Information Officers (DIOs) | 250+ authenticated press releases ingested into EUREKA via IPCS / webforms, boosting Pillar 1 Volume scores. |
| **12:30 - 15:30** | Midday Misinformation Detection | StGNN and Neo4j detect anomalous rumor clusters or viral fake news. Crisis SLA countdown timer triggers upon ticket generation. | Autonomous Graph Engine & DIO Fact-Check Desk | **Executive Dossier 2: Real-Time Crisis SLA Escalation Alert** sent via SMS / Telegram / Webhook to Collector. |
| **15:30 - 17:30** | Rebuttal Verification & SLA Closure | District Collector reviews proposed factual rebuttal, executes cryptographic sign-off via RBAC, and releases clarification. | District Collector / Magistrate (DM) | Clarification logged; TAT recorded. Crisis SLA score preserved at 25.0 points if refuted within 90 minutes. |
| **17:30 - 19:30** | Prime-Time Discourse Monitoring | Evening electronic media debates, social chatter, and regional news bulletins ingested and processed through Triton INT8 dynamic batching. | Outbox Worker & Neo4j Batch Ingestion | Neo4j updates node relationships; StGNN extracts 24-hour spatio-temporal feature matrices ($[36, 3, 24]$). |
| **19:30 - 21:00** | Predictive Diffusion Run | StGNN executes forward inference to forecast rumor contagion vectors across neighboring district borders over the next 6 hours ($T+6\text{h}$). | Spatio-Temporal Neural Model (`A3TGCN`) | **Executive Dossier 4: 6-Hour Spatio-Temporal Diffusion Warning Report** highlighting at-risk adjacent collectorates. |
| **21:00 - 22:30** | Night Score Tally & Governance Audit | Daily scoring engine tallies the 100-Point Composite Index for all 36 districts over the rolling 24-hour window ($S_{\text{vol}} + S_{\text{tat}} + S_{\text{sent}} + S_{\text{sla}}$). | PostgreSQL Audit Ledger & Reporting Engine | **Executive Dossier 3: Weekly / Daily Governance Ranking Dossier** presented on the MCC Command Dashboard. |

---

## 8. The 4 Executive Operational Dossiers & Output Specifications

Project EUREKA produces **4 Core Operational Dossiers** tailored to distinct stages of governance decision-making. Each dossier possesses a concrete business purpose, layout structure, and machine-readable JSON schema.

---

### Dossier 1: Daily Morning Media Intelligence Bulletin

* **Delivery Schedule:** Daily at 07:30 AM IST.
* **Target Audience:** Chief Minister's Office (CMO), Chief Secretary, DG DGIPR, Divisional Commissioners.
* **Core Purpose:** Pre-flight intelligence summarizing the state's narrative climate before morning cabinet and administrative meetings begin.

#### Visual Layout & Key Indicators
```
+----------------------------------------------------------------------------------------------------+
| DGIPR MAHARASHTRA | DAILY MORNING MEDIA INTELLIGENCE BULLETIN | 19-OCT-2026 07:30 IST              |
+----------------------------------------------------------------------------------------------------+
| STATEWIDE NSI: +0.38 [SATISFACTORY] | ACTIVE RUMORS: 2 [UNDER SLA] | ARTICLES PARSED: 4,812        |
+----------------------------------------------------------------------------------------------------+
| REGIONAL SENTIMENT HEATMAP:                                                                        |
| • Konkan Division   : +0.52 (High Approval - Metro lines, coastal infrastructure)                 |
| • Pune Division     : +0.41 (Stable - Industrial expansion, IT policy)                             |
| • Nashik Division   : -0.12 (Critical - Onion price slump in Lasalgaon mandi)                      |
| • Sambhajinagar Div : -0.28 (High Risk - Soy crop insurance delays in Beed/Jalna)                 |
| • Amravati Division : -0.18 (Moderate Risk - Cotton procurement MSP concerns)                     |
| • Nagpur Division   : +0.31 (Positive - Samruddhi corridor logistics hub expansion)               |
+----------------------------------------------------------------------------------------------------+
| TOP 3 EMERGENT ISSUES REQUIRING IMMEDIATE PROACTIVE RELEASES:                                      |
| 1. Beed: Rumor regarding farmer crop insurance claim rejections (Urgency: High, NSI: -0.65)        |
| 2. Nashik: Protests at Lasalgaon over onion export duty rumors (Urgency: High, NSI: -0.58)         |
| 3. Thane: False report of water contamination in Ulhasnagar civic supply (Urgency: Medium)        |
+----------------------------------------------------------------------------------------------------+
```

#### JSON Output Specification (`Dossier1_MorningBulletin.json`)
```json
{
  "$schema": "https://eureka.gov.in/schemas/dossier-morning-bulletin.json",
  "dossier_id": "D1-20261019-0730",
  "generated_at": "2026-10-19T07:30:00Z",
  "reporting_window_hours": 12,
  "state_summary": {
    "total_articles_parsed": 4812,
    "statewide_net_sentiment_index": 0.38,
    "active_unrefuted_rumors": 2,
    "top_governance_themes": ["Agriculture", "Infrastructure", "Civic Water Supply"]
  },
  "division_sentiment": [
    {"division": "Konkan", "net_sentiment_index": 0.52, "volume": 1640, "status": "SATISFACTORY"},
    {"division": "Pune", "net_sentiment_index": 0.41, "volume": 1120, "status": "SATISFACTORY"},
    {"division": "Nashik", "net_sentiment_index": -0.12, "volume": 580, "status": "WATCHLIST"},
    {"division": "Chhatrapati Sambhajinagar", "net_sentiment_index": -0.28, "volume": 690, "status": "CRITICAL_ACTION_REQUIRED"},
    {"division": "Amravati", "net_sentiment_index": -0.18, "volume": 390, "status": "WATCHLIST"},
    {"division": "Nagpur", "net_sentiment_index": 0.31, "volume": 392, "status": "SATISFACTORY"}
  ],
  "emergent_early_warnings": [
    {
      "warning_id": "WARN-2026-0041",
      "district": "Beed",
      "district_code": "MH-23",
      "topic": "Agrarian Crop Insurance Claim Delays",
      "net_sentiment_index": -0.65,
      "estimated_reach": 85000,
      "recommended_action": "District Collectorate must issue authenticated tabular breakdown of disbursed insurance funds via DIO within 2 hours."
    },
    {
      "warning_id": "WARN-2026-0042",
      "district": "Nashik",
      "district_code": "MH-15",
      "topic": "Onion Export Duty Rumor",
      "net_sentiment_index": -0.58,
      "estimated_reach": 120000,
      "recommended_action": "Cooperation Department must issue circular confirming zero new export curbs."
    }
  ]
}
```

---

### Dossier 2: Real-Time Crisis SLA Escalation Alert

* **Delivery Schedule:** Event-driven (Generated instantly when a high-velocity rumor or critical sentiment drop occurs).
* **Target Audience:** Originating District Collector, District Superintendent of Police, DGIPR Fact-Check Command Desk, Chief Secretary.
* **Core Purpose:** Enforces the Zero-Tolerance Crisis SLA by providing immediate situational awareness, graph diffusion vectors, and a countdown timer for authenticated rebuttal sign-off.

#### Visual Layout & Key Indicators
```
+----------------------------------------------------------------------------------------------------+
| *** URGENT CRISIS ESCALATION *** | EUREKA SLA ALERT ID: SLA-CRISIS-2026-089                       |
+----------------------------------------------------------------------------------------------------+
| TARGET DISTRICT: BEED (MH-23)       | INCIDENT TIME: 13:12 IST     | SLA DEADLINE: 14:42 IST (90m) |
| TIME REMAINING: 01 HR 14 MIN        | VIRAL VELOCITY: 420 shares/m | THREAT LEVEL: LEVEL 4 CRITICAL|
+----------------------------------------------------------------------------------------------------+
| RUMOR CONTENT IDENTIFIED (INDIC REGIONAL MARATHI):                                                 |
| "बीड जिल्ह्यातील सर्व पीक विमा दावे रद्द - सरकारचा शेतकऱ्यांना मोठा धक्का"                         |
| [English Translation: "All crop insurance claims in Beed cancelled - major shock to farmers"]      |
+----------------------------------------------------------------------------------------------------+
| CONTAGION RISK (NEO4J GRAPH HOPS):                                                                 |
| • Origin District   : Beed (MH-23)                                                                 |
| • High-Risk Hops    : Jalna (MH-20 - 78% probability), Dharashiv (MH-26 - 64% probability)        |
+----------------------------------------------------------------------------------------------------+
| ACTION REQUIRED BEFORE SLA BREACH:                                                                 |
| 1. District Collector Beed must review pre-generated factual rebuttal on MCC Portal.               |
| 2. Cryptographic sign-off required to authorize release.                                           |
| 3. If refuted by 14:42 IST: Pillar 3 (Crisis SLA) Score = 30.0 / 30.0.                             |
| 4. If unrefuted after 14:42 IST: Pillar 3 (Crisis SLA) Score = 0.0 / 30.0 (Automatic Demotion).   |
+----------------------------------------------------------------------------------------------------+
```

#### JSON Output Specification (`Dossier2_CrisisAlert.json`)
```json
{
  "$schema": "https://eureka.gov.in/schemas/dossier-crisis-alert.json",
  "alert_id": "SLA-CRISIS-2026-089",
  "triggered_at": "2026-10-19T13:12:45Z",
  "sla_deadline": "2026-10-19T14:42:45Z",
  "sla_window_minutes": 90,
  "origin_district": {
    "name": "Beed",
    "code": "MH-23",
    "collector_notified": true,
    "dio_contact": "dio.beed@maharashtra.gov.in"
  },
  "misinformation_payload": {
    "detected_claim_marathi": "बीड जिल्ह्यातील सर्व पीक विमा दावे रद्द - सरकारचा शेतकऱ्यांना मोठा धक्का",
    "english_translation": "All crop insurance claims in Beed cancelled - government delivers major blow to farmers",
    "source_channels": ["WhatsApp TipLine", "X Regional", "Local Web Portals"],
    "current_viral_velocity_shares_per_min": 420.5,
    "sentiment_polarity": -0.89
  },
  "graph_diffusion_vector": {
    "origin_node": "Beed",
    "direct_physical_neighbors": ["Jalna", "Ahmednagar", "Parbhani", "Latur", "Dharashiv"],
    "projected_contagion_probabilities": [
      {"neighbor": "Jalna", "probability": 0.78, "predicted_time_to_infection_minutes": 45},
      {"neighbor": "Dharashiv", "probability": 0.64, "predicted_time_to_infection_minutes": 70},
      {"neighbor": "Parbhani", "probability": 0.52, "predicted_time_to_infection_minutes": 95}
    ]
  },
  "governance_sla_impact": {
    "current_pillar_score": 25.0,
    "post_breach_penalty_score": 0.0,
    "overall_district_rank_drop": "Rank 14 -> Rank 34 (Projected)"
  },
  "recommended_rebuttal": {
    "headline_marathi": "बीड जिल्ह्यातील पीक विमा दाव्यांबाबत वस्तुस्थितीदर्शक खुलासा",
    "factual_points": [
      "No crop insurance claims have been cancelled.",
      "Over ₹142 Crore has already been disbursed to 118,000 eligible farmers in Beed as of 18-Oct-2026.",
      "Remaining verification of 14,000 claims is proceeding on schedule under Deputy Collector supervision."
    ],
    "verification_authority": "Office of the District Collector, Beed"
  }
}
```

---

### Dossier 3: Weekly 100-Point District Governance Ranking Dossier

* **Delivery Schedule:** Every Monday at 08:00 AM IST.
* **Target Audience:** Hon'ble Chief Minister, Deputy Chief Ministers, Cabinet Secretary, Chief Secretary, all 36 District Collectors.
* **Core Purpose:** The definitive, auditable scorecard establishing transparency and performance competition across all collectorates using the 100-Point Composite Index.

#### Visual Layout & Key Indicators
```
+----------------------------------------------------------------------------------------------------+
| MAHARASHTRA DISTRICT GOVERNANCE INDEX | WEEKLY LEAGUE TABLE (WEEK 42 - OCT 2026)                   |
+----------------------------------------------------------------------------------------------------+
| RANK | DISTRICT       | COMPOSITE SCORE | VOLUME (25) | TAT (25) | SENTIMENT (25) | CRISIS SLA (25)|
+------+----------------+-----------------+-------------+----------+----------------+----------------+
|  01  | Thane          |      94.20      |    24.50    |  23.80   |     20.90      |     25.00      |
|  02  | Pune           |      91.80      |    25.00    |  22.40   |     19.40      |     25.00      |
|  03  | Nagpur         |      89.50      |    23.10    |  24.10   |     17.30      |     25.00      |
|  04  | Kolhapur       |      88.10      |    22.00    |  23.50   |     17.60      |     25.00      |
|  05  | Sindhudurg     |      87.40      |    20.80    |  24.90   |     16.70      |     25.00      |
| ...  | ...            |       ...       |     ...     |   ...    |      ...       |      ...       |
|  32  | Jalgaon        |      62.30      |    18.20    |  14.50   |     14.60      |     15.00      |
|  33  | Nandurbar      |      58.10      |    12.40    |  12.10   |     13.60      |     20.00      |
|  34  | Nashik         |      55.40      |    24.10    |  11.20   |     07.60      |     12.50      |
|  35  | Buldhana       |      49.80      |    14.20    |  10.40   |     10.20      |     15.00      |
|  36  | Beed           |      42.10      |    19.00    |  09.80   |     08.30      |     05.00      |
+----------------------------------------------------------------------------------------------------+
| TOP MOVER: Thane (+4 Ranks due to sub-30min TAT on civic flood rebuttal)                           |
| CRITICAL CONCERN: Beed (-18 Ranks due to breached Crisis SLA and persistent agrarian rumor)         |
+----------------------------------------------------------------------------------------------------+
```

#### JSON Output Specification (`Dossier3_WeeklyGovernanceRankings.json`)
```json
{
  "$schema": "https://eureka.gov.in/schemas/dossier-weekly-rankings.json",
  "dossier_id": "D3-WEEK-42-2026",
  "evaluation_period": {
    "start_date": "2026-10-12T00:00:00Z",
    "end_date": "2026-10-18T23:59:59Z"
  },
  "state_performance_averages": {
    "composite_index": 76.84,
    "volume_pillar": 20.45,
    "tat_pillar": 18.22,
    "sentiment_pillar": 16.12,
    "crisis_sla_pillar": 22.05
  },
  "league_table": [
    {
      "rank": 1,
      "previous_rank": 5,
      "rank_delta": 4,
      "district": "Thane",
      "district_code": "MH-03",
      "division": "Konkan",
      "composite_score": 94.20,
      "pillars": {
        "volume": {"score": 24.50, "raw_releases": 294},
        "turnaround_time": {"score": 23.80, "avg_tat_minutes": 48.2},
        "sentiment": {"score": 20.90, "net_sentiment_index": 0.67},
        "crisis_sla": {"score": 25.00, "active_rumors": 0, "sla_breaches": 0}
      },
      "key_achievement": "Sub-45m rebuttal issued during Ulhasnagar civic rumor; perfect SLA retention."
    },
    {
      "rank": 36,
      "previous_rank": 18,
      "rank_delta": -18,
      "district": "Beed",
      "district_code": "MH-23",
      "division": "Chhatrapati Sambhajinagar",
      "composite_score": 42.10,
      "pillars": {
        "volume": {"score": 19.00, "raw_releases": 228},
        "turnaround_time": {"score": 09.80, "avg_tat_minutes": 142.5},
        "sentiment": {"score": 08.30, "net_sentiment_index": -0.34},
        "crisis_sla": {"score": 05.00, "active_rumors": 3, "sla_breaches": 2}
      },
      "remedial_directive": "Cabinet directive issued to Divisional Commissioner to deploy emergency communication officer to Beed."
    }
  ]
}
```

---

### Dossier 4: 6-Hour Spatio-Temporal Diffusion Warning Report

* **Delivery Schedule:** Automated Trigger (Issued when StGNN neural model predicts $P_{\text{diffusion}} \ge 0.70$ across district borders within 6 hours).
* **Target Audience:** State Emergency Operations Center (SEOC), ADG Law & Order, Bordering District Collectors, DG DGIPR.
* **Core Purpose:** Proactive narrative defense. Equips downstream collectorates with pre-emptive counter-narratives before a viral rumor physically or digitally penetrates their jurisdiction.

#### Visual Layout & Key Indicators
```
+----------------------------------------------------------------------------------------------------+
| EUREKA RADAR | 6-HOUR SPATIO-TEMPORAL DIFFUSION FORECAST | 19-OCT-2026 19:30 IST                   |
+----------------------------------------------------------------------------------------------------+
| OUTBREAK EPICENTER: NASHIK (MH-15) - ONION MANDI EXPORT CURB RUMOR                                |
| NEURAL CONFIDENCE: 84.6% (StGNN A3TGCN) | FORECAST HORIZON: T+0h TO T+6h (UNTIL 01:30 IST)         |
+----------------------------------------------------------------------------------------------------+
| PREDICTED CONTAGION TIMELINE & PATHWAYS:                                                           |
|                                                                                                    |
|   [NASHIK (MH-15)]  ==================>  [AHMEDNAGAR (MH-14)]  =======>  [PUNE (MH-12)]            |
|   (Epicenter: T=0h)     P = 86.4%           (Predicted: T+2h)    P=62.1%  (Predicted: T+5h)        |
|          ||                                       ||                                               |
|          || P = 79.2%                             || P = 71.5%                                     |
|          \/                                       \/                                               |
|   [JALGAON (MH-18)]                      [CHH. SAMBHAJINAGAR (MH-19)]                              |
|   (Predicted: T+2.5h)                    (Predicted: T+4h)                                         |
+----------------------------------------------------------------------------------------------------+
| PRE-EMPTIVE INTERVENTION PROTOCOL:                                                                 |
| 1. Ahmednagar & Jalgaon DIOs must publish clarifying agricultural circulars immediately.            |
| 2. Local mandi secretaries instructed to display official state denial on electronic APMC boards.  |
| 3. Preventative deployment halts narrative diffusion before morning trading at 08:00 IST.          |
+----------------------------------------------------------------------------------------------------+
```

#### JSON Output Specification (`Dossier4_DiffusionWarning.json`)
```json
{
  "$schema": "https://eureka.gov.in/schemas/dossier-diffusion-warning.json",
  "dossier_id": "D4-STGNN-20261019-1930",
  "generated_at": "2026-10-19T19:30:00Z",
  "forecast_horizon_hours": 6,
  "neural_model": "StGNN-A3TGCN-INT8",
  "model_confidence_score": 0.846,
  "epicenter": {
    "district": "Nashik",
    "district_code": "MH-15",
    "event_summary": "Unverified rumor claiming reimposition of 40% export duty on onion produce.",
    "current_velocity_index": 78.4,
    "current_sentiment": -0.62
  },
  "predicted_contagion_pathways": [
    {
      "destination_district": "Ahmednagar",
      "destination_code": "MH-14",
      "geographic_relation": "Direct Southern Border / Shared Agricultural Trade Corridor",
      "contagion_probability": 0.864,
      "projected_impact_time": "2026-10-19T21:30:00Z",
      "projected_sentiment_drop": -0.45,
      "recommended_preemptive_actions": [
        "Issue authenticated notice to Ahmednagar APMC secretaries denying export curbs.",
        "Broadcast video statement from Director of Marketing via regional WhatsApp networks."
      ]
    },
    {
      "destination_district": "Jalgaon",
      "destination_code": "MH-18",
      "geographic_relation": "Direct Eastern Border / Khandesh Transport Highway",
      "contagion_probability": 0.792,
      "projected_impact_time": "2026-10-19T22:00:00Z",
      "projected_sentiment_drop": -0.38,
      "recommended_preemptive_actions": [
        "DIO Jalgaon to push joint circular with Agriculture Department by 20:30 IST."
      ]
    },
    {
      "destination_district": "Chhatrapati Sambhajinagar",
      "destination_code": "MH-19",
      "geographic_relation": "Secondary Graph Hop via Ahmednagar / Jalna Highway",
      "contagion_probability": 0.715,
      "projected_impact_time": "2026-10-19T23:30:00Z",
      "projected_sentiment_drop": -0.31,
      "recommended_preemptive_actions": [
        "Alert Marathwada regional media desk; schedule morning press briefing."
      ]
    }
  ]
}
```

---

## 9. Bureaucratic Roles, Governance Personas & Escalation Workflows

Project EUREKA reflects the real-world administrative hierarchy of the Maharashtra Civil Services. Access control, action authorization, and reporting are partitioned across **4 Bureaucratic Personas** using cryptographically signed JSON Web Tokens (JWT).

```mermaid
flowchart LR
    subgraph P1["Persona 1: Central Command"]
        DG["DG State Admin<br/>(DGIPR Central HQ)"]
    end

    subgraph P2["Persona 2: Executive Leadership"]
        CMO["CMO / Cabinet Observer<br/>(Chief Minister's Office)"]
    end

    subgraph P3["Persona 3: Executive Ground Authority"]
        DM["District Collector / Magistrate<br/>(District Level - e.g. MH-12)"]
    end

    subgraph P4["Persona 4: Operational Field Desk"]
        DIO["District Information Officer<br/>(DIO Desk - Ground Operations)"]
    end

    DIO -->|"Submits Releases & Fact-Checks"| DM
    DM -->|"Signs Off Rebuttals (90m SLA)"| DG
    DG -->|"Statewide Audited Aggregates"| CMO
    DG -.->|"Issues Policy Overrides"| DM
    CMO -.->|"Strategic Inquiries & Directives"| DG
```

### Role-Based Access Control (RBAC) Matrix

| Persona / Role | Administrative Scope | Authentication Guard (`Role`) | Maha-Command Center (MCC) Views | Authorized System Actions | SLA & Escalation Accountability |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Director General (DG) State Admin** | Statewide (All 36 Districts, 6 Divisions) | `ROLE_STATE_ADMIN` | Statewide Master HUD, 36-District League Table, Cross-Division Contagion Radar, Audit Ledger | • Override system-generated scores<br/>• Reassign fact-check tickets across districts<br/>• Configure statewide SLA thresholds<br/>• Issue inter-departmental inquiries | Accountable to Chief Secretary & Hon'ble Minister (IPR) for statewide communication cohesion. |
| **District Collector / Magistrate (DM)** | District Specific (e.g., `MH-04` Thane) | `ROLE_DISTRICT_COLLECTOR` | District War Room HUD, 90-Minute Crisis Countdown Timer, Departmental TAT Tracker | • Cryptographically authorize crisis rebuttals<br/>• Sign off on official press statements<br/>• Request state-level fact-check assistance<br/>• View localized StGNN diffusion forecasts | Sole authority responsible for District Crisis SLA (Pillar 3 Crisis SLA score: 30.0 vs 0.0 points). |
| **District Information Officer (DIO Desk)** | District Field Operations | `ROLE_DIO_DESK` | Field Ingestion Desk, Clipping Upload Portal, Fact-Check Ticket Queue, Local Media Directory | • Ingest official releases and circulars<br/>• Upload and annotate regional press clippings<br/>• Draft preliminary rebuttal copy for DM sign-off<br/>• Log local press conference transcripts | Accountable for Pillar 1 Volume saturation and sub-45 minute response time (Pillar 2 TAT). |
| **CMO / Cabinet Observer** | Statewide Executive (Read-Only) | `ROLE_CABINET_OBSERVER` | Executive High-Level Briefing, 4 Executive Dossiers, Real-Time Crisis War Room | • View real-time statewide sentiment index<br/>• Inspect 6-hour predictive diffusion vectors<br/>• Export audited PDF dossiers for cabinet meetings<br/>• Drill down into historical district rankings | Zero operational input; provides real-time strategic awareness for the Chief Minister and Council of Ministers. |

---

## 10. Summary & Strategic Impact for Democratic Governance

Project EUREKA marks the definitive transition of public communications from retrospective, intuitive guesswork into an **exact, predictive, and mathematically verified science**:

1. **Democratic Accountability:** The 100-Point Composite Index provides the first objective, auditable metric measuring how transparently and rapidly government institutions communicate with their citizens.
2. **Pre-Emptive Narrative Defense:** Rather than chasing rumors hours after they spark panic, the StGNN neural engine alerts leadership 6 hours in advance, enabling preventative truth dissemination.
3. **Linguistic Equity:** Native Indic language processing (MuRIL Devanagari normalization) ensures rural voices in Varhadi, Ahirani, or Marathwada dialects receive the exact same high-priority administrative responsiveness as urban English publications.
4. **Frugal Architectural Excellence:** Through INT8 post-training quantization, centralized NVIDIA Triton micro-batching, serverless cloud NLP evaluation, and asynchronous Celery/Redis chunk streaming, EUREKA achieves massive state scale with minimal infrastructure footprint.

---

*Project EUREKA: Empowering governance through truth, speed, and mathematical rigor.*

---

## 11. Autonomous Hermes Agent & Neo4j Spatio-Temporal Knowledge Graph Operations

### 1. Hermes Agent Programmatic Integration & Architecture
To enable automated narrative analysis, draft rebuttal staging, and cross-database graph synchronization, Project EUREKA integrates the **Hermes Agent** (Nous Research) via its official **API Server interface**:

```
+----------------------------------------------------------------------------------------------------+
|                                 HERMES AGENT ORCHESTRATION PIPELINE                                |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [FastAPI Backend Router]                                                                          |
|         |                                                                                          |
|         v                                                                                          |
|  [Hermes Orchestrator Wrapper] ---> [Hermes Client (HTTP /v1)] ---> [Hermes Agent Server]          |
|         |                                                                  |                       |
|         |  (Tool Calls via Deterministic Sandbox)                          v                       |
|         +----------------------------------------------------> [4 Allowlisted Tools]               |
|                                                                        |                           |
|       +------------------------------------+---------------------------+-------------------+       |
|       |                                    |                           |                   |       |
|       v                                    v                           v                   v       |
| [tool_translate_and_normalize]   [tool_stage_dm_rebuttal]   [tool_execute_dm_signoff] [tool_sync_neo4j]
| • Google AI Studio Gemini Flash  • PostgreSQL Staging       • Enforces Collector RBAC • Neo4j Cypher  
| • Zero-shot Devanagari Dialects  • status: pending_review   • Checks 90m SLA Window   • MERGE (e)-[r] 
| • Deterministic JSON Extraction  • No auto-approval allowed • Writes Audit & Outbox   • AFFECTS, CLAIM
+----------------------------------------------------------------------------------------------------+
```

* **Programmatic HTTP API Interface (`eureka.hermes.hermes_client`):** Rather than spawning brittle CLI subprocesses, EUREKA communicates with Hermes using its standard OpenAI-compatible API Server endpoints (`POST /v1/chat/completions`, `GET /v1/models`, `POST /v1/responses`).
* **Protocol Demarcation:** 
  * *API Server:* Used for backend-to-agent programmatic orchestration and multi-step reasoning.
  * *Agent Client Protocol (ACP):* Reserved for IDE/editor host integration (not backend runtime).
  * *Model Context Protocol (MCP):* Provides standardized tool servers to the agent.
* **Deterministic Tool Execution Layer (`eureka.hermes.agent_tools`):**
  1. `tool_query_all_36_districts(division, include_metrics, sort_by)`: Queries PostgreSQL 16 for all 36 Maharashtra administrative districts (`MH-01` to `MH-36`), including English and Marathi bilingual names, division codes, and computes live 100-Point Composite Governance Index across all 4 pillars (Volume, TAT, Sentiment, Crisis SLA). Supports division filtering and multi-metric sorting.
  2. `tool_translate_and_normalize(raw_text)`: Connects to Google AI Studio's `gemini-flash-latest` with strict JSON schema enforcement (`marathi_text`, `english_text`, `detected_dialect`, `extracted_district_code`). Automatically strips markdown fences and falls back to deterministic Indic rule extractors if the cloud API is throttled.
  3. `tool_stage_dm_rebuttal(ticket_id, district_code, draft_text)`: Updates `fact_check_tickets` in PostgreSQL, storing draft rebuttals under `status = 'pending_review'` without triggering administrative publication.
  4. `tool_execute_dm_signoff(ticket_id, reviewer_id, role, district_code, action)`: Validates that only `ROLE_DISTRICT_COLLECTOR` matching the ticket's district can authorize sign-offs. Computes whether the rebuttal occurred within the 90-minute SLA window (`refuted_within_sla_90m = True/False`), records the action in `human_review_actions`, and queues transactional `outbox_events`.
  5. `tool_sync_neo4j_nodes(district_code, event_id, claim_text)`: Idempotently creates and links `(:District)`, `(:CanonicalEvent)`, and `(:Claim)` nodes using Cypher batch statements.
* **Non-Negotiable Human-in-the-Loop Governance:** Hermes is explicitly prohibited from autonomously signing off on rebuttals or altering verified factual records. Any autonomous attempt by the agent to approve a ticket is intercepted and rejected with HTTP 403 Forbidden.

---

### 1.1 System Prompts Status & Taxonomy
All system prompts across Project EUREKA have been standardized, hardened, and strictly aligned with DGIPR governance:

1. **Hermes Executive Orchestrator Prompt (`backend/src/eureka/hermes/orchestrator.py`):**
   * **Role:** Lead AI Media Governance & Incident Analyst for DGIPR Maharashtra.
   * **Scope:** 36 administrative districts (`MH-01` to `MH-36`) across 6 revenue divisions (Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, Nagpur).
   * **3 Governance Pillars:** Information Volume (35 pts), Net Sentiment Index (35 pts), and 90-Minute Crisis SLA (30 pts) (100 Points Total, TAT retired).
   * **Tool Access:** Strictly restricted to 4 allowlisted tools (`tool_query_all_36_districts`, `tool_translate_and_normalize`, `tool_stage_dm_rebuttal`, `tool_sync_neo4j_nodes`).
   * **Guardrail:** Non-negotiable prohibition on autonomous ticket sign-off or publishing.

2. **Multilingual Indic Translation Prompt (`backend/src/eureka/llm/multilingual_translator.py`):**
   * **Target:** Google AI Studio Gemini Flash (`gemini-flash-latest`).
   * **Dialect Coverage:** Standard Marathi, Varhadi (Vidarbha), Ahirani (Khandesh), Malvani/Konkani (Konkan), Dangi (Northern border), Deshi / Marathwada colloquial.
   * **Output Schema:** Zero-slop JSON format: `{"marathi_text": "...", "english_text": "...", "detected_dialect": "...", "extracted_district_code": "MH-XX"}`.
   * **Standards:** GIGW 3.0 and UX4G bilingual accessibility guidelines.

3. **Cloud Evaluator Prompts (`backend/src/eureka/llm/cloud_evaluator.py`):**
   * **Civic Sentiment Prompt (Groq LLaMA 3):** Strict scalar mapping $[-1.0, 1.0]$ with 4 category tags (critical_grievance, neutral_inquiry, positive_governance, general_discussion).
   * **Crisis SLA Verification Prompt (Groq LLaMA 3):** Deterministic verification evaluating whether an official rebuttal factually refutes the core claim within the 90-minute SLA window.

---

### 1.2 RAG Status (Retrieval-Augmented Generation)
* **Graph-RAG (Active & Implemented):**
  * Powered by Neo4j 5.18 Spatio-Temporal Knowledge Graph containing 17,020+ nodes and 1,500+ edges.
  * Connects `(:District)`, `(:CanonicalEvent)`, `(:Claim)`, `(:Release)`, `(:Author)`, and `(:Platform)` with `[:AFFECTS]`, `[:CONTAINS_CLAIM]`, `[:BORDERS]`, `[:REPORTS_ON]`, and `[:RELATES_TO]`.
  * Traversal queries retrieve real-time narrative diffusion context, 152 geographic border adjacencies, and historical event precedent to enrich agent dossiers and rebuttal staging.
* **Dense Vector RAG (Not Implemented / Inactive):**
  * PostgreSQL `pgvector` extension is not enabled (`SELECT * FROM pg_extension WHERE extname = 'vector'` returns 0 rows).
  * No standalone vector database (e.g., ChromaDB, Qdrant, FAISS) is currently deployed in the runtime.
  * Context retrieval relies on deterministic **Graph-RAG + relational entity lookups** in PostgreSQL 16.

---

### 1.3 Embeddings Status
Project EUREKA employs four distinct embedding representations across the machine learning and analytics stack:

1. **MuRIL Multilingual Indic Text Embeddings (768-dim):**
   * `MuRILEncoder` (`backend/src/eureka/processor/export_models.py`, `backend/src/eureka/model_repository/muril_encoder/`).
   * Generates 768-dimensional dense representations for Marathi, Hindi, and English text.
   * Exported to ONNX with Dynamic INT8 Post-Training Quantization (PTQ) for high-throughput Triton / CPU inference.
2. **FANG Context Embeddings (816-dim total):**
   * `FANGJointObjective` fuses 768-dim claim text embeddings + 16-dim source credibility features + 32-dim graph context features into unified rumor logits and authenticity confidence scores.
3. **STGNN Spatio-Temporal Graph Node Embeddings:**
   * Normalized degree Laplacian ($36 \times 36$) + temporal node feature tensors ($B \times 36 \times 3 \times 12$) passing through spatial graph recurrence and temporal attention to forecast 6-hour rumor diffusion across Maharashtra districts.
4. **Continuous Sentiment Embeddings:**
   * Continuous scalar mapping $[-1.0, 1.0]$ generated via fine-tuned RoBERTa / MuRIL classifiers with zero-shot Groq fallbacks.

---

### 1.4 Agent & Subagent Architecture
Project EUREKA employs a multi-tiered agentic hierarchy ensuring determinism, safety, and operational speed:

1. **Primary Agent — Hermes Autonomous Orchestrator:**
   * Programmatic integration via Nous Research HTTP API Server (`/v1/chat/completions`) with one-shot CLI and deterministic staging fallbacks.
   * Narrow allowlist of 4 domain tools.
   * Enforces strict RBAC scoping and prevents autonomous action sign-off.
2. **Specialized Micro-Agents (Subagents):**
   * **Linguistic Translation Subagent (`multilingual_translator.py`):** Powered by Google AI Studio Gemini Flash for dialect extraction, JSON structuring, and bilingual normalization.
   * **Crisis Verification Subagent (`cloud_evaluator.py`):** Powered by Groq LLaMA 3 for deterministic ($T=0.0$) refutation verification.
   * **Graph Outbox Subagent (`outbox_worker.py`):** Background worker using `FOR UPDATE SKIP LOCKED` to idempotently stream PostgreSQL changes to Neo4j.
   * **Edge Ingestion Subagents (`quad_ingestion` / `NEWS_API.py`):** Headless Crawl4AI + NewsAPI scrapers feeding Celery task queues.

---

### 2. Spatio-Temporal Knowledge Graph & Neo4j Web Explorer
Project EUREKA maintains a high-density spatio-temporal knowledge graph in **Neo4j 5.18 Community**, synchronized in real time with PostgreSQL 16 via the **Transactional Outbox Worker**.

#### Current Graph Topology & Metrics
* **Total Nodes:** 17,020+ active entities.
* **Active Node Labels:** `District`, `CanonicalEvent`, `Claim`, `Release`, `Department`, `MediaEvent`, `Content`, `Author`, `Platform`, `Citation`, `Entity`.
* **Graph Relationships:** `AFFECTS` (1,500+ edges), `BORDERS` (152 geographic border adjacencies across Maharashtra's 36 districts), `CONTAINS_CLAIM`, `AUTHORED`, `PUBLISHED_ON`, `CITES`, `MENTIONS`, `RELATES_TO`.

#### Neo4j Web Browser Access
Operators and researchers can explore the live graph network directly:
1. Navigate to: **`http://localhost:7474`**
2. Connection URL: **`bolt://localhost:7687`**
3. Authentication: `neo4j` / configured graph password (`savi_graph_secret`)

#### Authoritative Cypher Exploration Queries

**1. Incident & Claim Diffusion Network across Maharashtra Districts:**
```cypher
MATCH (d:District)<-[a:AFFECTS]-(e:CanonicalEvent)
OPTIONAL MATCH (e)-[c:CONTAINS_CLAIM]->(claim:Claim)
RETURN d, a, e, c, claim
LIMIT 120;
```

**2. Physical Border Contagion Mesh (152 Inter-District Adjacencies):**
```cypher
MATCH (d1:District)-[r:BORDERS]->(d2:District)
RETURN d1, r, d2;
```

**3. Social Media Propagation & Content Provenance:**
```cypher
MATCH (a:Author)-[r1:AUTHORED]->(c:Content)-[r2:PUBLISHED_ON]->(p:Platform)
RETURN a, r1, c, r2, p
LIMIT 150;
```

**4. Complete Graph Metamodel:**
```cypher
CALL db.schema.visualization();
```

---

### 3. Current Live Service Deployment Summary

| Service Layer | Host / Port | Underlying Process / Container | Operational Status |
| :--- | :--- | :--- | :--- |
| **Relational Master (PostgreSQL 16)** | `localhost:5433` | Docker (`savi-postgres-master`) | **Online & Healthy** (26 tables loaded) |
| **Knowledge Graph (Neo4j 5.18)** | `localhost:7474` (HTTP) / `7687` (Bolt) | Docker (`savi-neo4j-compute`) | **Online & Healthy** (17,020+ nodes) |
| **Transactional Outbox Worker** | Background Worker | `eureka.conclusion.outbox_worker` | **Synchronized** (Zero lag, ACID to Graph) |
| **Core API Engine (FastAPI)** | `http://127.0.0.1:8000` | Uvicorn (`eureka.api.main:app`) | **Healthy** (PostgreSQL & Neo4j connected) |
| **Command Deck (Next.js 16 MCC)** | `http://localhost:3000` | Next.js Production Build (`branch sarvdny`) | **Online** (`source: live_backend`, 36 districts) |
| **Vector Memory Store (Qdrant)** | `qdrant:6333` | Docker (`qdrant/qdrant:v1.9.0`) | **Operational** (Mem0 officer preferences) |
| **Nirdeshak Copilot Engine (v4)** | `FastAPI /api/v1/copilot` | Thesys C1 + Gemma Fallback + Fast-Path Router | **Online** (Dual-Path, Grounded OpenUI Lang) |

---

### 4. DGIPR Nirdeshak (निर्देशाक) Copilot: Architectural Specification, Mathematical Derivations & Code Implementation (v4)

The **DGIPR Nirdeshak Copilot** (`निर्देशाक`) is an enterprise-grade, read-only analytical copilot and generative UI interface natively integrated into the Maha-Command Center (MCC). Designed for the Government of Maharashtra, the copilot enables state ministers, district collectors, and information officers to interrogate complex governance intelligence in **Marathi, Hindi, or English** and receive dynamically streamed, role-governed, accessible visual artifacts (OpenUI Lang components and deterministic ViewSpecs) rather than passive text blobs.

---

#### 4.1 End-to-End System Architecture & Execution Lifecycle

Nirdeshak enforces a strict multi-stage deterministic pipeline where generative AI is constrained to UI presentation, while all facts, numbers, and scopes originate from governed backend tools:

```
+-----------------------------------------------------------------------------------------------------------------------+
|                                      DGIPR NIRDESHAK (निर्देशाक) DUAL-ENGINE LIFECYCLE                                |
+-----------------------------------------------------------------------------------------------------------------------+
|                                                                                                                       |
|  [Officer User Input] (Marathi / Hindi / English)                                                                     |
|         |                                                                                                             |
|         v                                                                                                             |
|  [Next.js 16 Front-End Drawer] (src/components/copilot/CopilotDrawer.tsx)                                             |
|         |                                                                                                             |
|         |  POST /api/v1/copilot/query (with Bearer JWT)                                                               |
|         v                                                                                                             |
|  [Next.js API Route Proxy] (src/app/api/v1/copilot/[...path]/route.ts)                                                |
|         |  Rewrites to http://127.0.0.1:8000/api/v1/copilot/query with X-Accel-Buffering: no                          |
|         v                                                                                                             |
|  [FastAPI Streaming Router] (eureka/copilot/router.py)                                                                |
|         |                                                                                                             |
|         +---> [1. JWT Auth & RBAC Extraction] (Principal: username, role, district_code, division)                    |
|         |                                                                                                             |
|         +---> [2. Fast-Path Deterministic Intent Router] (eureka/copilot/intent_router.py)                            |
|         |     |                                                                                                       |
|         |     |-- Latency < 5ms: Matches governance_overview, district_breakdown, crisis_sla_timeline                 |
|         |     |-- Emits Immediate Canonical ViewSpec (Zero Hallucination, Zero Artificial Delay)                      |
|         |     v                                                                                                       |
|         +---> [3. Dual-Path Background Upgrade] (eureka/copilot/c1_client.py / gemma_client.py)                        |
|         |     |                                                                                                       |
|         |     |-- Thesys C1 (https://api.thesys.dev/v1/embed) or Gemma-4-26B / Gemini Flash                           |
|         |     |-- Strict 6.0s SLA Deadline; fail-open fallback preserves initial ViewSpec if timeout occurs           |
|         |     v                                                                                                       |
|         +---> [4. Grounding Validator & GIGW 3.0 Filter] (eureka/copilot/openui_generator.py)                          |
|         |     |-- Mathematical Verification: 0.05 tolerance against executed read-only tool data                      |
|         |     |-- Whitelist Check: Validates component tags against ALLOWED_COMPONENTS                                |
|         |     v                                                                                                       |
|         +---> [5. SSE Chunk Streaming] -> Real-time streaming chunks without buffering                                |
|         |     v                                                                                                       |
|         +---> [6. Done Event & Client Render] -> Interactive OpenUI Lang components or ViewSpec fallback             |
|                                                                                                                       |
+-----------------------------------------------------------------------------------------------------------------------+
```

---

#### 4.2 Mathematical Derivations & Analytical Formulas

Every number rendered in the Nirdeshak Copilot is mathematically derived from raw transactional signals across Maharashtra's 36 administrative districts.

##### 1. Information Volume Pillar (0 - 35 Points)
The volume pillar measures whether a district administration proactively communicates authenticated news and public circulars, preventing an information vacuum. Evaluated strictly over a 24-hour window:

$$\text{VolumeScore} = 35.0 \times \min\left(\frac{\text{TotalReleases}}{300}, \; 1.0\right)$$

Where:
* Saturates strictly at 300 releases per evaluation window.
* Boundary conditions:
  * For $V = 0$: $\text{VolumeScore} = 0.0$ pts.
  * For $V = 150$: $\text{VolumeScore} = 17.50$ pts.
  * For $V \ge 300$: $\text{VolumeScore} = 35.00$ pts (capped).

##### 2. Turnaround Time (TAT) Speed Deprecation Notice
Per DGIPR Executive Directive, Turnaround Time (TAT) is **retired from the composite index score calculation**. It is preserved in the database schema strictly for auxiliary operational monitoring:
* **Output Velocity Metric:** $\% \text{ of press releases published with TAT} \le 60\text{ minutes}$.
* **Chronological Integrity Rule:**
  $$\text{If } T_{\text{published}} < T_{\text{event}} \implies \text{Falsified Record Flagged & Rejected by CSVAdapter}$$
* **Operational Monitoring Brackets (Auxiliary Only):**
  * $\Delta t \le 45\text{ min} \implies \text{Velocity Target Met}$ (Gold standard).
  * $\Delta t > 120\text{ min} \implies \text{Operational Escalation Warning}$.

##### 3. Net Sentiment Index (NSI) Pillar (Max: 35 Points)
The sentiment pillar maps public tone across regional news, citizen feedback, and media commentary using the MuRIL multilingual neural model. Each analyzed unit $i \in \{1, \dots, N\}$ receives a polarity classification:

$$P_i \in \{-1\text{ (Negative)}, \; 0\text{ (Neutral)}, \; +1\text{ (Positive)}\}$$

The **Net Sentiment Index (NSI)** is computed as:

$$\text{NSI} = \frac{N_{\text{pos}} - N_{\text{neg}}}{N_{\text{total}}} \quad \in [-1.0, \; +1.0]$$

The NSI scalar is mapped linearly into the 35-point governance pillar:

$$\text{SentimentScore} = 35.0 \times \left(\frac{\text{NSI} + 1.0}{2.0}\right)$$

* For $\text{NSI} = +1.0$ (Unanimously positive coverage): $\text{SentimentScore} = 35.0$.
* For $\text{NSI} = 0.0$ (Balanced/neutral civic tone): $\text{SentimentScore} = 17.50$.
* For $\text{NSI} = -1.0$ (Severe civic dissatisfaction): $\text{SentimentScore} = 0.0$.
*(If $N_{\text{total}} = 0$, neutral baseline $\text{NSI} = 0.0 \implies \text{SentimentScore} = 17.50$ pts)*

##### 4. Crisis SLA & Rumor Containment Pillar (Max: 30 Points)
The crisis pillar assesses whether active rumors or unrefuted viral misinformation tickets are lingering unaddressed. EUREKA evaluates the proportion of rumors refuted within the 90-minute SLA window:

$$\text{CrisisScore} = 30.0 \times \min\left(\frac{N_{\text{refuted\_within\_90m}}}{N_{\text{rumors}}}, \; 1.0\right)$$

* **Critical Division-by-Zero Protection:** If $N_{\text{rumors}} = 0$, the engine strictly awards the full $30.0$ points ($\text{CrisisScore} = 30.0$).
* Resolution strictly $< 90.0$ minutes is required for containment compliance.

##### 5. 100-Point Composite Governance Index ($CI$)
The overall district governance index is the exact sum of the three orthogonal pillars (with TAT retired to 0.0):

$$\text{CompositeIndex} = \text{VolumeScore} + \text{SentimentScore} + \text{CrisisScore} \quad \in [0.0, \; 100.0]$$

Where:
$$\text{VolumeScore} \in [0.0, \; 35.0], \quad \text{SentimentScore} \in [0.0, \; 35.0], \quad \text{CrisisScore} \in [0.0, \; 30.0]$$
$$\text{Maximum Composite Total} = 35.0 + 35.0 + 30.0 = 100.0\text{ Points}$$

##### 6. Spatio-Temporal Contagion Risk (StGNN / A3TGCN)
For the predictive radar (`forecast` tool), EUREKA models Maharashtra as a graph $\mathcal{G} = (\mathcal{V}, \mathcal{E})$, where $|\mathcal{V}| = 36$ districts, and $\mathcal{E}$ represents the 152 physical border adjacencies. The normalized graph Laplacian $\tilde{L}$ is computed as:

$$\tilde{L} = I_N - D^{-1/2} A D^{-1/2}$$

Given historical node feature tensors $X \in \mathbb{R}^{B \times 36 \times F \times T}$ ($F=3$ features: Volume, NSI, Rumor Count; $T=12$ time intervals of 30 minutes each), the A3TGCN layer evaluates spatial graph convolution coupled with temporal attention:

$$H^{(l)} = \text{Softmax}\left(\frac{Q K^T}{\sqrt{d_k}}\right) V \cdot \left(\tilde{L} X W\right)$$

The output yields the **6-Hour Escalation Probability**:

$$P(\text{Crisis}_{t+6\text{h}} \mid \text{District}_d) = \sigma\left(W_o H^{(L)} + b_o\right) \quad \in [0.0, \; 1.0]$$

---

#### 4.3 The 10 Governed Read-Only Tools

To guarantee total defense against SQL injection, data exfiltration, and model hallucination, the Copilot has **zero access to raw SQL, Cypher, or shell execution**. It communicates exclusively through 10 strictly typed Pydantic tools (`extra="forbid"`):

| Tool Name | Input Arguments | Scoping / RBAC Enforcement | Description & Return Artifact |
| :--- | :--- | :--- | :--- |
| **`league_table`** | `division?: str`, `sort_by?: str` | Statewide clearance for Admin; Division Head scoped to division. | Returns ranked 36-district leaderboard with 4-pillar scores and composite indices. |
| **`district_profile`** | `district_code: str` | Collector/DIO restricted to assigned district; Admin statewide. | Returns comprehensive 4-pillar breakdown, raw metric counts, and volume totals. |
| **`pillar_breakdown`** | `district_code: str`, `pillar_name: str` | Scoped by district clearance. | Deep-dive metrics for Volume, TAT Speed, Sentiment, or Crisis SLA. |
| **`trend`** | `district_code: str`, `metric: str`, `days?: int` | Scoped by district clearance. | 30-day historical time-series vector for the specified performance metric. |
| **`compare_districts`** | `district_codes: List[str]` (2 to 5) | Verifies clearance for each requested district. | Side-by-side comparative matrix across 4 pillars. |
| **`active_rumors`** | `district_code?: str` | District Collector scoped strictly to assigned district. | Active unrefuted fact-check tickets, 90-minute SLA countdowns, and claims. |
| **`forecast`** | `district_code: str` | Scoped by district clearance. | 6-hour spatio-temporal AI rumor diffusion forecast with neighbor contagion risks. |
| **`neighbors`** | `district_code: str`, `max_hops?: int` (1 or 2) | Scoped by district clearance. | Physical border adjacency sub-graph and inter-district risk transfer links. |
| **`division_rollup`** | `division: str` | Scoped by revenue division clearance. | Aggregated governance metrics rolled up across an entire division. |
| **`dossier_summary`** | `district_code: str` | Scoped by district clearance. | Executive intelligence briefing combining profile, active rumors, and diffusion forecast. |

---

#### 4.4 Technical Implementation: Core Python & TypeScript Code Blocks

##### 1. Fast-Path Deterministic Intent Router (`backend/src/eureka/copilot/intent_router.py`)
Intercepts canonical queries in under 5ms, generating fully grounded OpenUI `ViewSpec` payloads without waiting for LLM completion:

```python
def match_fast_path(
    query: str, principal: CopilotPrincipal
) -> Optional[Tuple[str, Dict[str, Any], Dict[str, Any]]]:
    """Inspects query text and returns (tool_name, tool_args_dict, tool_result) if a fast path matches.
    Returns None if the query requires conversational LLM exploration.
    """
    if not query:
        return None

    q_lower = query.strip().lower()

    # 1. COMPARE INTENTS (e.g. "compare Nashik and Ahilyanagar", "तुलना करा")
    compare_triggers = ["compare", "versus", " vs ", "तुलना", "मुकाबला"]
    if any(t in q_lower for t in compare_triggers) or " and " in q_lower:
        d_codes = extract_all_districts_from_query(query)
        if len(d_codes) >= 2:
            args = {"district_codes": d_codes[:5]}
            res = tool_compare_districts(principal, CompareDistrictsInput(**args))
            return ("compare_districts", args, res)

    # 2. ACTIVE RUMORS / CRISIS INTENTS
    rumor_triggers = ["rumor", "crisis", "sla", "misinformation", "अफवा", "संकट"]
    if any(t in q_lower for t in rumor_triggers):
        d_code = extract_district_from_query(query) or principal.district_code
        args = {"district_code": d_code} if d_code else {}
        res = tool_active_rumors(principal, ActiveRumorsInput(**args))
        return ("active_rumors", args, res)

    # 3. DISTRICT PROFILE INTENTS (Single district queries)
    d_code = extract_district_from_query(query)
    if d_code:
        args = {"district_code": d_code}
        res = tool_district_profile(principal, DistrictProfileInput(**args))
        return ("district_profile", args, res)

    # 4. LEAGUE TABLE / OVERVIEW INTENTS
    overview_triggers = ["leaderboard", "rank", "ranking", "top", "score", "तालिका", "गुण"]
    if any(t in q_lower for t in overview_triggers) or len(q_lower.split()) <= 4:
        args = {}
        res = tool_league_table(principal, LeagueTableInput(**args))
        return ("league_table", args, res)

    return None
```

##### 2. Thesys C1 Generative UI Client (`backend/src/eureka/copilot/c1_client.py`)
Generates rich dynamic UI specs via the Thesys C1 OpenAI-compatible endpoint with streaming and strict schema validation:

```python
class ThesysC1Client:
    """Client for Thesys C1 endpoint (https://api.thesys.dev/v1/embed) delivering generative UI specs."""

    def __init__(self):
        self.settings = get_copilot_settings()
        self.api_key = self.settings.get_effective_thesys_key()
        self.base_url = "https://api.thesys.dev/v1/embed"

    async def generate_ui_spec(
        self,
        prompt: str,
        tool_data: Dict[str, Any],
        language: str = "en",
    ) -> Dict[str, Any]:
        """Calls Thesys C1 chat completions to generate an OpenUI ViewSpec."""
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": "thesys-c1",
            "messages": [
                {"role": "system", "content": C1_SYSTEM_PROMPT},
                {"role": "user", "content": f"Query: {prompt}\nLanguage: {language}\nData: {json.dumps(tool_data)}"}
            ],
            "temperature": 0.0,
            "stream": False,
        }
        async with httpx.AsyncClient(timeout=6.0) as client:
            resp = await client.post(self.base_url, headers=headers, json=payload)
            resp.raise_for_status()
            return resp.json()
```

##### 3. Canonical 36-District Spatial Resolution & Alias Normalizer (`backend/src/eureka/copilot/reference_data.py` / `tools.py`)
Resolves English, Marathi inflections, Hindi, colloquialisms, and RTO codes to canonical ISO keys:

```python
# Canonical reconciliation: Thane is MH-04, Palghar is MH-03, Mumbai City is MH-01, Nashik is MH-21, Ahilyanagar is MH-25
CANONICAL_DISTRICTS = {
    "MH-01": {"name_en": "Mumbai City", "name_mr": "मुंबई शहर", "division": "Mumbai"},
    "MH-02": {"name_en": "Mumbai Suburban", "name_mr": "मुंबई उपनगर", "division": "Mumbai"},
    "MH-03": {"name_en": "Palghar", "name_mr": "पालघर", "division": "Konkan"},
    "MH-04": {"name_en": "Thane", "name_mr": "ठाणे", "division": "Konkan"},
    "MH-05": {"name_en": "Raigad", "name_mr": "रायगड", "division": "Konkan"},
    "MH-21": {"name_en": "Nashik", "name_mr": "नाशिक", "division": "Nashik"},
    "MH-25": {"name_en": "Ahilyanagar", "name_mr": "अहिल्यानगर", "division": "Nashik"},
    # Full 36 Maharashtra districts...
}

def extract_district_from_query(query: str) -> Optional[str]:
    """Extract official district code from conversational query in Marathi, English, or MH-XX code."""
    if not query:
        return None
    import re
    q_lower = query.lower()

    # 1. Direct regex match for MH-XX or MHXX
    mh_match = re.search(r'\b(MH-?\d{1,2})\b', query, re.IGNORECASE)
    if mh_match:
        code = mh_match.group(1).upper()
        if not code.startswith("MH-"):
            code = f"MH-{code[2:]}"
        parts = code.split("-")
        if len(parts) == 2 and len(parts[1]) == 1:
            code = f"MH-0{parts[1]}"
        return code

    # 2. Check alias map sorted by length descending (longest match first)
    for alias, code in sorted(DISTRICT_ALIAS_MAP.items(), key=lambda x: len(x[0]), reverse=True):
        if re.search(r'\b' + re.escape(alias) + r'\b', q_lower) or alias in query:
            return code

    return None
```

##### 4. Dual-Path SSE Streaming Engine (`backend/src/eureka/copilot/router.py`)
Streams progressive unbuffered chunks to the client with an immediate fast-path ViewSpec and background upgrade:

```python
@router.post("/query", summary="Execute Nirdeshak Copilot Query with SSE Streaming")
async def copilot_query(
    payload: CopilotQueryRequest,
    current_user: TokenData = Depends(get_current_user),
):
    principal = CopilotPrincipal(
        username=current_user.username,
        role=current_user.role.value if hasattr(current_user.role, "value") else str(current_user.role),
        district_code=current_user.district_code,
    )

    async def event_generator() -> AsyncGenerator[str, None]:
        user_query = payload.query.strip()
        lang = payload.language if payload.language in ("mr", "hi", "en") else detect_language(user_query)

        yield f"event: status\ndata: {json.dumps({'step': 'init', 'message': 'Processing query...', 'language': lang})}\n\n"

        # Step 1: Fast-Path Deterministic Evaluation (<5ms)
        fast_match = match_fast_path(user_query, principal)
        if fast_match:
            tool_name, tool_args, tool_result = fast_match
            view_spec = generate_deterministic_view_spec(tool_name, tool_result, lang)
            # Immediate unbuffered emission
            yield f"event: fast_view\ndata: {json.dumps({'viewSpec': view_spec})}\n\n"

        # Step 2: Background C1 / Generative AI Upgrade (6.0s Deadline)
        # Yields event: upgrade when synthesized, or closes cleanly with event: done
        ...

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache, no-transform"},
    )
```

##### 5. Number Grounding & GIGW 3.0 Accessibility Validator (`backend/src/eureka/copilot/openui_generator.py`)
Extracts every number in the generated OpenUI Lang and verifies it against the tool execution outputs:

```python
ALLOWED_COMPONENTS = {
    "Stack", "KpiCard", "DataTable", "BarChart", "LineChart", "GraphView", "Callout", "Heading", "Text"
}

def validate_openui_output(markup: str, tool_results: List[Dict[str, Any]]) -> Tuple[bool, List[str]]:
    """Strictly validate OpenUI Lang against component allowlist and ground numbers against tool data."""
    errors = []
    if not markup or not markup.strip():
        return False, ["Output is completely empty."]

    # 1. Check for disallowed HTML tags
    if re.search(r'<\s*(?:script|iframe|object|embed|style|a\s+href|img\s+src)', markup, re.IGNORECASE):
        return False, ["Output contains forbidden HTML tags."]

    # 2. Check component tags against allowlist
    tag_matches = re.findall(r'<\s*([A-Z][a-zA-Z0-9]+)', markup)
    for tag in tag_matches:
        if tag not in ALLOWED_COMPONENTS:
            errors.append(f"UNKNOWN_COMPONENT: Tag '<{tag}>' is not permitted.")

    # 3. Ground every numerical literal against tool data
    allowed_numbers = set()
    for res in tool_results:
        allowed_numbers.update(extract_all_numbers(res.get("data", {})))
    # Include standard pillar scaling limits
    allowed_numbers.update({0.0, 1.0, 20.0, 25.0, 30.0, 45.0, 90.0, 100.0})

    markup_numbers = extract_numbers_from_openui(markup)
    for num in markup_numbers:
        if not any(abs(num - allowed) < 0.05 for allowed in allowed_numbers):
            errors.append(f"FABRICATED_NUMBER: Literal '{num}' was not found in tool data.")

    return len(errors) == 0, errors
```

##### 6. Front-End Nirdeshak Drawer & Dual-Mode Hydration (`frontend/MCC/src/components/copilot/CopilotDrawer.tsx`)
Renders the interactive Nirdeshak slide-out drawer with live ViewSpec hydration, fallback rendering, and voice synthesis:

```tsx
// Frontend ViewSpec vs. Live OpenUI Lang switch
{msg.fallback && msg.viewSpec && msg.viewSpec.components ? (
  <div className="space-y-3">
    {msg.viewSpec.components.map((c: any, idx: number) => {
      if (c.component === 'Heading') return <Heading key={idx} level={c.level} text={c.text} />;
      if (c.component === 'Callout') return <Callout key={idx} type={c.type} message={c.message} />;
      if (c.component === 'KpiCard') return <KpiCard key={idx} title={c.title} value={c.value} unit={c.unit} status={c.status} />;
      if (c.component === 'DataTable') return <DataTable key={idx} columns={c.columns} rows={c.rows} caption={c.caption} />;
      if (c.component === 'BarChart') return (
        <BarChart key={idx} title={c.title} xKey={c.x_key} yKey={c.y_key} data={c.data}>
          <Text content={c.text_summary} />
        </BarChart>
      );
      return null;
    })}
  </div>
) : (
  renderFallbackMarkupOrText(msg.content)
)}
```

##### 7. Official Publication-Grade PDF Telemetry Exporter (`frontend/MCC/src/lib/exportTelemetryPdf.ts`)
Generates vector A4 Government of Maharashtra State Telemetry & Operations Reports:

```typescript
export function exportTelemetryReportPdf(options: TelemetryReportOptions = {}) {
  const {
    language = 'en',
    district = 'All Districts (Statewide)',
    scope = 'Statewide Clearance',
    period = 'Last 7 Days',
  } = options;

  // Constructs publication-grade print HTML with DGIPR Emblem, 3-Pillar Scorecards,
  // and Infrastructure Latency Audits formatted specifically for A4 portrait vector printing.
  const printWindow = window.open('', '_blank', 'width=900,height=800');
  if (printWindow) {
    printWindow.document.open();
    printWindow.document.write(printHtml);
    printWindow.document.close();
  }
}
```

---

#### 4.5 Security, Privacy & Compliance Matrix

| Security Parameter | Architecture Standard | Technical Enforcement Mechanism |
| :--- | :--- | :--- |
| **API Key Isolation** | Zero Secret Leakage | Enforced via `test_key_isolation_grep_codebase()`. `OPENUI_COPILOT_GEMINI_API_KEY` and `THESYS_API_KEY` can only exist in `eureka/copilot/`. |
| **User Privacy & Memory** | HMAC-SHA256 Pseudonymization | User IDs are hashed before storage in Qdrant (`hmac.new(secret, user_id, sha256).hexdigest()`). No plain-text identities stored. |
| **Right to be Forgotten** | Statutory Compliance | `DELETE /api/v1/copilot/memory` permanently purges all vector preferences for the authenticated officer. |
| **Prompt Injection Defense** | Passive Data Encapsulation | Tool outputs are serialized under `{"data": ...}` objects. Prompts explicitly instruct the LLM to treat tool text as raw data, never instructions. |
| **Accessibility Standard** | GIGW 3.0 & UX4G Compliance | Every chart (`BarChart`, `LineChart`, `GraphView`) must include a nested screen-reader summary `<Text>` and tabular alternative `<DataTable>`. |
| **District Code Single Truth** | Immutable Master Scope | Reconciled 36 districts where Thane is `MH-04`, Palghar is `MH-03`, Mumbai City is `MH-01`, Nashik is `MH-21`, Ahilyanagar is `MH-25`. |


---

## 12. EUREKA Nirdeshak Copilot & Decoupled Production Architecture (v4)

### 12.1 Mission & Strategic Governance Role
**DGIPR Nirdeshak Copilot** (`निर्देशाक`) serves as the autonomous AI intelligence and narrative copilot for the Maha-Command Center. It enables senior leadership, Divisional Directors, District Collectors, and Information Officers to converse directly with real-time operational state telemetry in **Marathi (मराठी)**, **Hindi (हिंदी)**, and **English**.

### 12.2 Decoupled Production Architecture
To guarantee absolute uptime, zero cold-start penalty, and isolated blast radiuses, Project EUREKA is deployed across two decoupled tiers:

```mermaid
flowchart TD
    subgraph Client ["Client Browser Tier"]
        UI["Maha-Command Center SPA (Next.js 16)"]
        DRAWER["Nirdeshak Copilot Drawer (OpenUI Lang)"]
        FAB["Bottom-Right Floating HUD Trigger"]
        UI --> DRAWER
        UI --> FAB
    end

    subgraph EdgeTier ["Presentation Tier: Vercel Edge"]
        V_STATIC["Edge CDN & Static Route Cache (30 Pages)"]
        V_PROXY["Dynamic Reverse Proxy (/api/v1/copilot/[...path])"]
        V_AUTH["Edge Token Exchange (jose HS256 JWT)"]
        DRAWER -->|SSE Query Stream| V_PROXY
        V_PROXY --> V_AUTH
    end

    subgraph CloudTier ["Intelligence Tier: Containerized Backend"]
        F_APP["FastAPI Application Engine (backend/Dockerfile)"]
        INTENT["Fast-Path Intent Router (<5ms Latency)"]
        GEN_UI["Generative UI Synthesizer (Thesys C1 / Gemma / Gemini)"]
        TOOLS["Governed Read-Only Data Services (PostgreSQL / Neo4j)"]
        ML_SUB["Spatio-Temporal Forecaster (EurekaA3TGCN / Heuristic Fallback)"]
        
        V_PROXY -->|HTTPS Forwarding / BACKEND_URL| F_APP
        F_APP --> INTENT
        F_APP --> GEN_UI
        INTENT --> TOOLS
        GEN_UI --> TOOLS
        TOOLS --> ML_SUB
    end

    subgraph Persistence ["Transactional & Graph Stores"]
        PG[("PostgreSQL 16 Master (Transactional Outbox)")]
        NEO[("Neo4j 5.x Graph (Topological Diffusion)")]
        REDIS[("Redis 7.x (Celery Task Broker & Memory Cache)")]
        TOOLS --> PG
        TOOLS --> NEO
        TOOLS --> REDIS
    end
```

### 12.3 Nirdeshak v2 Phase 1: Evidence Pack & 5-Point ClaimVerifier Architecture

Nirdeshak v2 strictly eliminates LLM hallucinations and unverifiable claims by enforcing an **Evidence-First, Claim-Based Verification Pipeline**:

```
+----------------------------------------------------------------------------------------------------+
|                         NIRDESHAK v2 PHASE 1: EVIDENCE-FIRST VERIFIER PIPELINE                     |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [Officer Governance Query]                                                                        |
|            │                                                                                       |
|            ▼                                                                                       |
|  [Evidence Pack Assembly] (eureka/copilot/evidence.py)                                             |
|  • Stable IDs: E1, E2, ... En                                                                      |
|  • 4,000-Token Strict Allocation Budget                                                            |
|  • Mandatory Schema: { id, source_table, source_id, as_of, source_status, source_url, data }       |
|  • Strict Role Scoping: DG State Admin (All-State) | Collector (Assigned Dist) | DIO Desk (Division)|
|            │                                                                                       |
|            ▼                                                                                       |
|  [Claim-Based LLM Synthesis Pass 1] (Gemma / Groq / Fallback)                                      |
|  • Output Format: Strict JSON (non-JSON payloads are immediately rejected)                         |
|  • Payload: { claims: [{ text, evidence: [ids], numbers: [{ value, evidence }] }], gaps: [], ... } |
|            │                                                                                       |
|            ▼                                                                                       |
|  [ClaimVerifier 5-Point Cryptographic & Logic Audit] (eureka/copilot/verifier.py)                   |
|  ├── 1. Citation Integrity: Every claim MUST cite existing, active evidence IDs (E1..En).          |
|  ├── 2. Exact Numerical Grounding:                                                                |
|  │      * Cross-references metric, entity, and value at display rounding.                          |
|  │      * Devanagari digit normalization (०, १, २, ... ९ -> 0, 1, 2, ... 9).                       |
|  │      * Strict local numbers only: zero global number pools, zero arbitrary whitelisting.        |
|  ├── 3. Spatio-Temporal Entity Audit: District names and dates must exist in verified database.   |
|  ├── 4. Second-Pass NLI Entailment: Separate secondary model pass verifies cited evidence entails  |
|  │      the stated claim. Unsupported claims are dropped or flagged.                               |
|  └── 5. Confident Abstention: If unsupported share > threshold or pack is empty -> ABSTAIN cleanly |
|         with: (a) what was found, (b) what is missing, and (c) suggested follow-up questions.       |
|            │                                                                                       |
|            ▼                                                                                       |
|  [Confidence Rating & Provenance Delivery]                                                         |
|  • High: All claims backed by structured tabular metrics                                           |
|  • Medium: Claims backed by retrieved text snippets & OCR                                          |
|  • Low: Partial evidence / Fallback demo data with prominent banner                                |
+----------------------------------------------------------------------------------------------------+
```

### 12.4 Nirdeshak v2 Phase 2: Hybrid Text Retrieval, Multilingual Entity Linking & Knowledge Subgraph Context

Phase 2 enriches the Evidence Pack with deep unstructured text retrieval and relational graph context:

1. **PostgreSQL Full-Text Search & Fuzzy Trigram Indexing:**
   - Simple configuration full-text index and `pg_trgm` extensions over `media_events.english_content`, `normalised_records`, claims, clippings, and audio transcripts.
   - Every text query applies strict role-scoping filters (`district_code`, `division`, date window).
2. **Multilingual Entity Linking & Temporal Parser (`entity_linking.py`):**
   - In-memory alias dictionary mapping 36 Maharashtra districts, government departments, flagship schemes (e.g., *Majhi Ladki Bahin*), officials, and media outlets.
   - Trigram fuzzy matching for misspelled queries across Marathi, Hindi, and English.
   - Temporal phrase parser resolving natural language timeframes (*"last week"*, *"मागील महिना"*, *"पिछले 24 घंटे"*) into ISO date windows.
3. **Background Asynchronous Extraction (Celery + Outbox):**
   - Scheduled Celery workers execute schema-based entity and claim extraction over normalized media feeds.
   - Writes verified entities, mentions, and relations to PostgreSQL, projecting updates to Neo4j via transactional outbox CDC events.
4. **Subgraph Context Expansion (`subgraph.py`):**
   - Seeds query from linked entities and expands 1 to 2 hops over curated relationship sets.
   - Hub suppression: Drops high-degree hub nodes (degree > 50) to prevent graph explosion.
   - Recency weighting: Decays edge weights based on event age.
   - Serialization: Top 30–60 triples serialized into the Evidence Pack and rendered client-side via `GraphViewSpec`.
5. **Hybrid Retrieval Tool (`retrieval_tool.py`):**
   - Registered as `search_media_and_text` in Nirdeshak's tool registry.
   - Returns ranked text snippets with unique evidence IDs, publication date, source outlet, and URL.
6. **Multi-Modal Evidence Fusion:**
   - Dynamically merges structured metrics (`E1..Ek`), knowledge triples (`Ek+1..Em`), and text snippets (`Em+1..En`) under the 4,000-token allocation budget.

### 12.5 Dynamic OpenUI Generative Multi-Graph Visualization Engine

Nirdeshak dynamically synthesizes and streams interactive visual charts based on detected user intent:
- **Pie & Donut Charts:** Synthesized for division breakdowns, administrative share comparisons, and categorical sentiment distribution across all 6 administrative divisions (*Konkan, Pune, Nashik, Chhatrapati Sambhajinagar, Amravati, Nagpur*).
- **Bar Charts:** Synthesized for district leaderboard comparisons, volume rankings, and composite scores.
- **Line Charts:** Synthesized for temporal metric trajectories, sentiment trend analysis, and incident velocity over time.
- **Interactive DataTables & KPI Cards:** Nested companion tables ensuring full accessibility compliance (GIGW 3.0 / UX4G).
- **Streaming Transport:** Real-time Server-Sent Events (SSE) with unbuffered transmission. Zero artificial chunk delays.

### 12.6 Dual-Engine Streaming Protocol: Fast-Path + Generative Upgrade
1. **Phase 1: Deterministic Fast-Path (<150ms)**
   - Common governance queries (`governance_overview`, `district_breakdown`, `crisis_sla_timeline`, `entity_graph_focus`) are intercepted by the deterministic intent router.
   - An authoritative, mathematically grounded `ViewSpec` is streamed immediately via Server-Sent Events (SSE).
   - Zero hallucination probability; 100% grounded in verified PostgreSQL 16 relational data.
2. **Phase 2: Progressive Generative Upgrade (<6.0s SLA)**
   - Concurrently, the Generative UI engine (Thesys C1 / Google Gemini / Gemma) synthesizes an enhanced OpenUI Lang representation in the background.
   - The output is validated through an allowlist filter (`Stack`, `KpiCard`, `DataTable`, `BarChart`, `LineChart`, `GraphView`, `Callout`) and checked against a 0.05 numerical tolerance threshold.
   - If verified within the 6-second SLA, an `upgrade` chunk smoothly replaces the UI without layout shifts.
   - If the SLA deadline expires or an error occurs, the fast-path ViewSpec remains authoritative with zero disruption.

### 12.7 Grounded 36-District Single Source of Truth
Reconciled across all data tables, RTO transport records, and administrative divisions:
- **Konkan (7 Districts)**: Mumbai City (`MH-01`), Mumbai Suburban (`MH-02`), Palghar (`MH-03`), Thane (`MH-04`), Raigad (`MH-05`), Ratnagiri (`MH-06`), Sindhudurg (`MH-07`).
- **Pune (5 Districts)**: Pune (`MH-08`), Kolhapur (`MH-09`), Sangli (`MH-10`), Satara (`MH-11`), Solapur (`MH-12`).
- **Nashik (5 Districts)**: Ahilyanagar/Ahmednagar (`MH-13`), Nashik (`MH-14`), Dhule (`MH-15`), Nandurbar (`MH-16`), Jalgaon (`MH-17`).
- **Chhatrapati Sambhajinagar (8 Districts)**: Chhatrapati Sambhajinagar/Aurangabad (`MH-18`), Jalna (`MH-19`), Parbhani (`MH-20`), Hingoli (`MH-21`), Beed (`MH-22`), Latur (`MH-23`), Dharashiv/Osmanabad (`MH-24`), Nanded (`MH-25`).
- **Amravati (5 Districts)**: Buldhana (`MH-26`), Akola (`MH-27`), Washim (`MH-28`), Amravati (`MH-29`), Yavatmal (`MH-30`).
- **Nagpur (6 Districts)**: Wardha (`MH-31`), Nagpur (`MH-32`), Bhandara (`MH-33`), Gondia (`MH-34`), Chandrapur (`MH-35`), Gadchiroli (`MH-36`).

### 12.8 Machine Learning Decoupling & Heuristic Fallback
- Heavy deep learning dependencies (`torch`, `torch-geometric`, `transformers`, `onnxruntime`, `tritonclient`) are decoupled from `requirements.txt` into `requirements-ml.txt`.
- When running in lightweight cloud serverless environments (<512MB RAM), the API starts instantly with standard manylinux wheels.
- Forward risk diffusion inference dynamically inspects PyTorch availability:
  - When models and GPU/CPU weights are available: Executes 3-layer `EurekaA3TGCN` forward pass (`provenance="model"`).
  - When running without PyTorch: Evaluates current state vectors and returns a calibrated 6-hour spatio-temporal risk baseline (`provenance="heuristic"`).

### 12.9 Official Publication-Grade PDF Telemetry Exporter
- Located at `frontend/MCC/src/lib/exportTelemetryPdf.ts`.
- Pure browser vector rendering producing official Government of Maharashtra State Telemetry Reports.
- Formatted with official state emblem headers, ISO/IEC 27001 compliance watermarks, 4-pillar index scorecards, and live infrastructure latency audits.


### 12.10 Fused Floating Action Button (FAB) & Side-Expandable Wide Workspace

To eliminate cognitive friction and provide senior leadership with a seamless, publication-grade analytical workspace, the Copilot trigger and drawer interface were unified under a fused architectural pattern:

```
+----------------------------------------------------------------------------------------------------+
|                      FUSED COPILOT TRIGGER & EXPANDABLE WORKSPACE TOPOLOGY                         |
+----------------------------------------------------------------------------------------------------+
|  Top Navigation Bar (Header.tsx)                   Floating Action Button (HUD FAB)                |
|  [✨ Nirdeshak | निर्देशांक Button]                 [w-14 h-14 Circular Pill (bottom-6 right-6)]   |
|          │                                                         │                               |
|          └───────────────────────────┬─────────────────────────────┘                               |
|                                      ▼                                                             |
|                      useDashboardStore().setCopilotOpen()                                          |
|                                      │                                                             |
|                                      ▼                                                             |
|           ┌────────────────────────────────────────────────────────┐                               |
|           │              CopilotDrawer.tsx (Sliding HUD)           │                               |
|           ├────────────────────────────────────────────────────────┤                               |
|           │  Standard Mode (max-w-lg / ~512px)                     │                               |
|           │    • Mobile/Tablet friendly, single-column chat view   │                               |
|           │                                                        │                               |
|           │  [Expand Button (open_in_full / fullscreen_exit)]      │                               |
|           │                                                        │                               |
|           │  Wide Workspace Mode (max-w-4xl / xl:max-w-5xl ~1024px)│                               |
|           │    • Multi-column comparative data tables              │                               |
|           │    • Multi-district BarChart & LineChart analytics     │                               |
|           │    • High-density Spatio-Temporal Graph Visualizations │                               |
|           │    • Visual "Expanded Workspace" / "विस्तृत कार्यक्षेत्र" badge│                        |
|           └────────────────────────────────────────────────────────┘                               |
+----------------------------------------------------------------------------------------------------+
```

1. **Dual-Trigger Synchronization with Zero HUD Conflicts:**
   - **Header Trigger Button:** Integrated directly into `Header.tsx` adjacent to the operational notifications bell. Displays a stylized badge `[✨ Nirdeshak | निर्देशांक]` with amber glow tokens (`hover:bg-amber-500/15 border-amber-500/40 text-amber-300`).
   - **Fused Floating Action Button (FAB):** Positioned globally at `fixed bottom-6 right-6 z-50`. Incorporates executive styling tokens: circular `w-14 h-14 rounded-full`, dark slate / gold government theme (`bg-primary text-primary-foreground shadow-lg hover:shadow-xl ring-1 ring-border/20`), an animated rotating sparkles icon, and a live pulsing beacon ping badge (`bg-gov-accent`).
   - **Single-Trigger Guarantee:** The redundant legacy floating button inside `CopilotDrawer.tsx` was eliminated. When `copilotOpen` is activated, the FAB gracefully morphs away to ensure zero overlap with the drawer's input text field and send button.
2. **Side-Expandable Wide Workspace Architecture:**
   - **State Control:** Managed via local `isExpanded` boolean state with animated CSS class transitions (`transition-all duration-300 ease-in-out`).
   - **Responsive Scaling:** Seamlessly transitions from standard drawer width (`max-w-lg` / 32rem / ~512px) to an expansive wide executive canvas (`max-w-4xl xl:max-w-5xl 2xl:max-w-6xl` / 56rem–72rem / ~896px–1152px).
   - **Ergonomic Controls:** Top header includes an Expand/Collapse toggle button rendered via `MaterialIcon` (`open_in_full` for expansion, `fullscreen_exit` for collapse), localized tooltips in Marathi (`कप्पे विस्तृत करा` / `कप्पे संकुचित करा`) and English, keyboard `Escape` dismissal, and backdrop click-outside closure.
   - **OpenUI Responsive Relayout:** In expanded mode, inline generated charts (`BarChart`, `LineChart`, `GraphView`) and governance score matrices (`DataTable`, `KpiCard` stacks) automatically scale horizontally to present rich multi-district comparisons without horizontal clipping.

---

### 12.11 Fail-Safe Resilient Streaming & Local Fallback Engine

In mission-critical command centers, network interruptions between edge presentation layers and backend compute nodes must never result in an unresponsive UI or unhandled `502 Bad Gateway` errors:

1. **Graceful Edge Interception:**
   - The Next.js edge proxy route (`/api/v1/copilot/[...path]`) implements dynamic error interception. If the upstream FastAPI backend or Cloudflare tunnel is temporarily unreachable, the route handler intercepts the failure and synthesizes an authoritative, verified local response stream.
2. **Deterministic Fallback ViewSpecs:**
   - In place of a broken connection error, Nirdeshak returns verified local governance fallback data accompanied by an operational status banner:
     `Service communication interrupted. Displaying verified local fallback data.`
   - Fallback payloads deliver verified 3-pillar governance leaderboards, district scores, and crisis SLA status directly from in-memory fallback datasets.
3. **Mem0 User Preference Memory Service:**
   - Integrated via `/api/v1/copilot/memory`. Tracks presentation preferences (language choices, preferred chart types, default districts) on an authenticated per-officer basis.
   - Officers can inspect remembered preferences via the "What I Remember About You" header panel (`MaterialIcon name="history"`) and trigger an immediate "Forget Me" purge at any time.

---

### 12.12 Cloudflare Persistent Named Tunnel & Hybrid Production Topology

Project EUREKA combines globally distributed edge rendering with secure on-premise / private cloud neural execution:

```
+----------------------------------------------------------------------------------------------------+
|                         CLOUDFLARE QUICK TUNNEL & PRODUCTION TOPOLOGY                              |
+----------------------------------------------------------------------------------------------------+
|                                                                                                    |
|  [Public Internet / Authorized Officers]                                                           |
|                       │                                                                            |
|                       ▼                                                                            |
|         Vercel Edge Network (Global CDN)                                                           |
|         URL: https://project-eureka-pi.vercel.app                                                  |
|         • Next.js 16 App Router (Statically Generated 42 Routes)                                  |
|         • Edge JWT Role Verification                                                               |
|         • Reverse Proxy Handler: /api/v1/copilot/[...path]                                         |
|                       │                                                                            |
|                       ▼ (Encrypted TLS Tunnel)                                                     |
|         Cloudflare Edge Ingress Point                                                              |
|         URL: https://api.yourdomain.com (Persistent Subdomain via Zero Trust Tunnel)                                  |
|                       │                                                                            |
|                       ▼ (HTTP/2 Multiplexed Pipe)                                                  |
|         Local Cloudflared Connector Agent                                                          |
|                       │                                                                            |
|                       ▼ (Internal Loopback: 127.0.0.1:8000)                                        |
|         FastAPI Application Engine (eureka.api.main:app)                                           |
|         ├── /api/v1/copilot/query (Fast-Path Intent Router & Gemma 4 26B)                          |
|         ├── /api/v1/copilot/memory (Mem0 User Memory Service)                                     |
|         ├── /api/v1/districts (3-Pillar 100-Point Composite Governance Scoring)                    |
|         ├── /api/v1/ticker (Live Emergency Marquee Stream)                                         |
|         └── /api/v1/transcription/stream (Multimodal Speech-to-Text)                               |
|                       │                                                                            |
|                       ├──► PostgreSQL 16 ACID Database (media_events, outbox_events)               |
|                       ├──► Neo4j 5.x Spatio-Temporal Knowledge Graph (17,020+ Nodes)              |
|                       └──► Redis 7.x Broker & Celery Asynchronous Workers                          |
+----------------------------------------------------------------------------------------------------+
```

- **Zero Port-Forwarding Attack Surface:** The internal API is never exposed to public internet ports. The `cloudflared` daemon establishes an outbound-only connection to Cloudflare's edge, eliminating firewall traversal and DDOS vulnerabilities.
- **Dynamic URL Discovery:** The Next.js frontend resolves upstream backend endpoints in strict priority order:
  1. `BACKEND_URL` environment variable (Cloudflare Tunnel in production / Vercel preview).
  2. `NEXT_PUBLIC_API_URL` environment variable.
  3. Local loopback default `http://127.0.0.1:8000` during development.
  4. Verified deterministic fallback engine when upstream is offline.

---

## 13. The 10 Specialized Institutional Operational Screens & Workspace Decks

Following the comprehensive institutional frontend modernization, the Maha-Command Center incorporates 10 dedicated operational screens designed for specialized administrative desks across the Government of Maharashtra:

```
+----------------------------------------------------------------------------------------------------+
|                         10 SPECIALIZED INSTITUTIONAL OPERATIONAL SCREENS                           |
+----------------------------------------------------------------------------------------------------+
| Screen Name             | Route               | Primary Operational Focus & Functional Capabilities|
+-------------------------+---------------------+----------------------------------------------------+
| 1. Newspaper Clippings  | /newspaper          | 516 daily print clippings across 36 districts; OCR |
|                         |                     | text extraction, regional editorial monitoring,    |
|                         |                     | sentiment polarity tags, provenance audit badges.  |
| 2. Live Broadcast News  | /live-news          | 4-channel TV broadcast grid (Doordarshan Sahyadri, |
|                         |                     | ABP Majha, TV9 Marathi, Zee 24 Taas); real-time OCR|
|                         |                     | ticker scanner, ticker history, breaking alerts.   |
| 3. Advertisements Desk  | /advertisements     | Government hoardings & public campaign GIS tracker;|
|                         |                     | GPS verification, vendor audit scores, display     |
|                         |                     | dimensions, expiry warnings, compliance status.    |
| 4. Publications Desk    | /publications       | Lokrajya (लोकराज्य) monthly state magazine digital |
|                         |                     | archive; edition downloads, thematic issue index,  |
|                         |                     | circulation analytics, special governance issues.  |
| 5. Media Intelligence   | /media-intelligence | Multi-channel cross-propagation analysis; print vs |
|                         |                     | TV vs social narrative clustering, velocity rates, |
|                         |                     | narrative divergence metrics, anomaly detection.   |
| 6. Biometric Attendance | /attendance         | District Information Office (DIO) biometric duty   |
|                         |                     | logs; shift adherence, active desk operators, field|
|                         |                     | officer availability, institutional telemetry.     |
| 7. Rapid Fact-Check     | /fact-check         | Fact-Check Unit (FCU) verification command desk;   |
|                         |                     | rumor intake, claim classification, official state |
|                         |                     | rebuttal generator, 90-min SLA containment clock.  |
| 8. Konkan Index Desk    | /konkan-index       | Divisional Director cockpit for the 7 Konkan       |
|                         |                     | districts (Mumbai City, Suburban, Thane, Palghar,  |
|                         |                     | Raigad, Ratnagiri, Sindhudurg); composite metrics. |
| 9. Live Events & Audio  | /live-events        | Mantralaya & regional press conferences; live audio|
|                         |                     | streaming, near-real-time speech-to-text (STT),    |
|                         |                     | Devanagari speaker transcripts, press releases.    |
| 10. Institutional Config| /settings           | RBAC cadre assignments, WebAuthn passkey management|
|                         |                     | API credentials, AI model selection, telemetry     |
|                         |                     | thresholds, audit log archival, system health.     |
+-------------------------+---------------------+----------------------------------------------------+
```

### Detailed Functional Walkthrough of Key Screens

#### 1. Newspaper Clippings Module (`/newspaper` - `NewspaperScreen.tsx`)
- **Capacity:** Indexes an average of 516 daily newspaper clippings harvested across major regional dailies (Loksatta, Sakal, Lokmat, Maharashtra Times, Pudhari, Saamana, Navakal, Tarun Bharat, Deshonneti, Punyanagari).
- **Core Capabilities:**
  - Full-text Devanagari OCR search and filtering by division, district, publication, and date range.
  - Interactive clipping modal displaying original newspaper scans side-by-side with extracted OCR text, automated headline summaries, and calculated sentiment tags.
  - Provenance traceability badge (`provenance="synthetic"` in demo mode; cryptographic SHA-256 hash in production).

#### 2. Live Broadcast News & TV OCR Relays (`/live-news` - `LiveNewsScreen.tsx`)
- **Channel Relays:** Simultaneous 4-relay multi-channel monitoring:
  1. *Doordarshan Sahyadri* (Public broadcaster / official releases).
  2. *ABP Majha* (Statewide Marathi commercial coverage).
  3. *TV9 Marathi* (Regional breaking and crime/political updates).
  4. *Zee 24 Taas* (Marathwada/Vidarbha regional focus).
- **Core Capabilities:**
  - Automated video OCR ticker extraction recording breaking on-screen text strips every 3 seconds.
  - Ticker queue capped at ergonomic vertical dimensions (`max-h-[210px]`) with real-time sentiment color-coding (rose = critical rumor, amber = breaking escalation, emerald = developmental/positive).
  - One-click navigation to generate an immediate Fact-Check ticket from any breaking TV broadcast claim.

#### 3. Scheme Hoardings & Outdoor Publicity GIS (`/advertisements` - `AdvertisementsScreen.tsx`)
- **Asset Register:** Catalogs all state-sponsored outdoor hoardings, bus shelter advertisements, digital LED billboards, and mobile publicity vans across Maharashtra.
- **Core Capabilities:**
  - Integrated Open-Boundary GIS Map rendering geospatial pins for all verified campaign sites.
  - Inspection parameters: Scheme title (e.g., *Majhi Ladki Bahin Yojana*, *Jalyukt Shivar Abhiyan*, *CM Fellowship*), vendor identity, display dimensions, sanctioned budget, GPS verification status, and physical condition audits.
  - Automated compliance scoring warning district collectors when sanctioned publicity saturation falls below mandated thresholds.

#### 4. Rapid Response Fact-Check Desk (`/fact-check` - `FactCheckScreen.tsx`)
- **Mission:** Serves as the primary operational terminal for the Maharashtra Government Fact-Check Unit (FCU).
- **Core Capabilities:**
  - Real-time intake pipeline aggregating flagged social posts, viral WhatsApp audio notes, and sensational press headlines.
  - Status pipeline: `intake -> investigating -> verified_false / partly_true / verified_true -> rebuttal_published`.
  - Countdown SLA visual timer enforcing the 90-Minute Crisis Response protocol. If an unverified rumor exceeds 90 minutes without an authorized rebuttal, the system escalates directly to Tier-1 DG Admin.

#### 5. Three-Column Executive Workspace, Zero-Scroll Cockpit & 2D Vector GIS Map
- **Layout Architecture (`ThreeColumnDashboard.tsx`):**
  - **Single-Screen Zero-Scroll Cockpit Mode:** Engineered specifically for command center video walls and executive desktop monitors (1080p and 4K displays). By constraining operational viewports with precise viewport calc bounds (`h-[calc(100vh-8.5rem)]`) and internal overflow containment, the entire tri-column state cockpit fits comfortably on a single screen without vertical or horizontal scrollbars.
  - **Left Column:** State Leaderboard & 36-District DIO Performance Matrix with tabular breathing room and horizontal scroll containment (`overflow-x-auto -mx-1 px-1`).
  - **Center Column:** Interactive Maharashtra GIS Vector Map (100% responsive width), detailed district telemetry inspector, and 16:9 live video relay canvas with tabbed deck controls.
  - **Right Column:** Social media sentiment discourse, real-time crisis tickets, and 90-minute SLA containment queue with responsive 2xl tab splitting.
  - **Full-Width Deep Red Broadcast News Ticker:** Spans the entire bottom baseline of the command cockpit with live scrolling updates, pause-on-hover interaction, and offline network connection guards.
- **High-Performance 2D Vector GIS Map (`EnhancedMaharashtraGISMap.tsx`):**
  - Replaces heavy WebGL 3D overhead with a high-performance, GPU-accelerated 2D vector GIS map.
  - Renders multi-tier geospatial layers including national/state highways, major river networks (Godavari, Krishna, Tapi, Bhima), Western Ghats topography, and 36 district centroid pins.
  - Interactive district hover cards display real-time 3-pillar governance indices, sentiment polarity, and active rumor counts.
  - Seamlessly toggles to the experimental Three.js 3D topography model map (`Maharashtra3DModelMap.tsx`) for immersive executive demonstrations.
- **Workspace View Switcher:** Enables officers to instantly toggle the command deck between:
  1. *Executive Cockpit:* 3-column unified single-screen control deck.
  2. *Full GIS Command:* Expands the geospatial vector map to 100% canvas with overlay layers (hoardings, rumors, scores).
  3. *Deep Analytics:* Focuses on historical time-series trends, sentiment decomposition, and divisional benchmarks.

---

## 14. Comprehensive Verification, Testing Matrix & Production Runbook

The platform maintains strict automated quality gates across every commit:

### 14.1 Quality Gates & Test Suite Results
- **Automated Regression Suite:** **84 / 84 passing tests across 22 test suites** (`npm test` via Node.js native test runner `--experimental-strip-types` in `frontend/MCC`).
  - Suite 1: Route-Aware Dynamic Prompts & Local Knowledge Base.
  - Suite 2: Backend AI Endpoint Route Handler & Fail-Safe Fallbacks.
  - Suite 3: UI Component Architecture & Layout Integration.
  - Suite 4: Decongestion & Responsive Bug Fixes.
  - Suite 5: Zero-CLS Skeleton Synchronization.
  - Suite 6: URL Security & Malicious Scheme Rejection.
  - Suite 7: Three-Column Executive Dashboard Workspace & Single-Screen Cockpit.
  - Suite 8: 100-Point Composite Index & 3-Pillar Scoring Formulas (Volume 35%, Sentiment 35%, Crisis SLA 30%).
  - Suite 9: Nirdeshak v2 Evidence Pack & 5-Point ClaimVerifier Audit.
  - Suite 10: Multilingual Entity Linking & Trigram Normalization.
- **TypeScript Strict Compilation:** `npx tsc --noEmit` exits with **0 errors**.
- **Next.js Production Build:** `npm run build` compiles all **41 static and dynamic routes** cleanly with zero fatal warnings.

### 14.2 Serial Boot Sequence for Local & Production Environments

To bring up the entire EUREKA platform from a cold start, execute the following steps in sequence:

```powershell
# Step 1: Start Persistence & Caching Services (Docker Compose)
docker compose --profile db up -d
# Verified: PostgreSQL on 5433, Neo4j on 7474/7687, Redis on 6379

# Step 2: Seed Deterministic 36-District Demo Data (if running local/demo mode)
uv run python scripts/seed_demo_dashboard.py

# Step 3: Start Celery Asynchronous Workers & Beat Scheduler
uv run celery -A eureka.core.celery_app worker -l info -Q default,quad_ingestion,irf_binding,processor,outbox
uv run celery -A eureka.core.celery_app beat -l info

# Step 4: Boot FastAPI Application Engine (Port 8000)
uv run uvicorn eureka.api.main:app --host 127.0.0.1 --port 8000 --app-dir backend/src

# Step 5: Start Cloudflare Persistent Named Tunnel
python scripts/run_cloudflare_tunnel.py
# Or directly via token:
# npx cloudflared tunnel --no-autoupdate run --token <CLOUDFLARE_TUNNEL_TOKEN>

# Step 6: Start Next.js Maha-Command Center Frontend (Port 3000)
cd frontend/MCC
npm run dev -- --webpack -p 3000
```

---

### 14.3 Production Edge Ingress, Rewrites Architecture & Enterprise Hardening

To satisfy mission-critical government command center reliability requirements and permanently eliminate client runtime errors, Project EUREKA implements six production hardening mechanisms:

#### 1. Next.js 16 Rewrites Fallback Partitioning
In Next.js 16 App Router, top-level array rewrites intercept paths before route handlers execute. In `frontend/MCC/next.config.mjs`, rewrites are partitioned into `{ fallback: [...] }`. This guarantees that dedicated App Router route handlers (e.g., `/api/v1/copilot/[...path]/route.ts`) take precedence, execute on the edge, inject valid signed JWT tokens, and manage fail-safe streaming before falling back to backend loopback proxies.

#### 2. Edge JWT Generation & Upstream Token Injection
The Next.js edge route handler automatically bridges client browser sessions with FastAPI's backend authentication:
- Signs HS256 tokens using `FASTAPI_JWT_SECRET` via `jose`.
- Maps client roles (`dg_admin`, `collector`, `dio_desk`) to official backend roles (`DG State Admin`, `District Collector`, `DIO Desk`).
- Client requests specify `credentials: 'same-origin'` and dynamic token resolution.
- Upstream 401 responses trigger an automatic token refresh and single-shot retry before failing over.

#### 3. Synchronous Global Script Protection (jQuery Shim)
Embedded third-party widgets and browser extensions frequently invoke legacy jQuery wrappers synchronously before React hydration. To permanently neutralize `Uncaught ReferenceError: jQuery is not defined`, an early self-executing script is injected at `<head>` and top of `<body>` in `src/app/layout.tsx`:
```javascript
(function(){
  var j = function(a){
    if(typeof a === 'function'){
      if(document.readyState !== 'loading') a();
      else document.addEventListener('DOMContentLoaded', a);
    }
    return j;
  };
  j.fn = j.prototype = {};
  j.ready = function(f){ j(f); };
  j.extend = Object.assign || function(t){ return t; };
  j.ajax = function(){ return Promise.resolve({}); };
  window.jQuery = window.$ = j;
  try { globalThis.jQuery = globalThis.$ = j; } catch(e){}
})();
```

#### 4. Silent Unauthenticated Session Resolution
Calling `/api/auth/me` on cold boots previously returned HTTP 401 for unauthenticated visitors, triggering red DevTools console errors. The handler now returns **HTTP 200** with `{ authenticated: false, user: null }` for clean cold-boot visits, reserving HTTP 401 strictly for tampered or expired cryptographic tokens.

#### 5. Offline Network State Guards
In `LiveNewsTicker.tsx`, recurring 30-second interval polling is guarded with `navigator.onLine` checks:
```typescript
if (typeof navigator !== 'undefined' && !navigator.onLine) {
  return;
}
```
This prevents browser network stack spam (`net::ERR_INTERNET_DISCONNECTED`, `net::ERR_NETWORK_CHANGED`) during transient mobile or Wi-Fi interruptions.

#### 6. Vercel Decoupled Root-Directory Build Specification
Because the Vercel project is configured with Root Directory = `frontend/MCC`, `.vercelignore` was updated to unignore `frontend/`, ensuring Vercel's build runner can resolve `package.json` and compile all 41 static and dynamic routes cleanly.
