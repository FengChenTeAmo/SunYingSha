# 【Three.js + MediaPipe】视频粒子特效：实时运动检测与人物分割技术详解

> **摘要**：本文详细介绍如何使用 Three.js 和 MediaPipe 实现视频粒子特效，通过帧差法进行实时运动检测，结合 MediaPipe Selfie Segmentation 实现人物分割，最终在 GPU 上渲染出运动点标记为红色、静止点标记为黑色的粒子效果。文章包含完整的技术原理、实现步骤和代码示例。

## 📋 目录

- [一、项目概述](#一项目概述)
- [二、技术架构](#二技术架构)
- [三、运动检测技术](#三运动检测技术)
- [四、人物分割技术](#四人物分割技术)
- [五、GPU Shader 渲染](#五gpu-shader-渲染)
- [六、完整代码实现](#六完整代码实现)
- [七、性能优化](#七性能优化)
- [八、总结](#八总结)

---

## 一、项目概述

### 1.1 效果展示

本项目实现了一个基于视频的粒子特效系统，核心功能包括：

- ✅ **实时运动检测**：通过帧差法识别视频中的运动区域
- ✅ **人物分割**：使用 MediaPipe 提取人像区域
- ✅ **GPU 渲染**：Three.js ShaderMaterial 实现高性能粒子渲染
- ✅ **视觉标记**：运动点显示为红色，静止点显示为黑色

### 1.2 核心技术栈

| 技术 | 用途 |
|------|------|
| **Three.js** | 3D 渲染引擎，用于粒子系统 |
| **MediaPipe** | Google 的人像分割解决方案 |
| **帧差法** | 实时运动检测算法 |
| **WebGL Shader** | GPU 渲染优化 |

### 1.3 最终效果

- 运动区域：红色粒子，清晰可见
- 静止区域：黑色粒子，形成对比
- 人物突出：人物区域更靠前（Z = 100）
- 背景虚化：背景区域更靠后（Z = -150）

---

## 二、技术架构

### 2.1 整体架构设计

```
┌─────────────────────────────────────────────────────────────┐
│                     视频输入层                                │
│  HTML5 <video> Element (视频解码)                            │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                     帧提取层                                  │
│  Canvas 2D API: drawImage() + getImageData()                 │
│  输出: Uint8ClampedArray (RGBA 像素数据)                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┴──────────────┐
        │                             │
        ▼                             ▼
┌──────────────────┐        ┌──────────────────┐
│   运动检测模块    │        │   人物分割模块    │
│  (帧差法算法)     │        │  (MediaPipe)     │
└────────┬─────────┘        └────────┬─────────┘
         │                          │
         └──────────┬───────────────┘
                    │
                    ▼
┌─────────────────────────────────────────────────────────────┐
│                   CPU 数据处理层                               │
│  颜色计算、深度设置、运动标记                                  │
│  输出: Float32Array (位置、颜色、标记)                        │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  GPU 数据传输层                                │
│  BufferAttribute (位置、颜色、aIsPerson)                       │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                  GPU Shader 渲染层                             │
│  Vertex Shader + Fragment Shader                             │
│  输出: 粒子系统渲染结果                                        │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 架构设计思路

采用 **CPU 处理 + GPU 渲染** 的混合架构：

**CPU 端负责**：
- 视频帧读取和像素数据处理
- 运动检测计算（帧差法）
- 颜色计算和标记
- MediaPipe 人物分割

**GPU 端负责**：
- 粒子位置变换
- 粒子渲染（Shader）
- 最终画面输出

**设计优势**：
- CPU 端可以执行复杂的逻辑判断（运动检测、阈值判断）
- 可以直接在 JavaScript 中查看和修改数据，便于调试
- 避免在 GPU 上创建大量纹理，减少显存占用
- 容易添加新的处理逻辑（如多帧历史、滤波等）

---

## 三、运动检测技术

### 3.1 帧差法（Frame Difference）原理

#### 什么是帧差法？

帧差法是最基础的运动检测算法，通过比较相邻两帧的像素差异来识别运动区域。其核心思想是：**运动的物体在相邻帧之间会产生像素值的变化**。

#### 数学原理

对于像素位置 `(x, y)`，当前帧 `I_t` 和上一帧 `I_{t-1}` 的差异计算：

```
D(x, y) = |I_t(x, y) - I_{t-1}(x, y)|
```

对于 RGB 彩色图像，需要分别计算三个通道的差异：

```
D_R(x, y) = |R_t(x, y) - R_{t-1}(x, y)|
D_G(x, y) = |G_t(x, y) - G_{t-1}(x, y)|
D_B(x, y) = |B_t(x, y) - B_{t-1}(x, y)|
```

综合运动强度：

```
Motion(x, y) = (D_R + D_G + D_B) / (255 × 3)
```

#### 代码实现

```typescript
// 1. 保存上一帧数据
const previousFrameRef = useRef<Uint8ClampedArray | null>(null)

// 2. 计算当前帧与上一帧的差异
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const index = (y * width + x) * 4  // RGBA 格式，每个像素 4 个字节
    
    // 计算 RGB 三个通道的绝对差值
    const rDiff = Math.abs(frame[index] - previousFrame[index])
    const gDiff = Math.abs(frame[index + 1] - previousFrame[index + 1])
    const bDiff = Math.abs(frame[index + 2] - previousFrame[index + 2])
    
    // 归一化到 [0, 1] 范围
    const motionValue = (rDiff + gDiff + bDiff) / (255 * 3)
    
    // 二值化：超过阈值标记为运动
    const motionThreshold = 0.1
    const motion = motionValue > motionThreshold ? 1.0 : 0.0
    
    motionData[y * width + x] = motion
  }
}

// 3. 保存当前帧作为下一帧的参考
previousFrameRef.current = new Uint8ClampedArray(frame)
```

### 3.2 二值化处理

#### 什么是二值化？

将连续的运动强度值（0-1）转换为只有两个值：0（静止）或 1（运动）。

**使用二值化的原因**：
- **存储效率**：只需要 1 bit 数据（0 或 1），而不是浮点数
- **视觉清晰**：运动区域和静止区域对比明显
- **计算简单**：阈值判断比连续值计算更快

#### 阈值选择策略

```typescript
const motionThreshold = 0.1  // 经验值：10% 的像素变化
```

**阈值调优建议**：
- **0.05-0.08**：高敏感度，适合检测细微运动（如手指动作）
- **0.1-0.15**：平衡模式，适合一般场景（当前使用）
- **0.2-0.3**：低敏感度，只检测明显运动（如大幅动作）

### 3.3 帧差法的特点

**优势**：
1. **算法简单**：实现容易，计算量小
2. **实时性好**：只需要两帧数据，延迟低
3. **内存占用小**：只需要保存一帧历史数据
4. **对光照变化不敏感**：如果光照均匀变化，相邻帧差异小

**局限性**：
1. **对噪声敏感**：视频压缩噪声会被误判为运动
2. **无法处理静止物体**：只能检测"变化"，不能检测"存在"
3. **阈值需要调整**：不同场景需要不同阈值

---

## 四、人物分割技术

### 4.1 MediaPipe Selfie Segmentation 介绍

MediaPipe Selfie Segmentation 是 Google 开发的实时人像分割解决方案，基于深度学习模型，可以在移动设备和浏览器中实时运行。

#### 工作原理

1. **输入**：视频帧（RGB 图像）
2. **模型处理**：
   - 使用轻量级 CNN（卷积神经网络）
   - 输出每个像素属于"人物"的概率（0-1）
3. **输出**：分割掩码（Mask），白色区域 = 人物，黑色区域 = 背景

#### 模型特点

- **轻量级**：模型大小约 2-3MB
- **实时性**：在 CPU 上可达 30+ FPS
- **精度**：对单人场景准确率 >95%
- **鲁棒性**：对光照、角度有一定容忍度

### 4.2 MediaPipe 集成方式

#### 动态导入（避免 SSR 问题）

```typescript
const initMediaPipe = async () => {
  // 动态导入，避免 Next.js SSR 报错
  const { SelfieSegmentation } = await import('@mediapipe/selfie_segmentation')
  
  const segmentation = new SelfieSegmentation({
    locateFile: (file: string) =>
      `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
  })
  
  segmentation.setOptions({
    modelSelection: 1,  // 0 = 通用模型, 1 = 高质量模型
    selfieMode: true    // 自拍模式优化
  })
  
  segmentation.onResults((results) => {
    // results.segmentationMask 是 Canvas 对象
    personMaskRef.current = results.segmentationMask
  })
}
```

#### 节流处理（性能优化）

```typescript
const lastSegTimeRef = useRef<number>(0)
const SEGMENTATION_INTERVAL = 100  // 100ms = 10 FPS

// 在渲染循环中
const now = Date.now()
if (now - lastSegTimeRef.current > SEGMENTATION_INTERVAL) {
  segmentation.send({ image: video })
  lastSegTimeRef.current = now
}
```

**为什么节流到 10 FPS？**
- MediaPipe 处理需要 ~30-50ms
- 人物分割不需要每帧更新（人物位置变化较慢）
- 10 FPS 已经足够流畅

### 4.3 人物识别方式

#### Mask 数据读取

```typescript
// MediaPipe 返回的 mask 是 Canvas 对象
// 需要转换为像素数据
maskCtx.clearRect(0, 0, width, height)
maskCtx.drawImage(personMaskRef.current, 0, 0, width, height)
const maskData = maskCtx.getImageData(0, 0, width, height).data

// Mask 是灰度图，R=G=B，只读取 R 通道
const maskValue = maskData[index]  // 0-255

// 阈值判断：>128 认为是人物
const isPerson = maskValue > 128 ? 1.0 : 0.0
```

---

## 五、GPU Shader 渲染

### 5.1 无纹理架构

#### 什么是无纹理架构？

传统方案使用纹理（Texture）在 GPU 上采样视频和 mask 数据，而当前实现使用 BufferAttribute 直接将数据传递给 GPU。

**传统纹理方案**：
```glsl
// Vertex Shader
uniform sampler2D uVideo;
uniform sampler2D uMask;
varying vec2 vUv;

void main() {
  vec4 videoColor = texture2D(uVideo, uv);
  float mask = texture2D(uMask, uv).r;
  // ...
}
```

**当前无纹理方案**：
```glsl
// Vertex Shader
attribute vec3 color;      // 颜色直接作为 attribute
attribute float aIsPerson; // 人物标记作为 attribute
varying vec3 vColor;

void main() {
  vColor = color;  // 直接使用顶点颜色
  // ...
}
```

#### 无纹理架构的优势

**为什么选择无纹理架构？**
- **灵活性**：CPU 端可以任意修改颜色（运动检测、阈值判断）
- **调试方便**：可以直接在 JavaScript 中查看颜色数据
- **内存优化**：不需要创建 VideoTexture 和 CanvasTexture
- **数据一致性**：颜色和位置数据同步更新

### 5.2 Shader 实现

#### Vertex Shader

```glsl
attribute float aIsPerson;  // 自定义 attribute：人物标记

varying vec3 vColor;         // 传递给 Fragment Shader 的颜色
varying float vIsPerson;     // 传递给 Fragment Shader 的人物标记

void main() {
  // 1. 传递颜色和人物标记到 Fragment Shader
  vColor = color;           // color 是 Three.js 自动注入的（vertexColors: true）
  vIsPerson = aIsPerson;
  
  // 2. 计算顶点位置（标准 Three.js 变换）
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  
  // 3. 设置粒子大小（统一大小，避免视觉变化）
  gl_PointSize = 3.0;
}
```

**关键点解析**：
- `color` attribute：Three.js 在 `vertexColors: true` 时自动注入
- `aIsPerson` attribute：自定义，用于标记人物区域
- `gl_PointSize`：统一设置为 3.0，避免基于亮度或深度的尺寸变化

#### Fragment Shader

```glsl
precision mediump float;  // 精度声明（WebGL 要求）

varying vec3 vColor;      // 从 Vertex Shader 接收的颜色
varying float vIsPerson;  // 从 Vertex Shader 接收的人物标记（未使用）

void main() {
  // 1. 圆形粒子：使用 gl_PointCoord 实现
  vec2 coord = gl_PointCoord - vec2(0.5);  // 将坐标中心化到 (0, 0)
  if (dot(coord, coord) > 0.25) discard;   // 距离中心 > 0.5 的像素丢弃
  
  // 2. 统一透明度
  float alpha = 1.0;
  
  // 3. 直接使用顶点颜色，不做任何调整
  gl_FragColor = vec4(vColor, alpha);
}
```

**圆形粒子实现原理**：
- `gl_PointCoord`：每个粒子内部的纹理坐标（0-1）
- 将坐标中心化：`coord = gl_PointCoord - vec2(0.5)`
- 计算到中心的距离：`distance = dot(coord, coord)`
- 如果距离 > 0.25（半径 0.5 的平方），则丢弃该像素

**为什么使用 `discard` 而不是 `alpha = 0`？**
- `discard` 直接跳过该像素的渲染，性能更好
- `alpha = 0` 仍会执行混合计算，性能较差

### 5.3 BufferAttribute 数据传输

#### 数据结构

```typescript
// 位置数据（每帧更新 Z 轴）
const positions = new Float32Array(count * 3)  // [x, y, z, x, y, z, ...]
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

// 颜色数据（每帧更新，运动点红色，静止点黑色）
const colors = new Float32Array(count * 3)    // [r, g, b, r, g, b, ...]
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

// 人物标记（每帧更新）
const isPerson = new Float32Array(count)       // [0/1, 0/1, ...]
geometry.setAttribute('aIsPerson', new THREE.BufferAttribute(isPerson, 1))
```

#### 数据传输优化

```typescript
// 标记需要更新的 attribute
geometry.attributes.color.needsUpdate = true
geometry.attributes.position.needsUpdate = true
geometry.attributes.aIsPerson.needsUpdate = true
```

**为什么需要 `needsUpdate`？**
- Three.js 会缓存 BufferAttribute 数据
- 只有设置 `needsUpdate = true` 才会将新数据上传到 GPU
- 避免不必要的 GPU 传输

---

## 六、完整代码实现

### 6.1 核心代码片段

#### 运动检测 + 颜色标记

```typescript
// 计算运动强度（与上一帧的差异）
let motionData: Float32Array | null = null
if (previousFrameRef.current) {
  motionData = new Float32Array(width * height)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const index = (y * width + x) * 4
      
      // 计算 RGB 差异
      const rDiff = Math.abs(frame[index] - previousFrameRef.current[index])
      const gDiff = Math.abs(frame[index + 1] - previousFrameRef.current[index + 1])
      const bDiff = Math.abs(frame[index + 2] - previousFrameRef.current[index + 2])
      
      // 运动强度（只有 0 或 1）
      const motionValue = (rDiff + gDiff + bDiff) / (255 * 3)
      const motionThreshold = 0.1
      const motion = motionValue > motionThreshold ? 1.0 : 0.0
      motionData[y * width + x] = motion
    }
  }
}

// 保存当前帧作为下一帧的参考
previousFrameRef.current = new Uint8ClampedArray(frame)

// 更新颜色（运动点标记为红色，静止点降低为黑色）
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const motion = motionData ? motionData[y * width + x] : 0
    
    if (motion === 1.0) {
      // 运动点：标记为红色
      colors[i * 3] = 1.0      // R = 红色
      colors[i * 3 + 1] = 0.0  // G = 0
      colors[i * 3 + 2] = 0.0  // B = 0
    } else {
      // 静止点：降低为黑色
      colors[i * 3] = 0
      colors[i * 3 + 1] = 0
      colors[i * 3 + 2] = 0
    }
    
    // 更新深度
    if (isPersonValue > 0.5) {
      positions[i * 3 + 2] = 100  // 人物固定深度
    } else {
      positions[i * 3 + 2] = -150  // 背景固定深度
    }
    
    i++
  }
}
```

### 6.2 完整组件代码

由于代码较长，完整实现请参考项目仓库。核心文件：
- `components/ShaderVideoParticle.tsx`：主组件实现
- `app/game/page.tsx`：使用示例

---

## 七、性能优化

### 7.1 性能要点

**CPU 端性能**（320×180 分辨率）：
- 运动检测循环：~2-3ms（57,600 次循环）
- 颜色计算循环：~1-2ms
- MediaPipe 处理：~30-50ms（每 100ms 一次，平均 ~3-5ms/帧）

**GPU 端性能**：
- 数据传输：~1-2ms（BufferAttribute 更新）
- Shader 渲染：~1-2ms（57,600 个粒子）

**总延迟**：~4-9ms（60 FPS 下可接受）

### 7.2 已实现的优化

1. ✅ **MediaPipe 节流**：10 FPS 而非 60 FPS
2. ✅ **二值化运动检测**：减少数据量
3. ✅ **统一粒子大小**：减少 Shader 计算
4. ✅ **圆形粒子优化**：使用 `discard` 而非 `alpha`

### 7.3 可选优化方案

1. **Web Workers**：将运动检测移到 Worker 线程
2. **降采样**：降低运动检测分辨率（每 2×2 像素检测一次）
3. **GPU 计算**：使用 Compute Shader（WebGL 2.0）

---

## 八、总结

### 8.1 核心技术总结

| 技术 | 用途 | 特点 |
|------|------|------|
| **帧差法** | 运动检测 | 简单快速，适合实时场景 |
| **MediaPipe** | 人物分割 | 精度高，轻量级，易集成 |
| **Three.js ShaderMaterial** | GPU 渲染 | 性能好，灵活可控 |
| **BufferAttribute** | 数据传输 | 灵活，便于 CPU 端处理 |

### 8.2 关键技术要点

1. **运动检测**：帧差法 + 二值化处理，阈值可调（0.05-0.3）
2. **人物分割**：MediaPipe 动态导入，节流到 10 FPS
3. **GPU 渲染**：无纹理架构，使用 BufferAttribute 传递数据
4. **性能优化**：MediaPipe 节流、二值化、统一粒子大小

### 8.3 适用场景

**适合**：
- ✅ 实时运动可视化
- ✅ 科技风视频特效
- ✅ 运动分析展示
- ✅ 单人场景（MediaPipe 限制）

**不适合**：
- ❌ 多人场景（需要更复杂的分割模型）
- ❌ 需要运动方向追踪（需要光流法）
- ❌ 需要高精度运动分析（需要更复杂的算法）

### 8.4 扩展方向

1. **运动检测增强**：多帧历史、运动方向、运动强度分级
2. **人物分割增强**：多人分割、实时追踪、边界优化
3. **渲染效果增强**：运动轨迹、热力图、3D 效果

---

## 📚 参考资料

- [MediaPipe Selfie Segmentation](https://google.github.io/mediapipe/solutions/selfie_segmentation.html)
- [Three.js ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [Frame Difference Algorithm](https://en.wikipedia.org/wiki/Frame_difference)
- [WebGL Shading Language](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)

---

## 💡 写在最后

本文详细介绍了视频粒子特效的实现技术，包括运动检测、人物分割和 GPU 渲染等核心内容。希望这篇文章能帮助大家理解这些技术，并在自己的项目中应用。

如果文章对你有帮助，欢迎点赞、收藏、关注！如有问题，欢迎在评论区讨论。

---

**标签**：`Three.js` `MediaPipe` `WebGL` `运动检测` `人物分割` `GPU渲染` `视频特效` `前端开发`
