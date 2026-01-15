'use client'

import { motion } from 'framer-motion'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import Beams from '@/components/reactbits/backgrounds/Beams'
import StatisticsChart from '@/components/charts/StatisticsChart'
import PieChart from '@/components/charts/PieChart'
import { statistics } from '@/data/statistics'
import { yearlyStats, matchTypeStats } from '@/data/chart-data'

export default function StatisticsSection() {

  return (
    <section
      id="statistics"
      className="relative py-20 md:py-32 bg-gradient-to-b from-gray-50 to-dark text-white overflow-hidden"
    >
      {/* Beams 背景 */}
      <Beams color="#00D9FF" className="opacity-30" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="bg-gradient-to-r from-gold to-neon-blue bg-clip-text text-transparent">
              数据统计
            </span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            用数据见证孙颖莎的卓越表现
          </p>
        </motion.div>

        {/* 数据卡片 - 使用动画计数器 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {statistics.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 hover:bg-white/20 transition-all"
            >
              <div className="text-4xl md:text-5xl font-bold mb-2 bg-gradient-to-r from-gold to-neon-blue bg-clip-text text-transparent">
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.unit}
                  className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gold to-neon-blue bg-clip-text text-transparent"
                />
              </div>
              <div className="text-gray-300 text-sm flex items-center gap-2">
                {stat.icon && <span>{stat.icon}</span>}
                <span>{stat.label}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 数据图表 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <StatisticsChart
              data={yearlyStats}
              title="年度成绩趋势"
              color="#FFD700"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <PieChart
              data={matchTypeStats}
              title="比赛类型分布"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
