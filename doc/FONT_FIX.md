# 字体加载问题修复说明

## 问题描述

在构建或运行项目时，可能会遇到 Google Fonts 加载失败的错误：
```
AbortError: The user aborted a request.
```

这通常是由于：
1. 网络连接问题（无法访问 Google Fonts）
2. 防火墙或代理阻止
3. Google Fonts 服务暂时不可用

## 解决方案

### ✅ 已实施的修复

1. **添加 Fallback 字体**
   - 在字体配置中添加了 `fallback` 选项
   - 即使 Google Fonts 加载失败，也会使用系统字体

2. **优化字体加载**
   - 使用 `display: 'swap'` 确保文本立即可见
   - 添加了 `adjustFontFallback: true` 优化字体替换

3. **CSS Fallback**
   - 在 `globals.css` 中添加了完整的字体回退链
   - 包含中文字体支持（Microsoft YaHei）

### 如果问题仍然存在

#### 方案一：使用本地字体（推荐）

1. 下载字体文件到 `public/fonts/` 目录
2. 修改 `app/layout.tsx`：

```typescript
import localFont from 'next/font/local'

const inter = localFont({
  src: './fonts/Inter-Variable.woff2',
  variable: '--font-inter',
  display: 'swap',
})

const poppins = localFont({
  src: './fonts/Poppins-Variable.woff2',
  variable: '--font-poppins',
  display: 'swap',
})
```

#### 方案二：禁用 Google Fonts（临时）

如果网络问题持续，可以暂时使用系统字体：

```typescript
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="scroll-smooth">
      <body className="font-sans antialiased">
        {/* 使用系统字体 */}
        <Navigation />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
```

#### 方案三：配置代理（如果有）

如果使用代理，可以在 `.env.local` 中配置：

```env
HTTP_PROXY=http://your-proxy:port
HTTPS_PROXY=http://your-proxy:port
```

## 当前状态

✅ 已添加 fallback 字体，即使 Google Fonts 加载失败，网站也能正常显示。

字体加载优先级：
1. Inter / Poppins (Google Fonts)
2. system-ui (系统 UI 字体)
3. Microsoft YaHei (中文字体)
4. sans-serif (通用无衬线字体)

## 测试

运行以下命令测试：

```bash
npm run dev
```

如果看到字体加载警告但网站正常显示，说明 fallback 字体已生效。

---

**注意**: 当前配置已确保即使 Google Fonts 无法加载，网站也能正常显示。字体加载失败不会影响网站功能。
