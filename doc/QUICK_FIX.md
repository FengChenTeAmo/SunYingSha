# 快速修复 ChunkLoadError

## 🚀 快速解决步骤

### 方法一：使用清理脚本（最简单）

```powershell
# 运行清理脚本
.\clean.ps1

# 然后重新构建和启动
npm run build
npm run dev
```

### 方法二：使用 npm 命令

```bash
# 清理缓存
npm run clean:cache

# 重新构建
npm run build

# 启动开发服务器
npm run dev
```

### 方法三：手动清理

```powershell
# 1. 停止开发服务器 (Ctrl+C)

# 2. 删除 .next 目录
Remove-Item -Recurse -Force .next

# 3. 重新构建
npm run build

# 4. 启动开发服务器
npm run dev
```

## ⚠️ 如果问题仍然存在

1. **完全重启**
   - 关闭所有终端窗口
   - 关闭 VS Code（如果正在使用）
   - 重新打开并运行上述步骤

2. **检查端口占用**
   ```powershell
   netstat -ano | findstr :3000
   # 如果发现进程，结束它
   taskkill /PID <PID> /F
   ```

3. **使用不同端口**
   ```bash
   npm run dev -- -p 3001
   ```

## ✅ 验证修复

运行 `npm run dev` 后，访问 http://localhost:3000，应该能看到网站正常加载。

---

**提示**: 这个错误通常是由于开发服务器在运行时构建文件发生变化导致的。清理缓存后重新构建即可解决。
