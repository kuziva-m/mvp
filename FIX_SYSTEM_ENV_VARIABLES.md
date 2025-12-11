# Fix System Environment Variables

## The Problem

You have **system environment variables** set that override your `.env.local` file:

```
REDIS_URL=https://heroic-prawn-45385.upstash.io  ← System variable (overrides .env.local)
REDIS_CONNECTION_STRING=redis://upstash...       ← System variable (overrides .env.local)
```

Even though `.env.local` now has:
```
REDIS_CONNECTION_STRING=redis://localhost:6379   ← Gets ignored!
```

**Windows environment variable priority:**
1. System environment variables (Machine)
2. User environment variables
3. `.env.local` file ← Lowest priority

## Solution: Remove System Environment Variables

### Step 1: Run the PowerShell Script

I've created a script to remove the Redis environment variables.

**Option A: Quick Fix (User variables only)**
```powershell
# In regular PowerShell (no Admin needed)
cd C:\Users\FX\Desktop\mvp-web-agency
.\fix-redis-env.ps1
```

**Option B: Complete Fix (User + System variables)**
```powershell
# Right-click PowerShell → "Run as Administrator"
cd C:\Users\FX\Desktop\mvp-web-agency
.\fix-redis-env.ps1
```

### Step 2: Close ALL Terminals

**CRITICAL:** Environment variables are loaded when the terminal starts.

1. Close **all** PowerShell/CMD windows
2. Close **all** VS Code windows
3. Close any running `npm run dev` or `npm run workers`

### Step 3: Open NEW Terminal

```powershell
# Open fresh PowerShell
cd C:\Users\FX\Desktop\mvp-web-agency
```

### Step 4: Verify It Works

```powershell
# Test that localhost is used
node -e "require('dotenv').config({ path: '.env.local' }); console.log('REDIS_CONNECTION_STRING:', process.env.REDIS_CONNECTION_STRING);"
```

You should see:
```
REDIS_CONNECTION_STRING: redis://localhost:6379  ← Correct!
```

NOT:
```
REDIS_CONNECTION_STRING: redis://...upstash...  ← Wrong!
```

### Step 5: Start Workers

```powershell
# Terminal 1
npm run dev

# Terminal 2 (separate window)
npm run workers
```

You should see:
```
✅ Environment variables loaded
✅ Redis connected
🚀 Queue workers started
   Mode: MOCK
```

## Manual Alternative (If Script Doesn't Work)

### Remove via Windows System Settings

1. **Open System Environment Variables:**
   - Press `Win + R`
   - Type: `sysdm.cpl`
   - Press Enter
   - Click "Environment Variables" button

2. **User Variables (top section):**
   - Find `REDIS_URL` → Click → Delete
   - Find `REDIS_CONNECTION_STRING` → Click → Delete
   - Click OK

3. **System Variables (bottom section) - Requires Admin:**
   - Find `REDIS_URL` → Click → Delete
   - Find `REDIS_CONNECTION_STRING` → Click → Delete
   - Click OK

4. **Apply Changes:**
   - Click OK on all dialogs
   - Close **all** terminals
   - Open new terminal

### Remove via PowerShell Commands

```powershell
# Remove User variables
[System.Environment]::SetEnvironmentVariable('REDIS_URL', $null, 'User')
[System.Environment]::SetEnvironmentVariable('REDIS_CONNECTION_STRING', $null, 'User')

# Remove System variables (requires Admin)
[System.Environment]::SetEnvironmentVariable('REDIS_URL', $null, 'Machine')
[System.Environment]::SetEnvironmentVariable('REDIS_CONNECTION_STRING', $null, 'Machine')
```

## Verify System Variables are Gone

```powershell
# Check User variables
[System.Environment]::GetEnvironmentVariable('REDIS_URL', 'User')
[System.Environment]::GetEnvironmentVariable('REDIS_CONNECTION_STRING', 'User')

# Check System variables
[System.Environment]::GetEnvironmentVariable('REDIS_URL', 'Machine')
[System.Environment]::GetEnvironmentVariable('REDIS_CONNECTION_STRING', 'Machine')
```

All should return empty/null.

## Expected Result

After removing system variables and restarting your terminal:

### Console Output (Clean)
```
✅ Database connection successful
✅ Environment variables loaded
✅ Redis connected
🚀 Queue workers started
   Mode: MOCK
```

### No Errors
- ❌ No ECONNRESET errors
- ❌ No connection timeouts
- ❌ No "Failed to connect to Redis"

### Workers Function
```powershell
# Test lead generation
npm run test:leads 10
```

Should see:
```
✅ Added: Business Name (85)
✅ Added: Another Business (72)
⏭️ Skipped: Low Quality (45)
```

## Troubleshooting

### Still seeing Upstash errors?
→ You didn't close all terminals. Close everything and start fresh.

### "redis-cli: command not found"?
→ Normal. Memurai doesn't add redis-cli to PATH. Workers will still work.

### Workers still not starting?
→ Make sure Memurai service is running:
```powershell
Get-Service Memurai
```

Should show: `Status: Running`

If not:
```powershell
Start-Service Memurai
```

### Local Redis not responding?
→ Restart Memurai:
```powershell
Restart-Service Memurai
```

## Summary

1. ✅ Run `.\fix-redis-env.ps1`
2. ✅ Close ALL terminals
3. ✅ Open NEW terminal
4. ✅ Run `npm run workers`
5. ✅ Should work perfectly!

---

**The system environment variables were overriding your .env.local file. Removing them fixes everything!**
