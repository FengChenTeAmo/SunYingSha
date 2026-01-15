'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'
import MediaPlaceholder from '@/components/ui/MediaPlaceholder'

const categories = ['全部', '照片', '视频', '比赛']

export default function HighlightsSection() {
  const [activeCategory, setActiveCategory] = useState('全部')

  return (
    <section
      id="highlights"
      className="relative py-20 md:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
              精彩瞬间
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            记录孙颖莎赛场内外的精彩时刻
          </p>
        </motion.div>

        {/* 分类筛选 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex justify-center space-x-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                activeCategory === category
                  ? 'bg-primary text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* 媒体网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((item) => {
            // 交替显示图片和视频占位符
            const type = item % 3 === 0 ? 'video' : 'image'
            return (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: item * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer group"
              >
                <MediaPlaceholder
                  type={type}
                  index={item}
                  label={type === 'video' ? '精彩视频' : '精彩瞬间'}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
