# 视频粒子特效功能文档

## 一、功能概述

### 最终效果

- **原视频内容完整保留**：视频的所有视觉信息通过粒子系统完整呈现
- **数万粒子构成每一帧**：每一帧画面由数万个粒子拼凑而成，形成独特的视觉效果
- **粒子颜色 = 原视频像素颜色**：每个粒子的颜色直接来源于对应位置的视频像素
- **视频播放 = 粒子在"重排"**：视频播放时，粒子位置保持不变，但颜色实时更新，形成动态重排效果
- **交互控制**：支持实时播放、暂停、切换视频等操作

### 视觉效果特点

相比传统的像素化效果，粒子特效具有以下特点：
- **更柔和的视觉效果**：粒子系统使用圆形点状粒子，边缘更柔和
- **动态感更强**：粒子颜色变化形成流动感
- **艺术感更突出**：将视频转化为抽象的艺术表现形式

## 二、安装依赖

### 安装 Three.js

如果项目中使用 npm/yarn：

```bash
npm install three
# 或
yarn add three
```

如果使用 CDN（HTML 版本）：

```html
<script type="importmap">
{
  "imports": {
    "three": "https://cdn.skypack.dev/three@0.158.0"
  }
}
</script>
```

### TypeScript 类型定义（可选）

```bash
npm install --save-dev @types/three
```

## 三、技术架构

### 技术栈

- **Three.js**：3D 图形渲染库，用于创建和管理粒子系统
- **Canvas API**：用于从视频中提取像素数据
- **HTML5 Video**：视频解码和播放
- **requestAnimationFrame**：实现流畅的实时渲染循环

### 技术流程

```
<video> 解码视频帧
        ↓
Canvas 读取 ImageData
        ↓
像素采样（降采样）
        ↓
Three.js Points 粒子
        ↓
requestAnimationFrame 实时更新
```

### 核心原理

1. **视频帧捕获**：使用 Canvas 2D API 的 `drawImage()` 将视频帧绘制到离屏 Canvas
2. **像素数据提取**：通过 `getImageData()` 获取像素的 RGBA 数据
3. **降采样处理**：按步长（STEP）采样像素，减少粒子数量，提高性能
4. **粒子系统创建**：使用 Three.js 的 `Points` 和 `BufferGeometry` 创建粒子系统
5. **实时更新**：在动画循环中持续更新粒子颜色，实现视频播放效果

## 四、实现细节

### 1. 初始化设置

```javascript
const WIDTH = 320      // 视频采样宽度
const HEIGHT = 180     // 视频采样高度
const STEP = 3         // 采样步长（越小粒子越多）
```

**参数说明**：
- `WIDTH / HEIGHT`：控制采样分辨率，影响粒子数量和性能
- `STEP`：采样步长，决定粒子密度
  - STEP = 1：最高密度（约 57,600 个粒子）
  - STEP = 3：中等密度（约 6,400 个粒子）
  - STEP = 5：较低密度（约 2,304 个粒子）

### 2. 场景初始化

```javascript
function init() {
  // 创建场景
  scene = new THREE.Scene()
  
  // 设置相机
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 400
  
  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)
}
```

### 3. 视频处理 Canvas

```javascript
// 创建离屏 Canvas 用于视频帧采样
videoCanvas = document.createElement('canvas')
videoCanvas.width = WIDTH
videoCanvas.height = HEIGHT
videoCtx = videoCanvas.getContext('2d')
```

**为什么使用离屏 Canvas**：
- 不占用页面布局空间
- 可以设置任意分辨率进行采样
- 提高性能，避免重复创建

### 4. 粒子系统创建

```javascript
// 计算粒子数量
const count = Math.floor((WIDTH / STEP) * (HEIGHT / STEP))

// 创建几何体
geometry = new THREE.BufferGeometry()

// 初始化位置和颜色数组
positions = new Float32Array(count * 3)  // x, y, z
colors = new Float32Array(count * 3)     // r, g, b

// 设置粒子位置（网格排列）
let i = 0
for (let y = 0; y < HEIGHT; y += STEP) {
  for (let x = 0; x < WIDTH; x += STEP) {
    positions[i * 3] = x - WIDTH / 2      // x 坐标（居中）
    positions[i * 3 + 1] = HEIGHT / 2 - y // y 坐标（居中，翻转）
    positions[i * 3 + 2] = 0               // z 坐标
    i++
  }
}

// 设置几何体属性
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// 创建材质
material = new THREE.PointsMaterial({
  size: 2,              // 粒子大小
  vertexColors: true    // 启用顶点颜色
})

// 创建粒子系统
particles = new THREE.Points(geometry, material)
scene.add(particles)
```

**关键点**：
- 使用 `BufferGeometry` 和 `BufferAttribute` 提高性能
- 位置坐标居中处理，使粒子在屏幕中心显示
- Y 轴翻转，匹配 Canvas 坐标系

