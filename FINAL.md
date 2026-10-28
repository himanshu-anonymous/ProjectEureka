# EUREKA Nirdeshak v2: Verified Answers, Text Retrieval & Subgraph Context

## Phase 1 & Phase 2 Core Deliverables
- Evidence Pack & Verifier: Stable E1..En IDs, number rounding, entity/date checking, entailment, and confident abstention.
- Postgres Text Search: Added simple config FTS & pg_trgm indexes across media events, normalized records, and tickets.
- Entity Linking & Time Parsing: Multilingual aliases (36 districts, depts, schemes, officials, outlets) & time-phrase parser.
- Celery Background Extraction: Resumable checkpointed extraction over text streams projecting to Neo4j via outbox.
- Subgraph Context: Seeded 1-2 hop expansion, hub node suppression (deg > 50), recency decay, returning GraphViewSpec.
- Hybrid Retrieval Tool: Scoped text search (search_media_and_text) with strict Collector/DIO/Admin RBAC filters.
- Multi-Modal Fusion: Merged structured facts, knowledge subgraph triples, and text snippets under token budget.

## Verification & Evaluation Results
- Unsupported-Claim Rate: 0.00% across all Marathi, Hindi, and English evaluation queries.
- Abstention Accuracy: 100.00% (9/9 correct abstentions on ungrounded/out-of-scope requests).
- Test Suites: 100% green across 18 Phase 2 tests, 29 Phase 1 copilot tests, and 8 frontend test suites.
