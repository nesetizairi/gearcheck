# Erzeugt die Titelbilder der neuen Ratgeber (assets/img/ratgeber/<slug>.svg) mit Edge im Hintergrund.
# Nur die Ratgeber, die in tools/gen/ratgeber.html stehen. Die älteren Titelbilder sind von Hand gezeichnet und bleiben unberührt.
$root = (Resolve-Path "$PSScriptRoot\..\..").Path
New-Item -ItemType Directory -Force (Join-Path $root 'assets\img\ratgeber') | Out-Null
$edge = @("${env:ProgramFiles(x86)}\Microsoft\Edge\Application\msedge.exe", "$env:ProgramFiles\Microsoft\Edge\Application\msedge.exe") | Where-Object { Test-Path $_ } | Select-Object -First 1
$url = 'file:///' + "$root\tools\gen\ratgeber.html".Replace('\', '/')
$dom = & $edge --headless=new --disable-gpu --allow-file-access-from-files --user-data-dir="$env:TEMP\gearcheck-gen" --dump-dom $url 2>$null | Out-String
$ms = [regex]::Matches($dom, '<textarea id="out-([a-z-]+)">([\s\S]*?)</textarea>')
foreach ($m in $ms) {
  $svg = $m.Groups[2].Value.Replace('&lt;', '<').Replace('&gt;', '>').Replace('&quot;', '"').Replace('&amp;', '&')
  $out = Join-Path $root ("assets\img\ratgeber\" + $m.Groups[1].Value + ".svg")
  [IO.File]::WriteAllText($out, $svg, (New-Object Text.UTF8Encoding $false))
  '{0,-40} {1} KB' -f $m.Groups[1].Value, [math]::Round($svg.Length / 1KB, 1)
}