### 5. 实时更新循环

```javascript
function animate() {
  requestAnimationFrame(animate)

  // 检查视频是否已加载
  if (video.readyState >= 2) {
    // 将当前视频帧绘制到 Canvas
    videoCtx.drawImage(video, 0, 0, WIDTH, HEIGHT)
    
    // 获取像素数据
    const frame = videoCtx.getImageData(0, 0, WIDTH, HEIGHT).data

    // 更新粒子颜色
    let i = 0
    for (let y = 0; y < HEIGHT; y += STEP) {
      for (let x = 0; x < WIDTH; x += STEP) {
        const index = (y * WIDTH + x) * 4  // RGBA 索引
        colors[i * 3] = frame[index] / 255         // R
        colors[i * 3 + 1] = frame[index + 1] / 255 // G
        colors[i * 3 + 2] = frame[index + 2] / 255 // B
        i++
      }
    }

    // 标记颜色属性需要更新
    geometry.attributes.color.needsUpdate = true
  }

  // 渲染场景
  renderer.render(scene, camera)
}
```

**性能优化**：
- 只在颜色变化时设置 `needsUpdate = true`
- 使用 `requestAnimationFrame` 实现流畅动画
- 降采样减少粒子数量

## 五、完整代码实现

### 基础版本

```javascript
import * as THREE from 'https://cdn.skypack.dev/three@0.158.0'

let scene, camera, renderer
let particles, geometry, material
let video, videoCanvas, videoCtx
let positions, colors

const WIDTH = 320
const HEIGHT = 180
const STEP = 3 // 越小粒子越多

init()
animate()

function init() {
  scene = new THREE.Scene()

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
  camera.position.z = 400

  renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  document.body.appendChild(renderer.domElement)

  // video
  video = document.getElementById('video')

  videoCanvas = document.createElement('canvas')
  videoCanvas.width = WIDTH
  videoCanvas.height = HEIGHT
  videoCtx = videoCanvas.getContext('2d')

  const count = Math.floor((WIDTH / STEP) * (HEIGHT / STEP))
  geometry = new THREE.BufferGeometry()

  positions = new Float32Array(count * 3)
  colors = new Float32Array(count * 3)

  let i = 0
  for (let y = 0; y < HEIGHT; y += STEP) {
    for (let x = 0; x < WIDTH; x += STEP) {
      positions[i * 3] = x - WIDTH / 2
      positions[i * 3 + 1] = HEIGHT / 2 - y
      positions[i * 3 + 2] = 0
      i++
    }
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  material = new THREE.PointsMaterial({
    size: 2,
    vertexColors: true
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)

  window.addEventListener('resize', onResize)
}

function animate() {
  requestAnimationFrame(animate)

  if (video.readyState >= 2) {
    videoCtx.drawImage(video, 0, 0, WIDTH, HEIGHT)
    const frame = videoCtx.getImageData(0, 0, WIDTH, HEIGHT).data

    let i = 0
    for (let y = 0; y < HEIGHT; y += STEP) {
      for (let x = 0; x < WIDTH; x += STEP) {
        const index = (y * WIDTH + x) * 4
        colors[i * 3] = frame[index] / 255
        colors[i * 3 + 1] = frame[index + 1] / 255
        colors[i * 3 + 2] = frame[index + 2] / 255
        i++
      }
    }

    geometry.attributes.color.needsUpdate = true
  }

  renderer.render(scene, camera)
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}
```

### React/Next.js 版本（推荐）

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface VideoParticleProps {
  videoSrc: string
  width?: number
  height?: number
  step?: number
  particleSize?: number
}

export default function VideoParticle({
  videoSrc,
  width = 320,
  height = 180,
  step = 3,
  particleSize = 2
}: VideoParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const geometryRef = useRef<THREE.BufferGeometry | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return

    // 初始化 Three.js
    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      1,
      1000
    )
    camera.position.z = 400
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 创建视频 Canvas
    const videoCanvas = document.createElement('canvas')
    videoCanvas.width = width
    videoCanvas.height = height
    const videoCtx = videoCanvas.getContext('2d')!

    // 创建粒子系统
    const count = Math.floor((width / step) * (height / step))
    const geometry = new THREE.BufferGeometry()
    geometryRef.current = geometry

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    let i = 0
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        positions[i * 3] = x - width / 2
        positions[i * 3 + 1] = height / 2 - y
        positions[i * 3 + 2] = 0
        i++
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
      size: particleSize,
      vertexColors: true
    })

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    particlesRef.current = particles

    // 动画循环
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate)

      const video = videoRef.current
      if (video && video.readyState >= 2) {
        videoCtx.drawImage(video, 0, 0, width, height)
        const frame = videoCtx.getImageData(0, 0, width, height).data

        let i = 0
        for (let y = 0; y < height; y += step) {
          for (let x = 0; x < width; x += step) {
            const index = (y * width + x) * 4
            colors[i * 3] = frame[index] / 255
            colors[i * 3 + 1] = frame[index + 1] / 255
            colors[i * 3 + 2] = frame[index + 2] / 255
            i++
          }
        }

        geometry.attributes.color.needsUpdate = true
      }

      renderer.render(scene, camera)
    }

    animate()

    // 窗口大小调整
    const handleResize = () => {
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
      geometry.dispose()
      material.dispose()
    }
  }, [width, height, step, particleSize])

  return (
    <div className="relative w-full h-screen">
      <div ref={containerRef} className="absolute inset-0" />
      <video
        ref={videoRef}
        src={videoSrc}
        className="hidden"
        autoPlay
        loop
        muted
        playsInline
      />
    </div>
  )
}
```

## 六、功能扩展

### 1. 播放控制

```typescript
const [isPlaying, setIsPlaying] = useState(false)

