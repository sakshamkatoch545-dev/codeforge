param (
    [int]$Port = 3000
)

$NGROK = "C:\Users\saksh\AppData\Local\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"

Write-Host ""
Write-Host "  CodeForge - Public URL Tunnel (ngrok)" -ForegroundColor Cyan
Write-Host "  ======================================" -ForegroundColor Cyan
Write-Host ""

if (-not (Test-Path $NGROK)) {
    $fromPath = Get-Command ngrok -ErrorAction SilentlyContinue
    if ($fromPath) {
        $NGROK = $fromPath.Source
    } else {
        Write-Host "  ERROR: ngrok not found. Run: winget install ngrok.ngrok" -ForegroundColor Red
        exit 1
    }
}

Write-Host "  Starting tunnel on port $Port..." -ForegroundColor Green
Write-Host "  Your public HTTPS URL will appear below." -ForegroundColor Gray
Write-Host "  Copy the Forwarding URL and add it to Google Cloud Console." -ForegroundColor Yellow
Write-Host ""
Write-Host "  Press Ctrl+C to stop." -ForegroundColor Gray
Write-Host ""

# Kill any existing ngrok to avoid ERR_NGROK_334
Stop-Process -Name "ngrok" -Force -ErrorAction SilentlyContinue

& $NGROK http $Port
