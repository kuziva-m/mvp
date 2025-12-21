module.exports = [
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
"[project]/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-route] (ecmascript)");
;
// Supabase configuration
const supabaseUrl = ("TURBOPACK compile-time value", "https://amslnjnjonxxinzvhicl.supabase.co");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error('Missing Supabase environment variables');
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});
}),
"[project]/lib/modules/customer-success/health-scorer.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "calculateHealthScore",
    ()=>calculateHealthScore,
    "getAtRiskCustomers",
    ()=>getAtRiskCustomers,
    "saveHealthScore",
    ()=>saveHealthScore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
;
async function calculateHealthScore(leadId) {
    console.log(`💊 Calculating health score for: ${leadId}`);
    // Get customer data
    const { data: lead } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('leads').select('*, subscriptions(*), support_tickets(*)').eq('id', leadId).single();
    if (!lead) {
        throw new Error('Lead not found');
    }
    // Factor 1: Engagement (40 points)
    let engagementScore = 0;
    // Check last activity (email opens, clicks, site visits)
    const daysSinceCreated = Math.floor((Date.now() - new Date(lead.created_at).getTime()) / (1000 * 60 * 60 * 24));
    const daysSinceActivity = lead.email_clicked_at ? Math.floor((Date.now() - new Date(lead.email_clicked_at).getTime()) / (1000 * 60 * 60 * 24)) : daysSinceCreated;
    if (daysSinceActivity <= 7) engagementScore = 40;
    else if (daysSinceActivity <= 14) engagementScore = 30;
    else if (daysSinceActivity <= 30) engagementScore = 20;
    else if (daysSinceActivity <= 60) engagementScore = 10;
    else engagementScore = 0;
    // Factor 2: Support tickets (30 points)
    const totalTickets = lead.support_tickets?.length || 0;
    const unresolvedTickets = lead.support_tickets?.filter((t)=>t.status !== 'resolved').length || 0;
    let supportScore = 30;
    if (unresolvedTickets > 0) supportScore -= unresolvedTickets * 10;
    if (totalTickets > 5) supportScore -= 10;
    supportScore = Math.max(0, supportScore);
    // Factor 3: Payment health (30 points)
    const subscription = lead.subscriptions?.[0];
    let paymentScore = 30;
    if (subscription?.status === 'past_due') paymentScore = 10;
    else if (subscription?.status === 'canceled') paymentScore = 0;
    // Calculate overall health score
    const healthScore = Math.round(engagementScore + supportScore + paymentScore);
    // Determine risk level
    let riskLevel;
    if (healthScore >= 80) riskLevel = 'low';
    else if (healthScore >= 60) riskLevel = 'medium';
    else if (healthScore >= 40) riskLevel = 'high';
    else riskLevel = 'critical';
    // Calculate churn probability
    const churnProbability = Math.round(100 - healthScore);
    // Determine satisfaction (simplified - in production, use survey data)
    const satisfactionScore = Math.min(100, healthScore + 10);
    console.log(`✅ Health score: ${healthScore}/100 (${riskLevel} risk)`);
    return {
        leadId,
        healthScore,
        engagementScore,
        satisfactionScore,
        riskLevel,
        churnProbability,
        factors: {
            daysSinceActivity,
            supportTickets: totalTickets,
            paymentIssues: subscription?.status === 'past_due' ? 1 : 0,
            engagement: daysSinceActivity <= 7 ? 'active' : daysSinceActivity <= 30 ? 'moderate' : 'low'
        }
    };
}
async function saveHealthScore(health) {
    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('customer_health').upsert({
        lead_id: health.leadId,
        health_score: health.healthScore,
        engagement_score: health.engagementScore,
        satisfaction_score: health.satisfactionScore,
        risk_level: health.riskLevel,
        churn_probability: health.churnProbability,
        last_activity_at: new Date().toISOString(),
        days_since_activity: health.factors.daysSinceActivity,
        total_support_tickets: health.factors.supportTickets,
        payment_failures: health.factors.paymentIssues,
        last_calculated_at: new Date().toISOString()
    }, {
        onConflict: 'lead_id'
    });
}
async function getAtRiskCustomers() {
    const { data } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('customer_health').select('*, leads(business_name, email)').in('risk_level', [
        'high',
        'critical'
    ]).order('health_score', {
        ascending: true
    });
    return data || [];
}
}),
"[project]/app/api/admin/customer-success/at-risk/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$customer$2d$success$2f$health$2d$scorer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modules/customer-success/health-scorer.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const atRisk = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$customer$2d$success$2f$health$2d$scorer$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAtRiskCustomers"])();
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            atRisk
        });
    } catch (error) {
        console.error('Failed to get at-risk customers:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to get at-risk customers'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__ce9fbe13._.js.map