# 视频粒子特效 - 运动检测技术讲解文档

## 一、概述

本文档讲解 `ShaderVideoParticle` 组件的技术实现，包括运动检测、人物分割、GPU Shader 渲染等核心技术，可作为技术学习和使用的参考文档。

### 文档定位

- **技术讲解**：深入讲解各项技术的原理和实现方法
- **使用指南**：提供完整的技术实现步骤和代码示例
- **知识传授**：便于向他人讲解和传授这些技术
- **技术复用**：为后续项目提供可直接使用的技术方案

### 核心技术

- **运动检测**：帧差法实现实时运动识别
- **人物分割**：MediaPipe 实现人像提取
- **GPU 渲染**：Three.js ShaderMaterial 实现粒子渲染
- **数据传递**：BufferAttribute 实现 CPU 到 GPU 的数据传输

### 文档结构

1. **技术架构**：整体设计思路和数据流程
2. **运动检测**：帧差法原理和实现步骤
3. **人物分割**：MediaPipe 集成和使用方法
4. **GPU 渲染**：Shader 编写和 BufferAttribute 使用
5. **关键技术点**：重要技术细节和注意事项
6. **实现参考**：完整代码示例和参数说明

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

#### CPU 处理 + GPU 渲染的混合架构

这种架构将数据处理和渲染分离：

**CPU 端负责**：
- 视频帧读取和像素数据处理
- 运动检测计算（帧差法）
- 颜色计算和标记
- MediaPipe 人物分割

**GPU 端负责**：
- 粒子位置变换
- 粒子渲染（Shader）
- 最终画面输出

**设计原因**：
- CPU 端可以执行复杂的逻辑判断（运动检测、阈值判断）
- 可以直接在 JavaScript 中查看和修改数据，便于调试
- 避免在 GPU 上创建大量纹理，减少显存占用
- 容易添加新的处理逻辑（如多帧历史、滤波等）

**性能表现**（320×180 分辨率）：
- CPU 处理：~2-5ms（运动检测 + 颜色计算）
- GPU 传输：~1-2ms（BufferAttribute 更新）
- GPU 渲染：~1-2ms（Shader 渲染）
- **总延迟**：~4-9ms（60 FPS 下可接受）

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

#### 具体实现

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

**注意事项**：
- 会丢失运动强度信息（无法区分轻微运动 vs 剧烈运动）
- 阈值设置需要根据场景调整

#### 阈值选择策略

```typescript
const motionThreshold = 0.1  // 经验值：10% 的像素变化
```

**阈值调优建议**：
- **0.05-0.08**：高敏感度，适合检测细微运动（如手指动作）
- **0.1-0.15**：平衡模式，适合一般场景（当前使用）
- **0.2-0.3**：低敏感度，只检测明显运动（如大幅动作）

**阈值自适应**（可选优化）：
```typescript
// 根据场景动态调整阈值
const avgMotion = calculateAverageMotion(motionData)
const adaptiveThreshold = avgMotion * 1.5  // 基于平均运动强度调整
```

### 3.3 帧差法的特点

#### 优势

1. **算法简单**：实现容易，计算量小
2. **实时性好**：只需要两帧数据，延迟低
3. **内存占用小**：只需要保存一帧历史数据
4. **对光照变化不敏感**：如果光照均匀变化，相邻帧差异小

#### 局限性

1. **对噪声敏感**：视频压缩噪声会被误判为运动，可能需要降噪处理
2. **无法处理静止物体**：只能检测"变化"，不能检测"存在"
3. **阈值需要调整**：不同场景需要不同阈值
4. **无法区分运动类型**：无法区分前景运动、背景运动、相机运动

### 3.4 其他运动检测方法

#### 常见算法对比

| 算法 | 特点 | 适用场景 |
|------|------|----------|
| **帧差法**（当前使用） | 简单、快速、实时 | 实时运动检测 |
| **光流法**（Optical Flow） | 可追踪方向、精度高，但计算量大 | 运动分析、追踪 |
| **背景减除**（Background Subtraction） | 可检测静止物体，但需要背景建模 | 监控场景 |
| **深度学习**（如 YOLO + 追踪） | 精度高、可识别物体，但计算量大 | 复杂场景分析 |

#### 选择帧差法的原因

1. **实时性要求**：需要 60 FPS 渲染，帧差法延迟最低
2. **简单可靠**：算法简单，不容易出错
3. **资源占用小**：不需要额外的模型或复杂计算
4. **效果满足需求**：对于"运动 vs 静止"的二值化需求足够

## 四、人物分割技术

