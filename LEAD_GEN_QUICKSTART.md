# 🚀 Lead Generation - Quick Start (5 Minutes)

## Step 1: Add Redis URL (2 mins)

1. Go to [Upstash.com](https://upstash.com) → Create account → Create Redis database
2. Copy the Redis URL
3. Add to `.env.local`:
   ```bash
   REDIS_URL=redis://default:your-password@your-redis-url:6379
   ```

## Step 2: Run Database Migration (1 min)

1. Open Supabase Dashboard → SQL Editor
2. Paste contents of `supabase/lead-gen-tables.sql`
3. Click "Run"

## Step 3: Start System (2 mins)

```bash
# Terminal 1: Dev Server
npm run dev

# Terminal 2: Queue Workers
npm run workers
```

## Step 4: Generate Test Leads

**Option A - Dashboard (Easiest):**
1. Go to: http://localhost:3000/admin/lead-gen
2. Click: "Generate 100 Test Leads"
3. Watch queue processing!

**Option B - CLI:**
```bash
npm run test:leads 50
```

**Option C - Simulate Clay:**
```bash
npm run test:clay 10
```

---

## ✅ Success Checklist

- [ ] Redis connected (check console: "✅ Redis connected")
- [ ] Database tables created
- [ ] Dev server running
- [ ] Workers running (shows "🚀 Queue workers started - Mode: MOCK")
- [ ] Dashboard loads at /admin/lead-gen
- [ ] Shows "MOCK MODE" badge
- [ ] Test leads generated successfully
- [ ] Queues processing (Active > 0)
- [ ] Leads appearing in database

---

## 🎯 What Should Happen

### Workers Console:
```
🚀 Queue workers started
   Mode: MOCK
✅ Added: Melbourne Plumbing Services (72)
⏭️ Skipped: Sydney Electrical Co (Duplicate (email))
⏭️ Skipped: Perth HVAC Group (Low quality (45))
✅ Added: Brisbane Roofing Experts (68)
✅ Site generated: site-123-456
```

### Dashboard Shows:
- Total Today: 50+
- Clay: 0 (MOCK mode)
- ScrapeMaps: 0 (MOCK mode)
- Mock: 50+
- Avg Quality: 60-75
- Queue Status: Processing

### Database:
- New leads in `leads` table with quality_score >= 60
- Duplicates logged in `duplicate_logs` table
- Source marked as 'mock'

---

## 🐛 Troubleshooting

### "Redis connection failed" or "ECONNRESET" errors
→ **Dashboard now works!** Shows warning instead of hanging
→ See [REDIS_TROUBLESHOOTING.md](REDIS_TROUBLESHOOTING.md) for detailed solutions
→ Check REDIS_CONNECTION_STRING in .env.local
→ You may have a system REDIS_URL variable conflicting

### "No workers processing"
→ Run `npm run workers` in separate terminal
→ Check Redis connection is stable

### "No leads showing"
→ Check quality scores (must be 60+)
→ Check duplicate_logs for rejected leads

### "Can't find module"
→ Run `npm install`

---

## 📊 Commands Reference

```bash
# Development
npm run dev              # Start Next.js
npm run workers          # Start queue workers
npm run all              # Start both

# Testing
npm run test:leads 100   # Generate 100 test leads
npm run test:clay 10     # Simulate 10 Clay webhooks

# Monitoring
http://localhost:3000/admin/lead-gen     # Dashboard
http://localhost:3000/api/admin/queues  # Queue status API
```

---

## 🔄 Switch to Production Later

When ready (after testing):

1. Purchase Clay.com ($349/mo) + ScrapeMaps ($49/mo)
2. Add to .env.local:
   ```bash
   CLAY_WEBHOOK_SECRET=your-secret
   SCRAPEMAPS_API_KEY=your-key
   ```
3. Restart workers: `npm run workers`
4. System automatically switches to PRODUCTION mode!

---

## 📚 Full Documentation

- **Setup Guide:** [LEAD_GEN_SETUP.md](LEAD_GEN_SETUP.md)
- **Implementation Details:** [LEAD_GEN_SUMMARY.md](LEAD_GEN_SUMMARY.md)
- **Redis Issues:** [REDIS_TROUBLESHOOTING.md](REDIS_TROUBLESHOOTING.md)
- **Environment Variables:** [.env.example.leadgen](.env.example.leadgen)

---

**Current Status: MOCK MODE (Free Testing) ✅**

**Next Step: Generate test leads and verify system works!**
