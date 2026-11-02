# Lokale Vorschau der Website: powershell -ExecutionPolicy Bypass -File tools/serve.ps1
param([int]$Port = 8080)

$root = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot '..'))
$types = @{
  '.html' = 'text/html; charset=utf-8'; '.css' = 'text/css; charset=utf-8'
  '.js' = 'application/javascript'; '.svg' = 'image/svg+xml'; '.png' = 'image/png'
  '.jpg' = 'image/jpeg'; '.webp' = 'image/webp'; '.xml' = 'application/xml'
  '.txt' = 'text/plain; charset=utf-8'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()
Write-Host "GearCheck Vorschau: http://localhost:$Port (Beenden mit Ctrl+C)"

while ($listener.IsListening) {
  $ctx = $listener.GetContext()
  $rel = [Uri]::UnescapeDataString($ctx.Request.Url.AbsolutePath).TrimStart('/')
  $file = [IO.Path]::GetFullPath((Join-Path $root $rel))
  if (Test-Path $file -PathType Container) { $file = Join-Path $file 'index.html' }

  $status = 200
  if (-not $file.StartsWith($root) -or -not (Test-Path $file -PathType Leaf)) {
    $file = Join-Path $root '404.html'
    $status = 404
  }

  $bytes = [IO.File]::ReadAllBytes($file)
  $type = $types[[IO.Path]::GetExtension($file).ToLower()]
  if (-not $type) { $type = 'application/octet-stream' }
  $ctx.Response.StatusCode = $status
  $ctx.Response.ContentType = $type
  $ctx.Response.OutputStream.Write($bytes, 0, $bytes.Length)
  $ctx.Response.Close()
}
