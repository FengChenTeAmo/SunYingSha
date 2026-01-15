'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

interface ShaderVideoParticleProps {
  videoSrc: string
  width?: number
  height?: number
  particleSize?: number
  className?: string
}

// Vertex Shader（简化版，不使用纹理）
// 注意：Three.js 在使用 vertexColors: true 时会自动注入 color attribute
const vertexShader = `
attribute float aIsPerson;

varying vec3 vColor;
varying float vIsPerson;

void main() {
  vColor = color;
  vIsPerson = aIsPerson;

  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // 统一粒子尺寸，避免视觉上的颜色变化
  gl_PointSize = 3.0;
}
`

// Fragment Shader（简化版，不使用纹理）
const fragmentShader = `
precision mediump float;

varying vec3 vColor;
varying float vIsPerson;

void main() {
  // 圆形粒子（可选，更柔和）
  vec2 coord = gl_PointCoord - vec2(0.5);
  if (dot(coord, coord) > 0.25) discard;

  // 统一透明度，避免颜色视觉变化
  float alpha = 1.0;

  // 直接使用顶点颜色，不做任何调整
  gl_FragColor = vec4(vColor, alpha);
}
`

export default function ShaderVideoParticle({
  videoSrc,
  width = 320,
  height = 180,
  particleSize = 2,
  className = ''
}: ShaderVideoParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const particlesRef = useRef<THREE.Points | null>(null)
  const geometryRef = useRef<THREE.BufferGeometry | null>(null)
  const materialRef = useRef<THREE.ShaderMaterial | null>(null)
  const animationFrameRef = useRef<number>()
  const videoCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const maskCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const maskCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const colorsRef = useRef<Float32Array | null>(null)
  const positionsRef = useRef<Float32Array | null>(null)
  const isPersonRef = useRef<Float32Array | null>(null)
  const segmentationRef = useRef<any>(null)
  const personMaskRef = useRef<HTMLCanvasElement | null>(null)
  const lastSegTimeRef = useRef<number>(0)
  const previousFrameRef = useRef<Uint8ClampedArray | null>(null) // 保存上一帧用于运动检测

  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasMask, setHasMask] = useState(false)

  useEffect(() => {
    if (!containerRef.current || !videoRef.current) return


    // 动态导入 MediaPipe（仅在客户端）
    const initMediaPipe = async () => {
      try {
        const { SelfieSegmentation } = await import('@mediapipe/selfie_segmentation')
        
        const segmentation = new SelfieSegmentation({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`
        })

        segmentation.setOptions({
          modelSelection: 1 // 0：近景人像，1：全身
        })

        segmentation.onResults((results: any) => {
          if (results.segmentationMask) {
            personMaskRef.current = results.segmentationMask
            setHasMask(true)
            console.log('MediaPipe mask 已更新')
          }
        })

        segmentationRef.current = segmentation
        console.log('MediaPipe 初始化成功')
      } catch (err) {
        console.warn('MediaPipe 不可用，将使用基础粒子效果')
      }
    }

    initMediaPipe()

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
      setError('无法创建视频 Canvas 上下文')
      return
    }
    videoCanvasRef.current = videoCanvas
    videoCtxRef.current = videoCtx

    // 创建 mask Canvas
    const maskCanvas = document.createElement('canvas')
    maskCanvas.width = width
    maskCanvas.height = height
    const maskCtx = maskCanvas.getContext('2d', { willReadFrequently: true })
    if (!maskCtx) {
      setError('无法创建 Mask Canvas 上下文')
      return
    }
    maskCanvasRef.current = maskCanvas
    maskCtxRef.current = maskCtx

    // 创建粒子系统（一次性创建，不再更新位置）
    const count = width * height
    console.log(`创建 GPU Shader 粒子系统: ${count} 个粒子 (${width}x${height})`)
    const geometry = new THREE.BufferGeometry()
    geometryRef.current = geometry

    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const isPerson = new Float32Array(count)

    let i = 0
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        positions[i * 3] = x - width / 2
        positions[i * 3 + 1] = height / 2 - y
        positions[i * 3 + 2] = 0

        // 初始化颜色为白色
        colors[i * 3] = 1
        colors[i * 3 + 1] = 1
        colors[i * 3 + 2] = 1

        // 初始化人物标记为 0（背景）
        isPerson[i] = 0

        i++
      }
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
    geometry.setAttribute('aIsPerson', new THREE.BufferAttribute(isPerson, 1))

    colorsRef.current = colors
    positionsRef.current = positions
    isPersonRef.current = isPerson

    // 创建 ShaderMaterial（不使用纹理）
    // 注意：Three.js 在使用 vertexColors: true 时会自动注入 color attribute
    const material = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader,
      fragmentShader,
      transparent: true,
      depthTest: true,
      depthWrite: false,
      vertexColors: true,
      side: THREE.DoubleSide
    })
    materialRef.current = material

    const particles = new THREE.Points(geometry, material)
    scene.add(particles)
    particlesRef.current = particles

    // 视频加载事件
    const video = videoRef.current
    const handleLoadedData = () => {
      console.log('视频数据已加载')
      setIsLoading(false)
      setError(null)
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = (e: Event) => {
      const videoError = video.error
      let errorMessage = '视频加载失败，请检查视频路径'
      if (videoError) {
        switch (videoError.code) {
          case videoError.MEDIA_ERR_ABORTED:
            errorMessage = '视频加载被中止'
            break
          case videoError.MEDIA_ERR_NETWORK:
            errorMessage = '网络错误，无法加载视频'
            break
          case videoError.MEDIA_ERR_DECODE:
            errorMessage = '视频解码失败'
            break
          case videoError.MEDIA_ERR_SRC_NOT_SUPPORTED:
            errorMessage = '视频格式不支持'
            break
        }
      }
      setError(errorMessage)
      setIsLoading(false)
    }

    video.addEventListener('loadeddata', handleLoadedData)
    video.addEventListener('canplay', handleCanPlay)
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
        } catch (err: any) {
          if (err?.message?.includes('Aborted') || err?.message?.includes('Module')) {
            console.warn('MediaPipe 运行时错误，将使用基础粒子效果')
            segmentationRef.current = null
          }
        }
      }
    }

    // 动画循环
    function animate() {
      animationFrameRef.current = requestAnimationFrame(animate)

      const videoCtx = videoCtxRef.current
      const camera = cameraRef.current
      const renderer = rendererRef.current
      const scene = sceneRef.current
      const video = videoRef.current
      const geometry = geometryRef.current

      // 始终渲染场景
      if (renderer && scene && camera) {
        // 更新分割（低频）
        if (video && !video.paused && video.readyState >= 2) {
          updateSegmentation(video)
        }

        // 更新粒子数据（CPU 端处理，不使用纹理）
        if (video && video.readyState >= 2 && videoCtx && geometry && colorsRef.current && positionsRef.current && isPersonRef.current) {
          try {
            // 绘制视频帧
            videoCtx.drawImage(video, 0, 0, width, height)
            const frame = videoCtx.getImageData(0, 0, width, height).data

            // 计算运动强度（与上一帧的差异）
            let motionData: Float32Array | null = null
            if (previousFrameRef.current) {
              motionData = new Float32Array(width * height)
              for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                  const index = (y * width + x) * 4
                  const prevIndex = index
                  
                  // 计算 RGB 差异
                  const rDiff = Math.abs(frame[index] - previousFrameRef.current[prevIndex])
                  const gDiff = Math.abs(frame[index + 1] - previousFrameRef.current[prevIndex + 1])
                  const bDiff = Math.abs(frame[index + 2] - previousFrameRef.current[prevIndex + 2])
                  
                  // 运动强度（只有 0 或 1）
                  const motionValue = (rDiff + gDiff + bDiff) / (255 * 3)
                  const motionThreshold = 0.1  // 运动阈值
                  const motion = motionValue > motionThreshold ? 1.0 : 0.0
                  motionData[y * width + x] = motion
                }
              }
            }
            
            // 保存当前帧作为下一帧的参考
            previousFrameRef.current = new Uint8ClampedArray(frame)

            // 获取 mask 数据
            let maskData: Uint8ClampedArray | null = null
            const maskCtx = maskCtxRef.current
            if (personMaskRef.current && maskCtx) {
              const mask = personMaskRef.current
              maskCtx.clearRect(0, 0, width, height)
              maskCtx.drawImage(mask, 0, 0, width, height)
              maskData = maskCtx.getImageData(0, 0, width, height).data
            }

            const colors = colorsRef.current
            const positions = positionsRef.current
            const isPerson = isPersonRef.current

            let i = 0
            for (let y = 0; y < height; y++) {
              for (let x = 0; x < width; x++) {
                const index = (y * width + x) * 4

                const r = frame[index] / 255
                const g = frame[index + 1] / 255
                const b = frame[index + 2] / 255

                // 判断是否为人像区域
                const isPersonValue = maskData && maskData[index] > 128 ? 1.0 : 0.0
                isPerson[i] = isPersonValue

                // 获取运动强度（只有 0 或 1，0 表示静止，1 表示运动）
                const motion = motionData ? motionData[y * width + x] : 0

                // 更新颜色（运动点标记为红色，静止点降低为黑色）
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

                // 更新深度（简化，不使用亮度计算，避免规律性变化）
                if (isPersonValue > 0.5) {
                  positions[i * 3 + 2] = 100  // 人物固定深度
                } else {
                  positions[i * 3 + 2] = -150  // 背景固定深度
                }

                i++
              }
            }

            geometry.attributes.color.needsUpdate = true
            geometry.attributes.position.needsUpdate = true
            geometry.attributes.aIsPerson.needsUpdate = true

            // 调试信息：统计运动点（每 60 帧输出一次）
            if (Math.random() < 0.016 && motionData) {
              let motionCount = 0
              for (let idx = 0; idx < motionData.length; idx++) {
                if (motionData[idx] === 1.0) {
                  motionCount++
                }
              }
              console.log('运动检测统计:', {
                totalParticles: motionData.length,
                motionParticles: motionCount,
                motionRatio: (motionCount / motionData.length * 100).toFixed(1) + '%',
                motionType: '二值化（0=静止，1=运动）'
              })
            }
          } catch (err) {
            if (err instanceof Error && !err.message.includes('cross-origin')) {
              console.warn('视频帧处理错误:', err)
            }
          }
        }

        renderer.render(scene, camera)
      }
    }

    animate()

    // 窗口大小调整
    const handleResize = () => {
      const camera = cameraRef.current
      const renderer = rendererRef.current
      if (!camera || !renderer) return
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener('resize', handleResize)

    // 清理
    return () => {
      const video = videoRef.current
      if (video) {
        video.removeEventListener('loadeddata', handleLoadedData)
        video.removeEventListener('canplay', handleCanPlay)
        video.removeEventListener('error', handleError)
      }
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
        try {
          segmentationRef.current.close()
        } catch (err) {
          console.warn('关闭分割器失败:', err)
        }
      }
    }
  }, [width, height, particleSize])

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
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 z-10">
          <div className="text-white text-lg mb-2">加载中...</div>
          <div className="text-white/60 text-sm">正在初始化 GPU Shader 和 MediaPipe</div>
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
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex flex-col items-center gap-2">
          <button
            onClick={togglePlay}
            className="px-6 py-2 bg-white/20 backdrop-blur-sm text-white rounded-lg hover:bg-white/30 transition-colors"
          >
            {isPlaying ? '暂停' : '播放'}
          </button>
          <div className="text-white/60 text-xs text-center">
            {hasMask ? '✓ Shader + MediaPipe 已就绪（无纹理模式）' : '⏳ 等待 MediaPipe 初始化...'}
          </div>
        </div>
      )}
    </div>
  )
}
