# 孙颖莎人物志网站

## 项目概述

这是一个专为展示乒乓球运动员孙颖莎的人物志网站。网站以炫酷的视觉效果和现代化的交互体验为核心，全面展示孙颖莎的生平、成就、精彩瞬间和个人风采。

## 项目定位

- **类型**：人物传记展示网站
- **风格**：炫酷、现代、视觉冲击力强
- **目标**：通过精美的设计和流畅的动画，展现孙颖莎的职业生涯和个人魅力

## 技术栈

### 前端框架
- **React 18+** / **Next.js 14+** - 现代化前端框架，支持SSR和静态生成
- **TypeScript** - 类型安全，提升代码质量

### 样式与动画
- **Tailwind CSS** - 快速构建现代化UI
- **Framer Motion** - 流畅的页面过渡和动画效果
- **GSAP** - 高级动画库，实现炫酷的视觉效果
- **Three.js** / **React Three Fiber** - 3D视觉效果（可选）

### 媒体处理
- **Next.js Image** - 图片优化和懒加载
- **React Player** - 视频播放支持

### UI组件库
- **[React Bits](https://reactbits.dev/)** - 110+ 炫酷动画组件库（核心组件库）
  - 动画背景（Aurora, Beams, Ballpit 等）
  - 动画组件（Animated Content, Animated List, Bounce Cards 等）
  - 文本动画（ASCIIText, Blur Text 等）
  - 交互组件（Blob Cursor, Bubble Menu, Card Swap 等）
  - 轮播组件（Carousel）

### 其他工具
- **React Icons** - 图标库
- **Swiper.js** - 轮播图组件（备用）
- **AOS (Animate On Scroll)** - 滚动动画

## 功能特性

### 核心页面

1. **首页（Hero Section）**
   - 全屏视频背景或动态粒子效果
   - 大标题动画展示
   - 平滑滚动导航

2. **关于（About）**
   - 个人简介
   - 时间轴展示成长历程
   - 3D卡片翻转效果

3. **职业生涯（Career）**
   - 重要比赛成绩展示
   - 数据可视化图表
   - 奖牌和荣誉展示墙

4. **精彩瞬间（Highlights）**
   - 图片/视频画廊
   - 瀑布流布局
   - 灯箱效果查看大图

5. **数据统计（Statistics）**
   - 动态数字计数动画
   - 交互式图表
   - 比赛数据可视化

6. **新闻动态（News）**
   - 最新资讯列表
   - 卡片式布局
   - 分类筛选

7. **联系方式/粉丝墙（Contact）**
   - 社交媒体链接
   - 粉丝留言墙（可选）

### 视觉特效

- ✨ **动画背景** - 使用 React Bits 的 Aurora、Beams、Ballpit 等背景组件
- 🎬 **视频背景** - 全屏视频循环播放
- 💫 **视差滚动** - 多层次视差效果
- 🎨 **渐变色彩** - 丰富的渐变配色方案
- ⚡ **微交互** - 使用 React Bits 的 Bounce Cards、Card Swap 等交互组件
- 🌟 **光标特效** - React Bits 的 Blob Cursor 光标动画
- 📝 **文本动画** - ASCIIText、Blur Text 等文本特效
- 🎪 **卡片动画** - 弹跳卡片、卡片交换等动画效果

## 设计风格

### 色彩方案
- **主色调**：中国红 + 金色（代表荣誉和成就）
- **辅助色**：深蓝、白色、渐变紫
- **强调色**：霓虹蓝、荧光绿（用于特效）

### 字体
- **标题**：粗体、现代无衬线字体（如：Poppins, Montserrat）
- **正文**：易读的衬线或无衬线字体（如：Inter, Noto Sans SC）

### 布局特点
- 全屏布局，充分利用视口空间
- 卡片式设计，层次分明
- 响应式设计，适配各种设备
- 留白充足，视觉舒适

## 项目结构

```
SunYingSha/
├── public/                 # 静态资源
│   ├── images/            # 图片资源
│   ├── videos/            # 视频资源
│   └── icons/             # 图标
├── src/
│   ├── components/        # 组件
│   │   ├── layout/        # 布局组件
│   │   ├── sections/      # 页面区块
│   │   ├── animations/    # 动画组件
│   │   └── ui/            # UI组件
│   ├── pages/             # 页面（Next.js）
│   │   ├── index.tsx      # 首页
│   │   ├── about.tsx      # 关于
│   │   ├── career.tsx     # 职业生涯
│   │   └── ...
│   ├── styles/            # 样式文件
│   ├── hooks/             # 自定义Hooks
│   ├── utils/             # 工具函数
│   ├── data/              # 数据文件
│   └── types/             # TypeScript类型
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 开发计划

### 第一阶段：基础搭建
- [ ] 项目初始化（Next.js + TypeScript）
- [ ] 配置 Tailwind CSS 和基础样式
- [ ] 创建基础布局组件
- [ ] 实现响应式导航栏

### 第二阶段：核心页面
- [ ] 首页 Hero Section（视频背景/粒子效果）
- [ ] 关于页面（时间轴展示）
- [ ] 职业生涯页面（数据可视化）
- [ ] 精彩瞬间页面（图片画廊）

### 第三阶段：视觉特效
- [ ] 添加页面过渡动画
- [ ] 实现视差滚动效果
- [ ] 添加粒子动画背景
- [ ] 实现微交互效果

### 第四阶段：优化与完善
- [ ] 性能优化（图片懒加载、代码分割）
- [ ] SEO优化
- [ ] 移动端适配优化
- [ ] 浏览器兼容性测试

## 设计参考

### 灵感来源
- 体育明星官方网站
- 现代作品集网站
- 科技公司官网
- 创意机构网站

### 参考网站
- 运动员个人网站
- 视觉设计作品集
- 现代企业官网

## 技术亮点

1. **性能优化**
   - 图片懒加载和优化
   - 代码分割和按需加载
   - 服务端渲染（SSR）

2. **用户体验**
   - 流畅的动画过渡
   - 响应式设计
   - 无障碍访问支持

3. **视觉效果**
   - 3D元素和动画
   - 粒子系统
   - 高级CSS动画

## 开发环境

### 环境要求
- Node.js 18+
- npm / yarn / pnpm

### 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

### 开发运行
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

### 构建生产版本
```bash
npm run build
npm run start
```

## 相关文档

- **[设计文档](./doc/DESIGN.md)** - 详细的设计规范和视觉指南
- **[技术实现文档](./doc/TECHNICAL.md)** - 技术架构和代码实现
- **[React Bits 使用指南](./doc/REACTBITS_GUIDE.md)** - React Bits 组件库使用指南

## 贡献指南

欢迎提交 Issue 和 Pull Request 来改进这个项目。

## 许可证

MIT License

---

**让孙颖莎的精彩故事以最炫酷的方式呈现！** 🏓✨
