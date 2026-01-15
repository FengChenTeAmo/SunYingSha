# Three.js 粒子视频（人物更清晰进阶方案）

## 一、目标效果

将原始视频整体粒子化呈现，并实现：

✅ **人物区域**：粒子更密 / 更清晰 / 更靠前

✅ **背景区域**：粒子更稀 / 更虚 / 有漂浮感

✅ **视频内容与运动完全一致**

✅ **Web 实时渲染**（非离线）

### 适合场景

- 科技风视频展示
- AI / 数字人 / Web 首页视觉
- 人物粒子消散 / 聚合转场

## 二、技术选型

| 模块 | 技术 |
|------|------|
| 视频解码 | HTML5 `<video>` |
| 帧采样 | Canvas 2D |
| 粒子渲染 | Three.js（Points） |
| 人物识别 | MediaPipe Selfie Segmentation |
| 渲染方式 | requestAnimationFrame |

## 三、整体技术架构

```
Video
  ↓
Canvas 获取视频帧
  ↓
MediaPipe 生成人像 Mask
  ↓
粒子系统（单一）
  ├─ 人物区域：高密度粒子
  └─ 背景区域：低密度粒子
```

⚠️ **关键原则**：
- 只使用一套粒子系统，通过 mask 控制表现

## 四、核心实现步骤

### 1️⃣ 引入 MediaPipe Selfie Segmentation

```html
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/selfie_segmentation.js"></script>
```

或使用 npm：

```bash
npm install @mediapipe/selfie_segmentation
```

### 2️⃣ 初始化人像分割器

```javascript
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'

const segmentation = new SelfieSegmentation({
  locateFile: file =>
    `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
})

segmentation.setOptions({
  modelSelection: 1 // 0：近景人像，1：全身
})

let personMask = null

segmentation.onResults(results => {
  personMask = results.segmentationMask
})
```

### 3️⃣ 视频帧送入分割模型（节流）

⚠️ **不需要每一帧分割**

```javascript
let lastSegTime = 0

async function updateSegmentation(video) {
  if (!video.videoWidth) return

  const now = performance.now()
  if (now - lastSegTime > 100) { // 约 10 FPS
    await segmentation.send({ image: video })
    lastSegTime = now
  }
}
```

在 `animate()` 中调用：

```javascript
updateSegmentation(video)
```

## 五、人物 / 背景粒子差异化（核心代码）

```javascript
videoCtx.drawImage(video, 0, 0, WIDTH, HEIGHT)
const frame = videoCtx.getImageData(0, 0, WIDTH, HEIGHT).data

let maskData = null
if (personMask) {
  videoCtx.drawImage(personMask, 0, 0, WIDTH, HEIGHT)
  maskData = videoCtx.getImageData(0, 0, WIDTH, HEIGHT).data
}

let i = 0
for (let y = 0; y < HEIGHT; y += STEP) {
  for (let x = 0; x < WIDTH; x += STEP) {
    const index = (y * WIDTH + x) * 4

    const r = frame[index] / 255
    const g = frame[index + 1] / 255
    const b = frame[index + 2] / 255

    const isPerson = maskData && maskData[index] > 128

    // 粒子颜色
    colors[i * 3] = r
    colors[i * 3 + 1] = g
    colors[i * 3 + 2] = b

    // Z 轴层次（人物更靠前）
    if (isPerson) {
      positions[i * 3 + 2] = 20
    } else {
      positions[i * 3 + 2] = -20 + Math.random() * 10
    }

    i++
  }
}

