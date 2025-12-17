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
"[project]/app/api/admin/diagnostics/database/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@supabase/supabase-js/dist/esm/wrapper.mjs [app-route] (ecmascript)");
;
;
const supabase = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$supabase$2f$supabase$2d$js$2f$dist$2f$esm$2f$wrapper$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createClient"])(("TURBOPACK compile-time value", "https://amslnjnjonxxinzvhicl.supabase.co"), ("TURBOPACK compile-time value", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtc2xuam5qb254eGluenZoaWNsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMzQ5NDEsImV4cCI6MjA4MDcxMDk0MX0.moOpDqIzalxklWBFYrD75vHEUcs_xgNDBZpQf9W-zZM"));
async function GET() {
    const issues = [];
    const warnings = [];
    const stats = {};
    try {
        // 1. Check Leads Table
        const { data: leads, count: leadsCount, error: leadsError } = await supabase.from('leads').select('*', {
            count: 'exact'
        });
        if (leadsError) {
            issues.push({
                severity: 'critical',
                table: 'leads',
                issue: 'Cannot query leads table',
                error: leadsError.message
            });
        } else {
            stats.totalLeads = leadsCount || 0;
            // Check for leads with missing email
            const missingEmail = leads?.filter((l)=>!l.email).length || 0;
            if (missingEmail > 0) {
                warnings.push({
                    severity: 'warning',
                    table: 'leads',
                    issue: `${missingEmail} leads missing email addresses`,
                    count: missingEmail
                });
            }
            // Check for duplicate emails
            const emails = leads?.map((l)=>l.email).filter(Boolean) || [];
            const duplicates = emails.filter((e, i)=>emails.indexOf(e) !== i);
            if (duplicates.length > 0) {
                warnings.push({
                    severity: 'warning',
                    table: 'leads',
                    issue: `${duplicates.length} duplicate email addresses found`,
                    duplicates: [
                        ...new Set(duplicates)
                    ]
                });
            }
            // Check status distribution
            const statuses = {};
            leads?.forEach((l)=>{
                statuses[l.status] = (statuses[l.status] || 0) + 1;
            });
            stats.leadStatuses = statuses;
        }
        // 2. Check Sites Table
        const { data: sites, count: sitesCount, error: sitesError } = await supabase.from('sites').select('*', {
            count: 'exact'
        });
        if (sitesError) {
            issues.push({
                severity: 'critical',
                table: 'sites',
                issue: 'Cannot query sites table',
                error: sitesError.message
            });
        } else {
            stats.totalSites = sitesCount || 0;
            // Check for sites without preview URL
            const missingPreview = sites?.filter((s)=>!s.preview_url).length || 0;
            if (missingPreview > 0) {
                warnings.push({
                    severity: 'warning',
                    table: 'sites',
                    issue: `${missingPreview} sites missing preview URLs`,
                    count: missingPreview
                });
            }
            // Check for orphaned sites (no lead_id)
            const orphaned = sites?.filter((s)=>!s.lead_id).length || 0;
            if (orphaned > 0) {
                issues.push({
                    severity: 'error',
                    table: 'sites',
                    issue: `${orphaned} orphaned sites (no lead_id)`,
                    count: orphaned
                });
            }
        }
        // 3. Check Subscriptions Table
        const { data: subscriptions, count: subsCount, error: subsError } = await supabase.from('subscriptions').select('*', {
            count: 'exact'
        });
        if (subsError) {
            issues.push({
                severity: 'critical',
                table: 'subscriptions',
                issue: 'Cannot query subscriptions table',
                error: subsError.message
            });
        } else {
            stats.totalSubscriptions = subsCount || 0;
            const activeCount = subscriptions?.filter((s)=>s.status === 'active').length || 0;
            stats.activeSubscriptions = activeCount;
            // Calculate MRR
            const mrr = subscriptions?.filter((s)=>s.status === 'active').reduce((sum, s)=>sum + parseFloat(s.amount?.toString() || '0'), 0) || 0;
            stats.mrr = Math.round(mrr * 100) / 100;
            // Calculate ARR
            stats.arr = Math.round(mrr * 12 * 100) / 100;
            // Check for subscriptions without lead_id
            const noLead = subscriptions?.filter((s)=>!s.lead_id).length || 0;
            if (noLead > 0) {
                warnings.push({
                    severity: 'warning',
                    table: 'subscriptions',
                    issue: `${noLead} subscriptions without lead_id`,
                    count: noLead
                });
            }
        }
        // 4. Check Email Logs
        const { count: emailsSent, error: emailError } = await supabase.from('email_logs').select('*', {
            count: 'exact',
            head: true
        });
        if (!emailError) {
            stats.totalEmailsSent = emailsSent || 0;
            const { count: emailsOpened } = await supabase.from('email_logs').select('*', {
                count: 'exact',
                head: true
            }).not('opened_at', 'is', null);
            stats.emailsOpened = emailsOpened || 0;
            stats.openRate = emailsSent && emailsSent > 0 ? Math.round(emailsOpened / emailsSent * 100 * 10) / 10 : 0;
        }
        // 5. Calculate Conversion Metrics
        const leadsContacted = leads?.filter((l)=>l.email_sent_at).length || 0;
        stats.leadsContacted = leadsContacted;
        stats.conversionRate = leadsContacted > 0 ? Math.round(stats.activeSubscriptions / leadsContacted * 100 * 10) / 10 : 0;
        // 6. Check for data integrity issues
        if (stats.conversionRate > 100) {
            issues.push({
                severity: 'critical',
                calculation: 'conversion_rate',
                issue: `Conversion rate is ${stats.conversionRate}% (impossible - must be ≤100%)`,
                activeSubscriptions: stats.activeSubscriptions,
                leadsContacted: stats.leadsContacted
            });
        }
        // 7. Check QA Reviews
        const { count: qaCount } = await supabase.from('qa_reviews').select('*', {
            count: 'exact',
            head: true
        });
        stats.totalQAReviews = qaCount || 0;
        // 8. Check Support Tickets
        const { count: ticketsCount } = await supabase.from('support_tickets').select('*', {
            count: 'exact',
            head: true
        });
        stats.totalSupportTickets = ticketsCount || 0;
        const { count: openTickets } = await supabase.from('support_tickets').select('*', {
            count: 'exact',
            head: true
        }).eq('status', 'open');
        stats.openSupportTickets = openTickets || 0;
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: 'complete',
            summary: {
                totalIssues: issues.length,
                totalWarnings: warnings.length,
                criticalIssues: issues.filter((i)=>i.severity === 'critical').length
            },
            issues,
            warnings,
            stats,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            status: 'error',
            error: error.message,
            issues: [
                {
                    severity: 'critical',
                    issue: 'Diagnostic scan failed',
                    error: error.message
                }
            ]
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__f2ebfd3a._.js.map