# Install Redis on Windows

Your Upstash Redis instance is unstable (timing out and resetting connections). Let's install Redis locally for reliable development.

## Option 1: Memurai (Recommended for Windows)

Memurai is a Redis-compatible server optimized for Windows.

### Installation Steps:

1. **Download Memurai:**
   - Go to: https://www.memurai.com/get-memurai
   - Click "Download" (free developer edition)
   - Run the installer: `Memurai-Developer-x64.msi`

2. **Install:**
   - Follow the installation wizard
   - Keep default settings
   - Memurai will auto-start as a Windows service

3. **Verify Installation:**
   ```powershell
   # Check if Memurai is running
   Get-Service Memurai
   ```

4. **Update .env.local:**
   ```bash
   REDIS_CONNECTION_STRING=redis://localhost:6379
   ```

5. **Restart dev server:**
   ```bash
   npm run dev
   ```

## Option 2: Redis via WSL2 (Alternative)

If you have WSL2 installed:

```bash
# In WSL2 terminal
sudo apt-get update
sudo apt-get install redis-server
sudo service redis-server start

# Test
redis-cli ping
# Should return: PONG
```

Update .env.local:
```bash
REDIS_CONNECTION_STRING=redis://localhost:6379
```

## Option 3: Docker (If you have Docker Desktop)

```powershell
# Pull and run Redis
docker run -d -p 6379:6379 --name redis redis:7-alpine

# Test
docker exec -it redis redis-cli ping
# Should return: PONG
```

Update .env.local:
```bash
REDIS_CONNECTION_STRING=redis://localhost:6379
```

To stop: `docker stop redis`
To start: `docker start redis`

## Option 4: Keep Using Upstash (Not Recommended)

Your current Upstash Redis is unstable. If you want to try again:

1. **Delete current Upstash Redis database**
2. **Create a NEW Upstash Redis:**
   - Go to: https://console.upstash.io/
   - Click "Create Database"
   - Choose a region closer to you
   - Copy the Redis URL (not REST URL)

3. **Update .env.local:**
   ```bash
   REDIS_CONNECTION_STRING=redis://default:NEW_PASSWORD@new-instance.upstash.io:6379
   ```

## Verify Redis Works

After installation, test the connection:

```bash
# Test connection
node -e "const Redis = require('ioredis'); const redis = new Redis('redis://localhost:6379'); redis.ping().then(() => { console.log('✅ Redis works!'); process.exit(0); }).catch(e => { console.error('❌ Failed:', e.message); process.exit(1); });"
```

You should see:
```
✅ Redis works!
```

## Why Local Redis?

- **Faster**: No network latency
- **More reliable**: No connection resets
- **Free**: No API limits or quotas
- **Better for development**: Full control

## Current Issue

Your Upstash Redis has these problems:
- ✅ Connects initially
- ❌ Immediately resets connection (ECONNRESET)
- ❌ Times out on operations
- ❌ Causes queue workers to fail

This makes it unusable for BullMQ queue processing.

## After Installing Redis

1. Stop your dev server (Ctrl+C)
2. Update REDIS_CONNECTION_STRING in .env.local
3. Restart: `npm run dev`
4. Start workers: `npm run workers` (in separate terminal)
5. Visit: http://localhost:3000/admin/lead-gen
6. Click "Generate 100 Test Leads"

You should see clean output:
```
✅ Redis connected
🚀 Queue workers started
   Mode: MOCK
✅ Added: Business Name (Score)
```

---

**Recommended: Install Memurai (5 minutes)**

It's the easiest solution for Windows and works perfectly with BullMQ.