geometry.attributes.color.needsUpdate = true
geometry.attributes.position.needsUpdate = true
```

## 六、增强人物清晰度的关键技巧

### ✅ 1. 粒子密度差异（推荐）

**人物区域**：`STEP = 2 ~ 3`

**背景区域**：`STEP = 5 ~ 8`

（进阶可用 Shader 动态控制）

### ✅ 2. 粒子大小区分

```javascript
material.size = isPerson ? 3.2 : 1.2
```

⚠️ **PointsMaterial 是全局 size**

真正进阶需要 `ShaderMaterial`

### ✅ 3. 亮度决定深度（增强立体感）

```javascript
const brightness = (r + g + b) / 3
positions[i * 3 + 2] += brightness * 20
```

### ✅ 4. 动态采样步长（进阶）

```javascript
// 根据 mask 动态调整采样
const step = isPerson ? 2 : 6

// 但这需要重新构建粒子系统，性能开销大
// 推荐：使用固定步长，通过其他方式增强
```

## 七、完整实现示例（React/Next.js）

```typescript
'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation'

interface AdvancedVideoParticleProps {
  videoSrc: string
  width?: number
  height?: number
  step?: number
  particleSize?: number
  personStep?: number // 人物区域步长
  backgroundStep?: number // 背景区域步长
}

