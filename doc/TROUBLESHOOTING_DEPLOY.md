# GitHub Pages 部署故障排除

## 无法访问网站

如果 `https://fengchenteamo.github.io/SunYingSha` 无法访问，请按以下步骤排查：

### 1. 检查部署状态

1. **进入 Actions 标签页**
   - 查看最新的 workflow 运行记录
   - 确认是否成功完成（绿色 ✓）

2. **查看构建日志**
   - 点击失败的 workflow
   - 查看 "Build" 步骤的详细日志
   - 查找错误信息

### 2. 检查 Pages 设置

1. **Settings → Pages**
   - 确认 Source 已选择 "GitHub Actions"
   - 确认显示 "Your site is live at..."
   - 如果显示 "Not yet published"，说明部署未成功

### 3. 常见问题及解决方案

#### 问题 1：构建失败

**错误信息**：TypeScript 类型错误、ESLint 错误等

**解决方法**：
- 修复所有类型错误
- 运行 `npm run lint` 检查代码
- 确保本地可以成功构建：`npm run build`

#### 问题 2：404 错误

**原因**：basePath 配置不正确

**解决方法**：
- 确认 `next.config.js` 中 `basePath: '/SunYingSha'`
- 确认访问 URL 包含仓库名：`https://fengchenteamo.github.io/SunYingSha/`
- 注意 URL 末尾的斜杠 `/`

#### 问题 3：资源加载失败

**原因**：静态资源路径不正确

**解决方法**：
- 确保所有资源使用相对路径（以 `/` 开头）
- Next.js 会自动处理 basePath
- 检查浏览器控制台的 404 错误

#### 问题 4：Pages 未启用

**错误信息**：`Get Pages site failed`

**解决方法**：
1. Settings → Pages
2. Source 选择 "GitHub Actions"
3. 保存设置
4. 重新运行 workflow

### 4. 验证部署

#### 方法 1：检查 Actions 日志

1. 进入 Actions 标签页
2. 查看最新的 workflow
3. 展开 "Deploy to GitHub Pages" 步骤
4. 查看是否有错误信息

#### 方法 2：检查 Pages 设置

1. Settings → Pages
2. 查看 "Custom domain" 部分
3. 应该显示部署的 URL

#### 方法 3：检查构建产物

1. 在 Actions 中查看 "Upload artifact" 步骤
2. 确认 `./out` 目录存在
3. 确认包含 `index.html` 文件

### 5. 手动验证构建

在本地验证构建是否成功：

```bash
# 设置环境变量
$env:NODE_ENV="production"

# 构建项目
npm run build

# 检查 out 目录
ls out

# 应该看到 index.html 和其他文件
```

### 6. 使用备用部署方案

如果 GitHub Actions 方式持续失败，可以使用分支部署：

1. **Settings → Pages**
   - Source 选择 "Deploy from a branch"
   - Branch 选择 `gh-pages`
   - Folder 选择 `/ (root)`

2. **运行备用 workflow**
   - Actions → "Deploy to GitHub Pages (Branch)"
   - 点击 "Run workflow"

### 7. 检查仓库权限

确保：
- 仓库是公开的（或你有 GitHub Pro）
- 你有仓库的 write 权限
- Actions 权限已启用

### 8. 等待部署完成

GitHub Pages 部署通常需要：
- 构建：2-5 分钟
- 部署：1-2 分钟
- 缓存更新：可能需要几分钟

**总计**：通常需要 5-10 分钟

### 9. 清除浏览器缓存

如果网站已部署但显示旧内容：
- 强制刷新：Ctrl + F5（Windows）或 Cmd + Shift + R（Mac）
- 使用无痕模式访问
- 清除浏览器缓存

## 获取帮助

如果以上方法都无法解决问题：

1. **查看详细错误日志**
   - Actions → 失败的 workflow → 查看详细日志

2. **检查常见错误**
   - 类型错误
   - 导入错误
   - 路径错误

3. **验证配置**
   - `next.config.js` 配置正确
   - `package.json` 脚本正确
   - workflow 文件语法正确
