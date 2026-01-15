'use client'

import { useEffect, useRef } from 'react'

interface BeamsProps {
  className?: string
  color?: string
}

export default function Beams({ 
  className = '', 
  color = '#00D9FF' 
}: BeamsProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const beams: Array<{
      x: number
      y: number
      angle: number
      length: number
      speed: number
    }> = []

    // 创建光束
    for (let i = 0; i < 5; i++) {
      beams.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        angle: Math.random() * Math.PI * 2,
        length: 100 + Math.random() * 200,
        speed: 0.5 + Math.random() * 0.5,
      })
    }

    const animate = () => {
      beams.forEach((beam) => {
        beam.x += Math.cos(beam.angle) * beam.speed
        beam.y += Math.sin(beam.angle) * beam.speed

        if (beam.x < 0 || beam.x > window.innerWidth) beam.angle = Math.PI - beam.angle
        if (beam.y < 0 || beam.y > window.innerHeight) beam.angle = -beam.angle
      })

      // 更新 DOM
      container.innerHTML = beams
        .map(
          (beam) => `
        <div
          class="absolute pointer-events-none"
          style="
            left: ${beam.x}px;
            top: ${beam.y}px;
            width: ${beam.length}px;
            height: 2px;
            background: linear-gradient(90deg, transparent, ${color}80, transparent);
            transform: rotate(${beam.angle}rad);
            transform-origin: left center;
          "
        ></div>
      `
        )
        .join('')

      requestAnimationFrame(animate)
    }

    animate()
  }, [color])

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-hidden ${className}`}
    />
  )
}