export default function AdvancedVideoParticle({
  videoSrc,
  width = 320,
  height = 180,
  step = 3,
  particleSize = 2,
  personStep = 2,
  backgroundStep = 6
}: AdvancedVideoParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const geometryRef = useRef<THREE.BufferGeometry | null>(null)
  const materialRef = useRef<THREE.PointsMaterial | null>(null)
  const animationFrameRef = useRef<number>()
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const colorsRef = useRef<Float32Array | null>(null)
  const positionsRef = useRef<Float32Array | null>(null)
  const segmentationRef = useRef<SelfieSegmentation | null>(null)
  const personMaskRef = useRef<HTMLCanvasElement | null>(null)
  const lastSegTimeRef = useRef<number>(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return

    // 初始化 MediaPipe
    const segmentation = new SelfieSegmentation({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
    })

    segmentation.setOptions({
      modelSelection: 1 // 0：近景人像，1：全身
    })

    segmentation.onResults((results) => {
      if (results.segmentationMask) {
        personMaskRef.current = results.segmentationMask
      }
    })

    segmentationRef.current = segmentation

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
    renderer.setClearColor(0x000000, 1)
    containerRef.current.appendChild(renderer.domElement)
    rendererRef.current = renderer

    // 创建视频 Canvas
    const videoCanvas = document.createElement('canvas')
    videoCanvas.width = width
    videoCanvas.height = height
    const videoCtx = videoCanvas.getContext('2d', { willReadFrequently: true })
    if (!videoCtx) {
      setError('无法创建 Canvas 上下文')
      return
    }
    videoCanvasRef.current = videoCanvas
    videoCtxRef.current = videoCtx

    // 创建粒子系统
    const count = Math.floor((width / step) * (height / step))
    const geometry = new THREE.BufferGeometry()
    geometryRef.current = geometry

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    colorsRef.current = colors
    positionsRef.current = positions

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
      vertexColors: true,
      transparent: false
    })
    materialRef.current = material

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    particlesRef.current = particles

    // 视频加载事件
    const video = videoRef.current
    const handleLoadedData = () => {
      setIsLoading(false)
      setError(null)
    }

    const handleError = (e: Event) => {
      setError('视频加载失败，请检查视频路径')
      setIsLoading(false)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('error', handleError)

    // 更新分割（节流）
    async function updateSegmentation(video: HTMLVideoElement) {
      if (!video.videoWidth || !segmentationRef.current) return

      const now = performance.now()
      if (now - lastSegTimeRef.current > 100) {
        // 约 10 FPS
        try {
          await segmentationRef.current.send({ image: video })
          lastSegTimeRef.current = now
        } catch (err) {
          console.warn('分割失败:', err)
        }
      }
    }

    // 动画循环
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate)

      if (video && video.readyState >= 2 && videoCtx && !video.paused) {
        try {
          // 更新分割（低频）
          updateSegmentation(video)

          // 绘制视频帧
          videoCtx.drawImage(video, 0, 0, width, height)
          const frame = videoCtx.getImageData(0, 0, width, height).data

          // 获取 mask 数据
          let maskData: Uint8ClampedArray | null = null
          if (personMaskRef.current && videoCtx) {
            videoCtx.drawImage(personMaskRef.current, 0, 0, width, height)
            maskData = videoCtx.getImageData(0, 0, width, height).data
          }

          let i = 0
          for (let y = 0; y < height; y += step) {
            for (let x = 0; x < width; x += step) {
              const index = (y * width + x) * 4

              const r = frame[index] / 255
              const g = frame[index + 1] / 255
              const b = frame[index + 2] / 255

              // 判断是否为人像区域
              const isPerson = maskData && maskData[index] > 128

              // 更新颜色
              colors[i * 3] = r
              colors[i * 3 + 1] = g
              colors[i * 3 + 2] = b

              // 更新深度
              if (isPerson) {
                // 人物区域：更靠前，更稳定
                const brightness = (r + g + b) / 3
                positions[i * 3 + 2] = 20 + brightness * 10
              } else {
                // 背景区域：更靠后，有漂浮感
                const time = Date.now() * 0.001
                positions[i * 3 + 2] = -20 + Math.sin(time + i) * 10
              }

              i++
            }
          }

          geometry.attributes.color.needsUpdate = true
          geometry.attributes.position.needsUpdate = true
        } catch (err) {
          if (err instanceof Error && !err.message.includes('cross-origin')) {
            console.warn('视频帧处理错误:', err)
          }
        }
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
      video.removeEventListener('loadeddata', handleLoadedData)
      video.removeEventListener('error', handleError)
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
      if (segmentationRef.current) {
        segmentationRef.current.close()
      }
    }
  }, [width, height, step, particleSize, personStep, backgroundStep])

  // 处理视频源变化
  useEffect(() => {
    if (videoRef.current && videoRef.current.src !== videoSrc) {
      setIsLoading(true)
      setError(null)
      setIsPlaying(false)
      videoRef.current.src = videoSrc
      videoRef.current.load()
    }
  }, [videoSrc])

  // 播放控制
  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
        setIsPlaying(false)
      } else {
        videoRef.current.play().catch((err) => {
          console.error('播放失败:', err)
          setError('视频播放失败，可能需要用户交互')
          setIsPlaying(false)
        })
        setIsPlaying(true)
      }
    }
  }

  // 监听视频播放状态
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [])

  return (
    <div className={`relative w-full h-screen ${className}`}>
      <div ref={containerRef} className="absolute inset-0" />
      <video
        ref={videoRef}
        src={videoSrc}
        className="hidden"
        loop
        muted
        playsInline
        preload="auto"
      />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-10">
          <div className="text-white text-lg">加载中...</div>
        </div>
      )}

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
          <div className="text-red-400 text-center px-4">
            <p className="text-lg mb-2">错误</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {!isLoading && !error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={togglePlay}
            className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            {isPlaying ? '暂停' : '播放'}
          </button>
        </div>
      )}
    </div>
  )
}
```

## 八、性能优化建议（非常重要）

| 问题 | 解决方案 |
|------|----------|
| 分割太慢 | 分割 ≤ 10 FPS（节流） |
| 粒子太多 | 降低视频采样分辨率（width/height） |
| GPU 卡顿 | 使用 ShaderMaterial 替代 PointsMaterial |
| 轮廓抖动 | mask 阈值 + 模糊处理 |
| 内存占用 | 及时释放 MediaPipe 资源 |

### 优化技巧

1. **分割频率控制**
   ```javascript
   // 每 100ms 分割一次（约 10 FPS）
   if (now - lastSegTime > 100) {
     await segmentation.send({ image: video })
   }
   ```

2. **降低采样分辨率**
   ```javascript
   // 使用较小的 width/height
   width = 240  // 而不是 640
   height = 135 // 而不是 360
   ```

3. **使用 ShaderMaterial（进阶）**
   ```javascript
   // 可以动态控制每个粒子的大小
   const material = new THREE.ShaderMaterial({
     uniforms: { ... },
     vertexShader: `...`,
     fragmentShader: `...`
   })
   ```

## 九、常见错误（避坑）

### ❌ 每帧都做人像分割

```javascript
// 错误：性能杀手
function animate() {
  segmentation.send({ image: video }) // 每帧都分割
}
```

### ✅ 低频分割 + 高频渲染

```javascript
// 正确：节流分割
let lastSegTime = 0
function animate() {
  if (now - lastSegTime > 100) {
    segmentation.send({ image: video })
  }
  // 高频渲染粒子
}
```

### ❌ 人物 / 背景两套粒子

```javascript
// 错误：性能差，难以同步
const personParticles = new THREE.Points(...)
const bgParticles = new THREE.Points(...)
```

### ✅ 一套粒子 + mask 控制

```javascript
// 正确：单一粒子系统
const particles = new THREE.Points(...)
// 通过 mask 判断，动态调整属性
```

### ❌ 直接用 mask 当 alpha

```javascript
// 错误：mask 是灰度图，需要阈值判断
const isPerson = maskData[index] // 0-255 的值
```

### ✅ 使用阈值判断人物区域

```javascript
// 正确：阈值判断
const isPerson = maskData[index] > 128 // 阈值 128
```

## 十、可扩展方向（下一步）

### 🎯 人物粒子消散 / 聚合

```javascript
// 根据时间或交互，让人物粒子逐渐消散
if (isPerson && isDissolving) {
  positions[i * 3 + 2] += dissolveOffset
  // 或改变粒子大小
}
```

### 🎯 鼠标 / 手势干扰粒子

```javascript
// 鼠标位置影响粒子
const mouseInfluence = calculateMouseInfluence(mouseX, mouseY, x, y)
positions[i * 3 + 2] += mouseInfluence
```

### 🎯 Shader GPU 粒子（10 万级）

```javascript
// 使用 ShaderMaterial 实现 GPU 加速
// 可以处理 10 万+ 粒子
const material = new THREE.ShaderMaterial({
  // GPU 计算粒子属性
})
```

### 🎯 Vue3 / React 组件封装

```vue
<template>
  <AdvancedVideoParticle
    :video-src="videoSrc"
    :width="320"
    :height="180"
    :step="3"
  />
