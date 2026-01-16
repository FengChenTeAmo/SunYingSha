'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import ShaderVideoParticle from '@/components/ShaderVideoParticle'
import QuestionModal from './components/QuestionModal'
import ScoreBoard from './components/ScoreBoard'
import SummaryModal from './components/SummaryModal'
import { useGameState } from './hooks/useGameState'
import { allVideos } from '@/data/quiz-questions'
import { Question, VideoData } from '@/types/quiz'

// 将所有视频的问题合并到一个数组中，每个问题关联对应的视频
interface QuestionWithVideo {
  question: Question
  video: VideoData
  questionIndex: number
}

export default function GamePage() {
  // 收集所有视频的所有问题并随机打乱顺序（只在组件初始化时执行一次）
  const shuffledQuestions = useMemo(() => {
    const allQuestionsWithVideo: QuestionWithVideo[] = allVideos.flatMap((video, videoIndex) =>
      video.questions.map((question, qIndex) => ({
        question,
        video,
        questionIndex: qIndex
      }))
    )
    // 使用 Fisher-Yates 洗牌算法进行随机打乱
    const shuffled = [...allQuestionsWithVideo]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
  }, []) // 空依赖数组，确保只在组件挂载时执行一次
  
  const totalQuestions = shuffledQuestions.length
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [isVideoEnded, setIsVideoEnded] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [answeredQuestions, setAnsweredQuestions] = useState<Map<number, number>>(new Map()) // questionId -> answerIndex
  const videoKeyRef = useRef(0) // 用于强制重新渲染视频组件

  const currentQuestionWithVideo = shuffledQuestions[currentQuestionIndex]
  const currentVideo = currentQuestionWithVideo?.video
  const currentQuestion = currentQuestionWithVideo?.question

  const { gameState, startGame, answerQuestion, endGame, resetGame } = useGameState(totalQuestions)

  // 开始游戏
  useEffect(() => {
    if (gameState.startTime === 0) {
      startGame()
      // 视频加载后显示问题
      setTimeout(() => {
        setShowQuestion(true)
      }, 1000)
    }
  }, [startGame, gameState.startTime])

  // 处理视频结束
  const handleVideoEnd = () => {
    setIsVideoEnded(true)
  }

  // 处理答题
  const handleQuestionAnswer = (answerIndex: number, isCorrect: boolean) => {
    if (!currentQuestion) return
    
    // 记录答案
    setAnsweredQuestions(prev => new Map(prev).set(currentQuestion.id, answerIndex))
    answerQuestion(currentQuestion.id, isCorrect)
    
    // 延迟后进入下一题
    setTimeout(() => {
      goToNextQuestion()
    }, 2000)
  }

  // 进入下一题
  const goToNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      const nextIndex = currentQuestionIndex + 1
      setCurrentQuestionIndex(nextIndex)
      setShowQuestion(false)
      setIsVideoEnded(false)
      
      // 强制重新渲染视频组件，这会触发清理并重新初始化Canvas
      videoKeyRef.current += 1
      
      // 如果下一个问题的视频不同，更新视频索引
      const nextQuestionWithVideo = shuffledQuestions[nextIndex]
      if (nextQuestionWithVideo && nextQuestionWithVideo.video.id !== currentVideo?.id) {
        setCurrentVideoIndex(allVideos.findIndex(v => v.id === nextQuestionWithVideo.video.id))
      }
      
      // 延迟显示问题，等待视频加载和Canvas清理完成
      setTimeout(() => {
        setShowQuestion(true)
      }, 500)
    } else {
      // 所有问题答完，结束游戏
      setTimeout(() => {
        endGame()
      }, 500)
    }
  }

  // 进入上一题
  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      const prevIndex = currentQuestionIndex - 1
      setCurrentQuestionIndex(prevIndex)
      setShowQuestion(false)
      setIsVideoEnded(false)
      
      // 强制重新渲染视频组件，这会触发清理并重新初始化Canvas
      videoKeyRef.current += 1
      
      // 如果上一个问题的视频不同，更新视频索引
      const prevQuestionWithVideo = shuffledQuestions[prevIndex]
      if (prevQuestionWithVideo && prevQuestionWithVideo.video.id !== currentVideo?.id) {
        setCurrentVideoIndex(allVideos.findIndex(v => v.id === prevQuestionWithVideo.video.id))
      }
      
      // 延迟显示问题，等待视频加载和Canvas清理完成
      setTimeout(() => {
        setShowQuestion(true)
      }, 500)
    }
  }

  // 计算游戏时长
  const getElapsedTime = () => {
    if (!gameState.startTime) return 0
    const end = gameState.endTime || Date.now()
    return Math.floor((end - gameState.startTime) / 1000)
  }

  // 重置游戏
  const handleRestart = () => {
    resetGame()
    setCurrentQuestionIndex(0)
    setCurrentVideoIndex(0)
    setIsVideoEnded(false)
    setShowQuestion(false)
    setAnsweredQuestions(new Map())
    videoKeyRef.current += 1
    window.location.reload()
  }

  // 计算正确答案数
  const correctAnswers = Array.from(answeredQuestions.entries()).reduce((count, [questionId, answerIndex]) => {
    const questionWithVideo = shuffledQuestions.find(qwv => qwv.question.id === questionId)
    if (questionWithVideo && questionWithVideo.question.correctAnswer === answerIndex) {
      return count + 1
    }
    return count
  }, 0)

  const allQuestionsAnswered = answeredQuestions.size === totalQuestions

  if (!currentVideo || !currentQuestion) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black relative flex flex-col">
      {/* 得分面板 */}
      <ScoreBoard
        score={gameState.score}
        totalQuestions={totalQuestions}
        elapsedTime={getElapsedTime()}
      />

      {/* 视频播放器区域 */}
      <div className="flex-1 relative flex items-center justify-center">
        <ShaderVideoParticle
          key={videoKeyRef.current}
          videoSrc={currentVideo.src}
          width={320}
          height={180}
          onVideoEnd={handleVideoEnd}
        />


        {/* 题目导航按钮（游戏结束后显示） */}
        {!gameState.isPlaying && gameState.endTime !== undefined && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-4">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                currentQuestionIndex === 0
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              ← 上一题
            </button>
            <button
              onClick={goToNextQuestion}
              disabled={currentQuestionIndex === totalQuestions - 1}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                currentQuestionIndex === totalQuestions - 1
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              下一题 →
            </button>
          </div>
        )}
      </div>

      {/* 问题显示区域（视频下方） */}
      {(showQuestion || (!gameState.isPlaying && gameState.endTime !== undefined)) && currentQuestion && (
        <div className="w-full bg-black/90 backdrop-blur-md border-t border-white/10 py-6">
          <QuestionModal
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            totalQuestions={totalQuestions}
            isVisible={true}
            onAnswer={handleQuestionAnswer}
            onClose={() => {}}
            previousAnswer={answeredQuestions.get(currentQuestion.id)}
            isAnswered={answeredQuestions.has(currentQuestion.id)}
          />
        </div>
      )}

      {/* 总结页面 - 游戏结束后在屏幕中央显示 */}
      <SummaryModal
        isVisible={!gameState.isPlaying && gameState.endTime !== undefined && allQuestionsAnswered}
        totalTime={getElapsedTime()}
        score={gameState.score}
        totalQuestions={totalQuestions}
        correctAnswers={correctAnswers}
        onRestart={handleRestart}
      />
    </div>
  )
}
