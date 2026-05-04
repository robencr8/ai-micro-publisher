/**
 * Stub Workers — M1
 * These are scaffolded workers with correct queue bindings and pause-check wiring.
 * Full implementation comes in M2–M5.
 * Each worker logs its job data and returns successfully (no-op body).
 */

import { Job } from "bullmq";
import { BaseWorker } from "./base";
import { QUEUE_NAMES } from "../queue/connection";

// ─── Topic Discovery Worker (M2) ──────────────────────────────────────────────

export class TopicDiscoveryWorker extends BaseWorker {
  constructor() {
    super(QUEUE_NAMES.TOPIC_DISCOVERY, "TopicDiscoveryWorker", "generation_paused");
  }

  protected async processJob(job: Job): Promise<void> {
    console.log(`[TopicDiscoveryWorker] STUB — job ${job.id}`, job.data);
    // M2: ingest RSS feeds, seasonal calendar, seeded keywords
    // M2: score topics and upsert into topics table
  }
}

// ─── Content Generation Worker (M3) ──────────────────────────────────────────

export class ContentGenerationWorker extends BaseWorker {
  constructor() {
    super(QUEUE_NAMES.CONTENT_GENERATION, "ContentGenerationWorker", "generation_paused");
  }

  protected async processJob(job: Job): Promise<void> {
    console.log(`[ContentGenerationWorker] STUB — job ${job.id}`, job.data);
    // M3: build structured brief, call LLM, store draft in content_pages
    // M3: record generation_jobs audit trail with tokens/cost/latency
  }
}

// ─── Quality Review Worker (M4) ──────────────────────────────────────────────

export class QualityReviewWorker extends BaseWorker {
  constructor() {
    super(QUEUE_NAMES.QUALITY_REVIEW, "QualityReviewWorker", "generation_paused");
  }

  protected async processJob(job: Job): Promise<void> {
    console.log(`[QualityReviewWorker] STUB — job ${job.id}`, job.data);
    // M4: Stage 1 heuristics + Stage 2 LLM review
    // M4: update content_pages with scores and approve/retry/merge/reject decision
  }
}

// ─── Publish Pages Worker (M5) ────────────────────────────────────────────────

export class PublishPagesWorker extends BaseWorker {
  constructor() {
    super(QUEUE_NAMES.PUBLISH_PAGES, "PublishPagesWorker", "publishing_paused");
  }

  protected async processJob(job: Job): Promise<void> {
    console.log(`[PublishPagesWorker] STUB — job ${job.id}`, job.data);
    // M5: generate slug, canonical URL, metadata, structured data
    // M5: set status = 'published', update published_at, add to sitemap
  }
}

// ─── Analytics Rollup Worker (M7) ────────────────────────────────────────────

export class AnalyticsRollupWorker extends BaseWorker {
  constructor() {
    super(QUEUE_NAMES.ANALYTICS_ROLLUP, "AnalyticsRollupWorker", "generation_paused");
  }

  protected async processJob(job: Job): Promise<void> {
    console.log(`[AnalyticsRollupWorker] STUB — job ${job.id}`, job.data);
    // M7: aggregate page_events into page_metrics_daily
    // M7: trigger refresh/archive decisions based on metrics
  }
}

// ─── Worker Registry ──────────────────────────────────────────────────────────

export const ALL_WORKERS = [
  new TopicDiscoveryWorker(),
  new ContentGenerationWorker(),
  new QualityReviewWorker(),
  new PublishPagesWorker(),
  new AnalyticsRollupWorker(),
] as const;

export function startAllWorkers(): void {
  for (const worker of ALL_WORKERS) {
    try {
      worker.start(1);
    } catch (err) {
      console.warn(`[Workers] Failed to start ${worker.getStatus().name}:`, err);
    }
  }
}

export async function stopAllWorkers(): Promise<void> {
  await Promise.all(ALL_WORKERS.map((w) => w.stop()));
}

export function getAllWorkerStatuses() {
  return ALL_WORKERS.map((w) => w.getStatus());
}
