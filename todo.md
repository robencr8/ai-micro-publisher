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
- [x] Apply full DB schema migrations (topics, content_pages, generation_jobs, page_events, page_metrics_daily, system_settings, admin_audit_log, prototype_runs)
- [x] Seed system_settings with default runtime config
- [x] Install BullMQ + ioredis, configure queue connection
- [x] Queue service: publisher.ts (enqueue jobs)
- [x] Worker bootstrap: base worker class with retry/backoff
- [x] Stub workers: topic-discovery, content-generation, quality-review, publish-pages, analytics-rollup
- [x] /api/health endpoint: DB ping, queue ping, worker status, uptime (responds in <250ms with or without Redis)
- [x] adminProcedure middleware (role === 'admin' gate)
- [x] Admin audit log helper (logAdminAction)
- [x] Admin-only tRPC router with system status procedure
- [x] GitHub Actions CI: pnpm install, pnpm test, pnpm check (yml ready, push via GitHub UI due to token scope)
- [x] M1 integration tests: DB connection, queue enqueue/dequeue config, health endpoint, admin gate (34/34 passing)
- [ ] BLOCKER: Real Redis/Valkey required for queue execution proof before M1 GO
- [ ] Queue execution proof: enqueue job, worker pickup, intentional failure, retry/backoff, final status
- [x] Push M1 infrastructure code to GitHub (pending queue proof commit)

## Post-M1 (BLOCKED until M1 GO decision)
- [ ] Autonomous topic discovery worker (M2)
- [ ] Content generation pipeline with version tracking (M3)
- [ ] Two-stage quality gate (M4)
- [ ] SEO publishing worker (M5)
- [ ] Bot protection + ad eligibility (M6)
- [ ] Analytics pipeline (M7)
- [ ] Admin dashboard (M7)
- [ ] Emergency control panel (M7)
