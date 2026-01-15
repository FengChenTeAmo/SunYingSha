'use client'

import { motion } from 'framer-motion'
import BounceCards from '@/components/reactbits/interactive/BounceCards'
import AnimatedList from '@/components/reactbits/animations/AnimatedList'
import AnimatedContent from '@/components/reactbits/animations/AnimatedContent'
import { statistics } from '@/data/statistics'
import { matches } from '@/data/matches'

export default function CareerSection() {
  const achievements = statistics.map(stat => ({
    title: stat.label,
    value: stat.value,
    icon: stat.icon,
  }))

  return (
    <section
      id="career"
      className="relative py-20 md:py-32 bg-gradient-to-b from-white to-gray-50"
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
              职业生涯
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            回顾孙颖莎的辉煌成就和重要时刻
          </p>
        </motion.div>

        {/* 数据统计卡片 - 使用 BounceCards */}
        <BounceCards items={achievements} className="mb-16" />

        {/* 重要比赛 - 使用 AnimatedList */}
        <AnimatedContent>
          <h3 className="text-2xl font-bold font-display mb-8 text-center">
            重要比赛
          </h3>
          <AnimatedList className="space-y-4">
            {matches.map((match) => (
              <div
                key={match.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-lg font-semibold mb-2">{match.tournament}</h4>
                    <p className="text-gray-600 text-sm">
                      {match.date} · {match.location}
                    </p>
                    <p className="text-primary font-medium mt-1">{match.result}</p>
                  </div>
                  <div className="text-3xl">
                    {match.medal === 'gold' && '🥇'}
                    {match.medal === 'silver' && '🥈'}
                    {match.medal === 'bronze' && '🥉'}
                  </div>
                </div>
              </div>
            ))}
          </AnimatedList>
        </AnimatedContent>
      </div>
    </section>
  )
}
