'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Question } from '@/types/quiz'

interface QuestionModalProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  isVisible: boolean
  onAnswer: (answerIndex: number, isCorrect: boolean) => void
  onClose: () => void
  previousAnswer?: number
  isAnswered?: boolean
}

export default function QuestionModal({
  question,
  questionIndex,
  totalQuestions,
  isVisible,
  onAnswer,
  onClose,
  previousAnswer,
  isAnswered = false
}: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(previousAnswer ?? null)
  const [showFeedback, setShowFeedback] = useState(isAnswered)
  const [isCorrect, setIsCorrect] = useState(
    isAnswered && previousAnswer !== undefined ? previousAnswer === question.correctAnswer : false
  )

  useEffect(() => {
    if (isVisible) {
      // 如果问题已经答过，显示之前的答案
      if (isAnswered && previousAnswer !== undefined) {
        setSelectedAnswer(previousAnswer)
        setShowFeedback(true)
        setIsCorrect(previousAnswer === question.correctAnswer)
      } else {
        setSelectedAnswer(null)
        setShowFeedback(false)
        setIsCorrect(false)
      }
    }
  }, [isVisible, question.id, isAnswered, previousAnswer])

  const handleOptionClick = (index: number) => {
    // 如果已经答过，不允许再次选择
    if (isAnswered || selectedAnswer !== null) return

    setSelectedAnswer(index)
    const correct = index === question.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    // 通知父组件
    onAnswer(index, correct)
  }

  if (!isVisible) {
    return null
  }

  const progress = ((questionIndex + 1) / totalQuestions) * 100

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4 md:p-6"
    >
      <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-2xl p-6 md:p-8 max-w-4xl w-full mx-auto shadow-2xl border border-white/50 backdrop-blur-sm">
        {/* 装饰性光晕 */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur-xl opacity-20 -z-10" />
        
        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold text-gray-600"
            >
              问题 {questionIndex + 1} / {totalQuestions}
            </motion.span>
            <span className="text-sm font-semibold text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full shadow-lg"
            />
          </div>
        </div>
        
        {/* 问题标题 */}
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-2xl md:text-3xl font-bold mb-8 text-gray-800 leading-tight"
        >
          {question.question}
        </motion.h2>
        
        {/* 选项网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectAnswer = index === question.correctAnswer
            const isWrong = isSelected && !isCorrectAnswer
            const isDisabled = selectedAnswer !== null || isAnswered
            
            return (
              <motion.button
                key={index}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                whileHover={!isDisabled ? { scale: 1.02, y: -2 } : {}}
                whileTap={!isDisabled ? { scale: 0.98 } : {}}
                onClick={() => handleOptionClick(index)}
                disabled={isDisabled}
                className={`
                  relative p-5 rounded-xl text-left font-medium text-lg
                  transition-all duration-300 overflow-hidden
                  ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                  ${
                    showFeedback
                      ? isCorrectAnswer
                        ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white border-2 border-green-500 shadow-lg shadow-green-500/50'
                        : isWrong
                        ? 'bg-gradient-to-br from-red-400 to-rose-500 text-white border-2 border-red-500 shadow-lg shadow-red-500/50'
                        : 'bg-gray-100 text-gray-500 border-2 border-gray-200 opacity-60'
                      : 'bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-purple-50 text-gray-800 border-2 border-gray-300 hover:border-blue-400 shadow-md hover:shadow-lg'
                  }
                `}
              >
                {/* 选中时的光晕效果 */}
                {isSelected && !showFeedback && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 opacity-20 rounded-xl"
                  />
                )}
                
                {/* 选项内容 */}
                <span className="relative z-10 flex items-center">
                  <span className="mr-3 text-2xl">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  <span>{option.replace(/^[A-D]\.\s*/, '')}</span>
                </span>
                
                {/* 正确/错误图标 */}
                {showFeedback && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="absolute top-2 right-2 text-2xl"
                  >
                    {isCorrectAnswer ? '✓' : isWrong ? '✗' : ''}
                  </motion.div>
                )}
              </motion.button>
            )
          })}
        </div>

        {/* 反馈信息 */}
        <AnimatePresence>
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 200 }}
              className={`
                p-6 rounded-xl shadow-lg border-2
                ${isCorrect 
                  ? 'bg-gradient-to-br from-green-100 to-emerald-100 text-green-800 border-green-300' 
                  : 'bg-gradient-to-br from-red-100 to-rose-100 text-red-800 border-red-300'
                }
              `}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="flex items-center gap-3 mb-2"
              >
                <span className="text-3xl">
                  {isCorrect ? '🎉' : '😔'}
                </span>
                <p className="font-bold text-xl">
                  {isCorrect ? (
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      ✓ 回答正确！+1分
                    </span>
                  ) : (
                    <span>
                      ✗ 回答错误，正确答案是：<span className="text-green-700">{question.options[question.correctAnswer]}</span>
                    </span>
                  )}
                </p>
              </motion.div>
              {question.explanation && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="mt-3 text-sm md:text-base leading-relaxed"
                >
                  {question.explanation}
                </motion.p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
