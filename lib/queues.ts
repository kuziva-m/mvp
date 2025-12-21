// LEAN MVP VERSION - No Redis required for now
// This allows the app to run fast without complex infrastructure overhead

// Mock Queue Class to satisfy type requirements if needed
class MockQueue {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  async add(name: string, data: any) {
    console.log(`[MOCK QUEUE ${this.name}] Added job: ${name}`, data);
    return { id: "mock-job-id-" + Date.now() };
  }

  async getWaitingCount() {
    return 0;
  }
  async getActiveCount() {
    return 0;
  }
  async getCompletedCount() {
    return 0;
  }
  async getFailedCount() {
    return 0;
  }
  async getDelayedCount() {
    return 0;
  }
  async isPaused() {
    return false;
  }
  async pause() {
    console.log(`[MOCK] Paused ${this.name}`);
  }
  async resume() {
    console.log(`[MOCK] Resumed ${this.name}`);
  }
  async drain() {
    console.log(`[MOCK] Drained ${this.name}`);
  }
  async clean() {
    console.log(`[MOCK] Cleaned ${this.name}`);
  }
  async getFailed() {
    return [];
  }
}

// Export the mock queues
export const leadProcessingQueue = new MockQueue("lead-processing") as any;
export const siteGenerationQueue = new MockQueue("site-generation") as any;
export const emailSendingQueue = new MockQueue("email-sending") as any;
export const deliveryQueue = new MockQueue("delivery") as any;

// Helper: Add job to queue (MOCKED)
export async function addJobToQueue(
  queue: any,
  jobName: string,
  data: any,
  options: any = {}
) {
  return queue.add(jobName, data);
}

// Helper: Get queue status (MOCKED)
export async function getQueueStatus(queue: any) {
  return {
    name: queue.name,
    waiting: 0,
    active: 0,
    completed: 0,
    failed: 0,
    delayed: 0,
    paused: false,
    total: 0,
  };
}

// Helper: Get all queue statuses (MOCKED)
export async function getAllQueueStatuses() {
  return [
    await getQueueStatus(leadProcessingQueue),
    await getQueueStatus(siteGenerationQueue),
    await getQueueStatus(emailSendingQueue),
    await getQueueStatus(deliveryQueue),
  ];
}

// Helper: Pause/Resume queues (MOCKED)
export async function pauseAllQueues() {
  console.log("⏸️ [MOCK] All queues paused");
}

export async function resumeAllQueues() {
  console.log("▶️ [MOCK] All queues resumed");
}

// Helper: Clear queue (MOCKED)
export async function clearQueue(queue: any) {
  console.log(`🗑️ [MOCK] Queue ${queue.name} cleared`);
}

// Helper: Get failed jobs (MOCKED)
export async function getFailedJobs(queue: any, limit: number = 50) {
  return [];
}
