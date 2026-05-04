/**
 * Base Worker
 * All autonomous workers extend this class.
 * Provides: lifecycle management, pause-check via system_settings, error logging,
 * retry-safe execution, and graceful shutdown.
 */

import { Worker, Job, WorkerOptions } from "bullmq";
import { redisConnection, QueueName } from "../queue/connection";
import { getDb } from "../db";
import { systemSettings } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export interface WorkerStatus {
  name: string;
  running: boolean;
  paused: boolean;
  processedCount: number;
  failedCount: number;
  lastProcessedAt: Date | null;
  lastError: string | null;
}

export abstract class BaseWorker {
  protected worker: Worker | null = null;
  protected status: WorkerStatus;
  protected pauseSettingKey: string;

  constructor(
    protected readonly queueName: QueueName,
    protected readonly workerName: string,
    pauseSettingKey: string,
  ) {
    this.pauseSettingKey = pauseSettingKey;
    this.status = {
      name: workerName,
      running: false,
      paused: false,
      processedCount: 0,
      failedCount: 0,
      lastProcessedAt: null,
      lastError: null,
    };
  }

  /** Override this in each concrete worker to handle job processing */
  protected abstract processJob(job: Job): Promise<void>;

  /** Check if this worker is globally paused via system_settings */
  protected async isPaused(): Promise<boolean> {
    try {
      const db = await getDb();
      if (!db) return false;
      const rows = await db
        .select()
        .from(systemSettings)
        .where(eq(systemSettings.key, this.pauseSettingKey))
        .limit(1);
      return rows[0]?.value === "true";
    } catch {
      return false; // Default: not paused if DB unavailable
    }
  }

  start(concurrency = 1): void {
    if (this.worker) return; // Already running

    const options: WorkerOptions = {
      connection: redisConnection,
      concurrency,
      autorun: true,
    };

    this.worker = new Worker(
      this.queueName,
      async (job: Job) => {
        const paused = await this.isPaused();
        if (paused) {
          console.log(`[${this.workerName}] Paused — skipping job ${job.id}`);
          return;
        }

        try {
          await this.processJob(job);
          this.status.processedCount++;
          this.status.lastProcessedAt = new Date();
        } catch (err) {
          this.status.failedCount++;
          this.status.lastError = err instanceof Error ? err.message : String(err);
          throw err; // Re-throw so BullMQ handles retry
        }
      },
      options,
    );

    this.worker.on("completed", (job) => {
      console.log(`[${this.workerName}] Job ${job.id} completed`);
    });

    this.worker.on("failed", (job, err) => {
      console.error(`[${this.workerName}] Job ${job?.id} failed:`, err.message);
    });

    this.worker.on("error", (err) => {
      console.error(`[${this.workerName}] Worker error:`, err.message);
      this.status.lastError = err.message;
    });

    this.status.running = true;
    console.log(`[${this.workerName}] Started (concurrency=${concurrency})`);
  }

  async stop(): Promise<void> {
    if (this.worker) {
      await this.worker.close();
      this.worker = null;
      this.status.running = false;
      console.log(`[${this.workerName}] Stopped`);
    }
  }

  getStatus(): WorkerStatus {
    return { ...this.status };
  }
}