</template>
```

## 十一、安装依赖

```bash
# MediaPipe Selfie Segmentation
npm install @mediapipe/selfie_segmentation

# Three.js（如果还没有）
npm install three @types/three
```

## 十二、注意事项

1. **MediaPipe 需要网络加载模型文件**
   - 首次使用需要下载模型（约 2-3 MB）
   - 建议使用 CDN 或本地缓存

2. **浏览器兼容性**
   - Chrome/Edge: ✅ 完全支持
   - Firefox: ✅ 支持
   - Safari: ⚠️ 可能需要额外配置

3. **性能考虑**
   - 分割模型在 CPU 上运行，可能较慢
   - 建议在高端设备上使用
   - 移动端可能需要降低分割频率

4. **隐私和安全**
   - MediaPipe 在本地运行，不会上传数据
   - 但需要用户授权摄像头（如果使用实时视频）

## 十三、总结

这是一个"视频不变、渲染方式完全改变"的粒子系统方案。

**核心思想**：
- MediaPipe 只负责告诉你：**哪里是人**
- Three.js 负责：**如何渲染粒子**
- 通过 mask 控制：**人物和背景的差异化表现**

**关键优势**：
- ✅ 人物更清晰、更突出
- ✅ 背景有漂浮感、更虚化
- ✅ 实时渲染，无需离线处理
- ✅ 单一粒子系统，性能优化

**适用场景**：
- 科技风视频展示
- AI / 数字人演示
- Web 首页视觉特效
- 人物粒子转场动画
