import { Queue } from "bullmq";
import Redis from "ioredis";

// FIX: Use global type to prevent TS errors and reuse connection across hot reloads
const globalForRedis = global as unknown as { redis: Redis };

// Singleton Redis connection
let connection: Redis | null = null;

function getRedisConnection(): Redis {
  // Skip Redis connection during build time to prevent build failures
  if (process.env.NEXT_PHASE === "phase-production-build") {
    throw new Error("Redis not available during build");
  }

  // Use REDIS_CONNECTION_STRING first to avoid conflicts with system REDIS_URL
  const redisUrl = process.env.REDIS_CONNECTION_STRING || process.env.REDIS_URL;

  if (!redisUrl) {
    throw new Error(
      "REDIS_CONNECTION_STRING or REDIS_URL is required. Get free Redis from https://upstash.com"
    );
  }

  // Validate it's a redis:// URL
  if (!redisUrl.startsWith("redis://") && !redisUrl.startsWith("rediss://")) {
    throw new Error(
      "Redis URL must start with redis:// or rediss:// (found: " +
        redisUrl.substring(0, 10) +
        "...)"
    );
  }

  // FIX: Return existing global connection if in development
  if (globalForRedis.redis) {
    return globalForRedis.redis;
  }

  // Create new connection if none exists
  if (!connection) {
    connection = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
      lazyConnect: true,
      retryStrategy: (times) => {
        return Math.min(times * 50, 2000);
      },
      reconnectOnError: (err) => {
        const targetErrors = ["READONLY", "ECONNRESET"];
        return targetErrors.some((e) => err.message.includes(e));
      },
    });

    connection.on("connect", () => {
      console.log("✅ Redis connected");
    });

    connection.on("error", (error) => {
      if (!error.message.includes("ECONNRESET")) {
        console.error("❌ Redis error:", error.message);
      }
    });

    // Connect immediately
    connection.connect().catch(() => {}); // Catch initial connect error to prevent crash
  }

  // FIX: Save to global scope in development/non-production
  if (process.env.NODE_ENV !== "production") {
    globalForRedis.redis = connection;
  }

  return connection;
}

// Lazy queue initialization
let _leadProcessingQueue: Queue | null = null;
let _siteGenerationQueue: Queue | null = null;
let _emailSendingQueue: Queue | null = null;
let _deliveryQueue: Queue | null = null;

export const leadProcessingQueue = new Proxy({} as Queue, {
  get(target, prop) {
    if (!_leadProcessingQueue) {
      const connection = getRedisConnection();
      _leadProcessingQueue = new Queue("lead-processing", { connection });
    }
    return (_leadProcessingQueue as any)[prop];
  },
});

export const siteGenerationQueue = new Proxy({} as Queue, {
  get(target, prop) {
    if (!_siteGenerationQueue) {
      const connection = getRedisConnection();
      _siteGenerationQueue = new Queue("site-generation", { connection });
    }
    return (_siteGenerationQueue as any)[prop];
  },
});

export const emailSendingQueue = new Proxy({} as Queue, {
  get(target, prop) {
    if (!_emailSendingQueue) {
      const connection = getRedisConnection();
      _emailSendingQueue = new Queue("email-sending", { connection });
    }
    return (_emailSendingQueue as any)[prop];
  },
});

export const deliveryQueue = new Proxy({} as Queue, {
  get(target, prop) {
    if (!_deliveryQueue) {
      const connection = getRedisConnection();
      _deliveryQueue = new Queue("delivery", { connection });
    }
    return (_deliveryQueue as any)[prop];
  },
});

// Helper: Add job to queue
export async function addJobToQueue(
  queue: Queue,
  jobName: string,
  data: any,
  options: any = {}
) {
  try {
    const job = await queue.add(jobName, data, {
      attempts: 3,
      backoff: {
        type: "exponential",
        delay: 2000,
      },
      removeOnComplete: {
        count: 1000,
        age: 7 * 24 * 60 * 60, // 7 days
      },
      removeOnFail: {
        count: 5000,
        age: 30 * 24 * 60 * 60, // 30 days
      },
      ...options,
    });

    return job;
  } catch (error) {
    console.error(`Failed to add job to ${queue.name}:`, error);
    throw error;
  }
}

// Helper: Get queue status
export async function getQueueStatus(queue: Queue) {
  const [waiting, active, completed, failed, delayed, paused] =
    await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
      queue.isPaused(),
    ]);

  return {
    name: queue.name,
    waiting,
    active,
    completed,
    failed,
    delayed,
    paused,
    total: waiting + active,
  };
}

// Helper: Get all queue statuses
export async function getAllQueueStatuses() {
  const queues = [
    leadProcessingQueue,
    siteGenerationQueue,
    emailSendingQueue,
    deliveryQueue,
  ];

  return Promise.all(queues.map((queue) => getQueueStatus(queue)));
}

// Helper: Pause/Resume queues
export async function pauseAllQueues() {
  await Promise.all([
    leadProcessingQueue.pause(),
    siteGenerationQueue.pause(),
    emailSendingQueue.pause(),
    deliveryQueue.pause(),
  ]);
  console.log("⏸️ All queues paused");
}

export async function resumeAllQueues() {
  await Promise.all([
    leadProcessingQueue.resume(),
    siteGenerationQueue.resume(),
    emailSendingQueue.resume(),
    deliveryQueue.resume(),
  ]);
  console.log("▶️ All queues resumed");
}

// Helper: Clear queue
export async function clearQueue(queue: Queue) {
  await queue.drain();
  await queue.clean(0, 1000, "completed");
  await queue.clean(0, 1000, "failed");
  console.log(`🗑️ Queue ${queue.name} cleared`);
}

// Helper: Get failed jobs
export async function getFailedJobs(queue: Queue, limit: number = 50) {
  const failed = await queue.getFailed(0, limit);
  return failed.map((job) => ({
    id: job.id,
    name: job.name,
    data: job.data,
    failedReason: job.failedReason,
    attemptsMade: job.attemptsMade,
    timestamp: job.timestamp,
  }));
}
