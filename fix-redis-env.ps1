# PowerShell script to remove Redis environment variables
# Run as Administrator: Right-click PowerShell -> Run as Administrator
# Then run: .\fix-redis-env.ps1

Write-Host "Removing Redis environment variables from system..." -ForegroundColor Yellow

# Remove from User environment
[System.Environment]::SetEnvironmentVariable('REDIS_URL', $null, 'User')
[System.Environment]::SetEnvironmentVariable('REDIS_CONNECTION_STRING', $null, 'User')

Write-Host "✅ User environment variables removed" -ForegroundColor Green

# Check if running as Administrator
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if ($isAdmin) {
    # Remove from System environment (requires Admin)
    [System.Environment]::SetEnvironmentVariable('REDIS_URL', $null, 'Machine')
    [System.Environment]::SetEnvironmentVariable('REDIS_CONNECTION_STRING', $null, 'Machine')
    Write-Host "✅ System environment variables removed" -ForegroundColor Green
} else {
    Write-Host "⚠️ Not running as Administrator - system variables not removed" -ForegroundColor Yellow
    Write-Host "   To remove system variables, run PowerShell as Administrator" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "✅ Environment variables cleared!" -ForegroundColor Green
Write-Host ""
Write-Host "IMPORTANT:" -ForegroundColor Cyan
Write-Host "1. Close this terminal completely" -ForegroundColor White
Write-Host "2. Open a NEW terminal" -ForegroundColor White
Write-Host "3. Navigate to: cd C:\Users\FX\Desktop\mvp-web-agency" -ForegroundColor White
Write-Host "4. Run: npm run workers" -ForegroundColor White
Write-Host ""
Write-Host "The .env.local file will now be used instead of system variables" -ForegroundColor Green
