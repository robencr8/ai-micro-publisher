# AI Micro-Publisher TODO

## Milestone 0 (CURRENT — must complete before anything else)
- [x] Hardcoded prototype topic brief (JSON constant in server)
- [x] LLM draft generation tRPC procedure (generateDraft)
- [x] Quality gate function: publish_score, safety_score, usefulness_score, readability_score
- [x] Approve/reject decision logic (thresholds: publish>=75, safety>=95, usefulness>=75, readability>=70)
- [x] Staging page /prototype: shows brief, generate button, scores, decision, rendered draft
- [x] 5-run evidence table: run number, generated, decision, scores, cost, latency, rendered, notes
- [x] Unit tests for quality gate scoring and thresholds (18 tests, all passing)

## Post-M0 (BLOCKED until GO decision)
- [ ] Full DB schema migration (topics, content_pages, generation_jobs, page_events, etc.)
- [ ] Autonomous topic discovery worker
- [ ] Content generation pipeline with version tracking
- [ ] Two-stage quality gate (heuristic + LLM)
- [ ] SEO publishing worker
- [ ] Bot protection + ad eligibility
- [ ] Analytics pipeline
- [ ] Admin dashboard
- [ ] Emergency control panel
