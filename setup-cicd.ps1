# Quick Setup Script for CI/CD
# This script helps you gather all the necessary IDs and tokens

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   Daffodil AI Club - CI/CD Setup Helper" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""

# Function to read JSON file
function Get-VercelProjectInfo {
    param($Path)
    if (Test-Path $Path) {
        $content = Get-Content $Path -Raw | ConvertFrom-Json
        return $content
    }
    return $null
}

Write-Host "📋 Gathering Vercel Project Information..." -ForegroundColor Yellow
Write-Host ""

# Backend Project Info
Write-Host "🔧 BACKEND PROJECT" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
$backendInfo = Get-VercelProjectInfo ".\backend\.vercel\project.json"
if ($backendInfo) {
    Write-Host "Organization ID: " -NoNewline
    Write-Host $backendInfo.orgId -ForegroundColor Cyan
    Write-Host "Project ID: " -NoNewline
    Write-Host $backendInfo.projectId -ForegroundColor Cyan
} else {
    Write-Host "❌ Backend not linked to Vercel yet!" -ForegroundColor Red
    Write-Host "Run: cd backend && vercel link" -ForegroundColor Yellow
}
Write-Host ""

# Frontend Project Info
Write-Host "🎨 FRONTEND PROJECT" -ForegroundColor Green
Write-Host "===================" -ForegroundColor Green
$frontendInfo = Get-VercelProjectInfo ".\frontend\.vercel\project.json"
if ($frontendInfo) {
    Write-Host "Organization ID: " -NoNewline
    Write-Host $frontendInfo.orgId -ForegroundColor Cyan
    Write-Host "Project ID: " -NoNewline
    Write-Host $frontendInfo.projectId -ForegroundColor Cyan
} else {
    Write-Host "❌ Frontend not linked to Vercel yet!" -ForegroundColor Red
    Write-Host "Run: cd frontend && vercel link" -ForegroundColor Yellow
}
Write-Host ""

# GitHub Secrets Summary
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host "   GitHub Secrets to Add" -ForegroundColor Cyan
Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Go to: https://github.com/reduanahmadswe/Daffodil_AI_Club/settings/secrets/actions" -ForegroundColor Yellow
Write-Host ""
Write-Host "Add these secrets:" -ForegroundColor White
Write-Host ""

if ($backendInfo -and $frontendInfo) {
    Write-Host "1. VERCEL_TOKEN" -ForegroundColor Green
    Write-Host "   Get from: https://vercel.com/account/tokens" -ForegroundColor Gray
    Write-Host ""
    
    Write-Host "2. VERCEL_ORG_ID" -ForegroundColor Green
    Write-Host "   Value: " -NoNewline
    Write-Host $backendInfo.orgId -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "3. VERCEL_BACKEND_PROJECT_ID" -ForegroundColor Green
    Write-Host "   Value: " -NoNewline
    Write-Host $backendInfo.projectId -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "4. VERCEL_FRONTEND_PROJECT_ID" -ForegroundColor Green
    Write-Host "   Value: " -NoNewline
    Write-Host $frontendInfo.projectId -ForegroundColor Cyan
    Write-Host ""
    
    Write-Host "5. NEXT_PUBLIC_API_URL" -ForegroundColor Green
    Write-Host "   Value: https://aiclubbackend.vercel.app" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host "⚠️  Please link both projects to Vercel first!" -ForegroundColor Yellow
}

Write-Host "==================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "For detailed instructions, see: CI_CD_SETUP.md" -ForegroundColor Yellow
Write-Host ""
