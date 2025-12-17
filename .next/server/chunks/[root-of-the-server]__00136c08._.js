module.exports = [
"[project]/.next-internal/server/app/api/admin/queues/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/queues.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// LEAN MVP VERSION - No Redis required for now
// This allows the app to run fast without complex infrastructure overhead
// Mock Queue Class to satisfy type requirements if needed
__turbopack_context__.s([
    "addJobToQueue",
    ()=>addJobToQueue,
    "clearQueue",
    ()=>clearQueue,
    "deliveryQueue",
    ()=>deliveryQueue,
    "emailSendingQueue",
    ()=>emailSendingQueue,
    "getAllQueueStatuses",
    ()=>getAllQueueStatuses,
    "getFailedJobs",
    ()=>getFailedJobs,
    "getQueueStatus",
    ()=>getQueueStatus,
    "leadProcessingQueue",
    ()=>leadProcessingQueue,
    "pauseAllQueues",
    ()=>pauseAllQueues,
    "resumeAllQueues",
    ()=>resumeAllQueues,
    "siteGenerationQueue",
    ()=>siteGenerationQueue
]);
class MockQueue {
    name;
    constructor(name){
        this.name = name;
    }
    async add(name, data) {
        console.log(`[MOCK QUEUE ${this.name}] Added job: ${name}`, data);
        return {
            id: "mock-job-id-" + Date.now()
        };
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
const leadProcessingQueue = new MockQueue("lead-processing");
const siteGenerationQueue = new MockQueue("site-generation");
const emailSendingQueue = new MockQueue("email-sending");
const deliveryQueue = new MockQueue("delivery");
async function addJobToQueue(queue, jobName, data, options = {}) {
    return queue.add(jobName, data);
}
async function getQueueStatus(queue) {
    return {
        name: queue.name,
        waiting: 0,
        active: 0,
        completed: 0,
        failed: 0,
        delayed: 0,
        paused: false,
        total: 0
    };
}
async function getAllQueueStatuses() {
    return [
        await getQueueStatus(leadProcessingQueue),
        await getQueueStatus(siteGenerationQueue),
        await getQueueStatus(emailSendingQueue),
        await getQueueStatus(deliveryQueue)
    ];
}
async function pauseAllQueues() {
    console.log("⏸️ [MOCK] All queues paused");
}
async function resumeAllQueues() {
    console.log("▶️ [MOCK] All queues resumed");
}
async function clearQueue(queue) {
    console.log(`🗑️ [MOCK] Queue ${queue.name} cleared`);
}
async function getFailedJobs(queue, limit = 50) {
    return [];
}
}),
"[project]/app/api/admin/queues/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queues$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/queues.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const statuses = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queues$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllQueueStatuses"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            queues: statuses
        });
    } catch (error) {
        // Return empty queues if Redis is unavailable
        console.error('Queue status error:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            queues: [],
            error: 'Redis connection unavailable'
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__00136c08._.js.map