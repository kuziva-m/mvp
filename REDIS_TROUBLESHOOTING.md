# Redis Connection Troubleshooting

## Issue: ECONNRESET Errors

If you're seeing `read ECONNRESET` errors in the console, this means Redis is connecting but then the connection is being reset. This is common with Upstash free tier.

### Current Status

✅ **Dashboard loads** - The [/admin/lead-gen](http://localhost:3000/admin/lead-gen) page now loads correctly even with Redis connection issues
✅ **Graceful degradation** - The dashboard shows a warning message instead of hanging
⚠️ **Queue monitoring unavailable** - Real-time queue status requires a stable Redis connection

### The Problem

You have a **system environment variable** `REDIS_URL` set to:
```
https://heroic-prawn-45385.upstash.io
```

This is the **REST API URL** (for HTTP requests), but BullMQ needs the **Redis protocol URL**:
```
redis://default:password@heroic-prawn-45385.upstash.io:6379
```

### Solution Options

#### Option 1: Remove System Environment Variable (Recommended)

Remove the `REDIS_URL` environment variable from your system:

**Windows:**
```powershell
# In PowerShell (as Administrator)
[System.Environment]::SetEnvironmentVariable('REDIS_URL', $null, 'User')
```

Then restart your terminal and run:
```bash
npm run dev
```

#### Option 2: Use Different Variable Name (Current Setup)

The code now checks `REDIS_CONNECTION_STRING` first, which is set in `.env.local`:
```bash
REDIS_CONNECTION_STRING=redis://default:password@heroic-prawn-45385.upstash.io:6379
```

This should work, but you may still see connection resets from Upstash.

#### Option 3: Create New Upstash Redis (Most Reliable)

1. Go to [Upstash Console](https://console.upstash.io/)
2. Create a **new Redis database**
3. Copy the **Redis** connection string (not REST)
4. Update `.env.local`:
   ```bash
   REDIS_CONNECTION_STRING=redis://default:NEW_PASSWORD@new-instance.upstash.io:6379
   ```

#### Option 4: Use Local Redis (Development)

For local development without internet dependency:

1. **Install Redis:**
   - Windows: Download from [Redis Windows](https://github.com/tporadowski/redis/releases)
   - Mac: `brew install redis`
   - Linux: `sudo apt-get install redis-server`

2. **Start Redis:**
   ```bash
   redis-server
   ```

3. **Update `.env.local`:**
   ```bash
   REDIS_CONNECTION_STRING=redis://localhost:6379
   ```

### Expected Console Output (Normal)

When everything works correctly, you should see:
```
✅ Database connection successful
✅ Redis connected
 GET /admin/lead-gen 200 in 150ms
```

### What You're Seeing Now

```
✅ Redis connected
Error: read ECONNRESET
Failed to connect to Redis: Connection is closed.
```

This means:
1. ✅ Initial connection succeeds
2. ❌ Connection drops immediately (Upstash issue)
3. ⚠️ Dashboard still loads (graceful degradation working)

### Testing Queue System

Once Redis is stable, you can test the full system:

1. **Start dev server:**
   ```bash
   npm run dev
   ```

2. **Start workers** (separate terminal):
   ```bash
   npm run workers
   ```

3. **Visit dashboard:**
   http://localhost:3000/admin/lead-gen

4. **Generate test leads:**
   - Click "Generate 100 Test Leads" button
   - Watch workers process in real-time

### Verifying Redis Works

Test your Redis connection:

**Windows (PowerShell):**
```powershell
$env:REDIS_CONNECTION_STRING = "redis://default:password@host:6379"
node -e "const Redis = require('ioredis'); const redis = new Redis(process.env.REDIS_CONNECTION_STRING); redis.ping().then(() => { console.log('✅ Success'); process.exit(0); }).catch(e => { console.error('❌ Failed:', e.message); process.exit(1); });"
```

**Mac/Linux:**
```bash
REDIS_CONNECTION_STRING="redis://default:password@host:6379" node -e "..."
```

### Environment Variable Priority

The code checks in this order:
1. `REDIS_CONNECTION_STRING` (from `.env.local`) ← **Highest priority**
2. `REDIS_URL` (from `.env.local` or system) ← Fallback

### Current Workaround

The dashboard now works even without Redis! You'll see:
- ⚠️ Warning message in Queue Status section
- ✅ All other features work normally
- ✅ Stats and metrics display correctly

To get full functionality with queue monitoring, you need a stable Redis connection using one of the options above.

## Need Help?

1. Check Upstash dashboard for connection limits
2. Verify your Redis instance is active
3. Try creating a new Redis instance
4. Consider local Redis for development

---

**TL;DR:** Dashboard works now! To fix Redis connection issues, either:
- Remove system `REDIS_URL` environment variable, OR
- Create a new Upstash Redis instance, OR
- Use local Redis for development
