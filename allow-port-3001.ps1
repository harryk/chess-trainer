# PowerShell script to allow port 3001 through Windows Firewall
# Run this as Administrator

Write-Host "Adding Windows Firewall rule for port 3001..." -ForegroundColor Green

# Add inbound rule for port 3001
New-NetFirewallRule -DisplayName "Chess Trainer Server - Port 3001" `
    -Direction Inbound `
    -Protocol TCP `
    -LocalPort 3001 `
    -Action Allow `
    -Profile Any `
    -Description "Allow incoming connections to Chess Trainer Server on port 3001"

# Add outbound rule for port 3001 (if needed)
New-NetFirewallRule -DisplayName "Chess Trainer Server - Port 3001 Outbound" `
    -Direction Outbound `
    -Protocol TCP `
    -LocalPort 3001 `
    -Action Allow `
    -Profile Any `
    -Description "Allow outbound connections from Chess Trainer Server on port 3001"

Write-Host "Firewall rules added successfully!" -ForegroundColor Green
Write-Host "You should now be able to access:" -ForegroundColor Yellow
Write-Host "  - http://localhost:3001/healthz" -ForegroundColor Cyan
Write-Host "  - http://192.168.1.82:3001/healthz" -ForegroundColor Cyan
Write-Host "  - WebSocket: ws://192.168.1.82:3001" -ForegroundColor Cyan

# Test the connection
Write-Host "`nTesting connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3001/healthz" -TimeoutSec 5
    Write-Host "✅ Local connection successful!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Local connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

try {
    $response = Invoke-WebRequest -Uri "http://192.168.1.82:3001/healthz" -TimeoutSec 5
    Write-Host "✅ Network connection successful!" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
} catch {
    Write-Host "❌ Network connection failed: $($_.Exception.Message)" -ForegroundColor Red
}

