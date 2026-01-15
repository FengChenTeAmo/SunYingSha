'use client'

import { useState } from 'react'
import ShaderVideoParticle from '@/components/ShaderVideoParticle'

// 示例视频列表（需要替换为实际视频路径）
const videoList = [
  {
    id: 1,
    name: '视频 1',
    src: '/videos/sample1.mp4'
  },
]

export default function GamePage() {
  const [currentVideo, setCurrentVideo] = useState(videoList[0].src)

  const handleVideoChange = (newSrc: string) => {
    setCurrentVideo(newSrc)
  }

  return (
    <div className="min-h-screen bg-black relative">
      {/* GPU Shader 视频粒子特效（高性能版） */}
      <ShaderVideoParticle
        videoSrc={currentVideo}
        width={320}
        height={180}
        particleSize={2}
      />

      {/* 视频选择器 */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-white/10 backdrop-blur-md rounded-lg p-4">
          <h2 className="text-white text-sm mb-2 text-center">选择视频</h2>
          <div className="flex gap-2">
            {videoList.map((video) => (
              <button
                key={video.id}
                onClick={() => handleVideoChange(video.src)}
                className={`px-4 py-2 rounded text-sm transition-colors ${
                  currentVideo === video.src
                    ? 'bg-white/30 text-white'
                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                }`}
              >
                {video.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 说明文字 */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-20">
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-4 max-w-md">
          <p className="text-white/80 text-sm text-center">
            GPU Shader 粒子特效：运动点高亮显示，静止点黑色（使用 GPU Shader + MediaPipe + 运动检测）
          </p>
        </div>
      </div>
    </div>
  )
}