const togglePlay = () => {
  if (videoRef.current) {
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }
}
```

### 2. 视频切换

```typescript
const [currentVideo, setCurrentVideo] = useState(videoSrc)

const changeVideo = (newSrc: string) => {
  if (videoRef.current) {
    videoRef.current.src = newSrc
    videoRef.current.load()
    setCurrentVideo(newSrc)
  }
}
```

### 3. 参数调节

```typescript
interface Controls {
  step: number        // 粒子密度
  particleSize: number // 粒子大小
  width: number       // 采样宽度
  height: number      // 采样高度
}

// 实时调节参数
const updateParams = (controls: Partial<Controls>) => {
  // 重新初始化粒子系统
}
```

### 4. 性能优化

```typescript
// 使用 Web Workers 处理像素数据（可选）
// 降低采样分辨率
// 使用 LOD（细节层次）根据距离调整粒子数量
// 使用 OffscreenCanvas（如果支持）
```

## 七、性能考虑

### 粒子数量计算

```
粒子数量 = (WIDTH / STEP) × (HEIGHT / STEP)
```

**性能参考**：
- < 5,000 粒子：流畅（60 FPS）
- 5,000 - 15,000 粒子：良好（30-60 FPS）
- > 15,000 粒子：可能卡顿（< 30 FPS）

### 优化建议

1. **降低采样分辨率**：减少 WIDTH 和 HEIGHT
2. **增加采样步长**：增大 STEP 值
3. **减少粒子大小**：较小的粒子渲染更快
4. **使用 WebGL 优化**：确保使用硬件加速
5. **限制帧率**：使用 `setTimeout` 或节流控制更新频率

## 八、使用示例

### HTML 版本

```html
<!DOCTYPE html>
<html>
<head>
  <title>视频粒子特效</title>
  <style>
    body {
      margin: 0;
      overflow: hidden;
      background: #000;
    }
    #video {
      display: none;
    }
  </style>
</head>
<body>
  <video id="video" src="your-video.mp4" autoplay loop muted></video>
  <script type="module">
    // 在这里引入上面的 JavaScript 代码
  </script>
</body>
</html>
```

### Next.js 页面集成

```typescript
// app/game/page.tsx
import VideoParticle from '@/components/VideoParticle'

export default function GamePage() {
  return (
    <div className="min-h-screen bg-black">
      <VideoParticle
        videoSrc="/videos/sample.mp4"
        width={320}
        height={180}
        step={3}
        particleSize={2}
      />
    </div>
  )
}
```

## 九、常见问题

### Q1: 视频不显示或粒子为黑色？

**A**: 检查视频是否已加载完成，确保 `video.readyState >= 2`，并添加视频加载事件监听。

### Q2: 性能问题？

**A**: 
- 减少粒子数量（增大 STEP 或降低分辨率）
- 检查浏览器是否启用硬件加速
- 使用 Chrome 或 Edge 浏览器（WebGL 支持更好）

### Q3: 粒子位置不对？

**A**: 检查坐标计算，确保 Y 轴翻转正确，位置居中计算正确。

### Q4: 如何添加交互效果？

**A**: 可以添加鼠标交互，让粒子跟随鼠标移动或产生涟漪效果。

## 十、后续优化方向

1. **3D 效果**：添加 Z 轴深度，根据像素亮度调整粒子位置
2. **物理效果**：添加粒子运动、重力、碰撞等物理效果
3. **过渡动画**：视频切换时的粒子过渡效果
4. **音效同步**：根据音频频谱调整粒子效果
5. **多视频支持**：同时处理多个视频源
6. **后处理效果**：添加模糊、发光等后处理效果

## 十一、参考资料

- [Three.js 官方文档](https://threejs.org/docs/)
- [Canvas API 文档](https://developer.mozilla.org/zh-CN/docs/Web/API/Canvas_API)
- [WebGL 最佳实践](https://developer.mozilla.org/zh-CN/docs/Web/API/WebGL_API/WebGL_best_practices)
