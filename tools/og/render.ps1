# Rendert alle Vorschaubilder (1200 × 630) nach assets/img/og/<key>.png mit Edge im Hintergrund.
# Vorher tools/build.pl laufen lassen (erzeugt daten.js), danach nochmals, damit die Seiten die Bilder verlinken.
# Aufruf: powershell -ExecutionPolicy Bypass -File tools/og/render.ps1 [-Only boxhandschuhe-groesse]
param([string]$Only = '')

$root = (Resolve-Path "$PSScriptRoot\..\..").Path
$dir = $PSScriptRoot
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") |
  Where-Object { Test-Path $_ } | Select-Object -First 1
$keys = [regex]::Matches((Get-Content "$dir\daten.js" -Raw -Encoding UTF8), '"key":"([^"]+)"') | ForEach-Object { $_.Groups[1].Value }
$outDir = Join-Path $root 'assets\img\og'
New-Item -ItemType Directory -Force $outDir | Out-Null
$profile = Join-Path $env:TEMP 'gearcheck-og-render'

foreach ($key in $keys) {
  if ($Only -and $key -ne $Only) { continue }
  $out = Join-Path $outDir "$key.png"
  $url = 'file:///' + "$dir\vorlage.html".Replace('\', '/') + "?key=$key"
  & $edge --headless=new --disable-gpu --hide-scrollbars --force-device-scale-factor=1 --user-data-dir="$profile" `
    --allow-file-access-from-files --window-size=1200,630 --virtual-time-budget=3000 --screenshot="$out" $url 2>$null | Out-Null
  $f = Get-Item $out -ErrorAction SilentlyContinue
  '{0,-30} {1}' -f $key, $(if ($f) { "$([math]::Round($f.Length / 1KB)) KB" } else { 'FEHLT' })
}
