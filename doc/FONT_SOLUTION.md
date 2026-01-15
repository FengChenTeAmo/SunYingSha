# 字体解决方案

## 当前配置

项目已配置为**完全使用系统字体**，不再依赖 Google Fonts。这样可以：

✅ **避免网络问题** - 不需要访问 Google Fonts 服务器  
✅ **更快加载** - 字体已安装在系统中，无需下载  
✅ **更好的隐私** - 不向 Google 发送请求  
✅ **无错误信息** - 不会出现字体加载失败的错误  

## 使用的字体栈

### 正文字体
```css
system-ui, -apple-system, BlinkMacSystemFont, 
'Segoe UI', 'Microsoft YaHei', 'PingFang SC', 
'Hiragino Sans GB', 'WenQuanYi Micro Hei', sans-serif
```

### 标题字体
使用相同的字体栈，但字重为 700（粗体）

## 字体在不同系统上的表现

- **Windows**: Segoe UI / Microsoft YaHei（微软雅黑）
- **macOS**: San Francisco / PingFang SC（苹方）
- **Linux**: 系统默认字体 / WenQuanYi Micro Hei（文泉驿微米黑）
- **Android**: Roboto / 系统默认中文字体
- **iOS**: San Francisco / PingFang SC

## 如果需要使用 Google Fonts

如果将来网络环境改善，想要使用 Google Fonts，可以：

1. 取消注释 `app/layout.tsx` 中的字体导入代码
2. 恢复 `className` 中的字体变量

```typescript
// app/layout.tsx
import { Inter, Poppins } from 'next/font/google'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

const poppins = Poppins({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-poppins',
  display: 'swap',
  fallback: ['system-ui', 'arial'],
})

// 在 body 中使用
<body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
```

## 使用本地字体文件

如果需要特定的字体，可以下载字体文件并使用 `next/font/local`：

```typescript
import localFont from 'next/font/local'

const customFont = localFont({
  src: './fonts/CustomFont.woff2',
  variable: '--font-custom',
  display: 'swap',
})
```

## 优势

使用系统字体的优势：

1. **零延迟** - 字体已安装，无需下载
2. **无网络依赖** - 完全离线可用
3. **原生体验** - 使用用户熟悉的系统字体
4. **性能优秀** - 减少 HTTP 请求和文件大小
5. **兼容性好** - 所有现代系统都支持

---

**当前配置已优化，无需任何操作即可正常使用！**