### 4.1 MediaPipe Selfie Segmentation 介绍

#### 什么是 MediaPipe？

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

### 4.3 MediaPipe 的特点

#### 优势

1. **精度高**：深度学习模型，分割边界准确
2. **实时性好**：轻量级模型，可在浏览器中实时运行
3. **易集成**：MediaPipe 提供现成的 JavaScript API
4. **鲁棒性**：对光照、角度有一定容忍度

#### 注意事项

1. **网络依赖**：需要从 CDN 加载模型文件（首次加载慢）
2. **计算开销**：虽然轻量，但仍需要 ~30-50ms 处理时间
3. **单人限制**：Selfie Segmentation 主要针对单人场景
4. **边界处理**：分割边界可能需要后处理优化

### 4.4 人物识别方式

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

#### 为什么使用 128 作为阈值？

- MediaPipe 输出的 mask 是 8 位灰度图（0-255）
- 128 是中间值，作为二值化阈值
- 可以适当调整（如 100-150）来优化边界效果

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

**性能表现**：

| 方案 | CPU 处理 | GPU 传输 | GPU 渲染 | 总延迟 |
|------|----------|----------|----------|--------|
| **纹理方案** | ~1ms | ~0.5ms | ~2ms | ~3.5ms |
| **无纹理方案**（当前） | ~3ms | ~1.5ms | ~1ms | ~5.5ms |

无纹理方案虽然总延迟略高，但提供了更大的灵活性，适合需要复杂 CPU 端处理的场景。

### 5.2 Shader 实现

#### Vertex Shader 详解

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
- `aIsPerson` attribute：自定义，用于标记人物区域（虽然当前 Fragment Shader 未使用）
- `gl_PointSize`：统一设置为 3.0，避免基于亮度或深度的尺寸变化

#### Fragment Shader 详解

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

#### 什么是 BufferAttribute？

BufferAttribute 是 Three.js 中用于将数据从 CPU 传递到 GPU 的方式。每个粒子可以有多个属性（位置、颜色、标记等），这些属性通过 BufferAttribute 传递给 Shader。

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

#### 传输性能分析

**数据量计算**（320×180 = 57,600 个粒子）：
- 位置数据：57,600 × 3 × 4 bytes = 691.2 KB
- 颜色数据：57,600 × 3 × 4 bytes = 691.2 KB
- 人物标记：57,600 × 1 × 4 bytes = 230.4 KB
- **总传输量**：~1.6 MB/帧

**传输时间**（60 FPS）：
- 每帧传输时间：~1-2ms
- 带宽需求：~96 MB/s（可接受）

## 六、深度设置

### 6.1 固定深度实现

```typescript
// 人物区域：Z = 100（更靠前）
if (isPersonValue > 0.5) {
  positions[i * 3 + 2] = 100
} else {
  // 背景区域：Z = -150（更靠后）
  positions[i * 3 + 2] = -150
}
```

### 6.2 固定深度的特点

#### 为什么使用固定深度？

1. **稳定性**：深度不随亮度变化，避免视觉上的"闪烁"
2. **性能**：不需要计算亮度，减少 CPU 开销
3. **清晰度**：人物和背景层次分明

#### 其他深度方案

| 方案 | 特点 | 适用场景 |
|------|------|----------|
| **固定深度**（当前） | 稳定、性能好 | 简单场景 |
| **基于亮度** | 有层次感，但不稳定 | 艺术效果 |
| **基于深度图** | 真实 3D，但需要深度相机 | 专业应用 |

## 七、性能优化

### 7.1 性能要点

#### CPU 端性能

1. **运动检测循环**：O(width × height)
   - 320×180 = 57,600 次循环
   - 每次循环：3 次减法 + 3 次绝对值 + 1 次除法
   - **耗时**：~2-3ms

2. **颜色计算循环**：O(width × height)
   - 57,600 次循环
   - 每次循环：条件判断 + 颜色赋值
   - **耗时**：~1-2ms

3. **MediaPipe 处理**：~30-50ms（每 100ms 一次）
   - 平均到每帧：~3-5ms

#### GPU 端性能

1. **数据传输**：~1-2ms（BufferAttribute 更新）
2. **Shader 渲染**：~1-2ms（57,600 个粒子）

### 7.2 优化建议

#### 已实现的优化

1. ✅ **MediaPipe 节流**：10 FPS 而非 60 FPS
2. ✅ **二值化运动检测**：减少数据量
3. ✅ **统一粒子大小**：减少 Shader 计算
4. ✅ **圆形粒子优化**：使用 `discard` 而非 `alpha`

