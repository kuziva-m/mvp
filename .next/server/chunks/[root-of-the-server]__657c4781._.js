module.exports = [
"[project]/.next-internal/server/app/api/admin/subscriptions/route/actions.js [app-rsc] (server actions loader, ecmascript)", ((__turbopack_context__, module, exports) => {

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
"[externals]/crypto [external] (crypto, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto", () => require("crypto"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/http [external] (http, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("http", () => require("http"));

module.exports = mod;
}),
"[externals]/https [external] (https, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("https", () => require("https"));

module.exports = mod;
}),
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/child_process [external] (child_process, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("child_process", () => require("child_process"));

module.exports = mod;
}),
"[project]/lib/modules/payments/stripe-client.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createCheckoutSession",
    ()=>createCheckoutSession,
    "createCustomerPortal",
    ()=>createCustomerPortal,
    "createPrice",
    ()=>createPrice,
    "createProduct",
    ()=>createProduct,
    "stripe",
    ()=>stripe
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/stripe/esm/stripe.esm.node.js [app-route] (ecmascript)");
;
if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}
const stripe = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$stripe$2f$esm$2f$stripe$2e$esm$2e$node$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-11-17.clover'
});
async function createProduct() {
    const product = await stripe.products.create({
        name: 'Website Hosting Service',
        description: 'Professional website with hosting, domain, and email'
    });
    console.log('Product created:', product.id);
    return product;
}
async function createPrice(productId) {
    const price = await stripe.prices.create({
        product: productId,
        unit_amount: 9900,
        currency: 'aud',
        recurring: {
            interval: 'month'
        }
    });
    console.log('Price created:', price.id);
    return price;
}
async function createCheckoutSession(leadId, priceId, leadEmail) {
    const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: [
            'card'
        ],
        customer_email: leadEmail,
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        success_url: `${("TURBOPACK compile-time value", "http://localhost:3000")}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${("TURBOPACK compile-time value", "http://localhost:3000")}/cancel`,
        metadata: {
            leadId: leadId
        },
        subscription_data: {
            metadata: {
                leadId: leadId
            }
        }
    });
    return session;
}
async function createCustomerPortal(customerId) {
    const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${("TURBOPACK compile-time value", "http://localhost:3000")}/admin/subscriptions`
    });
    return session;
}
}),
"[project]/lib/modules/payments/subscription-manager.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "cancelSubscription",
    ()=>cancelSubscription,
    "createSubscription",
    ()=>createSubscription,
    "getActiveSubscriptions",
    ()=>getActiveSubscriptions,
    "getAllSubscriptions",
    ()=>getAllSubscriptions,
    "updateSubscription",
    ()=>updateSubscription
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$payments$2f$stripe$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modules/payments/stripe-client.ts [app-route] (ecmascript)");
;
;
;
async function createSubscription(data) {
    try {
        // Insert subscription
        const { data: subscription, error: subError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["insert"])('subscriptions', {
            id: crypto.randomUUID(),
            lead_id: data.leadId,
            stripe_subscription_id: data.stripeSubscriptionId,
            stripe_customer_id: data.stripeCustomerId,
            status: data.status,
            amount: data.amount,
            currency: data.currency,
            current_period_start: data.currentPeriodStart.toISOString(),
            current_period_end: data.currentPeriodEnd.toISOString(),
            cancel_at: null
        });
        if (subError) {
            console.error('Failed to create subscription:', subError);
            throw new Error('Failed to create subscription in database');
        }
        // Update lead status
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])('leads', data.leadId, {
            status: 'subscribed'
        });
        console.log('Subscription created successfully:', subscription);
        return subscription;
    } catch (error) {
        console.error('Error creating subscription:', error);
        throw error;
    }
}
async function updateSubscription(stripeSubscriptionId, updates) {
    try {
        // Find subscription by stripe_subscription_id
        const { data: subscriptions, error: findError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('subscriptions', {
            stripe_subscription_id: stripeSubscriptionId
        });
        if (findError || !subscriptions || subscriptions.length === 0) {
            throw new Error('Subscription not found');
        }
        const subscription = subscriptions[0];
        // Update subscription
        const { data: updated, error: updateError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])('subscriptions', subscription.id, updates);
        if (updateError) {
            throw new Error('Failed to update subscription');
        }
        console.log('Subscription updated:', updated);
        return updated;
    } catch (error) {
        console.error('Error updating subscription:', error);
        throw error;
    }
}
async function cancelSubscription(stripeSubscriptionId, cancelInStripe = true) {
    try {
        // Find subscription
        const { data: subscriptions, error: findError } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["query"])('subscriptions', {
            stripe_subscription_id: stripeSubscriptionId
        });
        if (findError || !subscriptions || subscriptions.length === 0) {
            throw new Error('Subscription not found');
        }
        const subscription = subscriptions[0];
        // Update database
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])('subscriptions', subscription.id, {
            status: 'canceled',
            cancel_at: new Date().toISOString()
        });
        // Update lead status
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["update"])('leads', subscription.lead_id, {
            status: 'canceled'
        });
        // Cancel in Stripe (only if not already canceled via webhook)
        if (cancelInStripe) {
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$payments$2f$stripe$2d$client$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripe"].subscriptions.cancel(stripeSubscriptionId);
            console.log('Subscription canceled in Stripe:', stripeSubscriptionId);
        }
        console.log('Subscription canceled in database:', stripeSubscriptionId);
        return {
            success: true
        };
    } catch (error) {
        console.error('Error canceling subscription:', error);
        throw error;
    }
}
async function getActiveSubscriptions() {
    try {
        const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('subscriptions').select(`
        *,
        leads:lead_id (
          business_name,
          email,
          phone
        )
      `).eq('status', 'active').order('created_at', {
            ascending: false
        });
        if (error) {
            console.error('Error fetching active subscriptions:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error getting active subscriptions:', error);
        throw error;
    }
}
async function getAllSubscriptions(statusFilter) {
    try {
        let queryBuilder = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["supabase"].from('subscriptions').select(`
        *,
        leads:lead_id (
          business_name,
          email,
          phone
        )
      `);
        if (statusFilter) {
            queryBuilder = queryBuilder.eq('status', statusFilter);
        }
        const { data, error } = await queryBuilder.order('created_at', {
            ascending: false
        });
        if (error) {
            console.error('Error fetching subscriptions:', error);
            throw error;
        }
        return data;
    } catch (error) {
        console.error('Error getting subscriptions:', error);
        throw error;
    }
}
}),
"[project]/app/api/admin/subscriptions/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "GET",
    ()=>GET,
    "POST",
    ()=>POST,
    "dynamic",
    ()=>dynamic
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$payments$2f$subscription$2d$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/modules/payments/subscription-manager.ts [app-route] (ecmascript)");
;
;
const dynamic = 'force-dynamic';
async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const search = searchParams.get('search');
        let subscriptions = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$payments$2f$subscription$2d$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getAllSubscriptions"])(status || undefined);
        // Filter by search term (business name or email)
        if (search && search.trim()) {
            const searchLower = search.toLowerCase().trim();
            subscriptions = subscriptions.filter((sub)=>{
                const businessName = sub.lead?.business_name?.toLowerCase() || '';
                const email = sub.lead?.email?.toLowerCase() || '';
                return businessName.includes(searchLower) || email.includes(searchLower);
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: subscriptions
        }, {
            status: 200
        });
    } catch (error) {
        console.error('Error fetching subscriptions:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to fetch subscriptions',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
async function POST(request) {
    try {
        const body = await request.json();
        // Validate required fields
        if (!body.leadId || !body.stripeSubscriptionId || !body.stripeCustomerId) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                error: 'Missing required fields'
            }, {
                status: 400
            });
        }
        const subscription = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$modules$2f$payments$2f$subscription$2d$manager$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createSubscription"])({
            leadId: body.leadId,
            stripeSubscriptionId: body.stripeSubscriptionId,
            stripeCustomerId: body.stripeCustomerId,
            status: body.status || 'active',
            amount: body.amount || 99.0,
            currency: body.currency || 'aud',
            currentPeriodStart: body.currentPeriodStart ? new Date(body.currentPeriodStart) : new Date(),
            currentPeriodEnd: body.currentPeriodEnd ? new Date(body.currentPeriodEnd) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: subscription
        }, {
            status: 201
        });
    } catch (error) {
        console.error('Error creating subscription:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Failed to create subscription',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__657c4781._.js.map