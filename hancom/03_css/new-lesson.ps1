# 03_css 폴더에서 가장 큰 번호를 찾아 다음 레슨 폴더를 자동 생성
$base = $PSScriptRoot

$existing = Get-ChildItem -Path $base -Directory |
    Where-Object { $_.Name -match '^\d+$' } |
    ForEach-Object { [int]$_.Name } |
    Sort-Object

$next = if ($existing) { ($existing | Select-Object -Last 1) + 1 } else { 1 }
$num  = '{0:D2}' -f $next

$lessonDir = Join-Path $base $num
$stylesDir = Join-Path $lessonDir 'styles'

New-Item -ItemType Directory -Path $stylesDir -Force | Out-Null

$html = @"
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="./styles/main.css">
    <title>$num</title>
</head>
<body>
    <h1>$num</h1>
</body>
</html>
"@

Set-Content -Path (Join-Path $lessonDir 'index.html') -Value $html -Encoding UTF8
Set-Content -Path (Join-Path $stylesDir 'main.css')   -Value ''   -Encoding UTF8

Write-Host "생성 완료: $lessonDir"
