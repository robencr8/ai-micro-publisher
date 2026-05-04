/**
 * Queue Connection
 * Provides a shared Redis connection for BullMQ queues and workers.
 * Falls back gracefully when Redis is not configured (dev without Redis).
 */

import { ConnectionOptions } from "bullmq";

export const QUEUE_NAMES = {
  TOPIC_DISCOVERY: "topic-discovery",
  CONTENT_GENERATION: "content-generation",
  QUALITY_REVIEW: "quality-review",
  PUBLISH_PAGES: "publish-pages",
  ANALYTICS_ROLLUP: "analytics-rollup",
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

/**
 * Parse a Redis URL or return a default localhost config.
 * Supports: redis://host:port, redis://:password@host:port, rediss:// (TLS)
 */
export function getRedisConnection(): ConnectionOptions {
  const redisUrl = process.env.REDIS_URL;

  if (redisUrl) {
    try {
      const url = new URL(redisUrl);
      const config: ConnectionOptions = {
        host: url.hostname || "localhost",
        port: parseInt(url.port || "6379", 10),
        ...(url.password ? { password: decodeURIComponent(url.password) } : {}),
        ...(url.protocol === "rediss:" ? { tls: {} } : {}),
        maxRetriesPerRequest: null, // Required by BullMQ
        enableReadyCheck: false,
      };
      return config;
    } catch {
      console.warn("[Queue] Invalid REDIS_URL, falling back to localhost");
    }
  }

  return {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    ...(process.env.REDIS_PASSWORD ? { password: process.env.REDIS_PASSWORD } : {}),
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  };
}

export const redisConnection = getRedisConnection();
