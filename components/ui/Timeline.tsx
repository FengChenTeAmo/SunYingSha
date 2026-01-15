'use client'

import { motion } from 'framer-motion'
import { CareerEvent } from '@/types'
import AnimatedContent from '@/components/reactbits/animations/AnimatedContent'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'

interface TimelineProps {
  events: CareerEvent[]
}

export default function Timeline({ events }: TimelineProps) {
  return (
    <div className="relative">
      {/* 时间轴线 */}
      <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-gold to-primary transform md:-translate-x-1/2" />

      <div className="space-y-12">
        {events.map((event, index) => (
          <AnimatedContent
            key={event.year}
            delay={index * 0.2}
            direction={index % 2 === 0 ? 'right' : 'left'}
          >
            <div className={`relative flex items-center ${
              index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
            }`}>
              {/* 时间节点 */}
              <div className="relative z-10 flex-shrink-0 w-16 h-16 md:w-20 md:h-20 flex items-center justify-center">
                <div className="absolute w-4 h-4 md:w-6 md:h-6 bg-primary rounded-full border-4 border-white shadow-lg" />
                <div className="absolute text-sm md:text-base font-bold text-primary bg-white px-2 py-1 rounded shadow-md">
                  {event.year}
                </div>
              </div>

              {/* 内容卡片 */}
              <div className={`flex-1 ml-8 md:ml-0 md:w-5/12 ${
                index % 2 === 0 ? 'md:mr-auto md:pr-8' : 'md:ml-auto md:pl-8'
              }`}>
                <motion.div
                  whileHover={{ scale: 1.02, y: -5 }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
                >
                  <h3 className="text-xl font-bold mb-2 text-primary">{event.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{event.description}</p>
                  {event.image && (
                    <div className="mt-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/10 to-gold/10 p-4">
                      <ImagePlaceholder
                        label={`${event.year}年照片`}
                        size="md"
                      />
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </AnimatedContent>
        ))}
      </div>
    </div>
  )
}
