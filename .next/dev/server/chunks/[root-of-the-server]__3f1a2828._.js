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

// FIX: Ensure this file is never bundled to the client
__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-route] (ecmascript)");
;
;
// Supabase configuration
const supabaseUrl = ("TURBOPACK compile-time value", "https://amslnjnjonxxinzvhicl.supabase.co");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables");
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});
}),
"[project]/app/api/admin/lead-magnet/stats/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        // Get all submissions
        const { data: submissions } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('lead_magnet_submissions').select('*');
        if (!submissions) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                totalSubmissions: 0,
                totalGenerated: 0,
                totalConverted: 0,
                conversionRate: 0,
                revenue: 0,
                costPerLead: 0,
                roi: 0,
                campaignBreakdown: []
            });
        }
        // Calculate metrics
        const totalSubmissions = submissions.length;
        const totalGenerated = submissions.filter((s)=>s.status === 'generated' || s.status === 'delivered' || s.status === 'converted').length;
        const totalConverted = submissions.filter((s)=>s.status === 'converted').length;
        const conversionRate = totalSubmissions > 0 ? totalConverted / totalSubmissions * 100 : 0;
        // Calculate revenue (assuming $99/month)
        const revenue = totalConverted * 99;
        // Get total ad spend
        const { data: campaigns } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('lead_magnet_campaigns').select('ad_spend');
        const totalAdSpend = campaigns?.reduce((sum, c)=>sum + parseFloat(c.ad_spend || '0'), 0) || 0;
        const costPerLead = totalSubmissions > 0 ? totalAdSpend / totalSubmissions : 0;
        const roi = totalAdSpend > 0 ? (revenue - totalAdSpend) / totalAdSpend * 100 : 0;
        // Campaign breakdown
        const { data: campaignData } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('lead_magnet_campaigns').select(`
        id,
        name,
        platform,
        ad_spend,
        submissions:lead_magnet_submissions(count)
      `);
        const campaignBreakdown = campaignData?.map((campaign)=>({
                id: campaign.id,
                name: campaign.name,
                platform: campaign.platform,
                submissions: campaign.submissions?.length || 0,
                adSpend: parseFloat(campaign.ad_spend || '0'),
                costPerLead: campaign.submissions?.length > 0 ? parseFloat(campaign.ad_spend || '0') / campaign.submissions.length : 0
            })) || [];
        // Funnel metrics
        const visited = submissions.filter((s)=>s.landing_page_visited_at).length;
        const formStarted = submissions.filter((s)=>s.form_started_at).length;
        const formCompleted = submissions.filter((s)=>s.form_completed_at).length;
        const generated = submissions.filter((s)=>s.website_generated_at).length;
        const delivered = submissions.filter((s)=>s.email_sent_at).length;
        const previewVisited = submissions.filter((s)=>s.preview_visited_at).length;
        const ctaClicked = submissions.filter((s)=>s.cta_clicked_at).length;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            totalSubmissions,
            totalGenerated,
            totalConverted,
            conversionRate: Math.round(conversionRate * 10) / 10,
            revenue,
            costPerLead: Math.round(costPerLead * 100) / 100,
            roi: Math.round(roi * 10) / 10,
            campaignBreakdown,
            funnelMetrics: {
                visited,
                formStarted,
                formCompleted,
                generated,
                delivered,
                previewVisited,
                ctaClicked,
                converted: totalConverted
            }
        });
    } catch (error) {
        console.error('❌ Failed to get stats:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to get stats'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__3f1a2828._.js.map