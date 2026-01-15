'use client'

import { motion } from 'framer-motion'
import AnimatedContent from '@/components/reactbits/animations/AnimatedContent'
import Timeline from '@/components/ui/Timeline'
import ImagePlaceholder from '@/components/ui/ImagePlaceholder'
import { careerEvents } from '@/data/career'

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative py-20 md:py-32 bg-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedContent className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold font-display mb-4">
            <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
              关于
            </span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            了解孙颖莎的成长历程和个人风采
          </p>
        </AnimatedContent>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* 图片区域 */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-primary/10 to-gold/10"
          >
            <ImagePlaceholder
              label="个人照片"
              size="lg"
              className="w-full h-full"
            />
          </motion.div>

          {/* 内容区域 */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-bold font-display">个人简介</h3>
            <p className="text-gray-600 leading-relaxed">
              孙颖莎，中国乒乓球运动员，世界冠军。以其出色的技术和坚韧的意志，
              在国际赛场上屡创佳绩，为中国乒乓球事业做出了重要贡献。
            </p>
            <p className="text-gray-600 leading-relaxed">
              从进入国家队到成为世界冠军，孙颖莎用汗水和努力书写着自己的传奇故事。
              她的每一场比赛都展现着中国乒乓球运动员的风采和实力。
            </p>
            
            {/* 关键信息 */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="p-4 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                <div className="text-2xl font-bold text-primary">2015</div>
                <div className="text-sm text-gray-600">进入国家队</div>
              </div>
              <div className="p-4 bg-gradient-to-br from-gold/10 to-gold/5 rounded-lg">
                <div className="text-2xl font-bold text-gold">第1</div>
                <div className="text-sm text-gray-600">世界排名</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 时间轴 */}
        <div className="mt-20">
          <AnimatedContent delay={0.3}>
            <h3 className="text-3xl font-bold font-display mb-12 text-center">
              <span className="bg-gradient-to-r from-primary to-gold bg-clip-text text-transparent">
                成长历程
              </span>
            </h3>
            <Timeline events={careerEvents} />
          </AnimatedContent>
        </div>
      </div>
    </section>
  )
}
