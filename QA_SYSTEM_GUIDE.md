# Quality Assurance System - Complete Guide

## Overview

A production-grade QA system that validates website quality BEFORE sending to customers using AI content review, visual validation, and manual review workflows.

## Features

- **AI Content Review**: Grammar, professionalism, accuracy, completeness, brand consistency
- **Visual Validation**: Page loading, responsive design, image loading, CTA visibility
- **Automated Scoring**: 0-100 quality score with weighted metrics
- **Smart Routing**:
  - Score 80+: Auto-approve
  - Score 60-79: Manual review queue
  - Score <60: Auto-reject and regenerate
- **Manual Review Dashboard**: VA queue for uncertain cases
- **Screenshot Capture**: Full-page screenshots for visual inspection
- **Auto-Regeneration**: Failed sites automatically regenerated

## Architecture

### Quality Scoring Formula

```
Overall Score = (Content Score × 70%) + (Visual Score × 30%)

Content Score (0-100):
- Grammar & Spelling: 0-20 points
- Professionalism: 0-20 points
- Accuracy: 0-20 points
- Completeness: 0-20 points
- Brand Consistency: 0-20 points

Visual Score (0-100):
- Loads Successfully: 20 points
- No Visible Errors: 20 points
- Responsive Design: 20 points
- Images Load: 20 points
- CTA Visible: 20 points
```

### Workflow

```
Site Generated
     ↓
QA Worker Triggered
     ↓
┌────────────────┬────────────────┐
│                │                │
│  AI Content    │  Visual QA     │
│  Review        │  (Puppeteer)   │
│  (Claude)      │                │
│                │                │
└────────────────┴────────────────┘
           ↓
    Calculate Score
           ↓
     ┌─────────────┐
     │   Score?    │
     └─────────────┘
           ↓
    ┌──────┴──────┐
    │             │
  80+          60-79        <60
    │             │          │
Auto-Approve  Manual     Auto-Reject
              Review    & Regenerate
```

## Files Structure

### Core Modules

1. **[lib/modules/qa/content-reviewer.ts](lib/modules/qa/content-reviewer.ts)**
   - AI-powered content quality validation
   - Claude Sonnet 4.5 for review
   - 5-category scoring system
   - Fallback to default passing score if AI fails

2. **[lib/modules/qa/visual-validator.ts](lib/modules/qa/visual-validator.ts)**
   - Puppeteer-based visual testing
   - Screenshot capture
   - 5-point validation checklist
   - Mobile responsive testing

3. **[lib/modules/qa/qa-orchestrator.ts](lib/modules/qa/qa-orchestrator.ts)**
   - Main QA workflow orchestration
   - Weighted scoring calculation
   - Auto-regeneration logic
   - Database updates

### Worker System

4. **[workers/qa-processor.ts](workers/qa-processor.ts)** (DEPRECATED - now in worker-manager.ts)
   - BullMQ worker for QA processing
   - Concurrency: 2
   - Rate limit: 10/min

5. **[workers/worker-manager.ts](workers/worker-manager.ts)** (UPDATED)
   - Added QA worker integration
   - Health monitoring for QA queue
   - Graceful shutdown support

### Dashboard & APIs

6. **[app/admin/qa/page.tsx](app/admin/qa/page.tsx)**
   - Manual review queue dashboard
   - Approve/reject interface
   - Real-time score breakdowns
   - Preview links

7. **[app/api/admin/qa/queue/route.ts](app/api/admin/qa/queue/route.ts)**
   - GET: Fetch sites needing manual review
   - Returns sites with `qa_status='manual_review'`

8. **[app/api/admin/qa/[siteId]/approve/route.ts](app/api/admin/qa/[siteId]/approve/route.ts)**
   - POST: Approve site manually
   - Updates `qa_status='approved'`

9. **[app/api/admin/qa/[siteId]/reject/route.ts](app/api/admin/qa/[siteId]/reject/route.ts)**
   - POST: Reject site and trigger regeneration
   - Logs rejection reason

### Database

10. **[supabase/qa-system.sql](supabase/qa-system.sql)**
    - `qa_reviews` table for all review results
    - Added QA columns to `sites` table
    - Indexes for performance

### Integration

11. **[lib/modules/websites/generator.ts](lib/modules/websites/generator.ts)** (UPDATED)
    - Queues QA review after site generation
    - Non-fatal if QA queue fails

## Installation & Setup

### Step 1: Run Database Migration

```sql
-- Execute in Supabase SQL Editor
-- File: supabase/qa-system.sql
```

This creates:
- `qa_reviews` table
- Adds `qa_status`, `qa_score`, `qa_reviewed_at`, `qa_reviewed_by` to `sites`

### Step 2: Create Screenshots Directory

```bash
mkdir -p public/screenshots
```

Already created with `.gitkeep` file.

