param(
    [string]$BaseUrl = "http://localhost:3000",
    [string]$BackupRoot = "E:\IJER BACKUP"
)

$ErrorActionPreference = "Stop"

$timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

$backupFolder = Join-Path $BackupRoot $timestamp

New-Item -ItemType Directory -Force -Path $backupFolder | Out-Null

$databaseFolder = Join-Path $backupFolder "Database"
$manuscriptFolder = Join-Path $backupFolder "Manuscripts"
$articleFolder = Join-Path $backupFolder "Published Articles"

New-Item -ItemType Directory -Force -Path $databaseFolder | Out-Null
New-Item -ItemType Directory -Force -Path $manuscriptFolder | Out-Null
New-Item -ItemType Directory -Force -Path $articleFolder | Out-Null

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "          IJER LOCAL BACKUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Website: $BaseUrl"
Write-Host "Backup:  $backupFolder"
Write-Host ""

Write-Host "IMPORTANT:" -ForegroundColor Yellow
Write-Host "You must already be logged in as SUPER_ADMIN in your browser."
Write-Host ""

$sessionToken = Read-Host "Paste the value of your ijer_admin_session cookie"

if ([string]::IsNullOrWhiteSpace($sessionToken)) {
    throw "Admin session cookie is required."
}

$headers = @{
    Cookie = "ijer_admin_session=$sessionToken"
}

Write-Host ""
Write-Host "Downloading journal database backup..." -ForegroundColor Cyan

$backupUrl = "$BaseUrl/api/admin/backup"

$response = Invoke-RestMethod `
    -Uri $backupUrl `
    -Headers $headers `
    -Method Get

if (-not $response.success) {
    throw "Backup API returned an error."
}

$jsonPath = Join-Path $databaseFolder "ijer-database-backup.json"

$response |
    ConvertTo-Json -Depth 100 |
    Set-Content -LiteralPath $jsonPath -Encoding UTF8

Write-Host "Database backup saved." -ForegroundColor Green

$countPath = Join-Path $databaseFolder "backup-summary.txt"

@"
IJER BACKUP SUMMARY

Created: $($response.generatedAt)

Manuscripts: $($response.counts.manuscripts)
Articles: $($response.counts.articles)
Issues: $($response.counts.issues)
Editorial Members: $($response.counts.editorialMembers)
"@ |
Set-Content -LiteralPath $countPath -Encoding UTF8

Write-Host ""
Write-Host "Saving manuscript metadata..." -ForegroundColor Cyan

foreach ($manuscript in $response.data.manuscripts) {

    $safeReference = $manuscript.referenceNumber -replace '[\\/:*?"<>|]', '_'

    $folder = Join-Path $manuscriptFolder $safeReference

    New-Item -ItemType Directory -Force -Path $folder | Out-Null

    $metadataPath = Join-Path $folder "details.json"

    $manuscript |
        ConvertTo-Json -Depth 50 |
        Set-Content -LiteralPath $metadataPath -Encoding UTF8
}

Write-Host "Manuscript metadata saved." -ForegroundColor Green

Write-Host ""
Write-Host "Saving article metadata..." -ForegroundColor Cyan

foreach ($article in $response.data.articles) {

    $safeSlug = $article.slug -replace '[\\/:*?"<>|]', '_'

    $folder = Join-Path $articleFolder $safeSlug

    New-Item -ItemType Directory -Force -Path $folder | Out-Null

    $metadataPath = Join-Path $folder "details.json"

    $article |
        ConvertTo-Json -Depth 50 |
        Set-Content -LiteralPath $metadataPath -Encoding UTF8
}

Write-Host "Article metadata saved." -ForegroundColor Green

Write-Host ""
Write-Host "BACKUP COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host ""
Write-Host "Saved to:"
Write-Host $backupFolder -ForegroundColor Yellow
Write-Host ""