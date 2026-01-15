'use client'

import { FiImage } from 'react-icons/fi'

interface ImagePlaceholderProps {
  label?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function ImagePlaceholder({
  label = '图片占位符',
  className = '',
  size = 'md',
}: ImagePlaceholderProps) {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  }

  const iconSizes = {
    sm: 24,
    md: 32,
    lg: 48,
  }

  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-lg bg-gradient-to-br from-primary/20 to-gold/20 flex items-center justify-center border-2 border-dashed border-primary/30`}
      >
        <FiImage
          size={iconSizes[size]}
          className="text-primary/60"
        />
      </div>
      <p className="text-sm text-gray-500 font-medium">{label}</p>
    </div>
  )
}
