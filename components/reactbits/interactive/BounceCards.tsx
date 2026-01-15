'use client'

import { motion } from 'framer-motion'

interface BounceCardItem {
  title: string
  content?: string
  value?: string | number
  icon?: string
  image?: string
}

interface BounceCardsProps {
  items: BounceCardItem[]
  className?: string
}

export default function BounceCards({ items, className = '' }: BounceCardsProps) {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {items.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          whileHover={{ 
            scale: 1.05, 
            y: -10,
            transition: { type: 'spring', stiffness: 300 }
          }}
          className="relative bg-white rounded-xl shadow-lg p-6 cursor-pointer overflow-hidden group"
        >
          {/* 背景装饰 */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-gold/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          {/* 内容 */}
          <div className="relative z-10">
            {item.icon && (
              <div className="text-4xl mb-4">{item.icon}</div>
            )}
            {item.image && (
              <div className="w-16 h-16 mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-gold/20" />
            )}
            {item.value && (
              <div className="text-3xl font-bold text-primary mb-2">
                {item.value}
              </div>
            )}
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            {item.content && (
              <p className="text-gray-600 text-sm">{item.content}</p>
            )}
          </div>

          {/* 悬停效果 */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary to-gold transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
        </motion.div>
      ))}
    </div>
  )
}
