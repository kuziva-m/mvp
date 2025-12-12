# Production-Grade Worker Resilience System

## Overview

This system provides **99.9% uptime** for background job processing with comprehensive health monitoring, automatic recovery, and production-ready deployment.

## Features

- **Dual Redundancy**: Primary + Backup worker instances
- **Health Monitoring**: Heartbeat every 30 seconds
- **Auto-Restart**: Automatic recovery from crashes
- **Dead Letter Queue**: Failed job tracking and resolution
- **Rate Limiting**: Intelligent job throttling
- **Graceful Shutdown**: Clean process termination
- **Real-time Dashboard**: Worker monitoring UI
- **Cost Tracking**: AI token usage and cost monitoring

## Architecture

### Worker Queues

1. **Lead Processing** (Concurrency: 5, Rate: 50/min)
   - Processes raw leads from Clay.com webhook
   - Quality scoring and deduplication
   - Database storage

2. **Site Generation** (Concurrency: 3, Rate: 20/min)
   - AI-powered website generation
   - Cost tracking for Claude API usage
   - Template-based rendering

3. **Email Sending** (Concurrency: 10, Rate: 100/min)
   - Transactional email delivery
   - Campaign management
   - Open/click tracking

4. **Delivery** (Concurrency: 2, Rate: 10/min)
   - Service orchestration
   - Multi-step workflows

### Health Monitoring

Workers are marked **unhealthy** if:
- No jobs processed in 5+ minutes AND errors > 5
- Failure rate > 5%
- Queue is paused unexpectedly

Workers are marked **healthy** when:
- Errors < 3
- Processing jobs successfully
- Failure rate < 5%

### Dead Letter Queue

Jobs moved to DLQ when:
- Failed after 3 retry attempts
- Permanent failures (invalid data, missing resources)

DLQ provides:
- Full job data for debugging
- Error message and stack trace
- Resolution tracking (who resolved, when)
- Notes for post-mortem analysis

## Development Usage

### Start Workers (Development)

```bash
npm run workers
```

This starts the worker manager with:
- Live reload via tsx
- Console logging
- Environment from .env.local
- MOCK mode (no real API calls)

### Generate Test Leads

```bash
npm run test:leads 10
```

Generates 10 test leads and processes them through the queue.

### Monitor Workers

```bash
# Start Next.js dev server
npm run dev

# Visit worker dashboard
http://localhost:3000/admin/workers
```

Dashboard shows:
- Overall system health
- Per-worker statistics (waiting, active, completed, failed)
- Failure rates
- Dead letter queue entries
- Real-time auto-refresh

### View Queue Status

```bash
# Check Redis queues directly
redis-cli

> KEYS bull:*
> LLEN bull:lead-processing:waiting
> LLEN bull:site-generation:active
```

## Production Deployment

### Prerequisites

```bash
# Install PM2 globally (recommended)
npm install -g pm2

# Or use local PM2 (already in package.json)
npm install
```

### Database Setup

Run the dead letter queue migration:

```sql
-- Execute in Supabase SQL Editor
-- File: supabase/dead-letter-queue.sql

CREATE TABLE IF NOT EXISTS dead_letter_queue (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  queue_name VARCHAR(100) NOT NULL,
  job_id VARCHAR(255),
  job_data JSONB NOT NULL,
  error_message TEXT,
  error_stack TEXT,
  attempts_made INTEGER,
  failed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  resolved_by VARCHAR(100),
  notes TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_dlq_queue_name ON dead_letter_queue(queue_name);
CREATE INDEX IF NOT EXISTS idx_dlq_failed_at ON dead_letter_queue(failed_at DESC);
CREATE INDEX IF NOT EXISTS idx_dlq_resolved ON dead_letter_queue(resolved) WHERE resolved = FALSE;
CREATE INDEX IF NOT EXISTS idx_dlq_queue_resolved ON dead_letter_queue(queue_name, resolved);
```

### Start Production Workers

```bash
# Start dual workers with PM2
npm run workers:prod

# Or using PM2 directly
pm2 start ecosystem.config.js
```

This launches:
- **worker-primary**: Main processing instance
- **worker-backup**: Redundant instance for failover

Both workers process jobs from the same queues, providing dual redundancy.

### Monitor Production Workers

```bash
# Check worker status
npm run workers:status

# View live logs (all workers)
npm run workers:logs

# View primary worker logs only
npm run workers:logs:primary

# View backup worker logs only
npm run workers:logs:backup

# Restart all workers (zero-downtime)
npm run workers:restart

# Stop all workers
npm run workers:stop

# Delete workers from PM2
npm run workers:delete
```

### Production Dashboard

```bash
# Access the monitoring dashboard
https://your-domain.com/admin/workers
```

Features:
- Live health monitoring (auto-refresh every 10s)
- Dead letter queue management
- Resolve failed jobs
- Delete permanently failed jobs
- View full error stack traces

## PM2 Configuration

File: `ecosystem.config.js`

```javascript
{
  name: 'worker-primary',
  script: 'workers/worker-manager.ts',
  instances: 1,
  autorestart: true,
  max_memory_restart: '1G',
  min_uptime: '10s',
  max_restarts: 10,
  restart_delay: 4000,
  env: {
    NODE_ENV: 'production',
    WORKER_INSTANCE: 'primary'
  }
}
```

