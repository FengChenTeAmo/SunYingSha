# GitHub Pages 设置指南

## ⚠️ 重要：必须先手动启用 GitHub Pages

**GitHub Actions 无法自动启用 Pages，必须在仓库设置中手动启用！**

## 错误：Setup Pages HttpError: Not Found

如果遇到此错误，说明 GitHub Pages 尚未在仓库中启用。请按照以下步骤操作：

## 解决步骤

### 方法 1：手动启用 GitHub Pages（推荐）

1. **进入仓库设置**
   - 打开你的 GitHub 仓库
   - 点击顶部的 **Settings**（设置）标签

2. **找到 Pages 设置**
   - 在左侧菜单中，向下滚动找到 **Pages**（页面）选项
   - 点击进入 Pages 设置页面

3. **配置 Pages 源**
   - 在 **Source**（源）部分
   - 选择 **GitHub Actions** 作为部署源
   - **不要**选择 "Deploy from a branch"
   - 点击 **Save**（保存）

4. **检查 Actions 权限**
   - 在 Settings → Actions → General
   - 确保 "Allow all actions and reusable workflows" 已启用
   - 确保 "Workflow permissions" 设置为 "Read and write permissions"

5. **重新运行 Workflow**
   - 进入 **Actions** 标签页
   - 选择 "Deploy to GitHub Pages" workflow
   - 点击 **Run workflow** 重新运行

### 方法 2：使用 gh-pages 分支部署（推荐备用方案）

如果 GitHub Actions 方式仍然失败，可以使用 `deploy-branch.yml` workflow：

1. **Settings → Pages**
   - **Source** 选择 "Deploy from a branch"
   - **Branch** 选择 `gh-pages`
   - **Folder** 选择 `/ (root)`
   - 点击 **Save**

2. **使用备用 Workflow**
   - 项目已包含 `.github/workflows/deploy-branch.yml`
   - 这个 workflow 会自动构建并推送到 `gh-pages` 分支
   - 推送到 `main` 分支时会自动触发

3. **手动触发**
   - 进入 Actions 标签页
   - 选择 "Deploy to GitHub Pages (Branch)" workflow
   - 点击 "Run workflow"

## 验证设置

启用后，你应该能看到：
- Settings → Pages 页面显示 "Your site is live at https://..."
- Actions 标签页中的 workflow 可以成功运行

## 常见问题

### Q: 为什么需要先启用 Pages？

A: GitHub Pages 需要仓库级别的权限配置。首次使用时，必须在 Settings 中手动启用，之后 GitHub Actions 才能自动部署。

### Q: 启用后仍然失败？

A: 检查以下几点：
1. 仓库是否为公开仓库（私有仓库需要 GitHub Pro）
2. Actions 权限是否正确配置
3. 是否有足够的仓库权限（需要 write 权限）

### Q: 可以使用其他部署方式吗？

A: 可以，但推荐使用 GitHub Actions，因为：
- 自动化程度高
- 支持 Next.js 静态导出
- 可以自定义构建流程

## 部署后的访问地址

部署成功后，网站将在以下地址可用：
- `https://<你的用户名>.github.io/<仓库名>/`

例如：`https://username.github.io/SunYingSha/`
