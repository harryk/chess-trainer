# Simple Chess Server using PowerShell
$port = 3001

# Create a simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

# WebSocket server simulation using a simple message queue
$clients = @()
$messageQueue = @()

try {
    $listener.Start()
    Write-Host "🚀 Simple Chess Server running on port $port" -ForegroundColor Green
    Write-Host "📊 Health check: http://localhost:$port/healthz" -ForegroundColor Cyan
    Write-Host "🔌 Simulating WebSocket responses..." -ForegroundColor Yellow
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        if ($request.Url.LocalPath -eq "/healthz") {
            $healthData = @{
                status = "healthy"
                timestamp = (Get-Date).ToString("yyyy-MM-ddTHH:mm:ss.fffZ")
                uptime = [System.Environment]::TickCount / 1000
                message = "Simple Chess Server Running"
            } | ConvertTo-Json
            
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($healthData)
            $response.ContentLength64 = $buffer.Length
            $response.OutputStream.Write($buffer, 0, $buffer.Length)
            $response.StatusCode = 200
        } else {
            $response.StatusCode = 404
        }
        
        $response.Close()
    }
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
} finally {
    $listener.Stop()
}

