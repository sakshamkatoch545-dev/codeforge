param (
    [int]$FrontendPort = 3000,
    [int]$BackendPort = 8000
)

Write-Host "CodeForge Sharing Script" -ForegroundColor Cyan
Write-Host "========================" -ForegroundColor Cyan
Write-Host "This script will use localtunnel to expose your frontend and backend to the internet."

# Check if npx is available
if (!(Get-Command npx -ErrorAction SilentlyContinue)) {
    Write-Error "npx is not installed. Please install Node.js (which includes npx) to use this feature."
    exit 1
}

Write-Host "`n[1] Starting backend tunnel on port $BackendPort..." -ForegroundColor Yellow
$BackendJob = Start-Job -ScriptBlock {
    param($Port)
    npx localtunnel --port $Port
} -ArgumentList $BackendPort

Start-Sleep -Seconds 3
$BackendOutput = Receive-Job -Job $BackendJob
$BackendUrl = ""
if ($BackendOutput -match "your url is: (https://.*)") {
    $BackendUrl = $matches[1]
    Write-Host "Backend URL: $BackendUrl" -ForegroundColor Green
} else {
    Write-Host "Failed to start backend tunnel. Output:" -ForegroundColor Red
    Write-Host $BackendOutput
    Stop-Job $BackendJob
    exit 1
}

Write-Host "`n[2] Starting frontend tunnel on port $FrontendPort..." -ForegroundColor Yellow
$FrontendJob = Start-Job -ScriptBlock {
    param($Port)
    npx localtunnel --port $Port
} -ArgumentList $FrontendPort

Start-Sleep -Seconds 3
$FrontendOutput = Receive-Job -Job $FrontendJob
$FrontendUrl = ""
if ($FrontendOutput -match "your url is: (https://.*)") {
    $FrontendUrl = $matches[1]
    Write-Host "Frontend URL: $FrontendUrl" -ForegroundColor Green
} else {
    Write-Host "Failed to start frontend tunnel. Output:" -ForegroundColor Red
    Write-Host $FrontendOutput
    Stop-Job $BackendJob
    Stop-Job $FrontendJob
    exit 1
}

Write-Host "`n========================" -ForegroundColor Cyan
Write-Host "SUCCESS! Your application is now live on the internet." -ForegroundColor Green
Write-Host "IMPORTANT: For the frontend to communicate with the remote backend, you must update your API URL."
Write-Host "Please edit 'frontend/src/api.ts' and change:"
Write-Host "    const API_BASE = 'http://localhost:8000/api/v1'"
Write-Host "To:"
Write-Host "    const API_BASE = '$BackendUrl/api/v1'" -ForegroundColor Magenta
Write-Host "Then share this link with your friends: $FrontendUrl" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the tunnels when you're done."

# Keep script running
try {
    while ($true) {
        Start-Sleep -Seconds 1
    }
} finally {
    Write-Host "Shutting down tunnels..."
    Stop-Job -Job $BackendJob
    Stop-Job -Job $FrontendJob
    Remove-Job -Job $BackendJob
    Remove-Job -Job $FrontendJob
}