#### 可选的进一步优化

1. **Web Workers**：将运动检测移到 Worker 线程
   ```typescript
   // 在 Worker 中计算运动检测
   const worker = new Worker('motion-detection.worker.js')
   worker.postMessage({ frame, previousFrame })
   ```

2. **降采样**：降低运动检测分辨率
   ```typescript
   // 每 2×2 像素检测一次，减少 75% 计算量
   for (let y = 0; y < height; y += 2) {
     for (let x = 0; x < width; x += 2) {
       // 检测逻辑
     }
   }
   ```

3. **GPU 计算**：使用 Compute Shader（WebGL 2.0）
   ```glsl
   // 在 GPU 上计算运动检测
   // 需要 WebGL 2.0 支持
   ```

## 八、技术总结

### 8.1 核心技术栈

| 技术 | 用途 | 特点 |
|------|------|------|
| **帧差法** | 运动检测 | 简单快速，适合实时场景 |
| **MediaPipe** | 人物分割 | 精度高，轻量级，易集成 |
| **Three.js ShaderMaterial** | GPU 渲染 | 性能好，灵活可控 |
| **BufferAttribute** | 数据传输 | 灵活，便于 CPU 端处理 |

### 8.2 关键技术决策

| 设计决策 | 选择 | 原因 |
|----------|------|------|
| **纹理 vs 无纹理** | 无纹理 | 需要 CPU 端复杂处理 |
| **连续值 vs 二值化** | 二值化 | 存储效率 + 视觉清晰 |
| **动态深度 vs 固定深度** | 固定深度 | 稳定性 + 性能 |
| **60 FPS vs 10 FPS MediaPipe** | 10 FPS | 人物分割不需要每帧更新 |

### 8.3 适用场景

**适合的场景**：
- ✅ 实时运动可视化
- ✅ 科技风视频特效
- ✅ 运动分析展示
- ✅ 单人场景（MediaPipe 限制）

**不适合的场景**：
- ❌ 多人场景（需要更复杂的分割模型）
- ❌ 需要运动方向追踪（需要光流法）
- ❌ 需要高精度运动分析（需要更复杂的算法）

## 九、扩展方向

### 9.1 运动检测增强

1. **多帧历史**：使用 3-5 帧历史数据，提高稳定性
2. **运动方向**：使用光流法计算运动方向
3. **运动强度分级**：不使用二值化，保留连续值并分级显示

### 9.2 人物分割增强

1. **多人分割**：使用 MediaPipe Pose 或其他模型
2. **实时追踪**：结合追踪算法，提高分割稳定性
3. **边界优化**：使用形态学操作优化分割边界

### 9.3 渲染效果增强

1. **运动轨迹**：保存多帧运动数据，显示运动轨迹
2. **热力图**：根据运动强度显示颜色渐变
3. **3D 效果**：使用深度图实现真实 3D 效果

## 十、关键技术要点总结

### 10.1 运动检测要点

1. **帧差法核心**：比较相邻两帧的像素差异
2. **二值化处理**：将连续值转换为 0/1，简化计算
3. **阈值选择**：根据场景调整阈值（0.05-0.3）
4. **性能优化**：只保存一帧历史数据，计算量小

### 10.2 人物分割要点

1. **MediaPipe 集成**：动态导入避免 SSR 问题
2. **节流处理**：10 FPS 而非 60 FPS，减少计算开销
3. **Mask 读取**：Canvas 转像素数据，阈值判断（128）
4. **单人限制**：Selfie Segmentation 主要针对单人场景

### 10.3 GPU 渲染要点

1. **无纹理架构**：使用 BufferAttribute 传递数据
2. **Shader 编写**：Vertex Shader 处理位置，Fragment Shader 处理颜色
3. **圆形粒子**：使用 `gl_PointCoord` 和 `discard` 实现
4. **数据更新**：设置 `needsUpdate = true` 触发 GPU 传输

### 10.4 性能优化要点

1. **MediaPipe 节流**：10 FPS 而非 60 FPS
2. **二值化运动检测**：减少数据量
3. **统一粒子大小**：减少 Shader 计算
4. **圆形粒子优化**：使用 `discard` 而非 `alpha`

## 十、参考资料

- [MediaPipe Selfie Segmentation](https://google.github.io/mediapipe/solutions/selfie_segmentation.html)
- [Three.js ShaderMaterial](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [Frame Difference Algorithm](https://en.wikipedia.org/wiki/Frame_difference)
- [WebGL Shading Language](https://www.khronos.org/opengl/wiki/OpenGL_Shading_Language)
