# AI Micro-Publisher TODO

## Milestone 0 (CURRENT — must complete before anything else)
- [x] Hardcoded prototype topic brief (JSON constant in server)
- [x] LLM draft generation tRPC procedure (generateDraft)
- [x] Quality gate function: publish_score, safety_score, usefulness_score, readability_score
- [x] Approve/reject decision logic (thresholds: publish>=75, safety>=95, usefulness>=75, readability>=70)
- [x] Staging page /prototype: shows brief, generate button, scores, decision, rendered draft
- [x] 5-run evidence table: run number, generated, decision, scores, cost, latency, rendered, notes
- [x] Unit tests for quality gate scoring and thresholds (18 tests, all passing)

## Milestone 1 (CURRENT — infrastructure)
- [ ] Apply full DB schema migrations (topics, content_pages, generation_jobs, page_events, page_metrics_daily, system_settings, admin_audit_log, prototype_runs)
- [ ] Seed system_settings with default runtime config
- [ ] Install BullMQ + ioredis, configure queue connection
- [ ] Queue service: publisher.ts (enqueue jobs)
- [ ] Worker bootstrap: base worker class with retry/backoff
- [ ] Stub workers: topic-discovery, content-generation, quality-review, publish-pages, analytics-rollup
- [ ] /api/health endpoint: DB ping, queue ping, worker status, uptime
- [ ] adminProcedure middleware (role === 'admin' gate)
- [ ] Admin audit log helper (logAdminAction)
- [ ] Admin-only tRPC router with system status procedure
- [ ] GitHub Actions CI: pnpm install, pnpm test, pnpm check
- [ ] M1 integration tests: DB connection, queue enqueue/dequeue, health endpoint, admin gate
- [ ] Push M1 to GitHub

## Post-M1 (BLOCKED until M1 GO decision)
- [ ] Autonomous topic discovery worker (M2)
- [ ] Content generation pipeline with version tracking (M3)
- [ ] Two-stage quality gate (M4)
- [ ] SEO publishing worker (M5)
- [ ] Bot protection + ad eligibility (M6)
- [ ] Analytics pipeline (M7)
- [ ] Admin dashboard (M7)
- [ ] Emergency control panel (M7)
