param([string[]]$Only)

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.Net.Http

$items = @(
  @{ Slug = 'dune-part2'; Query = '듄 파트2 공식 포스터' },
  @{ Slug = 'peppertones-club-tour'; Query = '페퍼톤스 클럽투어 공식 포스터' },
  @{ Slug = 'phantom-musical'; Query = '뮤지컬 오페라의 유령 공식 포스터' },
  @{ Slug = 'lg-doosan'; Query = 'LG 트윈스 두산 베어스 경기 포스터' },
  @{ Slug = 'pentaport'; Query = '펜타포트 락 페스티벌 공식 포스터' },
  @{ Slug = 'wicked'; Query = '위키드 영화 공식 포스터' },
  @{ Slug = 'coldplay-seoul'; Query = '콜드플레이 내한공연 공식 포스터' },
  @{ Slug = 'liar-play'; Query = '연극 라이어 공식 포스터' },
  @{ Slug = 'korea-football'; Query = '축구 국가대표 A매치 공식 포스터' },
  @{ Slug = 'seoul-jazz'; Query = '서울재즈페스티벌 공식 포스터' },
  @{ Slug = 'inside-out2'; Query = '인사이드 아웃 2 공식 포스터' },
  @{ Slug = 'chicago-musical'; Query = '뮤지컬 시카고 한국 공식 포스터' },
  @{ Slug = 'boy-and-heron'; Query = '그대들은 어떻게 살 것인가 공식 포스터' },
  @{ Slug = 'waterbomb-seoul'; Query = '워터밤 서울 공식 포스터' },
  @{ Slug = 'day6-decade'; Query = '데이식스 The DECADE 콘서트 공식 포스터' },
  @{ Slug = 'les-miserables'; Query = '뮤지컬 레미제라블 한국 공식 포스터' },
  @{ Slug = 'volleyball-final'; Query = '프로배구 챔피언결정전 포스터' },
  @{ Slug = 'silica-gel-power-andre'; Query = '실리카겔 POWER ANDRE 공식 포스터' },
  @{ Slug = 'kinky-boots'; Query = '뮤지컬 킹키부츠 한국 공식 포스터' },
  @{ Slug = 'doosan-kia'; Query = '두산 베어스 KIA 타이거즈 경기 포스터' },
  @{ Slug = 'conjuring-last-rites'; Query = '컨저링 라스트 라이츠 공식 포스터' },
  @{ Slug = 'hedwig-musical'; Query = '뮤지컬 헤드윅 한국 공식 포스터' }
)

# 자동 검색 결과를 시각 검수한 뒤 확정한 포스터 원본.
$overrides = @{
  'boy-and-heron' = 'https://img.extmovie.com/files/attach/images/135/318/818/091/d9a548090b641e654b91cb80d4284cfd.jpeg'
  'chicago-musical' = 'http://blogfiles.naver.net/MjAxNjEwMjVfMjQz/MDAxNDc3Mzc4NTY2MDcy.GWTtzjAomUgXPuyBLtGFWXqWwpfB71qSnxMua5Z3w90g.N13q7QzyrgIJwBvoW0jTI4HECOsOHH1VIw54XO63V7Yg.JPEG.kkcine/openingposter.jpg'
  'coldplay-seoul' = 'http://imgnews.naver.net/image/144/2024/09/19/0000989344_007_20240919171813713.jpg'
  'conjuring-last-rites' = 'https://img.extmovie.com/files/attach/images/135/999/270/093/68505affec4334fcdf90254fc43c26a9.jpg'
  'day6-decade' = 'http://blogfiles.naver.net/MjAyNTA4MjZfMjcg/MDAxNzU2MjEwMzMyMDY0.ZV5wCx_3--BDPHITjgfTf_9CVv_-PoXCUM6fWCVN7z0g.d4ta5-OxH9mH7XgN3w77T79C-whV3mACQ81ENfbThc4g.JPEG/900%A3%DF20250826%A3%DF182624.jpg'
  'les-miserables' = 'http://blogfiles.naver.net/MjAyMzA3MjZfMjEz/MDAxNjkwMzM3MzYyODkx.Zd2VWVXa6NemrOw4wtgMmj81PA7b7jaasAyt5h-syW8g.6wxV8tf9ZcNWxy9CC1raAt_NUpAG0SqDokKKHp4crC8g.JPEG.dltmdgn0808/Screenshot%A3%DF20230726%A3%DF110546%A3%DFInstagram.jpg'
  'liar-play' = 'http://cafefiles.naver.net/MjAxOTA1MjFfMTM3/MDAxNTU4NDE0NjA0NDUx.MrBFqzqb5yr1c-cs8W6nwS_Tc4Lp-BqWriDU-AQjfh4g._dXYlWgy4cIcSGtAVRWuopkPOOrC8J9zr8JD_fTAr_8g.JPEG.leena92/%B6%F3%C0%CC%BE%EE-1%C5%BA%C6%F7%BD%BA%C5%CD%282019%291.jpg'
  'seoul-jazz' = 'http://blogfiles.naver.net/MjAyNTAyMjBfMTIy/MDAxNzQwMDIxMDIzNTI3.HrypAOtDfeUMGXRNRcNZKTlOuDbDC0-hHAEk1wb2mpsg.RvnaXh5Rblx86ORcQQmq9A7DFyDATx8Nwa8rhmSNKscg.JPEG/output_1903763374.jpg'
  'silica-gel-power-andre' = 'https://img1.newsis.com/2023/10/13/NISI20231013_0001385210_web.jpg'
}

