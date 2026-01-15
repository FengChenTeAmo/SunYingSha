'use client'

import { useEffect, useRef } from 'react'

interface BlobCursorProps {
  size?: number
  color?: string
  blur?: number
}

export default function BlobCursor({ 
  size = 50, 
  color = '#DC143C',
  blur = 20 
}: BlobCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cursor = cursorRef.current
    if (!cursor) return

    let mouseX = 0
    let mouseY = 0
    let currentX = 0
    let currentY = 0

    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.1
      currentY += (mouseY - currentY) * 0.1

      cursor.style.left = `${currentX}px`
      cursor.style.top = `${currentY}px`

      requestAnimationFrame(updateCursor)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    window.addEventListener('mousemove', handleMouseMove)
    updateCursor()

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-50 mix-blend-difference"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: `-${size / 2}px`,
        marginTop: `-${size / 2}px`,
        background: `radial-gradient(circle, ${color}80, ${color}40)`,
        borderRadius: '50%',
        filter: `blur(${blur}px)`,
        transition: 'transform 0.1s ease-out',
      }}
    />
  )
}
