'use client'

import { motion } from 'framer-motion'

interface PieData {
  label: string
  value: number
  color: string
}

interface PieChartProps {
  data: PieData[]
  title?: string
}

export default function PieChart({ data, title = '数据分布' }: PieChartProps) {
  const total = data.reduce((sum, item) => sum + item.value, 0)
  
  let currentAngle = -90 // 从顶部开始

  return (
    <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/20">
      <h3 className="text-2xl font-bold mb-6 text-center text-white">{title}</h3>
      
      <div className="flex flex-col md:flex-row items-center gap-8">
        {/* 饼图 */}
        <div className="relative w-64 h-64">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {data.map((item, index) => {
              const percentage = (item.value / total) * 100
              const angle = (percentage / 100) * 360
              const largeArcFlag = angle > 180 ? 1 : 0
              
              const x1 = 100 + 100 * Math.cos((currentAngle * Math.PI) / 180)
              const y1 = 100 + 100 * Math.sin((currentAngle * Math.PI) / 180)
              
              const x2 = 100 + 100 * Math.cos(((currentAngle + angle) * Math.PI) / 180)
              const y2 = 100 + 100 * Math.sin(((currentAngle + angle) * Math.PI) / 180)
              
              const pathData = [
                `M 100 100`,
                `L ${x1} ${y1}`,
                `A 100 100 0 ${largeArcFlag} 1 ${x2} ${y2}`,
                `Z`,
              ].join(' ')
              
              currentAngle += angle
              
              return (
                <motion.path
                  key={index}
                  d={pathData}
                  fill={item.color}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  whileHover={{ scale: 1.05, transformOrigin: '100 100' }}
                />
              )
            })}
          </svg>
        </div>

        {/* 图例 */}
        <div className="space-y-3">
          {data.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-3"
            >
              <div
                className="w-4 h-4 rounded"
                style={{ background: item.color }}
              />
              <span className="text-white text-sm">{item.label}</span>
              <span className="text-gray-300 text-sm">
                ({((item.value / total) * 100).toFixed(1)}%)
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
