// LIB/QUEUES.TS - MOCK VERSION FOR LOCAL DEVELOPMENT

// 1. Mock Queue Class (Does nothing but log)
export class MockQueue {
  name: string;
  constructor(name: string) {
    this.name = name;
    console.log(`[Queue] Initialized Local Queue: ${name}`);
  }
  async add(name: string, data: any) {
    console.log(`[Queue] bypassing Redis for ${this.name}, job: ${name}`);
    return { id: "mock-id-" + Date.now() };
  }
  async close() {
    return Promise.resolve();
  }
}

// 2. Mock Worker Class
export class MockWorker {
  constructor(name: string, processor: any) {
    console.log(`[Worker] Initialized Mock Worker for: ${name}`);
  }
  async close() {
    return Promise.resolve();
  }
}

// 3. Export these so other files don't break
export const scrapingQueue = new MockQueue("scraping-queue");
export const generationQueue = new MockQueue("generation-queue");
export const emailQueue = new MockQueue("email-queue");
export const qaQueue = new MockQueue("qa-queue");
export const reportingQueue = new MockQueue("reporting-queue");
