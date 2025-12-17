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
"[externals]/node:crypto [external] (node:crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:crypto", () => require("node:crypto"));

module.exports = mod;
}),
"[project]/lib/modules/financial/expense-tracker.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "logAIUsage",
    ()=>logAIUsage,
    "logDomainPurchase",
    ()=>logDomainPurchase,
    "logEmailCost",
    ()=>logEmailCost,
    "logEmailHosting",
    ()=>logEmailHosting,
    "logExpense",
    ()=>logExpense,
    "logFixedCost",
    ()=>logFixedCost,
    "logHostingCost",
    ()=>logHostingCost,
    "logLeadGenCost",
    ()=>logLeadGenCost,
    "logStripeFee",
    ()=>logStripeFee
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
;
async function logExpense(expense) {
    const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('expenses').insert({
        category: expense.category,
        subcategory: expense.subcategory,
        description: expense.description,
        amount: expense.amount,
        currency: expense.currency || 'AUD',
        related_to_customer: expense.relatedToCustomer,
        related_to_site: expense.relatedToSite,
        expense_date: expense.expenseDate,
        is_recurring: expense.isRecurring || false,
        recurrence_period: expense.recurrencePeriod
    }).select().single();
    if (error) {
        console.error('Failed to log expense:', error);
        return null;
    }
    console.log(`💰 Expense logged: ${expense.subcategory} - $${expense.amount}`);
    return data;
}
async function logAIUsage(leadId, siteId, tokensUsed, costUSD) {
    return logExpense({
        category: 'api_usage',
        subcategory: 'anthropic',
        description: `AI generation - ${tokensUsed} tokens`,
        amount: costUSD,
        currency: 'USD',
        relatedToCustomer: leadId,
        relatedToSite: siteId,
        expenseDate: new Date().toISOString().split('T')[0]
    });
}
async function logEmailCost(leadId, emailCount = 1) {
    // Resend: 3,000 emails/month free, then $20/10k
    // Conservative estimate: $0.002 per email
    const costPerEmail = 0.002;
    return logExpense({
        category: 'api_usage',
        subcategory: 'resend',
        description: `Email sending - ${emailCount} email(s)`,
        amount: emailCount * costPerEmail,
        currency: 'USD',
        relatedToCustomer: leadId,
        expenseDate: new Date().toISOString().split('T')[0]
    });
}
async function logStripeFee(leadId, subscriptionAmount) {
    // Stripe: 1.75% + $0.30 AUD for Australian cards
    const fee = subscriptionAmount * 0.0175 + 0.30;
    return logExpense({
        category: 'api_usage',
        subcategory: 'stripe',
        description: `Payment processing fee`,
        amount: fee,
        currency: 'AUD',
        relatedToCustomer: leadId,
        expenseDate: new Date().toISOString().split('T')[0]
    });
}
async function logDomainPurchase(leadId, domain, costAUD = 15.00) {
    return logExpense({
        category: 'infrastructure',
        subcategory: 'domain',
        description: `Domain registration - ${domain}`,
        amount: costAUD,
        currency: 'AUD',
        relatedToCustomer: leadId,
        expenseDate: new Date().toISOString().split('T')[0],
        isRecurring: true,
        recurrencePeriod: 'annual'
    });
}
async function logHostingCost(leadId, monthlyAUD = 20.00) {
    return logExpense({
        category: 'infrastructure',
        subcategory: 'hosting',
        description: `Framer hosting`,
        amount: monthlyAUD,
        currency: 'AUD',
        relatedToCustomer: leadId,
        expenseDate: new Date().toISOString().split('T')[0],
        isRecurring: true,
        recurrencePeriod: 'monthly'
    });
}
async function logEmailHosting(leadId, monthlyAUD = 0.40 // $20/50 customers
) {
    return logExpense({
        category: 'infrastructure',
        subcategory: 'email_hosting',
        description: `cPanel email hosting`,
        amount: monthlyAUD,
        currency: 'AUD',
        relatedToCustomer: leadId,
        expenseDate: new Date().toISOString().split('T')[0],
        isRecurring: true,
        recurrencePeriod: 'monthly'
    });
}
async function logLeadGenCost(source, leadsObtained, totalCost) {
    return logExpense({
        category: 'lead_gen',
        subcategory: source,
        description: `${leadsObtained} leads from ${source}`,
        amount: totalCost,
        currency: 'USD',
        expenseDate: new Date().toISOString().split('T')[0]
    });
}
async function logFixedCost(service, monthlyAmount, currency = 'USD') {
    return logExpense({
        category: 'fixed_costs',
        subcategory: service,
        description: `${service} monthly subscription`,
        amount: monthlyAmount,
        currency,
        expenseDate: new Date().toISOString().split('T')[0],
        isRecurring: true,
        recurrencePeriod: 'monthly'
    });
}
}),
"[project]/lib/modules/emails/sender.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractFirstName",
    ()=>extractFirstName,
    "replaceVariables",
    ()=>replaceVariables,
    "sendEmail",
    ()=>sendEmail,
    "stripHtml",
    ()=>stripHtml
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/resend/dist/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$financial$2f$expense$2d$tracker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modules/financial/expense-tracker.ts [app-route] (ecmascript)");
;
;
;
const resend = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$resend$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Resend"](process.env.RESEND_API_KEY);
async function sendEmail(params) {
    try {
        const { to, subject, htmlBody, textBody, leadId, templateId } = params;
        // 1. Inject tracking pixel
        const trackingPixel = `<img src="${("TURBOPACK compile-time value", "http://localhost:3000")}/api/track/open/${leadId}" width="1" height="1" style="display:none" />`;
        const htmlWithPixel = htmlBody + trackingPixel;
        // 2. Wrap all links with click tracking
        const htmlWithTracking = wrapLinksWithTracking(htmlWithPixel, leadId);
        // 3. Generate text body if not provided
        const finalTextBody = textBody || stripHtml(htmlBody);
        // 4. Send email via Resend
        const { data, error } = await resend.emails.send({
            from: 'Your Agency <onboarding@resend.dev>',
            to: to,
            subject: subject,
            html: htmlWithTracking,
            text: finalTextBody
        });
        if (error) {
            console.error('Resend error:', error);
            return {
                success: false,
                error: error.message || 'Failed to send email'
            };
        }
        // 5. Log to database
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insert"])('email_logs', {
                id: crypto.randomUUID(),
                lead_id: leadId,
                template_id: templateId || null,
                subject: subject,
                resend_message_id: data?.id || null
            });
        } catch (logError) {
            console.error('Failed to log email:', logError);
        // Don't fail the whole operation if logging fails
        }
        // 6. Update lead.email_sent_at if NULL
        try {
            // We'll check and update conditionally in the API endpoint
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])('leads', leadId, {
                email_sent_at: new Date().toISOString()
            });
        } catch (updateError) {
            console.error('Failed to update lead:', updateError);
        // Don't fail if update fails
        }
        // 7. Log email cost
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$financial$2f$expense$2d$tracker$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["logEmailCost"])(leadId, 1);
        } catch (expenseError) {
            console.error('Failed to log email expense (non-fatal):', expenseError);
        }
        return {
            success: true,
            messageId: data?.id
        };
    } catch (error) {
        console.error('Email sending error:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}
function replaceVariables(template, variables) {
    let result = template;
    // Replace {{business_name}}
    if (variables.businessName) {
        result = result.replace(/\{\{business_name\}\}/gi, variables.businessName);
    }
    // Replace {{first_name}}
    if (variables.firstName) {
        result = result.replace(/\{\{first_name\}\}/gi, variables.firstName);
    }
    // Replace {{preview_url}} and {{demo_url}}
    if (variables.previewUrl) {
        result = result.replace(/\{\{preview_url\}\}/gi, variables.previewUrl);
        result = result.replace(/\{\{demo_url\}\}/gi, variables.previewUrl);
    }
    return result;
}
function extractFirstName(businessName) {
    // Try to extract name before 's, apostrophe s
    const possessiveMatch = businessName.match(/^([A-Z][a-z]+)'s?\s/i);
    if (possessiveMatch) {
        return possessiveMatch[1];
    }
    // Try first word if it looks like a name (starts with capital, all letters)
    const firstWord = businessName.split(/\s+/)[0];
    if (firstWord && /^[A-Z][a-z]+$/.test(firstWord)) {
        return firstWord;
    }
    // Default fallback
    return 'there';
}
/**
 * Wrap all <a href> links with tracking
 */ function wrapLinksWithTracking(html, leadId) {
    // Match all <a href="..."> tags
    const linkRegex = /<a\s+([^>]*href=["']([^"']*)["'][^>]*)>/gi;
    return html.replace(linkRegex, (match, attributes, originalUrl)=>{
        // Skip if already a tracking link
        if (originalUrl.includes('/api/track/click')) {
            return match;
        }
        // Create tracking URL
        const trackingUrl = `${("TURBOPACK compile-time value", "http://localhost:3000")}/api/track/click/${leadId}?url=${encodeURIComponent(originalUrl)}`;
        // Replace the href in the attributes
        const newAttributes = attributes.replace(/href=["'][^"']*["']/i, `href="${trackingUrl}"`);
        return `<a ${newAttributes}>`;
    });
}
function stripHtml(html) {
    // Convert <br> and </p> to newlines
    let text = html.replace(/<br\s*\/?>/gi, '\n');
    text = text.replace(/<\/p>/gi, '\n\n');
    // Remove all other HTML tags
    text = text.replace(/<[^>]*>/g, '');
    // Decode HTML entities
    text = text.replace(/&nbsp;/g, ' ');
    text = text.replace(/&amp;/g, '&');
    text = text.replace(/&lt;/g, '<');
    text = text.replace(/&gt;/g, '>');
    text = text.replace(/&quot;/g, '"');
    // Clean up extra whitespace
    text = text.replace(/\n\s*\n\s*\n/g, '\n\n');
    text = text.trim();
    return text;
}
}),
"[project]/app/api/support/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Support Tickets API
 *
 * GET /api/support - List all tickets with filters
 * POST /api/support - Create new ticket
 */ __turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$emails$2f$sender$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modules/emails/sender.ts [app-route] (ecmascript)");
;
;
;
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const priority = searchParams.get('priority');
        const assignedTo = searchParams.get('assigned_to');
        // Build filter
        const filter = {};
        if (status && status !== 'all') filter.status = status;
        if (priority && priority !== 'all') filter.priority = priority;
        if (assignedTo && assignedTo !== 'all') filter.assigned_to = assignedTo;
        const { data: tickets, error } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('support_tickets', filter);
        if (error) {
            throw error;
        }
        // Fetch lead details for each ticket
        const ticketsWithLeads = await Promise.all((tickets || []).map(async (ticket)=>{
            if (ticket.lead_id) {
                const { data: leads } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('leads', {
                    id: ticket.lead_id
                });
                return {
                    ...ticket,
                    lead: leads?.[0]
                };
            }
            return ticket;
        }));
        // Sort by created date (newest first)
        ticketsWithLeads.sort((a, b)=>new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            tickets: ticketsWithLeads
        });
    } catch (error) {
        console.error('Error fetching tickets:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to fetch tickets',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        const { leadId, subject, message, priority = 'normal' } = body;
        if (!subject || !message) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                error: 'Subject and message are required'
            }, {
                status: 400
            });
        }
        // Create ticket
        const { data: ticket, error: ticketError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insert"])('support_tickets', {
            lead_id: leadId || null,
            subject,
            message,
            status: 'open',
            priority,
            assigned_to: null
        });
        if (ticketError || !ticket) {
            throw new Error(ticketError?.message || 'Failed to create ticket');
        }
        // Create initial message
        const { error: msgError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insert"])('ticket_messages', {
            ticket_id: ticket.id,
            sender: 'customer',
            message,
            is_internal: false
        });
        if (msgError) {
            throw new Error(msgError.message || 'Failed to create message');
        }
        // Send confirmation email to customer (if lead exists)
        if (leadId) {
            const { data: leads } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('leads', {
                id: leadId
            });
            const lead = leads?.[0];
            if (lead?.email) {
                await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$emails$2f$sender$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["sendEmail"])({
                    to: lead.email,
                    subject: `Support Ticket Created: ${subject}`,
                    htmlBody: `
            <h2>Support Ticket Created</h2>
            <p>Hi ${lead.business_name},</p>
            <p>Your support ticket has been created and our team will respond shortly.</p>
            <p><strong>Ticket ID:</strong> ${ticket.id}</p>
            <p><strong>Subject:</strong> ${subject}</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            <p>Best regards,<br>Support Team</p>
          `,
                    textBody: `Support Ticket Created\n\nHi ${lead.business_name},\n\nYour support ticket has been created.\n\nTicket ID: ${ticket.id}\nSubject: ${subject}\n\nYour Message:\n${message}\n\nBest regards,\nSupport Team`,
                    leadId: leadId
                });
            }
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            ticket
        });
    } catch (error) {
        console.error('Error creating ticket:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: 'Failed to create ticket',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a27e0794._.js.map