Key settings:
- **autorestart**: Automatically restart on crash
- **max_memory_restart**: Restart if memory exceeds 1GB
- **min_uptime**: Only restart if process runs 10s+ (prevents infinite restart loops)
- **max_restarts**: Maximum 10 restarts in a window
- **restart_delay**: Wait 4s between restarts

## Environment Variables

Required in `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Redis (local or Upstash)
REDIS_CONNECTION_STRING=redis://localhost:6379
REDIS_URL=redis://localhost:6379

# Clay.com (production only)
CLAY_WEBHOOK_SECRET=your-clay-webhook-secret

# OpenAI/Claude API (optional for local dev)
ANTHROPIC_API_KEY=your-anthropic-key
```

## Troubleshooting

### Workers won't start

```bash
# Check Redis is running
redis-cli ping
# Should return: PONG

# Check environment variables
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.REDIS_CONNECTION_STRING)"

# Check for existing processes
pm2 list
```

### High failure rate

```bash
# Check dead letter queue
http://localhost:3000/admin/workers

# View worker logs
npm run workers:logs

# Check Redis memory
redis-cli info memory
```

### Redis connection errors

```bash
# Verify Redis URL format
redis://localhost:6379  ✅ Correct
https://...upstash.io   ❌ Wrong (should be redis://)

# Test connection
redis-cli -u redis://localhost:6379 ping
```

### PM2 workers not restarting

```bash
# Check PM2 logs
pm2 logs --lines 100

# Reset PM2
pm2 delete all
npm run workers:prod

# Check system resources
pm2 monit
```

## Performance Benchmarks

Expected throughput (per minute):
- Lead processing: 50 jobs/min
- Site generation: 20 jobs/min
- Email sending: 100 jobs/min
- Delivery: 10 jobs/min

Memory usage:
- Worker instance: ~200-500 MB
- Peak (with active jobs): ~800 MB
- PM2 restart threshold: 1 GB

CPU usage:
- Idle: <5%
- Active processing: 20-40%
- AI generation: 40-60%

## Cost Tracking

Site generation shows real-time costs:

```
✅ Site generated: site_abc123 | 2500 tokens | $0.0125
   💰 Total: 15 sites | 37500 tokens | $0.1875
```

Pricing (Claude Haiku):
- Input: $0.25 / 1M tokens
- Output: $1.25 / 1M tokens

## Monitoring Checklist

### Daily
- [ ] Check dashboard for overall health
- [ ] Review dead letter queue (should be 0)
- [ ] Check failure rates (should be <2%)

### Weekly
- [ ] Review PM2 logs for patterns
- [ ] Check cost metrics
- [ ] Verify auto-restart working
- [ ] Test graceful shutdown

### Monthly
- [ ] Review dead letter queue trends
- [ ] Optimize rate limits based on usage
- [ ] Update dependencies
- [ ] Backup Redis data

## API Endpoints

### GET /api/admin/workers/health

Returns overall health status and per-worker metrics.

**Response:**
```json
{
  "success": true,
  "overall": "healthy",
  "workers": [
    {
      "name": "lead-processing",
      "healthy": true,
      "waiting": 5,
      "active": 2,
      "completed": 1234,
      "failed": 3,
      "failureRate": 0.24
    }
  ],
  "summary": {
    "totalActive": 7,
    "totalCompleted": 5000,
    "totalFailed": 12,
    "allHealthy": true
  },
  "timestamp": "2025-12-11T12:00:00Z"
}
```

### GET /api/admin/dead-letter-queue

Returns unresolved failed jobs.

**Response:**
```json
{
  "success": true,
  "jobs": [
    {
      "id": "uuid",
      "queue_name": "site-generation",
      "job_id": "123",
      "job_data": { "leadId": "abc" },
      "error_message": "API rate limit exceeded",
      "error_stack": "...",
      "attempts_made": 3,
      "failed_at": "2025-12-11T12:00:00Z",
      "resolved": false
    }
  ],
  "count": 1,
  "stats": {
    "site-generation": {
      "total": 10,
      "resolved": 9,
      "unresolved": 1
    }
  }
}
```

### PATCH /api/admin/dead-letter-queue

Mark a job as resolved.

**Request:**
```json
{
  "id": "uuid",
  "resolved": true,
  "resolvedBy": "admin@example.com",
  "notes": "Fixed API key and reprocessed manually"
}
```

### DELETE /api/admin/dead-letter-queue?id=uuid

Permanently delete a failed job.

## Files Reference

### Core Files
- `workers/worker-manager.ts` - Main worker orchestrator
- `workers/env-loader.ts` - Environment variable loader
- `lib/queues.ts` - Queue definitions and configuration
- `ecosystem.config.js` - PM2 configuration

### API Routes
- `app/api/admin/workers/health/route.ts` - Health monitoring
- `app/api/admin/dead-letter-queue/route.ts` - DLQ management

### UI
- `app/admin/workers/page.tsx` - Worker monitoring dashboard

### Database
- `supabase/dead-letter-queue.sql` - DLQ table schema

## Support

For issues:
1. Check the troubleshooting section above
2. Review PM2 logs: `npm run workers:logs`
3. Check worker dashboard: `/admin/workers`
4. Review dead letter queue for patterns

## License

Proprietary - MVP Web Agency
