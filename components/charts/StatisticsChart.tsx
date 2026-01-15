'use client'

import { motion } from 'framer-motion'
import { useState } from 'react'

interface ChartData {
  year: string
  value: number
}

interface StatisticsChartProps {
  data: ChartData[]
  title?: string
  color?: string
}

export default function StatisticsChart({
  data,
  title = '成绩趋势',
  color = '#DC143C',
}: StatisticsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const maxValue = Math.max(...data.map(d => d.value))
  const minValue = Math.min(...data.map(d => d.value))
  const range = maxValue - minValue || 1

  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
      <h3 className="text-2xl font-bold mb-6 text-center text-white">{title}</h3>
      
      <div className="relative h-64 flex items-end justify-between gap-2">
        {data.map((item, index) => {
          const height = ((item.value - minValue) / range) * 100
          
          return (
            <motion.div
              key={item.year}
              className="flex-1 flex flex-col items-center group cursor-pointer"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* 柱状图 */}
              <motion.div
                className="w-full rounded-t-lg relative"
                style={{
                  height: `${height}%`,
                  background: `linear-gradient(to top, ${color}, ${color}CC)`,
                }}
                whileHover={{ scale: 1.05 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {/* 数值标签 */}
                {hoveredIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-white text-gray-900 px-2 py-1 rounded text-sm font-semibold whitespace-nowrap"
                  >
                    {item.value}
                  </motion.div>
                )}
              </motion.div>
              
              {/* 年份标签 */}
              <div className="mt-2 text-xs text-gray-300">{item.year}</div>
            </motion.div>
          )
        })}
      </div>

      {/* 图例 */}
      <div className="mt-6 flex items-center justify-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ background: color }} />
          <span className="text-sm text-gray-300">成绩</span>
        </div>
      </div>
    </div>
  )
}
