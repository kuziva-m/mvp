# Lead Generation System - Setup Guide

## Overview

This is a **DUAL-MODE** lead generation system that works perfectly in both:
- **MOCK MODE** (Default): Free testing with no API keys required
- **PRODUCTION MODE**: Real lead generation with Clay.com & ScrapeMaps

## Quick Start (MOCK MODE)

### 1. Add Redis URL

Get a free Redis instance from [Upstash](https://upstash.com):

```bash
# Add to .env.local
REDIS_URL=redis://default:password@your-redis-url:6379
```

### 2. Run Database Migration

Execute in Supabase SQL Editor:
```bash
supabase/lead-gen-tables.sql
```

### 3. Start the System

```bash
# Terminal 1: Start Next.js dev server
npm run dev

# Terminal 2: Start queue workers
npm run workers
```

### 4. Generate Test Leads

Option A - Via Dashboard:
1. Go to http://localhost:3000/admin/lead-gen
2. Click "Generate 100 Test Leads"
3. Watch queues process in real-time

Option B - Via CLI:
```bash
npm run test:leads 50
```

Option C - Simulate Clay Webhook:
```bash
npm run test:clay 10
```

## System Architecture

```
┌─────────────────────────────────────────────────┐
│         LEAD SOURCES (Dual-Mode)                │
├─────────────────────────────────────────────────┤
│                                                 │
│  MOCK MODE:              PRODUCTION MODE:       │
│  ├─ Mock Generator       ├─ Clay.com Webhook   │
│  ├─ Test Scripts         ├─ ScrapeMaps API     │
│  └─ Simulations          └─ Live Scraping      │
│                                                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│            BULLMQ JOB QUEUES                    │
├─────────────────────────────────────────────────┤
│  ├─ Lead Processing Queue (5 workers)          │
│  ├─ Site Generation Queue (3 workers)          │
│  ├─ Email Sending Queue (10 workers)           │
│  └─ Delivery Queue (2 workers)                 │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│         DEDUPLICATION & QUALITY SCORING         │
├─────────────────────────────────────────────────┤
│  ├─ Email matching (Priority 1)                │
│  ├─ Phone matching (Priority 2)                │
│  ├─ Website domain (Priority 3)                │
│  ├─ Business name fuzzy (Priority 4)           │
│  └─ Quality threshold: 60/100                  │
└──────────────────┬──────────────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────────────┐
│              DATABASE STORAGE                   │
├─────────────────────────────────────────────────┤
│  ├─ Leads table                                │
│  ├─ Duplicate logs table                       │
│  └─ API usage logs table                       │
└─────────────────────────────────────────────────┘
```

## Quality Scoring Algorithm

**Total: 100 points**

1. **Website Status (40 points)**
   - No website: 40 points ⭐ BEST!
   - Website 10+ years old: 25 points
   - Website 5+ years old: 15 points
   - Modern website: 5 points

2. **Credibility (30 points)**
   - 4.5+ rating, 50+ reviews: 30 points
   - 4.0+ rating, 20+ reviews: 20 points
   - 3.5+ rating: 10 points
   - Both phone & email: +5 points

3. **Maturity (15 points)**
   - 10+ years in business: 15 points
   - 5+ years in business: 10 points
   - 2+ years in business: 5 points
   - 10+ employees: +5 points

4. **Contact Info (10 points)**
   - Phone: 5 points
   - Email: 5 points

5. **Industry (5 points)**
   - Tier 1 (plumbing, electrical, HVAC): 5 points
   - Tier 2 (locksmith, pest, cleaning): 3 points
   - Other: 1 point

**Auto-Add Threshold: 60/100**

## Deduplication Strategy

Checks in priority order:

1. **Email** (exact match)
2. **Phone** (normalized Australian format)
3. **Website** (domain extraction)
4. **Business Name** (80% fuzzy similarity)

All duplicates are logged to `duplicate_logs` table for analysis.

## Switching to PRODUCTION MODE

When ready (after testing):

### 1. Purchase Services

- Clay.com: $349/month (lead enrichment & webhooks)
- ScrapeMaps: $49/month (Google Maps scraping)

### 2. Add API Keys

```bash
# Add to .env.local
CLAY_WEBHOOK_SECRET=your-clay-secret-key
SCRAPEMAPS_API_KEY=your-scrapemaps-api-key
```

### 3. Configure Clay.com

1. Create workflow in Clay
2. Add webhook action pointing to:
   ```
   https://your-domain.com/api/webhooks/clay
   ```
3. Add signature header: `x-clay-signature: your-clay-secret-key`

### 4. Restart Workers

```bash
npm run workers
```

System automatically detects API keys and switches to PRODUCTION MODE!

## Monitoring

### Dashboard
- http://localhost:3000/admin/lead-gen
- Real-time queue status
- Daily lead statistics
- Quality score averages
- Source breakdown (Clay/ScrapeMaps/Mock)

### API Endpoints

**Lead Stats:**
```bash
GET /api/admin/lead-stats
```

**Queue Status:**
```bash
GET /api/admin/queues
```

**Generate Test Leads:**
```bash
POST /api/admin/generate-test-leads
```

## CLI Commands

```bash
# Start development server
npm run dev

# Start queue workers
npm run workers

# Start both (dev + workers)
npm run all

# Generate test leads (specify count)
npm run test:leads 100

# Simulate Clay webhooks
npm run test:clay 20
```

## Capacity & Performance

**MOCK MODE:**
- Unlimited test leads
- No API costs
- Perfect for development
- Instant generation

**PRODUCTION MODE:**
- 1,000+ leads/day capacity
- Automatic deduplication
- Quality filtering (60+ score)
- Cost: ~$398/month when active

**Queue Concurrency:**
- Lead Processing: 5 workers
- Site Generation: 3 workers
- Email Sending: 10 workers
- Delivery: 2 workers

## Troubleshooting

### Redis Connection Failed
```bash
# Check REDIS_URL in .env.local
# Get free Redis: https://upstash.com
```

### Workers Not Processing
```bash
# Check workers are running:
npm run workers

# Check queue status in dashboard
```

### No Leads Showing
```bash
# Verify database migration ran
# Check lead quality scores (must be 60+)
# View duplicate logs for rejected leads
```

### MOCK Mode Not Detected
```bash
# Ensure CLAY_WEBHOOK_SECRET is NOT set
# Restart workers after removing keys
```

## File Structure

```
lib/
├── queues.ts                              # BullMQ queue configuration
└── modules/
    └── leads/
        ├── deduplication.ts               # Duplicate detection
        ├── quality-scorer.ts              # Quality algorithm
        ├── lead-processor.ts              # Main processor
        ├── mock-data-generator.ts         # Test data
        └── scrapers/
            └── scrapemaps-client.ts       # ScrapeMaps integration

app/
├── api/
│   ├── webhooks/
│   │   └── clay/route.ts                 # Clay webhook endpoint
│   └── admin/
│       ├── lead-stats/route.ts           # Statistics API
│       ├── queues/route.ts               # Queue status API
│       └── generate-test-leads/route.ts  # Test lead generator
└── admin/
    └── lead-gen/page.tsx                 # Dashboard UI

workers/
└── queue-processor.ts                     # Job workers

scripts/
├── generate-test-leads.ts                 # CLI lead generator
└── simulate-clay-webhook.ts               # Webhook simulator

supabase/
└── lead-gen-tables.sql                    # Database schema
```

## Next Steps

1. ✅ Complete MOCK MODE testing
2. ✅ Verify deduplication works
3. ✅ Test quality scoring
4. ✅ Monitor queue processing
5. 🔲 Purchase Clay.com & ScrapeMaps
6. 🔲 Add API keys to .env.local
7. 🔲 Configure Clay workflows
8. 🔲 Switch to PRODUCTION MODE
9. 🔲 Monitor costs & performance
10. 🔲 Scale workers as needed

## Support

**MOCK MODE Issues:**
- Check Redis connection
- Verify workers are running
- Review console logs

**PRODUCTION MODE Issues:**
- Verify API keys are correct
- Check webhook signatures
- Monitor API rate limits
- Review cost estimates

Happy Lead Generating! 🚀
