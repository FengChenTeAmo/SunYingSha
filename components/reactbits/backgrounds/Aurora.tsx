'use client'

import { useEffect, useRef } from 'react'

interface AuroraProps {
  className?: string
  colors?: string[]
}

export default function Aurora({ 
  className = '', 
  colors = ['#DC143C', '#FFD700', '#00D9FF'] 
}: AuroraProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const draw = () => {
      time += 0.005
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient1 = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient1.addColorStop(0, colors[0] + '40')
      gradient1.addColorStop(0.5, colors[1] + '30')
      gradient1.addColorStop(1, colors[2] + '40')

      const gradient2 = ctx.createLinearGradient(canvas.width, 0, 0, canvas.height)
      gradient2.addColorStop(0, colors[2] + '30')
      gradient2.addColorStop(0.5, colors[0] + '40')
      gradient2.addColorStop(1, colors[1] + '30')

      // 绘制流动的渐变
      for (let i = 0; i < 3; i++) {
        ctx.save()
        ctx.globalAlpha = 0.6
        ctx.fillStyle = i % 2 === 0 ? gradient1 : gradient2
        
        const x = (canvas.width / 2) + Math.sin(time + i) * (canvas.width / 3)
        const y = (canvas.height / 2) + Math.cos(time + i * 0.5) * (canvas.height / 3)
        const radius = 200 + Math.sin(time * 2 + i) * 50

        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [colors])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full ${className}`}
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
