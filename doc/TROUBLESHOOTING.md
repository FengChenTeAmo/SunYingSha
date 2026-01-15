# 故障排除指南

## ChunkLoadError: Loading chunk failed

### 错误信息
```
ChunkLoadError: Loading chunk app/layout failed.
(timeout: http://localhost:3000/_next/static/chunks/app/layout.js)
```

### 原因
这个错误通常由以下原因引起：
1. **缓存问题** - `.next` 目录中的构建文件损坏或不一致
2. **开发服务器问题** - 服务器在运行时构建文件发生变化
3. **网络问题** - 本地开发服务器连接超时

### 解决方案

#### 方案一：清理缓存并重启（推荐）

```bash
# 1. 停止开发服务器 (Ctrl+C)

# 2. 删除 .next 目录
Remove-Item -Recurse -Force .next

# 3. 清理 node_modules 缓存（可选）
Remove-Item -Recurse -Force node_modules/.cache

# 4. 重新构建
npm run build

# 5. 重启开发服务器
npm run dev
```

#### 方案二：使用 PowerShell 脚本

创建 `clean.ps1` 文件：

```powershell
Write-Host "清理 Next.js 缓存..." -ForegroundColor Yellow
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue
Write-Host "缓存已清理！" -ForegroundColor Green
Write-Host "运行 npm run dev 重启开发服务器" -ForegroundColor Cyan
```

运行：
```powershell
.\clean.ps1
```

#### 方案三：完全重置

如果问题持续存在：

```bash
# 1. 停止所有 Node 进程
# 在任务管理器中结束所有 node.exe 进程

# 2. 清理所有缓存
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules/.cache

# 3. 重新安装依赖（可选）
npm install

# 4. 重新构建
npm run build

# 5. 启动开发服务器
npm run dev
```

### 预防措施

1. **不要在开发服务器运行时修改构建配置**
2. **定期清理缓存**（特别是在更新依赖后）
3. **使用稳定的网络连接**

## 其他常见问题

### 1. Google Fonts 加载失败

**症状**: 构建时出现字体加载警告

**解决**: 已配置 fallback 字体，不影响功能。如需完全解决，参考 `FONT_FIX.md`

### 2. 端口被占用

**症状**: `Error: listen EADDRINUSE: address already in use :::3000`

**解决**:
```bash
# 查找占用端口的进程
netstat -ano | findstr :3000

# 结束进程（替换 PID 为实际进程ID）
taskkill /PID <PID> /F

# 或使用其他端口
npm run dev -- -p 3001
```

### 3. 模块未找到错误

**症状**: `Module not found: Can't resolve 'xxx'`

**解决**:
```bash
# 重新安装依赖
rm -rf node_modules package-lock.json
npm install
```

### 4. TypeScript 类型错误

**症状**: 构建时出现类型错误

**解决**:
```bash
# 检查类型
npm run build

# 如果只是警告，可以继续开发
# 如果是错误，需要修复代码
```

### 5. 内存不足

**症状**: `JavaScript heap out of memory`

**解决**:
```bash
# 增加 Node.js 内存限制
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run dev
```

## 快速修复命令

创建一个 `fix.ps1` 脚本：

```powershell
Write-Host "开始修复..." -ForegroundColor Yellow

# 停止可能运行的进程
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force

# 清理缓存
Write-Host "清理缓存..." -ForegroundColor Cyan
Remove-Item -Recurse -Force .next -ErrorAction SilentlyContinue
Remove-Item -Recurse -Force node_modules/.cache -ErrorAction SilentlyContinue

# 重新构建
Write-Host "重新构建..." -ForegroundColor Cyan
npm run build

Write-Host "修复完成！运行 npm run dev 启动开发服务器" -ForegroundColor Green
```

## 获取帮助

如果问题仍然存在：

1. 检查 Next.js 版本：`npm list next`
2. 查看完整错误日志
3. 检查 Node.js 版本（推荐 18+）
4. 查看 Next.js 官方文档：https://nextjs.org/docs

---

**提示**: 大多数问题都可以通过清理 `.next` 目录和重启开发服务器解决。
