# MVP Web Agency - Automated Website SaaS

**Status:** In Development

## Quick Start
```bash
npm install
npm run dev
```

## Progress Tracker

- [x] Prompt 1: Initial Next.js setup ✅
- [x] Prompt 2: Database setup ✅
- [x] Prompt 3: Database schema ✅
- [ ] Prompt 4: Lead entry form
- [ ] ... (52 total)

## Tech Stack

Next.js 15 • TypeScript • Tailwind • shadcn/ui • Supabase

## Delivery Automation System

The delivery automation system handles complete service delivery after payment:

### Architecture

1. **Domain Registration** (Namecheap - MOCKED)
   - Search for available domain based on business name
   - Register domain automatically
   - Update nameservers to point to Cloudflare

2. **DNS Configuration** (Cloudflare - REAL API)
   - Create or find zone for the domain
   - Configure website DNS (A records for root and www)
   - Configure email DNS (MX and SPF records)
   - Verify DNS propagation

3. **Website Publishing** (Vercel - MOCKED)
   - Deploy website to custom domain
   - Configure SSL certificate
   - Verify deployment status

4. **Email Setup** (Verpex/cPanel - MOCKED)
   - Create professional email account (info@domain.com)
   - Set up cPanel account for hosting management
   - Configure email client settings

5. **Welcome Email**
   - Send comprehensive welcome email with all credentials
   - Include website URL, email account, cPanel access
   - Provide next steps and support information

### Files

**Service Clients:**
- `lib/modules/deliveries/namecheap-client.ts` - Domain registration (MOCKED)
- `lib/modules/deliveries/cloudflare-client.ts` - DNS management (REAL)
- `lib/modules/deliveries/vercel-client.ts` - Website deployment (MOCKED)
- `lib/modules/deliveries/verpex-client.ts` - Email & hosting (MOCKED)

**Orchestration:**
- `lib/modules/deliveries/orchestrator.ts` - Main delivery workflow

**API Endpoints:**
- `app/api/admin/deliver/[leadId]/route.ts` - Manual delivery trigger

**UI Components:**
- `components/DeliverButton.tsx` - Manual delivery button with progress tracking

**Webhook Integration:**
- `app/api/webhooks/stripe/route.ts` - Automatic delivery after payment

### Mocked vs Real APIs

**MOCKED Services (Development Only):**
- Namecheap domain registration - Console logs with `[MOCK]` prefix
- Verpex/cPanel email and hosting - Console logs with `[MOCK]` prefix
- Vercel deployment - Console logs with `[MOCK]` prefix

**REAL Services (Production Ready):**
- Cloudflare DNS configuration - Uses actual Cloudflare API with `[REAL]` prefix in logs

### Environment Variables

```bash
# Cloudflare (DNS - REAL API)
CLOUDFLARE_API_TOKEN=your_cloudflare_token_here

# Namecheap (Domain Registration - MOCKED)
# NAMECHEAP_API_KEY=your_api_key_here
# NAMECHEAP_USERNAME=your_username_here
# NAMECHEAP_API_USER=your_api_user_here

# Verpex/cPanel (Email & Hosting - MOCKED)
# CPANEL_HOST=your_cpanel_server.com
# CPANEL_API_TOKEN=your_api_token_here
# CPANEL_USERNAME=your_username_here

# Vercel (Website Publishing - MOCKED)
# VERCEL_API_TOKEN=your_vercel_token_here
# VERCEL_TEAM_ID=your_team_id_here
```

### Usage

**Automatic Delivery (via Webhook):**
Delivery is automatically triggered when a customer completes payment through Stripe checkout.

**Manual Delivery (via Admin Panel):**
1. Navigate to lead detail page
2. Ensure lead has active subscription
3. Click "Deliver Service" button
4. Monitor progress in real-time dialog
5. View delivery results and credentials

### Swapping Mocked to Real

To replace mocked implementations with real APIs:

1. Add environment variables to `.env.local`
2. Uncomment the production code section in the respective client file
3. Remove or comment out the mock implementation
4. Update console logs from `[MOCK]` to `[REAL]`

Example for Namecheap:
```typescript
// In lib/modules/deliveries/namecheap-client.ts
export async function registerDomain(domain: string, leadId: string) {
  // Comment out mock code
  // console.log('[MOCK] Namecheap: Registering domain...')
  // return mockResult

  // Uncomment production code
  const namecheapApiKey = process.env.NAMECHEAP_API_KEY
  const response = await fetch('https://api.namecheap.com/xml.response', {
    // ... actual API call
  })
}
```
