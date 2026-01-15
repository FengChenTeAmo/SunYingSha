# Next.js 缓存清理脚本
# 使用方法: .\clean.ps1

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Next.js 缓存清理工具" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# 停止可能运行的 Node 进程
Write-Host "检查运行中的 Node 进程..." -ForegroundColor Yellow
$nodeProcesses = Get-Process -Name node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "发现 $($nodeProcesses.Count) 个 Node 进程，正在停止..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force
    Start-Sleep -Seconds 2
    Write-Host "Node 进程已停止" -ForegroundColor Green
} else {
    Write-Host "没有运行中的 Node 进程" -ForegroundColor Green
}

Write-Host ""

# 清理 .next 目录
Write-Host "清理 .next 目录..." -ForegroundColor Yellow
if (Test-Path ".next") {
    Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
    Write-Host "✓ .next 目录已清理" -ForegroundColor Green
} else {
    Write-Host "✓ .next 目录不存在" -ForegroundColor Gray
}

# 清理 node_modules 缓存
Write-Host "清理 node_modules/.cache..." -ForegroundColor Yellow
if (Test-Path "node_modules/.cache") {
    Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
    Write-Host "✓ node_modules/.cache 已清理" -ForegroundColor Green
} else {
    Write-Host "✓ node_modules/.cache 不存在" -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  清理完成！" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "下一步操作：" -ForegroundColor Yellow
Write-Host "  1. 运行 'npm run build' 重新构建" -ForegroundColor Cyan
Write-Host "  2. 运行 'npm run dev' 启动开发服务器" -ForegroundColor Cyan
Write-Host ""
