# 图片资源目录

## 目录结构

```
images/
├── hero/              # 首页英雄区图片
│   └── hero-bg.jpg
├── about/             # 关于页面图片
│   └── profile.jpg
├── career/            # 职业生涯图片
│   ├── 2015.jpg
│   ├── 2017.jpg
│   ├── 2019.jpg
│   ├── 2021.jpg
│   └── 2023.jpg
├── matches/            # 比赛图片
│   ├── match1.jpg
│   ├── match2.jpg
│   ├── match3.jpg
│   ├── match4.jpg
│   └── match5.jpg
├── highlights/         # 精彩瞬间
│   ├── highlight1.jpg
│   ├── highlight2.jpg
│   ├── highlight3.jpg
│   ├── highlight4.jpg
│   ├── highlight5.jpg
│   ├── highlight6.jpg
│   ├── thumb1.jpg
│   ├── thumb2.jpg
│   ├── video1-thumb.jpg
│   └── video2-thumb.jpg
└── medals/            # 奖牌和荣誉
    ├── gold.jpg
    ├── silver.jpg
    └── certificate.jpg
```

## 图片要求

### 尺寸建议
- **Hero 背景**: 1920x1080 或更大
- **个人照片**: 800x1000 或类似比例
- **比赛图片**: 1200x800 或类似比例
- **缩略图**: 400x400 或 400x300
- **奖牌图片**: 600x600

### 格式要求
- 优先使用 WebP 格式（更好的压缩）
- 备选 JPG/PNG 格式
- 确保图片已优化（文件大小合理）

## 图片来源建议

### 合法来源
1. **官方渠道**
   - 中国乒乓球协会官网
   - 国际乒联官网
   - 奥运会官方图片库

2. **新闻媒体**
   - 新华社
   - 人民日报
   - 体育类新闻网站

3. **图片库**
   - Unsplash（免费，但可能没有特定人物）
   - Pexels（免费）
   - 注意：需要确认版权和使用许可

### 注意事项
⚠️ **版权警告**：
- 确保使用的图片有合法使用权
- 商业用途需要获得授权
- 个人展示网站建议使用官方或授权图片
- 避免使用受版权保护的图片

## 图片优化

使用 Next.js Image 组件会自动优化图片，但建议：
- 压缩图片文件大小
- 使用适当的尺寸
- 考虑使用 CDN 加速

## 占位符

当前使用占位符，替换为真实图片后，组件会自动显示。
