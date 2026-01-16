'use client'

import { useState, useCallback } from 'react'
import { GameState } from '@/types/quiz'

export function useGameState(totalQuestions: number) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentVideoId: 0,
    currentQuestionIndex: -1,
    score: 0,
    totalQuestions,
    correctAnswers: 0,
    startTime: 0,
    answeredQuestions: new Set()
  })

  const startGame = useCallback(() => {
    setGameState({
      isPlaying: true,
      currentVideoId: 0,
      currentQuestionIndex: -1,
      score: 0,
      totalQuestions,
      correctAnswers: 0,
      startTime: Date.now(),
      answeredQuestions: new Set()
    })
  }, [totalQuestions])

  const answerQuestion = useCallback((questionId: number, isCorrect: boolean) => {
    setGameState(prev => ({
      ...prev,
      score: isCorrect ? prev.score + 1 : prev.score,
      correctAnswers: isCorrect ? prev.correctAnswers + 1 : prev.correctAnswers,
      answeredQuestions: new Set([...prev.answeredQuestions, questionId])
    }))
  }, [])

  const endGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      endTime: Date.now()
    }))
  }, [])

  const resetGame = useCallback(() => {
    startGame()
  }, [startGame])

  return {
    gameState,
    startGame,
    answerQuestion,
    endGame,
    resetGame
  }
}
