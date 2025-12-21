module.exports = [
"[project]/.next-internal/server/app/api/admin/analytics/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[project]/lib/supabase.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// FIX: Ensure this file is never bundled to the client
__turbopack_context__.s([
    "supabase",
    ()=>supabase
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$server$2d$only$2f$empty$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/server-only/empty.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/index.mjs [app-route] (ecmascript) <locals>");
;
;
// Supabase configuration
const supabaseUrl = ("TURBOPACK compile-time value", "https://amslnjnjonxxinzvhicl.supabase.co");
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseServiceRoleKey) {
    throw new Error("Missing Supabase environment variables");
}
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createClient"])(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false,
        detectSessionInUrl: false
    }
});
}),
"[project]/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "advancedQuery",
    ()=>advancedQuery,
    "count",
    ()=>count,
    "deleteRecord",
    ()=>deleteRecord,
    "getById",
    ()=>getById,
    "insert",
    ()=>insert,
    "query",
    ()=>query,
    "testConnection",
    ()=>testConnection,
    "update",
    ()=>update
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
;
async function query(table, filters) {
    try {
        let queryBuilder = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from(table).select('*');
        // Apply filters if provided
        if (filters) {
            Object.entries(filters).forEach(([key, value])=>{
                if (value !== undefined && value !== null) {
                    queryBuilder = queryBuilder.eq(key, value);
                }
            });
        }
        const { data, error } = await queryBuilder;
        if (error) {
            console.error(`Query error on ${table}:`, error.message || error);
            return {
                data: null,
                error
            };
        }
        return {
            data: data,
            error: null
        };
    } catch (error) {
        console.error(`Unexpected error querying ${table}:`, error);
        return {
            data: null,
            error
        };
    }
}
async function insert(table, data) {
    try {
        const { data: insertedData, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from(table).insert(data).select().single();
        if (error) {
            console.error(`Insert error on ${table}:`, error);
            return {
                data: null,
                error
            };
        }
        return {
            data: insertedData,
            error: null
        };
    } catch (error) {
        console.error(`Unexpected error inserting into ${table}:`, error);
        return {
            data: null,
            error
        };
    }
}
async function update(table, id, updates) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from(table).update(updates).eq('id', id).select().single();
        if (error) {
            console.error(`Update error on ${table}:`, error);
            return {
                data: null,
                error
            };
        }
        return {
            data: data,
            error: null
        };
    } catch (error) {
        console.error(`Unexpected error updating ${table}:`, error);
        return {
            data: null,
            error
        };
    }
}
async function deleteRecord(table, id) {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from(table).delete().eq('id', id);
        if (error) {
            console.error(`Delete error on ${table}:`, error);
            return {
                success: false,
                error
            };
        }
        return {
            success: true,
            error: null
        };
    } catch (error) {
        console.error(`Unexpected error deleting from ${table}:`, error);
        return {
            success: false,
            error
        };
    }
}
async function getById(table, id) {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from(table).select('*').eq('id', id).single();
        if (error) {
            console.error(`GetById error on ${table}:`, error);
            return {
                data: null,
                error
            };
        }
        return {
            data: data,
            error: null
        };
    } catch (error) {
        console.error(`Unexpected error getting record from ${table}:`, error);
        return {
            data: null,
            error
        };
    }
}
async function count(table, filters) {
    try {
        let queryBuilder = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from(table).select('*', {
            count: 'exact',
            head: true
        });
        // Apply filters if provided
        if (filters) {
            Object.entries(filters).forEach(([key, value])=>{
                queryBuilder = queryBuilder.eq(key, value);
            });
        }
        const { count, error } = await queryBuilder;
        if (error) {
            console.error(`Count error on ${table}:`, error);
            return {
                count: null,
                error
            };
        }
        return {
            count,
            error: null
        };
    } catch (error) {
        console.error(`Unexpected error counting ${table}:`, error);
        return {
            count: null,
            error
        };
    }
}
async function advancedQuery(options) {
    try {
        let queryBuilder = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from(options.table).select(options.select || '*', {
            count: 'exact'
        });
        // Apply filters
        if (options.filters) {
            Object.entries(options.filters).forEach(([key, value])=>{
                if (value !== undefined && value !== null) {
                    queryBuilder = queryBuilder.eq(key, value);
                }
            });
        }
        // Apply sorting
        if (options.orderBy) {
            queryBuilder = queryBuilder.order(options.orderBy.column, {
                ascending: options.orderBy.ascending ?? false
            });
        }
        // Apply pagination
        if (options.limit !== undefined) {
            queryBuilder = queryBuilder.limit(options.limit);
        }
        if (options.offset !== undefined) {
            queryBuilder = queryBuilder.range(options.offset, options.offset + (options.limit || 10) - 1);
        }
        const { data, error, count } = await queryBuilder;
        if (error) {
            console.error(`Advanced query error on ${options.table}:`, error);
            return {
                data: null,
                error,
                count: undefined
            };
        }
        return {
            data: data,
            error: null,
            count: count ?? undefined
        };
    } catch (error) {
        console.error(`Unexpected error in advanced query:`, error);
        return {
            data: null,
            error,
            count: undefined
        };
    }
}
async function testConnection() {
    try {
        const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('leads').select('count').limit(1);
        // PGRST205 means table doesn't exist - but connection works!
        if (error && error.code !== 'PGRST205') {
            console.error('Database connection test failed:', error);
            return false;
        }
        // If error is PGRST205, connection is working, tables just don't exist yet
        if (error && error.code === 'PGRST205') {
            console.log('✅ Database connected (tables not created yet)');
            return true;
        }
        console.log('✅ Database connection successful');
        return true;
    } catch (error) {
        console.error('Database connection test error:', error);
        return false;
    }
}
}),
"[project]/lib/modules/crm/analytics.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * CRM Analytics Module
 *
 * Provides comprehensive analytics calculations for:
 * - Key business metrics (MRR, ARR, LTV, CAC, etc.)
 * - Conversion funnel analysis
 * - Time-series data (leads/revenue over time)
 * - Performance tracking
 */ __turbopack_context__.s([
    "calculateMetrics",
    ()=>calculateMetrics,
    "getBestSubjectLines",
    ()=>getBestSubjectLines,
    "getFunnelMetrics",
    ()=>getFunnelMetrics,
    "getLeadsByStatus",
    ()=>getLeadsByStatus,
    "getLeadsOverTime",
    ()=>getLeadsOverTime,
    "getRecentActivity",
    ()=>getRecentActivity,
    "getRevenueByIndustry",
    ()=>getRevenueByIndustry,
    "getRevenueOverTime",
    ()=>getRevenueOverTime
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
;
async function calculateMetrics() {
    console.log('Calculating CRM metrics...');
    // Fetch all data
    const { data: leads } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('leads');
    const { data: allSubscriptions } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('subscriptions');
    const { data: generations } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('generations');
    const totalLeads = leads?.length || 0;
    const totalContacted = leads?.filter((l)=>l.email_sent_at).length || 0;
    const totalOpened = leads?.filter((l)=>l.email_opened_at).length || 0;
    const totalClicked = leads?.filter((l)=>l.email_clicked_at).length || 0;
    // Active subscriptions
    const activeSubscriptions = allSubscriptions?.filter((s)=>s.status === 'active') || [];
    const totalSubscribed = activeSubscriptions.length;
    // Delivered and canceled
    const totalDelivered = leads?.filter((l)=>l.status === 'delivered').length || 0;
    const totalCanceled = leads?.filter((l)=>l.status === 'canceled').length || 0;
    // Revenue calculations
    const mrr = activeSubscriptions.reduce((sum, s)=>sum + Number(s.amount), 0);
    const arr = mrr * 12;
    // Conversion rates
    const conversionRate = totalContacted > 0 ? totalSubscribed / totalContacted * 100 : 0;
    const openRate = totalContacted > 0 ? totalOpened / totalContacted * 100 : 0;
    const clickRate = totalOpened > 0 ? totalClicked / totalOpened * 100 : 0;
    const clickToSubscribeRate = totalClicked > 0 ? totalSubscribed / totalClicked * 100 : 0;
    // Average revenue per lead
    const avgRevenuePerLead = totalLeads > 0 ? mrr / totalLeads : 0;
    // Customer Acquisition Cost (CAC)
    const totalCost = generations?.reduce((sum, g)=>sum + Number(g.cost_usd || 0), 0) || 0;
    const cac = totalSubscribed > 0 ? totalCost / totalSubscribed : 0;
    // Lifetime Value (LTV) - simplified: average subscription * 12 months
    const ltv = totalSubscribed > 0 ? mrr / totalSubscribed * 12 : 0;
    // Churn Rate - canceled / total ever subscribed
    const totalEverSubscribed = allSubscriptions?.length || 0;
    const churnRate = totalEverSubscribed > 0 ? totalCanceled / totalEverSubscribed * 100 : 0;
    console.log('Metrics calculated:', {
        totalLeads,
        totalSubscribed,
        mrr,
        conversionRate: conversionRate.toFixed(2) + '%'
    });
    return {
        totalLeads,
        totalContacted,
        totalOpened,
        totalClicked,
        totalSubscribed,
        totalDelivered,
        totalCanceled,
        mrr,
        arr,
        conversionRate,
        openRate,
        clickRate,
        clickToSubscribeRate,
        avgRevenuePerLead,
        ltv,
        cac,
        churnRate,
        activeSubscriptions: totalSubscribed
    };
}
async function getLeadsOverTime(days = 30) {
    console.log(`Getting leads over last ${days} days...`);
    const { data: leads } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('leads');
    const dates = [];
    for(let i = days - 1; i >= 0; i--){
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const count = leads?.filter((l)=>l.created_at?.split('T')[0] === dateStr).length || 0;
        dates.push({
            date: dateStr,
            count
        });
    }
    return dates;
}
async function getRevenueOverTime(months = 12) {
    console.log(`Getting revenue over last ${months} months...`);
    const { data: subscriptions } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('subscriptions');
    const monthsData = [];
    for(let i = months - 1; i >= 0; i--){
        const date = new Date();
        date.setMonth(date.getMonth() - i);
        const monthStr = date.toISOString().substring(0, 7) // YYYY-MM
        ;
        const monthSubs = subscriptions?.filter((s)=>s.created_at?.startsWith(monthStr)) || [];
        const revenue = monthSubs.reduce((sum, s)=>sum + Number(s.amount), 0);
        monthsData.push({
            month: monthStr,
            revenue,
            subscriptions: monthSubs.length
        });
    }
    return monthsData;
}
async function getFunnelMetrics() {
    console.log('Calculating funnel metrics...');
    const metrics = await calculateMetrics();
    const stages = [
        {
            name: 'Contacted',
            count: metrics.totalContacted,
            rate: 100
        },
        {
            name: 'Opened',
            count: metrics.totalOpened,
            rate: metrics.openRate,
            dropOffRate: 100 - metrics.openRate
        },
        {
            name: 'Clicked',
            count: metrics.totalClicked,
            rate: metrics.clickRate,
            dropOffRate: 100 - metrics.clickRate
        },
        {
            name: 'Subscribed',
            count: metrics.totalSubscribed,
            rate: metrics.clickToSubscribeRate,
            dropOffRate: 100 - metrics.clickToSubscribeRate
        },
        {
            name: 'Delivered',
            count: metrics.totalDelivered,
            rate: metrics.totalSubscribed > 0 ? metrics.totalDelivered / metrics.totalSubscribed * 100 : 0
        }
    ];
    return stages;
}
async function getLeadsByStatus() {
    console.log('Getting leads grouped by status...');
    const { data: leads } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('leads');
    const grouped = {
        pending: leads?.filter((l)=>l.status === 'pending') || [],
        contacted: leads?.filter((l)=>l.status === 'contacted') || [],
        opened: leads?.filter((l)=>l.status === 'opened') || [],
        clicked: leads?.filter((l)=>l.status === 'clicked') || [],
        subscribed: leads?.filter((l)=>l.status === 'subscribed') || [],
        delivered: leads?.filter((l)=>l.status === 'delivered') || [],
        canceled: leads?.filter((l)=>l.status === 'canceled') || []
    };
    return grouped;
}
async function getRecentActivity(limit = 20) {
    console.log(`Getting recent ${limit} activities...`);
    const activities = [];
    // Get recent leads
    const { data: leads } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('leads');
    const sortedLeads = leads?.sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];
    for (const lead of sortedLeads.slice(0, limit)){
        // Lead added
        activities.push({
            id: `lead-${lead.id}`,
            type: 'lead_added',
            leadName: lead.business_name,
            leadId: lead.id,
            timestamp: lead.created_at
        });
        // Email sent
        if (lead.email_sent_at) {
            activities.push({
                id: `email-sent-${lead.id}`,
                type: 'email_sent',
                leadName: lead.business_name,
                leadId: lead.id,
                timestamp: lead.email_sent_at
            });
        }
        // Email opened
        if (lead.email_opened_at) {
            activities.push({
                id: `email-opened-${lead.id}`,
                type: 'email_opened',
                leadName: lead.business_name,
                leadId: lead.id,
                timestamp: lead.email_opened_at
            });
        }
        // Email clicked
        if (lead.email_clicked_at) {
            activities.push({
                id: `email-clicked-${lead.id}`,
                type: 'email_clicked',
                leadName: lead.business_name,
                leadId: lead.id,
                timestamp: lead.email_clicked_at
            });
        }
        // Website delivered
        if (lead.status === 'delivered') {
            activities.push({
                id: `delivered-${lead.id}`,
                type: 'website_delivered',
                leadName: lead.business_name,
                leadId: lead.id,
                timestamp: lead.updated_at
            });
        }
    }
    // Sort by timestamp and limit
    return activities.sort((a, b)=>new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, limit);
}
async function getRevenueByIndustry() {
    console.log('Calculating revenue by industry...');
    const { data: leads } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('leads');
    const { data: subscriptions } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('subscriptions', {
        status: 'active'
    });
    // Group subscriptions by industry
    const industryMap = new Map();
    for (const sub of subscriptions || []){
        const lead = leads?.find((l)=>l.id === sub.lead_id);
        if (!lead) continue;
        const industry = lead.industry || 'Unknown';
        const current = industryMap.get(industry) || {
            revenue: 0,
            count: 0
        };
        industryMap.set(industry, {
            revenue: current.revenue + Number(sub.amount),
            count: current.count + 1
        });
    }
    return Array.from(industryMap.entries()).map(([industry, data])=>({
            industry,
            revenue: data.revenue,
            count: data.count
        }));
}
async function getBestSubjectLines(limit = 5) {
    console.log('Getting best performing subject lines...');
    const { data: emailLogs } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('email_logs');
    // Group by subject
    const subjectMap = new Map();
    for (const log of emailLogs || []){
        const current = subjectMap.get(log.subject) || {
            opens: 0,
            total: 0
        };
        subjectMap.set(log.subject, {
            opens: current.opens + (log.opened_at ? 1 : 0),
            total: current.total + 1
        });
    }
    // Calculate open rates and sort
    return Array.from(subjectMap.entries()).map(([subject, data])=>({
            subject,
            opens: data.opens,
            total: data.total,
            openRate: data.opens / data.total * 100
        })).sort((a, b)=>b.openRate - a.openRate).slice(0, limit);
}
}),
"[project]/app/api/admin/analytics/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Admin Analytics API
 *
 * GET /api/admin/analytics
 * Returns comprehensive analytics data
 */ __turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$crm$2f$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modules/crm/analytics.ts [app-route] (ecmascript)");
;
;
async function GET() {
    try {
        const [metrics, leadsOverTime, revenueOverTime, funnelMetrics, revenueByIndustry, bestSubjects] = await Promise.all([
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$crm$2f$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["calculateMetrics"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$crm$2f$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getLeadsOverTime"])(30),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$crm$2f$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRevenueOverTime"])(12),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$crm$2f$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFunnelMetrics"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$crm$2f$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getRevenueByIndustry"])(),
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$crm$2f$analytics$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getBestSubjectLines"])(5)
        ]);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            analytics: {
                metrics,
                leadsOverTime,
                revenueOverTime,
                funnelMetrics,
                revenueByIndustry,
                bestSubjects
            }
        });
    } catch (error) {
        console.error('Error fetching analytics:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch analytics',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a5561b8b._.js.map