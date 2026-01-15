'use client'

import { motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import Aurora from '@/components/reactbits/backgrounds/Aurora'
// import BlobCursor from '@/components/reactbits/interactive/BlobCursor' // 可选：取消注释以启用光标特效

export default function HeroSection() {
  const scrollToNext = () => {
    const aboutSection = document.querySelector('#about')
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="home"
      className="relative h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Aurora 背景 */}
      <Aurora className="opacity-60" />
      
      {/* 背景渐变遮罩 */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark/80 via-dark/60 to-dark/80" />
      
      {/* Blob Cursor 特效（可选，取消注释以启用） */}
      {/* <BlobCursor size={60} color="#FFD700" blur={25} /> */}

      {/* 内容 */}
      <div className="relative z-10 text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-5xl md:text-7xl lg:text-8xl font-bold font-display mb-4"
        >
          <span className="bg-gradient-to-r from-primary via-gold to-neon-blue bg-clip-text text-transparent">
            孙颖莎
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-2 font-display"
        >
          SUN YING SHA
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto"
        >
          世界冠军 · 乒乓球运动员 · 中国国家乒乓球队
        </motion.p>

        {/* 滚动提示 */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          onClick={scrollToNext}
          className="mt-12 flex flex-col items-center space-y-2 text-gray-400 hover:text-gold transition-colors group"
        >
          <span className="text-sm">向下滚动</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <FiChevronDown size={24} className="group-hover:text-gold" />
          </motion.div>
        </motion.button>
      </div>
    </section>
  )
}
