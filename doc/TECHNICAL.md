# 技术实现文档 - 孙颖莎人物志网站

## 技术架构

### 项目初始化

#### 使用 Next.js 14 (App Router)
```bash
npx create-next-app@latest sun-yingsha-biography --typescript --tailwind --app
```

#### 核心依赖
```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "framer-motion": "^10.16.0",
    "gsap": "^3.12.2",
    "react-icons": "^4.11.0",
    "swiper": "^10.3.0",
    "react-player": "^2.13.0",
    "aos": "^2.3.4",
    "@react-three/fiber": "^8.15.0",
    "@react-three/drei": "^9.88.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "typescript": "^5.2.0",
    "tailwindcss": "^3.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0"
  }
}
```

### React Bits 组件库集成

[React Bits](https://reactbits.dev/) 是一个提供 110+ 炫酷动画组件的开源库，非常适合创建视觉冲击力强的网站。

#### 安装方式

React Bits 组件可以直接从官网复制代码，或通过 npm 安装（如果提供）：

```bash
# 访问 https://reactbits.dev/get-started/index
# 选择需要的组件，复制代码到项目中
```

#### 推荐使用的组件

**背景组件：**
- `Aurora` - 极光背景效果
- `Beams` - 光束背景
- `Ballpit` - 球池背景
- `Balatro` - 卡片背景

**动画组件：**
- `Animated Content` - 内容动画
- `Animated List` - 列表动画
- `Antigravity` - 反重力动画效果

**文本动画：**
- `ASCIIText` - ASCII 艺术文本
- `Blur Text` - 模糊文本效果

**交互组件：**
- `Blob Cursor` - 斑点光标跟随效果
- `Bounce Cards` - 弹跳卡片
- `Card Swap` - 卡片交换动画
- `Card Nav` - 卡片导航
- `Bubble Menu` - 气泡菜单

**其他组件：**
- `Carousel` - 轮播组件

#### 使用示例

```typescript
// 示例：使用 Aurora 背景
import { Aurora } from '@/components/reactbits/aurora';

export const HeroSection = () => {
  return (
    <div className="relative h-screen">
      <Aurora />
      <div className="relative z-10">
        {/* 内容 */}
      </div>
    </div>
  );
};

// 示例：使用 Blob Cursor
import { BlobCursor } from '@/components/reactbits/blob-cursor';

export const Page = () => {
  return (
    <>
      <BlobCursor />
      {/* 页面内容 */}
    </>
  );
};

// 示例：使用 Bounce Cards
import { BounceCards } from '@/components/reactbits/bounce-cards';

export const CareerSection = () => {
  const cards = [
    { title: '世界排名', value: '第1名' },
    { title: '总冠军', value: 'XX个' },
  ];
  
  return <BounceCards items={cards} />;
};
```

## 核心组件设计

### 1. 布局组件

#### Navigation（导航栏）
```typescript
// src/components/layout/Navigation.tsx
- 透明背景，滚动后固定
- 毛玻璃效果（backdrop-blur）
- 平滑滚动锚点
- 移动端汉堡菜单
```

#### Footer（页脚）
```typescript
// src/components/layout/Footer.tsx
- 社交媒体链接
- 版权信息
- 返回顶部按钮
```

### 2. 动画组件

#### ParticleBackground（粒子背景）
```typescript
// src/components/animations/ParticleBackground.tsx
- 使用 Canvas 或 Three.js
- 粒子形成乒乓球轨迹
- 鼠标交互效果
- 性能优化（限制粒子数量）
```

#### ScrollReveal（滚动显示）
```typescript
// src/components/animations/ScrollReveal.tsx
- 基于 Intersection Observer
- 支持多种动画类型
- 延迟和持续时间配置
```

#### PageTransition（页面过渡）
```typescript
// src/components/animations/PageTransition.tsx
- 使用 Framer Motion
- 淡入淡出效果
- 滑动过渡效果
```

### 3. UI 组件

#### AnimatedCounter（动画计数器）
```typescript
// src/components/ui/AnimatedCounter.tsx
- 数字从0开始计数到目标值
- 使用 GSAP 或 Framer Motion
- 支持格式化（千分位、单位等）
```

#### Timeline（时间轴）
```typescript
// src/components/ui/Timeline.tsx
- 垂直时间轴布局
- 左右交替卡片
- 滚动触发动画
- 响应式设计
```

#### MediaGallery（媒体画廊）
```typescript
// src/components/ui/MediaGallery.tsx
- Masonry 瀑布流布局
- 图片懒加载
- 灯箱效果
- 视频播放支持
```

#### DataChart（数据图表）
```typescript
// src/components/ui/DataChart.tsx
- 使用 Recharts 或 Chart.js
- 支持多种图表类型
- 动画效果
- 响应式设计
```

### 4. 页面区块组件

#### HeroSection（首页英雄区）
```typescript
// src/components/sections/HeroSection.tsx
- 使用 React Bits 的 Aurora 或 Beams 背景
- 大标题动画（使用 Animated Content）
- 副标题打字机效果（使用 ASCIIText 或 Blur Text）
- 滚动提示动画
- 可选：Blob Cursor 光标特效
```

#### AboutSection（关于区块）
```typescript
// src/components/sections/AboutSection.tsx
- 使用 React Bits 的 Card Swap 或 Bounce Cards
- 个人简介（Animated Content）
- 关键信息展示（卡片网格布局）
```

#### CareerSection（职业生涯区块）
```typescript
// src/components/sections/CareerSection.tsx
- 使用 React Bits 的 Bounce Cards 展示数据统计
- 重要比赛列表（Animated List）
- 荣誉展示墙（Card Nav 或 Carousel）
```

#### HighlightsSection（精彩瞬间区块）
```typescript
// src/components/sections/HighlightsSection.tsx
- 使用 React Bits 的 Carousel 或 Card Swap
- 媒体画廊（瀑布流布局）
- 筛选功能（Bubble Menu）
- 灯箱查看
```

## 关键技术实现

### 1. 视频背景实现

```typescript
// src/components/animations/VideoBackground.tsx
import { useEffect, useRef } from 'react';

export const VideoBackground = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8; // 慢速播放
    }
  }, []);

  return (
    <div className="fixed inset-0 z-0">
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
      >
        <source src={src} type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-black/40" /> {/* 遮罩层 */}
    </div>
  );
};
```

### 2. 粒子动画实现

```typescript
// src/components/animations/ParticleSystem.tsx
import { useEffect, useRef } from 'react';

export const ParticleSystem = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 设置画布大小
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // 粒子类
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
        this.color = `rgba(220, 20, 60, ${Math.random() * 0.5 + 0.5})`;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    // 创建粒子
    const particles: Particle[] = [];
    for (let i = 0; i < 100; i++) {
      particles.push(new Particle());
    }

    // 动画循环
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
};
```

### 3. 滚动动画实现

```typescript
// src/components/animations/ScrollReveal.tsx
import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ScrollRevealProps {
  children: React.ReactNode;
  direction?: 'up' | 'down' | 'left' | 'right';
  delay?: number;
}

export const ScrollReveal = ({
  children,
  direction = 'up',
  delay = 0,
}: ScrollRevealProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const variants = {
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 50 : direction === 'down' ? -50 : 0,
      x: direction === 'left' ? 50 : direction === 'right' ? -50 : 0,
    },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: {
        duration: 0.6,
        delay,
        ease: 'easeOut',
      },
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isVisible ? 'visible' : 'hidden'}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};
```

### 4. 数字计数动画

```typescript
// src/components/ui/AnimatedCounter.tsx
import { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export const AnimatedCounter = ({
  value,
  duration = 2,
  suffix = '',
  prefix = '',
}: AnimatedCounterProps) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView || !ref.current) return;

    const start = 0;
    const end = value;
    const startTime = Date.now();

    const animate = () => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const progress = Math.min(elapsed / duration, 1);

      // 缓动函数
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const current = Math.floor(start + (end - start) * easeOutQuart);

      if (ref.current) {
        ref.current.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }, [isInView, value, duration, prefix, suffix]);

  return (
    <span ref={ref} className="font-bold text-4xl">
      {prefix}0{suffix}
    </span>
  );
};
```

### 5. 3D卡片翻转

```typescript
// src/components/ui/FlipCard.tsx
import { useState } from 'react';
import { motion } from 'framer-motion';

interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
}

export const FlipCard = ({ front, back }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div
      className="w-full h-96 perspective-1000"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
    >
      <motion.div
        className="relative w-full h-full preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 backface-hidden">
          {front}
        </div>
        <div className="absolute inset-0 backface-hidden rotate-y-180">
          {back}
        </div>
      </motion.div>
    </div>
  );
};
```

## React Bits 组件使用指南

### 组件获取方式

1. **访问官网**：https://reactbits.dev/get-started/index
2. **浏览组件**：选择需要的组件类别（背景、动画、文本、交互等）
3. **复制代码**：点击组件查看详情，复制代码到项目中
4. **自定义样式**：根据项目需求调整颜色、尺寸等参数

### 组件目录结构

```
src/
├── components/
│   ├── reactbits/          # React Bits 组件目录
│   │   ├── backgrounds/    # 背景组件
│   │   │   ├── Aurora.tsx
│   │   │   ├── Beams.tsx
│   │   │   ├── Ballpit.tsx
│   │   │   └── Balatro.tsx
│   │   ├── animations/     # 动画组件
│   │   │   ├── AnimatedContent.tsx
│   │   │   ├── AnimatedList.tsx
│   │   │   └── Antigravity.tsx
│   │   ├── text/           # 文本动画
│   │   │   ├── ASCIIText.tsx
│   │   │   └── BlurText.tsx
│   │   ├── interactive/   # 交互组件
│   │   │   ├── BlobCursor.tsx
│   │   │   ├── BounceCards.tsx
│   │   │   ├── CardSwap.tsx
│   │   │   ├── CardNav.tsx
│   │   │   └── BubbleMenu.tsx
│   │   └── carousel/       # 轮播组件
│   │       └── Carousel.tsx
```

### 实际应用场景

#### 1. 首页 Hero 区域

```typescript
// src/components/sections/HeroSection.tsx
import { Aurora } from '@/components/reactbits/backgrounds/Aurora';
import { BlobCursor } from '@/components/reactbits/interactive/BlobCursor';
import { ASCIIText } from '@/components/reactbits/text/ASCIIText';

export const HeroSection = () => {
  return (
    <section className="relative h-screen overflow-hidden">
      {/* 极光背景 */}
      <Aurora />
      
      {/* 光标特效（可选） */}
      <BlobCursor />
      
      {/* 内容层 */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <h1 className="text-6xl font-bold mb-4">
          <ASCIIText text="孙颖莎" />
        </h1>
        <p className="text-2xl">世界冠军 · 乒乓球运动员</p>
      </div>
    </section>
  );
};
```

#### 2. 关于页面 - 卡片展示

```typescript
// src/components/sections/AboutSection.tsx
import { BounceCards } from '@/components/reactbits/interactive/BounceCards';

export const AboutSection = () => {
  const cards = [
    {
      title: '个人简介',
      content: '孙颖莎，中国乒乓球运动员...',
      image: '/images/about/intro.jpg',
    },
    {
      title: '成长历程',
      content: '2015年进入国家队...',
      image: '/images/about/career.jpg',
    },
  ];

  return (
    <section className="py-20">
      <BounceCards items={cards} />
    </section>
  );
};
```

#### 3. 职业生涯 - 数据统计

```typescript
// src/components/sections/CareerSection.tsx
import { BounceCards } from '@/components/reactbits/interactive/BounceCards';
import { AnimatedList } from '@/components/reactbits/animations/AnimatedList';

export const CareerSection = () => {
  const stats = [
    { label: '世界排名', value: '第1名', icon: '🏆' },
    { label: '总冠军', value: 'XX个', icon: '🥇' },
    { label: '胜率', value: 'XX%', icon: '📊' },
  ];

  return (
    <section className="py-20">
      <BounceCards items={stats} />
      
      <div className="mt-20">
        <AnimatedList items={matches} />
      </div>
    </section>
  );
};
```

#### 4. 精彩瞬间 - 轮播展示

```typescript
// src/components/sections/HighlightsSection.tsx
import { Carousel } from '@/components/reactbits/carousel/Carousel';
import { BubbleMenu } from '@/components/reactbits/interactive/BubbleMenu';

export const HighlightsSection = () => {
  const categories = ['全部', '照片', '视频', '比赛'];
  const mediaItems = [/* ... */];

  return (
    <section className="py-20">
      <BubbleMenu items={categories} />
      
      <div className="mt-10">
        <Carousel items={mediaItems} />
      </div>
    </section>
  );
};
```

#### 5. 背景装饰

```typescript
// 在页面中使用不同的背景效果
import { Beams } from '@/components/reactbits/backgrounds/Beams';
import { Ballpit } from '@/components/reactbits/backgrounds/Ballpit';

// 光束背景 - 适合数据展示页面
<Beams className="absolute inset-0" />

// 球池背景 - 适合活泼的页面
<Ballpit className="absolute inset-0" />
```

### 样式定制

React Bits 组件通常使用 Tailwind CSS，可以轻松自定义：

```typescript
// 示例：自定义 Aurora 背景颜色
<Aurora 
  className="opacity-80"
  colors={['#DC143C', '#FFD700', '#00D9FF']} // 中国红、金色、霓虹蓝
/>

// 示例：自定义 Blob Cursor
<BlobCursor 
  size={50}
  color="#DC143C"
  blur={20}
/>
```

### 性能优化建议

1. **按需加载**：只导入需要的组件
2. **代码分割**：使用动态导入加载 React Bits 组件
3. **减少重渲染**：使用 React.memo 包装组件
4. **控制动画数量**：避免同时运行过多动画

```typescript
// 动态导入示例
import dynamic from 'next/dynamic';

const Aurora = dynamic(() => import('@/components/reactbits/backgrounds/Aurora'), {
  ssr: false, // 背景动画通常不需要 SSR
});
```

## 数据管理

### 数据结构设计

```typescript
// src/types/index.ts

export interface CareerEvent {
  year: number;
  title: string;
  description: string;
  image?: string;
  video?: string;
}

export interface MatchResult {
  id: string;
  tournament: string;
  date: string;
  location: string;
  result: string;
  medal?: 'gold' | 'silver' | 'bronze';
  image?: string;
}

export interface Statistic {
  label: string;
  value: number;
  unit?: string;
  icon?: string;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title?: string;
  description?: string;
  category?: string;
}
```

### 数据文件

```typescript
// src/data/career.ts
export const careerEvents: CareerEvent[] = [
  {
    year: 2015,
    title: '进入国家队',
    description: '...',
    image: '/images/career/2015.jpg',
  },
  // ...
];

// src/data/matches.ts
export const matches: MatchResult[] = [
  // ...
];

// src/data/statistics.ts
export const statistics: Statistic[] = [
  {
    label: '世界排名',
    value: 1,
    icon: 'trophy',
  },
  // ...
];
```

## 性能优化策略

### 1. 图片优化

```typescript
// 使用 Next.js Image 组件
import Image from 'next/image';

<Image
  src="/images/photo.jpg"
  alt="描述"
  width={800}
  height={600}
  loading="lazy"
  placeholder="blur"
  className="rounded-lg"
/>
```

### 2. 代码分割

```typescript
// 动态导入组件
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>加载中...</div>,
  ssr: false, // 如果不需要SSR
});
```

### 3. 动画性能优化

```css
/* 使用 transform 和 opacity，避免触发重排 */
.animated-element {
  will-change: transform, opacity;
  transform: translateZ(0); /* 开启硬件加速 */
}
```

## SEO 优化

### 1. Metadata 配置

```typescript
// app/layout.tsx 或 pages/_document.tsx
export const metadata = {
  title: '孙颖莎 - 世界冠军 | 人物志',
  description: '孙颖莎个人官方网站，展示职业生涯、成就和精彩瞬间',
  keywords: '孙颖莎, 乒乓球, 世界冠军, 奥运会',
  openGraph: {
    title: '孙颖莎 - 世界冠军',
    description: '...',
    images: ['/og-image.jpg'],
  },
};
```

### 2. 结构化数据

```typescript
// src/components/SEO/StructuredData.tsx
export const StructuredData = () => {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: '孙颖莎',
    jobTitle: '乒乓球运动员',
    // ...
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
};
```

## 部署配置

### Vercel 部署（推荐）

1. 连接 GitHub 仓库
2. 自动构建和部署
3. 环境变量配置
4. 自定义域名

### 其他部署选项

- Netlify
- AWS Amplify
- 自建服务器（Docker）

## 开发工具配置

### ESLint 配置

```json
// .eslintrc.json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended"
  ],
  "rules": {
    "@typescript-eslint/no-unused-vars": "warn"
  }
}
```

### Prettier 配置

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

---

**技术实现目标：高性能、可维护、可扩展的现代化网站！** 🚀💻
