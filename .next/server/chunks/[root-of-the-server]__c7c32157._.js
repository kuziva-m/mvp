module.exports = [
"[project]/.next-internal/server/app/api/admin/generate-test-leads/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/lib/modules/leads/mock-data-generator.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "generateMockLeads",
    ()=>generateMockLeads
]);
function generateMockLeads(config) {
    const leads = [];
    const cities = [
        'Melbourne',
        'Sydney',
        'Brisbane',
        'Perth',
        'Adelaide'
    ];
    const industries = [
        'plumbing',
        'electrical',
        'hvac',
        'roofing',
        'landscaping',
        'painting'
    ];
    const businessTypes = [
        'Services',
        'Co',
        'Group',
        'Experts',
        'Solutions',
        'Pros'
    ];
    const streets = [
        'Main St',
        'High St',
        'King St',
        'Queen St',
        'Smith St',
        'Collins St'
    ];
    const firstNames = [
        'John',
        'Sarah',
        'Michael',
        'Emma',
        'David',
        'Lisa',
        'James',
        'Sophie'
    ];
    const lastNames = [
        'Smith',
        'Johnson',
        'Williams',
        'Brown',
        'Jones',
        'Davis',
        'Wilson',
        'Taylor'
    ];
    for(let i = 0; i < config.count; i++){
        const city = config.city || cities[Math.floor(Math.random() * cities.length)];
        const industry = config.industry || industries[Math.floor(Math.random() * industries.length)];
        const businessType = businessTypes[Math.floor(Math.random() * businessTypes.length)];
        const street = streets[Math.floor(Math.random() * streets.length)];
        const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
        const businessName = `${city} ${industry.charAt(0).toUpperCase() + industry.slice(1)} ${businessType}`;
        const hasWebsite = Math.random() > 0.5;
        const hasEmail = Math.random() > 0.3;
        leads.push({
            business_name: businessName,
            email: hasEmail ? `contact@${businessName.toLowerCase().replace(/\s/g, '')}.com.au` : null,
            phone: `04${Math.floor(10000000 + Math.random() * 90000000)}`,
            website: hasWebsite ? `https://${businessName.toLowerCase().replace(/\s/g, '')}.com.au` : null,
            address: `${Math.floor(Math.random() * 999) + 1} ${street}, ${city} VIC ${3000 + i}`,
            city: city,
            state: 'VIC',
            postcode: `${3000 + i}`,
            industry: industry,
            owner_name: `${firstName} ${lastName}`,
            business_age: Math.floor(Math.random() * 20) + 1,
            rating: Math.random() > 0.2 ? 3.5 + Math.random() * 1.5 : null,
            reviews_count: Math.random() > 0.2 ? Math.floor(Math.random() * 200) + 1 : null,
            source: 'mock',
            source_metadata: {
                mock_id: `mock-${i}`,
                generated_at: new Date().toISOString()
            }
        });
    }
    return leads;
}
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
"[project]/app/api/admin/generate-test-leads/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$leads$2f$mock$2d$data$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modules/leads/mock-data-generator.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queues$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/queues.ts [app-route] (ecmascript)");
;
;
;
async function POST() {
    try {
        const leads = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$leads$2f$mock$2d$data$2d$generator$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["generateMockLeads"])({
            count: 100
        });
        for (const lead of leads){
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queues$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addJobToQueue"])(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$queues$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["leadProcessingQueue"], 'process', lead);
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: '100 test leads queued'
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c7c32157._.js.map