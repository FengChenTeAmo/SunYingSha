'use client'

import { FiImage, FiVideo } from 'react-icons/fi'

interface MediaPlaceholderProps {
  type?: 'image' | 'video'
  label?: string
  index?: number
  className?: string
}

export default function MediaPlaceholder({
  type = 'image',
  label,
  index,
  className = '',
}: MediaPlaceholderProps) {
  const Icon = type === 'video' ? FiVideo : FiImage
  const displayLabel = label || (type === 'video' ? '视频' : '图片')

  return (
    <div
      className={`absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/20 to-gold/30 flex flex-col items-center justify-center gap-4 ${className}`}
    >
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30 shadow-lg">
          <Icon size={40} className="text-white" />
        </div>
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0 h-0 border-l-[12px] border-l-white border-t-[8px] border-t-transparent border-b-[8px] border-b-transparent ml-1" />
          </div>
        )}
      </div>
      <div className="text-center">
        <p className="text-white font-semibold text-lg mb-1">
          {displayLabel}
        </p>
        {index !== undefined && (
          <p className="text-white/80 text-sm">#{index}</p>
        )}
      </div>
      {/* 装饰性图案 */}
      <div className="absolute top-4 right-4 w-16 h-16 border-2 border-white/20 rounded-lg rotate-12" />
      <div className="absolute bottom-4 left-4 w-12 h-12 border-2 border-white/20 rounded-full" />
    </div>
  )
}
