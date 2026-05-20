[CmdletBinding()]
param(
    [switch]$Pristine,
    [switch]$Verify,
    [string]$PnpmVersion = '11.1.0'
)

$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest

function Write-Step {
    param([string]$Message)
    Write-Host "[pnpm-bootstrap] $Message" -ForegroundColor Cyan
}

function Test-CommandExists {
    param([string]$Name)

    return [bool](Get-Command $Name -ErrorAction SilentlyContinue)
}

function Assert-Tool {
    param([string]$Name)

    if (-not (Test-CommandExists $Name)) {
        throw "Missing '$Name'. Install Node.js 22+ with Corepack available before running this script."
    }
}

function Get-PackageManagerVersion {
    $packageJson = Get-Content -LiteralPath 'package.json' -Raw | ConvertFrom-Json

    if (-not $packageJson.packageManager) {
        throw 'package.json must define packageManager (expected pnpm@11.1.0).'
    }

    if ($packageJson.packageManager -notmatch '^pnpm@(.+)$') {
        throw "packageManager must pin pnpm, but found '$($packageJson.packageManager)'."
    }

    return $Matches[1]
}

function Invoke-CheckedCommand {
    param(
        [Parameter(Mandatory)]
        [string]$Command,
        [Parameter(Mandatory)]
        [string[]]$Arguments,
        [string]$FailureMessage
    )

    & $Command @Arguments
    if ($LASTEXITCODE -ne 0) {
        if ($FailureMessage) {
            throw $FailureMessage
        }

        throw "Command '$Command' failed with exit code $LASTEXITCODE."
    }
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $repoRoot

Assert-Tool node
Assert-Tool corepack

if (-not (Test-Path 'package.json')) {
    throw 'package.json was not found at the repository root. Run this script from the repo checkout.'
}

$nodeVersion = (node --version).Trim()
Write-Step "Node detected: $nodeVersion"
if ($nodeVersion -notmatch '^v?(2[2-9]|[3-9]\d)\.') {
    Write-Warning 'This repository is validated on Node.js 22+. Continue only if you have a specific reason.'
}

Write-Step 'Validating pnpm pin from package.json'
$pinnedVersion = Get-PackageManagerVersion
if ($pinnedVersion -notlike "$PnpmVersion*") {
    throw "packageManager pins pnpm $pinnedVersion, but this bootstrap expects $PnpmVersion. Keep both aligned."
}

foreach ($lockfile in @('package-lock.json', 'npm-shrinkwrap.json', 'yarn.lock')) {
    if (Test-Path $lockfile) {
        try {
            Remove-Item $lockfile -Force
            Write-Step "Removed $lockfile"
        }
        catch {
            Write-Warning "Could not remove $lockfile automatically. Delete it manually if you no longer need it."
        }
    }
}

if ($Pristine -and (Test-Path 'node_modules')) {
    try {
        Remove-Item 'node_modules' -Recurse -Force
        Write-Step 'Removed node_modules'
    }
    catch {
        throw 'Failed to remove node_modules. Close running dev servers or editors that may be locking files and try again.'
    }
}

if (-not (Test-Path 'pnpm-lock.yaml')) {
    throw 'pnpm-lock.yaml is required. Pull the latest branch state before continuing.'
}

Write-Step 'Installing dependencies with a frozen lockfile'
Invoke-CheckedCommand -Command 'corepack' -Arguments @('pnpm', 'install', '--frozen-lockfile') -FailureMessage 'Dependency installation failed. Review the output above and fix the lockfile or environment before retrying.'

if ($Verify) {
    Write-Step 'Running frontend lint'
    Invoke-CheckedCommand -Command 'corepack' -Arguments @('pnpm', 'run', 'lint:frontend') -FailureMessage 'Lint verification failed.'

    Write-Step 'Running production build'
    Invoke-CheckedCommand -Command 'corepack' -Arguments @('pnpm', 'run', 'build') -FailureMessage 'Build verification failed.'
}

Write-Host 'Done. Use pnpm for all future project commands.' -ForegroundColor Green