$root = if ($PSScriptRoot) {
  Split-Path -Parent $PSScriptRoot
} else {
  (Get-Location).Path
}
$outputDir = Join-Path $root 'public\posters'
New-Item -ItemType Directory -Force -Path $outputDir | Out-Null

$client = [System.Net.Http.HttpClient]::new()
$client.Timeout = [TimeSpan]::FromSeconds(15)
$client.DefaultRequestHeaders.UserAgent.ParseAdd(
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/126 Safari/537.36'
)

function Convert-SearchString([string]$value) {
  return $value.Replace('\/', '/').Replace('\u0026', '&').Replace('\"', '"')
}

function Save-Poster([byte[]]$bytes, [string]$path) {
  $stream = [System.IO.MemoryStream]::new($bytes)
  $source = [System.Drawing.Image]::FromStream($stream)

  try {
    $scale = [Math]::Min(1, [Math]::Min(720 / $source.Width, 1080 / $source.Height))
    $width = [Math]::Max(1, [int][Math]::Round($source.Width * $scale))
    $height = [Math]::Max(1, [int][Math]::Round($source.Height * $scale))
    $bitmap = [System.Drawing.Bitmap]::new($width, $height)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)

    try {
      $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
      $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
      $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
      $graphics.DrawImage($source, 0, 0, $width, $height)

      $codec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
        Where-Object { $_.MimeType -eq 'image/jpeg' } |
        Select-Object -First 1
      $quality = [System.Drawing.Imaging.EncoderParameter]::new(
        [System.Drawing.Imaging.Encoder]::Quality,
        [long]88
      )
      $parameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
      $parameters.Param[0] = $quality

      try {
        $bitmap.Save($path, $codec, $parameters)
      } finally {
        $parameters.Dispose()
        $quality.Dispose()
      }
    } finally {
      $graphics.Dispose()
      $bitmap.Dispose()
    }

    return "$($source.Width)x$($source.Height)"
  } finally {
    $source.Dispose()
    $stream.Dispose()
  }
}

$pattern = '(?s)\{"type":"image".*?"link":"((?:\\.|[^"])*)".*?"title":"((?:\\.|[^"])*)".*?"originalUrl":"((?:\\.|[^"])*)".*?"orgWidth":(\d+),"orgHeight":(\d+)'

try {
  foreach ($item in $items) {
    if ($Only -and $item.Slug -notin $Only) {
      continue
    }

    if ($overrides.ContainsKey($item.Slug)) {
      $imageUrl = $overrides[$item.Slug]
      $downloadUrls = @($imageUrl)

      if ($imageUrl.StartsWith('http://')) {
        $downloadUrls = @($imageUrl.Replace('http://', 'https://'), $imageUrl)
      }

      $saved = $false
      foreach ($downloadUrl in $downloadUrls) {
        try {
          $bytes = $client.GetByteArrayAsync($downloadUrl).GetAwaiter().GetResult()
          $path = Join-Path $outputDir "$($item.Slug).jpg"
          $sourceSize = Save-Poster $bytes $path
          Write-Output "CURATED|$($item.Slug)|$imageUrl|$sourceSize"
          $saved = $true
          break
        } catch {
          continue
        }
      }

      if ($saved) {
        continue
      }

      Write-Output "CURATED-FAILED|$($item.Slug)|$imageUrl"
    }

    $query = [uri]::EscapeDataString($item.Query)
    $searchUrl = "https://search.naver.com/search.naver?where=image&sm=tab_jum&query=$query"
    $html = (Invoke-WebRequest -Uri $searchUrl -UseBasicParsing -TimeoutSec 20).Content
    $matches = [regex]::Matches($html, $pattern)
    $saved = $false

    foreach ($match in $matches | Select-Object -First 20) {
      $width = [int]$match.Groups[4].Value
      $height = [int]$match.Groups[5].Value

      if ($height -lt 500 -or ($width / $height) -gt 0.88) {
        continue
      }

      $pageUrl = Convert-SearchString $match.Groups[1].Value
      $title = Convert-SearchString $match.Groups[2].Value
      $imageUrl = Convert-SearchString $match.Groups[3].Value
      $downloadUrls = @($imageUrl)

      if ($imageUrl.StartsWith('http://')) {
        $downloadUrls = @($imageUrl.Replace('http://', 'https://'), $imageUrl)
      }

      foreach ($downloadUrl in $downloadUrls) {
        try {
          $bytes = $client.GetByteArrayAsync($downloadUrl).GetAwaiter().GetResult()
          if ($bytes.Length -lt 15000) {
            continue
          }

          $path = Join-Path $outputDir "$($item.Slug).jpg"
          $sourceSize = Save-Poster $bytes $path
          Write-Output "SELECTED|$($item.Slug)|$title|$pageUrl|$imageUrl|$sourceSize"
          $saved = $true
          break
        } catch {
          continue
        }
      }

      if ($saved) {
        break
      }
    }

    if (-not $saved) {
      Write-Output "MISSING|$($item.Slug)|$($item.Query)"
    }
  }
} finally {
  $client.Dispose()
}