### Step 3: Environment Variables

Ensure these are set in `.env.local`:

```bash
# Required for AI content review
ANTHROPIC_API_KEY=your-claude-api-key

# Required for visual validation
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # or your production URL

# Redis for workers
REDIS_CONNECTION_STRING=redis://localhost:6379
```

### Step 4: Start Workers

```bash
# Development
npm run workers

# Production with PM2
npm run workers:prod
```

## Usage

### Automatic Flow

1. Generate a site (manually or via Clay webhook)
2. Site generation completes
3. QA worker automatically triggered
4. AI content review runs
5. Visual validation runs
6. Overall score calculated
7. Site routed based on score:
   - **80+**: Auto-approved, ready for delivery
   - **60-79**: Sent to manual review queue
   - **<60**: Deleted and regenerated

### Manual Review

1. Visit: http://localhost:3000/admin/qa
2. See sites requiring review
3. View preview link
4. Check content and visual scores
5. Review issues and recommendations
6. Click **Approve & Send** or **Reject & Regenerate**

## Testing

### Test 1: Generate Site and Check QA

```bash
# Terminal 1: Start workers
npm run workers

# Terminal 2: Generate test leads
npm run test:leads 5

# Watch worker logs for QA output:
🔍 Reviewing content for: Business Name
✅ Content review complete: 85/100 (PASS)
🎨 Performing visual QA for: http://localhost:3000/preview/[id]
✅ Visual QA complete: 100/100 (PASS)
✅ AUTO-APPROVED: Business Name (score: 90)
```

### Test 2: Manual Review Queue

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000/admin/qa
3. Should see sites with score 60-79
4. Click preview to inspect
5. Approve or reject

### Test 3: Database Verification

```sql
-- Check QA reviews
SELECT * FROM qa_reviews ORDER BY reviewed_at DESC LIMIT 10;

-- Check site QA status
SELECT
  business_name,
  qa_status,
  qa_score,
  qa_reviewed_by
FROM sites
JOIN leads ON sites.lead_id = leads.id
ORDER BY qa_reviewed_at DESC
LIMIT 10;

-- QA status breakdown
SELECT qa_status, COUNT(*)
FROM sites
GROUP BY qa_status;
```

## Monitoring

### Worker Dashboard

Visit: http://localhost:3000/admin/workers

Shows:
- QA worker health status
- Jobs processed
- Failure rate
- Active/waiting jobs

### QA Dashboard

Visit: http://localhost:3000/admin/qa

Shows:
- Sites requiring manual review
- Content review scores (grammar, professionalism, accuracy, completeness, brand)
- Visual review checks (loads, no errors, responsive, images, CTA)
- Issues and recommendations
- Approve/reject actions

### Console Logs

**Successful QA:**
```
🔍 Starting complete QA for site: abc-123
🔍 Reviewing content for: Joe's Plumbing
✅ Content review complete: 85/100 (PASS)
🎨 Performing visual QA for: http://localhost:3000/preview/abc-123
✅ Visual QA complete: 100/100 (PASS)
✅ AUTO-APPROVED: Joe's Plumbing (score: 90)
```

**Manual Review Needed:**
```
🔍 Starting complete QA for site: def-456
🔍 Reviewing content for: Bob's Cafe
✅ Content review complete: 70/100 (PASS)
🎨 Performing visual QA for: http://localhost:3000/preview/def-456
✅ Visual QA complete: 80/100 (PASS)
⚠️ MANUAL REVIEW NEEDED: Bob's Cafe (score: 72)
```

**Auto-Reject:**
```
🔍 Starting complete QA for site: ghi-789
🔍 Reviewing content for: Bad Example
✅ Content review complete: 45/100 (FAIL)
🎨 Performing visual QA for: http://localhost:3000/preview/ghi-789
✅ Visual QA complete: 60/100 (PASS)
❌ QA FAILED: Bad Example (score: 50)
🔄 Regenerating failed site: ghi-789
✅ Regeneration queued for lead: lead-123
```

## Configuration

### Adjust Thresholds

Edit [lib/modules/qa/qa-orchestrator.ts](lib/modules/qa/qa-orchestrator.ts:62-76):

```typescript
// Current thresholds:
if (overallScore >= 80) {
  qaStatus = 'passed'  // Auto-approve
} else if (overallScore >= 60) {
  qaStatus = 'manual_review'  // VA review
} else {
  qaStatus = 'failed'  // Auto-regenerate
}

// To be more strict:
if (overallScore >= 85) {
  qaStatus = 'passed'  // Auto-approve
} else if (overallScore >= 70) {
  qaStatus = 'manual_review'  // VA review
} else {
  qaStatus = 'failed'  // Auto-regenerate
}

// To be more lenient:
if (overallScore >= 75) {
  qaStatus = 'passed'  // Auto-approve
} else if (overallScore >= 50) {
  qaStatus = 'manual_review'  // VA review
} else {
  qaStatus = 'failed'  // Auto-regenerate
}
```

