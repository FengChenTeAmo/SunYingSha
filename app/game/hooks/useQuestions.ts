'use client'

import { useState, useCallback } from 'react'
import { Question } from '@/types/quiz'

export function useQuestions(questions: Question[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [isQuestionVisible, setIsQuestionVisible] = useState(false)
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<number>>(new Set())

  // 视频结束后触发第一个问题
  const triggerQuestions = useCallback(() => {
    console.log('triggerQuestions 被调用', { 
      questionsLength: questions.length, 
      currentQuestionIndex, 
      answeredQuestionIds: Array.from(answeredQuestionIds) 
    })
    
    // 重置索引为0，确保从第一题开始
    setCurrentQuestionIndex(0)
    
    if (questions.length > 0) {
      const question = questions[0] // 总是从第一题开始
      console.log('准备显示问题:', question)
      if (!answeredQuestionIds.has(question.id)) {
        setCurrentQuestion(question)
        setIsQuestionVisible(true)
        console.log('问题已设置，isQuestionVisible 应为 true', question)
      } else {
        console.log('问题已答过，跳过')
      }
    } else {
      console.log('没有可显示的问题')
    }
  }, [questions, answeredQuestionIds])

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!currentQuestion) return false

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    setAnsweredQuestionIds(prev => {
      const newSet = new Set([...prev, currentQuestion.id])
      console.log('问题已回答，answeredQuestionIds 更新:', {
        questionId: currentQuestion.id,
        newSize: newSet.size,
        totalQuestions: questions.length,
        allAnswered: newSet.size === questions.length
      })
      return newSet
    })
    
    return isCorrect
  }, [currentQuestion, questions.length])

  const closeQuestion = useCallback(() => {
    setIsQuestionVisible(false)
    
    // 进入下一题
    if (currentQuestionIndex < questions.length - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      // 延迟显示下一题，给用户反馈时间
      setTimeout(() => {
        const nextQuestion = questions[nextIndex]
        if (nextQuestion && !answeredQuestionIds.has(nextQuestion.id)) {
          setCurrentQuestion(nextQuestion)
          setIsQuestionVisible(true)
        }
      }, 2000)
    }
  }, [currentQuestionIndex, questions, answeredQuestionIds])

  const allQuestionsAnswered = answeredQuestionIds.size === questions.length

  return {
    currentQuestion,
    isQuestionVisible,
    handleAnswer,
    closeQuestion,
    triggerQuestions,
    allQuestionsAnswered
  }
}
