'use client'

import { useState, useEffect } from 'react'
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

  return (
    <div className="w-full p-6 animate-fadeIn">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-auto shadow-2xl border-2 border-gray-200">
        <div className="text-sm text-gray-500 mb-2">
          问题 {questionIndex + 1}/{totalQuestions}
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-gray-800">{question.question}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectAnswer = index === question.correctAnswer
            const isWrong = isSelected && !isCorrectAnswer
            
            let buttonClass = "p-4 border-2 rounded-lg text-left transition-all font-medium"
            
            if (showFeedback) {
              if (isCorrectAnswer) {
                buttonClass += " border-green-500 bg-green-50 text-green-800"
              } else if (isWrong) {
                buttonClass += " border-red-500 bg-red-50 text-red-800"
              } else {
                buttonClass += " border-gray-200 bg-gray-50 opacity-50"
              }
            } else {
              buttonClass += " border-gray-300 bg-white hover:bg-gray-50 hover:border-blue-400 cursor-pointer"
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionClick(index)}
                disabled={selectedAnswer !== null}
                className={buttonClass}
              >
                {option}
              </button>
            )
          })}
        </div>

        {showFeedback && (
          <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isCorrect ? (
              <p className="font-bold text-lg">✓ 回答正确！+1分</p>
            ) : (
              <p className="font-bold text-lg">✗ 回答错误，正确答案是：{question.options[question.correctAnswer]}</p>
            )}
            {question.explanation && (
              <p className="mt-2 text-sm">{question.explanation}</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
