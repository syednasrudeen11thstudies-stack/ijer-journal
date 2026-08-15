param(
    [Parameter(Mandatory = $true)]
    [string]$BaseUrl,

    [string]$BackupRoot = "E:\IJER BACKUP"
)

$ErrorActionPreference = "Stop"

function SafeName([string]$Value) {
    if ([string]::IsNullOrWhiteSpace($Value)) {
        return "unknown"
    }

    return ($Value -replace '[\\/:*?"<>|]', '_')
}

$secretFile =
    Join-Path $BackupRoot ".ijer-backup-secret"

if (-not (Test-Path -LiteralPath $secretFile)) {
    throw "Encrypted IJER backup secret not found."
}

$encrypted =
    [System.IO.File]::ReadAllText($secretFile)

$secure =
    ConvertTo-SecureString $encrypted

$credential =
    New-Object System.Management.Automation.PSCredential(
        "ijer-backup",
        $secure
    )

$secret =
    $credential.GetNetworkCredential().Password

$BaseUrl =
    $BaseUrl.TrimEnd("/")

$timestamp =
    Get-Date -Format "yyyy-MM-dd_HH-mm-ss"

$backupFolder =
    Join-Path $BackupRoot $timestamp

$databaseFolder =
    Join-Path $backupFolder "Database"

$manuscriptFolder =
    Join-Path $backupFolder "Manuscripts"

$articleFolder =
    Join-Path $backupFolder "Published Articles"

$issueFolder =
    Join-Path $backupFolder "Issues"

$editorialFolder =
    Join-Path $backupFolder "Editorial Board"

$settingsFolder =
    Join-Path $backupFolder "Journal Settings"

foreach ($folder in @(
    $backupFolder,
    $databaseFolder,
    $manuscriptFolder,
    $articleFolder,
    $issueFolder,
    $editorialFolder,
    $settingsFolder
)) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           IJER LOCAL BACKUP" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Source: $BaseUrl"
Write-Host "Target: $backupFolder"
Write-Host ""

$headers = @{
    "x-ijer-backup-secret" = $secret
}

Write-Host "Downloading database export..." -ForegroundColor Cyan

$response =
    Invoke-RestMethod `
        -Uri "$BaseUrl/api/admin/backup" `
        -Headers $headers `
        -Method Get

if (-not $response.success) {
    throw "Backup API failed."
}

$response |
    ConvertTo-Json -Depth 100 |
    Set-Content `
        -LiteralPath (Join-Path $databaseFolder "ijer-database-backup.json") `
        -Encoding UTF8

@"
IJER BACKUP SUMMARY

Created:
$($response.generatedAt)

Manuscripts:
$($response.counts.manuscripts)

Published Articles:
$($response.counts.articles)

Issues:
$($response.counts.issues)

Editorial Members:
$($response.counts.editorialMembers)
"@ |
Set-Content `
    -LiteralPath (Join-Path $databaseFolder "backup-summary.txt") `
    -Encoding UTF8

Write-Host "Database export saved." -ForegroundColor Green

# ============================================================
# MANUSCRIPTS
# ============================================================

Write-Host ""
Write-Host "Saving manuscripts..." -ForegroundColor Cyan

foreach ($manuscript in $response.data.manuscripts) {

    $reference =
        SafeName $manuscript.referenceNumber

    $folder =
        Join-Path $manuscriptFolder $reference

    New-Item -ItemType Directory -Force -Path $folder | Out-Null

    $manuscript |
        ConvertTo-Json -Depth 50 |
        Set-Content `
            -LiteralPath (Join-Path $folder "details.json") `
            -Encoding UTF8

    if ($manuscript.manuscriptFileUrl) {
        try {
            $extension =
                [System.IO.Path]::GetExtension(
                    ([uri]$manuscript.manuscriptFileUrl).AbsolutePath
                )

            if (-not $extension) {
                $extension = ".bin"
            }

            $filePath =
                Join-Path $folder "manuscript$extension"

            Invoke-WebRequest `
                -Uri $manuscript.manuscriptFileUrl `
                -Headers $headers `
                -OutFile $filePath
        }
        catch {
            Write-Warning "Could not download manuscript file for $reference"
        }
    }
}

# ============================================================
# ARTICLES
# ============================================================

Write-Host "Saving published articles..." -ForegroundColor Cyan

foreach ($article in $response.data.articles) {

    $slug =
        SafeName $article.slug

    $folder =
        Join-Path $articleFolder $slug

    New-Item -ItemType Directory -Force -Path $folder | Out-Null

    $article |
        ConvertTo-Json -Depth 50 |
        Set-Content `
            -LiteralPath (Join-Path $folder "details.json") `
            -Encoding UTF8

    if ($article.pdfUrl) {
        try {
            $filePath =
                Join-Path $folder "article.pdf"

            Invoke-WebRequest `
                -Uri "$BaseUrl/api/articles/$($article.slug)/pdf" `
                -Headers $headers `
                -OutFile $filePath
        }
        catch {
            Write-Warning "Could not download article PDF for $slug"
        }
    }
}

# ============================================================
# ISSUES
# ============================================================

$response.data.issues |
    ConvertTo-Json -Depth 50 |
    Set-Content `
        -LiteralPath (Join-Path $issueFolder "issues.json") `
        -Encoding UTF8

# ============================================================
# EDITORIAL BOARD
# ============================================================

$response.data.editorialMembers |
    ConvertTo-Json -Depth 50 |
    Set-Content `
        -LiteralPath (Join-Path $editorialFolder "editorial-board.json") `
        -Encoding UTF8

# ============================================================
# SETTINGS
# ============================================================

$response.data.journalSettings |
    ConvertTo-Json -Depth 50 |
    Set-Content `
        -LiteralPath (Join-Path $settingsFolder "journal-settings.json") `
        -Encoding UTF8

$secret = $null

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "     BACKUP COMPLETED SUCCESSFULLY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host $backupFolder -ForegroundColor Yellow
Write-Host ""