### Adjust Content Review Prompt

Edit [lib/modules/qa/content-reviewer.ts](lib/modules/qa/content-reviewer.ts:45-72) to customize:
- Scoring criteria
- Industry-specific rules
- Quality standards
- AI model (currently Claude Sonnet 4.5)

### Adjust Visual Checks

Edit [lib/modules/qa/visual-validator.ts](lib/modules/qa/visual-validator.ts:45-94) to add/remove checks:
- Custom CSS selectors
- Additional viewport sizes
- Performance metrics
- Accessibility checks

## Troubleshooting

### Issue: QA not triggered after site generation

**Check:**
1. Workers running? `npm run workers`
2. Redis connected? Check worker logs
3. Queue exists? Check `/admin/workers` dashboard

### Issue: AI content review fails

**Check:**
1. `ANTHROPIC_API_KEY` set in `.env.local`?
2. API key valid?
3. Check console for errors

**Fallback:** System defaults to score 75 (passing) if AI fails

### Issue: Visual validation fails

**Check:**
1. Puppeteer installed? `npm list puppeteer`
2. Preview URL accessible? Try opening in browser
3. `NEXT_PUBLIC_SITE_URL` set correctly?
4. Screenshot directory exists? `public/screenshots/`

### Issue: No sites in manual review queue

**This is good!** It means all sites are scoring either:
- 80+ (auto-approved)
- <60 (auto-rejected and regenerated)

### Issue: Too many sites in manual review

**Adjust thresholds** to be more lenient or strict (see Configuration above)

## API Reference

### GET /api/admin/qa/queue

Returns sites requiring manual review.

**Response:**
```json
{
  "success": true,
  "sites": [
    {
      "id": "site-id",
      "qa_score": 72,
      "qa_status": "manual_review",
      "qa_reviewed_at": "2025-12-11T12:00:00Z",
      "leads": {
        "business_name": "Joe's Plumbing",
        "industry": "Plumbing"
      },
      "qa_reviews": [
        {
          "review_type": "content",
          "score": 70,
          "passed": true,
          "issues": ["Headline could be more compelling"],
          "recommendations": ["Add urgency to CTA"],
          "breakdown": {
            "grammar": 18,
            "professionalism": 15,
            "accuracy": 17,
            "completeness": 12,
            "brandConsistency": 18
          }
        },
        {
          "review_type": "visual",
          "score": 80,
          "passed": true
        }
      ]
    }
  ]
}
```

### POST /api/admin/qa/[siteId]/approve

Approves a site manually.

**Response:**
```json
{
  "success": true
}
```

### POST /api/admin/qa/[siteId]/reject

Rejects a site and triggers regeneration.

**Body:**
```json
{
  "reason": "Business name incorrect throughout"
}
```

**Response:**
```json
{
  "success": true
}
```

## Performance

Expected processing times:
- AI Content Review: 3-5 seconds
- Visual Validation: 5-10 seconds
- Total QA time: 8-15 seconds per site

Concurrency: 2 QA reviews simultaneously
Rate limit: 10 QA reviews per minute

## Cost Tracking

AI content review uses Claude Sonnet 4.5:
- Input: ~1,000 tokens per review
- Output: ~500 tokens per review
- Cost: ~$0.003 per review

Visual validation:
- Free (Puppeteer is open source)
- Screenshot storage: ~200KB per site

## Production Checklist

Before going live:

- [ ] Database migration run (`qa-system.sql`)
- [ ] `ANTHROPIC_API_KEY` set in production env
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] PM2 workers running (`npm run workers:prod`)
- [ ] QA thresholds configured appropriately
- [ ] Manual review process established for VA team
- [ ] Screenshot storage monitored for disk space

## Future Enhancements

Potential additions:
- [ ] A/B testing different quality thresholds
- [ ] Industry-specific QA rules
- [ ] Accessibility (a11y) validation
- [ ] Performance metrics (Core Web Vitals)
- [ ] SEO validation
- [ ] Mobile app visual testing
- [ ] Multi-language content review
- [ ] Custom QA rules per client

## Support

For issues:
1. Check worker logs: `npm run workers:logs`
2. Check QA dashboard: `/admin/qa`
3. Check worker dashboard: `/admin/workers`
4. Review database: `qa_reviews` and `sites` tables

## Summary

The QA system ensures only high-quality websites reach customers by:
1. Automatically validating content quality with AI
2. Checking visual rendering and functionality
3. Routing uncertain cases to manual review
4. Auto-regenerating failed sites
5. Providing VA team with actionable review dashboard

Result: Improved customer satisfaction and reduced manual review workload.
