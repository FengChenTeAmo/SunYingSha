'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface SummaryModalProps {
  isVisible: boolean
  totalTime: number
  score: number
  totalQuestions: number
  correctAnswers: number
  onRestart: () => void
}

export default function SummaryModal({
  isVisible,
  totalTime,
  score,
  totalQuestions,
  correctAnswers,
  onRestart
}: SummaryModalProps) {
  const [animatedScore, setAnimatedScore] = useState(0)
  const [animatedCorrect, setAnimatedCorrect] = useState(0)
  const [animatedRate, setAnimatedRate] = useState(0)

  const correctRate = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100) : 0
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getRating = () => {
    if (correctRate >= 90) return { 
      text: '优秀', 
      stars: '⭐⭐⭐⭐⭐', 
      color: 'text-yellow-400',
      bgGradient: 'from-yellow-400 via-orange-500 to-red-500',
      glowColor: 'shadow-yellow-500/50'
    }
    if (correctRate >= 80) return { 
      text: '良好', 
      stars: '⭐⭐⭐⭐', 
      color: 'text-blue-400',
      bgGradient: 'from-blue-400 via-purple-500 to-pink-500',
      glowColor: 'shadow-blue-500/50'
    }
    if (correctRate >= 60) return { 
      text: '一般', 
      stars: '⭐⭐⭐', 
      color: 'text-green-400',
      bgGradient: 'from-green-400 via-emerald-500 to-teal-500',
      glowColor: 'shadow-green-500/50'
    }
    return { 
      text: '加油', 
      stars: '⭐⭐', 
      color: 'text-gray-400',
      bgGradient: 'from-gray-400 via-slate-500 to-gray-600',
      glowColor: 'shadow-gray-500/50'
    }
  }

  const rating = getRating()

  // 数字递增动画
  useEffect(() => {
    if (!isVisible) return

    const duration = 1500 // 动画时长（毫秒）
    const steps = 60
    const stepDuration = duration / steps

    // 分数动画
    let currentStep = 0
    const scoreInterval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3) // 缓动函数
      setAnimatedScore(Math.floor(score * easeOut))
      
      if (currentStep >= steps) {
        setAnimatedScore(score)
        clearInterval(scoreInterval)
      }
    }, stepDuration)

    // 正确数动画
    currentStep = 0
    const correctInterval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setAnimatedCorrect(Math.floor(correctAnswers * easeOut))
      
      if (currentStep >= steps) {
        setAnimatedCorrect(correctAnswers)
        clearInterval(correctInterval)
      }
    }, stepDuration)

    // 正确率动画
    currentStep = 0
    const rateInterval = setInterval(() => {
      currentStep++
      const progress = currentStep / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)
      setAnimatedRate(parseFloat((correctRate * easeOut).toFixed(1)))
      
      if (currentStep >= steps) {
        setAnimatedRate(correctRate)
        clearInterval(rateInterval)
      }
    }, stepDuration)

    return () => {
      clearInterval(scoreInterval)
      clearInterval(correctInterval)
      clearInterval(rateInterval)
    }
  }, [isVisible, score, correctAnswers, correctRate])

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center"
      >
        {/* 渐变背景 */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 opacity-95" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />
        
        {/* 主卡片 */}
        <motion.div
          initial={{ scale: 0.8, y: 50, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            delay: 0.1
          }}
          className="relative bg-gradient-to-br from-white/95 to-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 max-w-2xl w-full mx-4 shadow-2xl border border-white/20"
        >
          {/* 装饰性光晕 */}
          <div className={`absolute -inset-1 bg-gradient-to-r ${rating.bgGradient} rounded-3xl blur-xl opacity-20 -z-10`} />
          
          {/* 标题 */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mb-8"
          >
            <motion.h2
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="text-5xl md:text-6xl font-extrabold mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent"
            >
              🎉 游戏结束 🎉
            </motion.h2>
            <p className="text-gray-600 text-lg">恭喜完成挑战！</p>
          </motion.div>

          {/* 统计卡片网格 */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            {/* 总得分 */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform"
            >
              <div className="text-sm opacity-90 mb-2">总得分</div>
              <div className="text-4xl font-bold">
                {animatedScore}<span className="text-2xl opacity-75">/{totalQuestions}</span>
              </div>
            </motion.div>

            {/* 正确率 */}
            <motion.div
              initial={{ scale: 0, rotate: 180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform"
            >
              <div className="text-sm opacity-90 mb-2">正确率</div>
              <div className="text-4xl font-bold">
                {animatedRate.toFixed(1)}<span className="text-2xl">%</span>
              </div>
            </motion.div>

            {/* 正确题数 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform"
            >
              <div className="text-sm opacity-90 mb-2">正确题数</div>
              <div className="text-4xl font-bold">
                {animatedCorrect}<span className="text-2xl opacity-75">/{totalQuestions}</span>
              </div>
            </motion.div>

            {/* 总时长 */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              className="bg-gradient-to-br from-indigo-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg transform hover:scale-105 transition-transform"
            >
              <div className="text-sm opacity-90 mb-2">总时长</div>
              <div className="text-4xl font-bold">{formatTime(totalTime)}</div>
            </motion.div>
          </div>

          {/* 等级显示 */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className={`text-center mb-8 p-6 rounded-2xl bg-gradient-to-r ${rating.bgGradient} text-white shadow-xl ${rating.glowColor} shadow-2xl`}
          >
            <div className="text-sm opacity-90 mb-2">等级评价</div>
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{ 
                duration: 1,
                repeat: Infinity,
                repeatDelay: 1
              }}
              className={`text-5xl font-extrabold ${rating.color}`}
            >
              {rating.text}
            </motion.div>
            <div className="text-3xl mt-2">{rating.stars}</div>
          </motion.div>

          {/* 重新开始按钮 */}
          <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
          >
            <span className="relative z-10">🎮 重新开始游戏</span>
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-red-600 via-pink-600 to-purple-600"
              initial={{ x: '-100%' }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.3 }}
            />
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
