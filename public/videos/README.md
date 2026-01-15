# 视频文件目录

## 说明

此目录用于存放视频粒子特效所需的视频文件。

## 使用方法

1. 将视频文件（建议使用 MP4 格式）放置在此目录下
2. 在 `app/game/page.tsx` 中更新 `videoList` 数组，添加视频路径

## 视频要求

- **格式**：推荐 MP4 (H.264 编码)
- **大小**：建议每个视频不超过 50MB（可根据实际情况调整）
- **分辨率**：建议 720p 或 1080p
- **时长**：建议 10-60 秒（可根据需求调整）

## 示例

```
public/
└── videos/
    ├── sample1.mp4
    ├── sample2.mp4
    └── sample3.mp4
```

然后在 `app/game/page.tsx` 中：

```typescript
const videoList = [
  {
    id: 1,
    name: '视频 1',
    src: '/videos/sample1.mp4'
  },
  {
    id: 2,
    name: '视频 2',
    src: '/videos/sample2.mp4'
  },
  {
    id: 3,
    name: '视频 3',
    src: '/videos/sample3.mp4'
  }
]
```

## 注意事项

1. 视频文件不会被 Git 跟踪（已在 .gitignore 中排除）
2. 确保视频文件路径正确
3. 如果视频无法加载，检查浏览器控制台的错误信息
