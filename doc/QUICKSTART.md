# 快速开始指南

## 安装依赖

首先安装项目依赖：

```bash
npm install
# 或
yarn install
# 或
pnpm install
```

## 开发运行

启动开发服务器：

```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

然后在浏览器中打开 [http://localhost:3000](http://localhost:3000) 查看网站。

## 项目结构

```
SunYingSha/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 根布局
│   ├── page.tsx           # 首页
│   └── globals.css        # 全局样式
├── components/            # React 组件
│   ├── layout/           # 布局组件
│   │   ├── Navigation.tsx # 导航栏
│   │   └── Footer.tsx    # 页脚
│   └── sections/         # 页面区块
│       ├── HeroSection.tsx
│       ├── AboutSection.tsx
│       ├── CareerSection.tsx
│       ├── HighlightsSection.tsx
│       └── StatisticsSection.tsx
├── types/                 # TypeScript 类型定义
│   └── index.ts
├── public/                # 静态资源
│   ├── images/           # 图片
│   └── videos/          # 视频
└── data/                 # 数据文件
```

## 下一步

### 1. 添加 React Bits 组件

访问 [React Bits 官网](https://reactbits.dev/get-started/index)，选择需要的组件：

- **背景组件**：Aurora、Beams、Ballpit 等
- **动画组件**：Animated Content、Animated List 等
- **交互组件**：Bounce Cards、Card Swap、Blob Cursor 等

将组件代码复制到 `components/reactbits/` 目录下。

### 2. 添加真实数据

在 `data/` 目录下创建数据文件：

- `career.ts` - 职业生涯事件
- `matches.ts` - 比赛成绩
- `statistics.ts` - 统计数据
- `media.ts` - 媒体资源

### 3. 添加图片和视频

将图片和视频资源放入 `public/images/` 和 `public/videos/` 目录。

### 4. 自定义样式

在 `tailwind.config.ts` 中调整颜色、字体等设计参数。

## 构建生产版本

```bash
npm run build
npm run start
```

## 部署

### Vercel（推荐）

1. 将代码推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署完成

### 其他平台

- Netlify
- AWS Amplify
- 自建服务器

## 开发提示

- 使用 `npm run lint` 检查代码规范
- 所有组件都支持响应式设计
- 动画使用 Framer Motion，性能优化良好
- 图片使用 Next.js Image 组件自动优化

## 需要帮助？

查看详细文档：
- [README.md](./README.md) - 项目概述
- [DESIGN.md](./DESIGN.md) - 设计规范
- [TECHNICAL.md](./TECHNICAL.md) - 技术文档
- [REACTBITS_GUIDE.md](./REACTBITS_GUIDE.md) - React Bits 使用指南
