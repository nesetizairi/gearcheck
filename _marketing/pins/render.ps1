# Rendert alle Pins aus pins.js als PNG (1000 × 1500) mit Edge im Hintergrund.
# Aufruf: powershell -ExecutionPolicy Bypass -File _marketing/pins/render.ps1 [-Only boxhandschuhe]
param([string]$Only = '')

$dir = $PSScriptRoot
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") |
  Where-Object { Test-Path $_ } | Select-Object -First 1
$ids = [regex]::Matches((Get-Content "$dir\pins.js" -Raw), "id: '([^']+)'") | ForEach-Object { $_.Groups[1].Value }
$outDir = Join-Path $dir 'bilder'
New-Item -ItemType Directory -Force $outDir | Out-Null
$profile = Join-Path $env:TEMP 'gearcheck-pin-render'

$n = 0
foreach ($id in $ids) {
  $n++
  if ($Only -and $id -ne $Only) { continue }
  $out = Join-Path $outDir ('{0:D2}-{1}.png' -f $n, $id)
  $url = 'file:///' + ((Join-Path $dir 'vorlage.html') -replace '\\', '/') + "?id=$id"
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --user-data-dir="$profile" `
    --allow-file-access-from-files --window-size=1000,1500 --virtual-time-budget=3000 --screenshot="$out" $url 2>$null | Out-Null
  $f = Get-Item $out -ErrorAction SilentlyContinue
  '{0,-24} {1}' -f $id, $(if ($f) { "$([math]::Round($f.Length / 1KB)) KB" } else { 'FEHLT' })
}
