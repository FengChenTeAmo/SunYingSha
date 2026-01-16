# GitHub Pages 部署指南

## 前置步骤

在运行 GitHub Actions 之前，需要先在仓库设置中启用 GitHub Pages：

### 1. 启用 GitHub Pages

1. 进入仓库的 **Settings**（设置）
2. 在左侧菜单中找到 **Pages**（页面）
3. 在 **Source**（源）部分：
   - 选择 **GitHub Actions** 作为部署源
   - **不要**选择 "Deploy from a branch"
4. 点击 **Save**（保存）

### 2. 检查权限

确保仓库的 Actions 权限已启用：
- Settings → Actions → General
- 确保 "Allow all actions and reusable workflows" 已启用

## 部署流程

### 自动部署

当代码推送到 `main` 分支时，GitHub Actions 会自动：
1. 安装依赖
2. 构建 Next.js 项目（静态导出）
3. 部署到 GitHub Pages

### 手动触发部署

如果需要手动触发部署：
1. 进入仓库的 **Actions** 标签页
2. 选择 **Deploy to GitHub Pages** workflow
3. 点击 **Run workflow** 按钮
4. 选择分支（通常是 `main`）
5. 点击 **Run workflow**

## 部署后访问

部署完成后，网站将在以下地址可用：
- `https://<你的用户名>.github.io/<仓库名>/`

例如：如果仓库名是 `SunYingSha`，用户名为 `yourusername`，则访问地址为：
- `https://yourusername.github.io/SunYingSha/`

## 常见问题

### 1. "Get Pages site failed" 错误

**原因**：GitHub Pages 未在仓库设置中启用

**解决方法**：
1. 进入 Settings → Pages
2. 选择 "GitHub Actions" 作为 Source
3. 保存设置
4. 重新运行 workflow

### 2. 404 错误

**原因**：可能是 basePath 配置问题

**解决方法**：
- 如果仓库名不是根路径，需要在 `next.config.js` 中设置 `basePath`
- 例如：`basePath: '/SunYingSha'`

### 3. 资源加载失败

**原因**：静态资源路径不正确

**解决方法**：
- 确保所有资源路径使用相对路径或正确的 basePath
- 检查 `public` 目录下的文件是否正确

### 4. 构建失败

**检查项**：
- 确保所有 TypeScript 类型错误已修复
- 确保没有使用服务端功能（如 `getServerSideProps`）
- 检查控制台输出中的具体错误信息

## 验证部署

部署成功后，可以：
1. 在 Actions 标签页查看部署状态（绿色 ✓ 表示成功）
2. 访问网站 URL 验证功能
3. 检查浏览器控制台是否有错误

## 更新内容

每次推送代码到 `main` 分支后，GitHub Actions 会自动重新构建和部署，通常需要几分钟时间。
