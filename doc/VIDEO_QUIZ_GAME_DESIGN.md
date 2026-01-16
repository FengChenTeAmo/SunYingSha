# 视频粒子特效问答游戏 - 设计开发文档

## 一、项目概述

### 1.1 项目简介

在现有的视频粒子特效基础上，开发一个关于**孙颖莎比赛**的互动问答游戏。游戏结合视频播放和粒子特效，**在视频播放完成后**提出问题，问题内容围绕：
- 孙颖莎的对手是谁？
- 这是孙颖莎的哪场经典比赛？

用户通过选择答案进行答题，最终显示游戏总结（时间、得分等）。

### 1.2 核心功能

- ✅ **视频播放**：播放孙颖莎比赛视频并显示粒子特效
- ✅ **问答系统**：视频播放完成后弹出问题（关于对手、比赛场次等）
- ✅ **选项交互**：四个选项供用户选择
- ✅ **计分系统**：答对加一分，实时显示得分
- ✅ **总结页面**：游戏结束后显示总时间、得分、正确率等

### 1.3 技术栈

| 技术 | 用途 |
|------|------|
| **Next.js** | React 框架 |
| **Three.js** | 视频粒子特效渲染 |
| **TypeScript** | 类型安全 |
| **Tailwind CSS** | 样式设计 |
| **React Hooks** | 状态管理 |

---

## 二、功能需求

### 2.1 游戏流程

```
开始游戏
   ↓
播放视频（显示粒子特效）
   ↓
视频播放完成
   ↓
弹出问题（4个选项）
   ↓
用户选择答案
   ↓
显示正确答案（正确/错误反馈）
   ↓
进入下一题
   ↓
所有题目答完
   ↓
显示总结页面（时间、得分、正确率）
```

**注意**：所有问题都在视频播放完成后触发，不再在播放过程中暂停提问。

### 2.2 功能模块

#### 2.2.1 视频播放模块

- **功能**：
  - 播放孙颖莎比赛视频
  - 显示粒子特效（复用现有 `ShaderVideoParticle` 组件）
  - 显示视频信息（对手、比赛场次）
  - 显示播放进度

- **交互**：
  - 视频播放时，粒子特效同步显示
  - 视频完整播放，不中断
  - 视频播放完成后自动进入问答环节

#### 2.2.2 问答系统模块

- **功能**：
  - 视频播放完成后触发问题
  - 显示问题文本（关于孙颖莎的对手、比赛场次等）
  - 显示4个选项（A、B、C、D）
  - 处理用户选择
  - 显示正确答案和反馈

- **交互**：
  - 点击选项后禁用所有选项
  - 显示正确答案（绿色）和错误答案（红色）
  - 显示反馈信息（"回答正确！" / "回答错误，正确答案是..."）
  - 2-3秒后自动进入下一题

#### 2.2.3 计分系统模块

- **功能**：
  - 实时显示当前得分
  - 答对一题加1分
  - 记录总题数和正确题数
  - 计算正确率

#### 2.2.4 总结页面模块

- **功能**：
  - 显示游戏总时长
  - 显示总得分
  - 显示总题数
  - 显示正确题数
  - 显示正确率
  - 显示等级评价（如：优秀、良好、一般）
  - 提供重新开始按钮

---

## 三、数据结构设计

### 3.1 问题数据结构

```typescript
interface Question {
  id: number                    // 问题ID
  videoId: number              // 关联的视频ID
  question: string             // 问题文本
  options: string[]            // 选项数组（4个选项）
  correctAnswer: number        // 正确答案索引（0-3）
  explanation?: string         // 答案解析（可选）
}

// 示例 - 关于孙颖莎的问题
const question: Question = {
  id: 1,
  videoId: 1,
  question: "这段视频中，孙颖莎的对手是谁？",
  options: [
    "A. 陈梦",
    "B. 王曼昱",
    "C. 伊藤美诚",
    "D. 王艺迪"
  ],
  correctAnswer: 2,  // 正确答案是C（伊藤美诚）
  explanation: "这是孙颖莎与伊藤美诚的经典对决"
}
```

### 3.2 问题类型设计

问题主要围绕以下两个方面：

#### 3.2.1 对手识别类问题

**问题格式**：
- "这段视频中，孙颖莎的对手是谁？"
- "视频中与孙颖莎对战的选手是？"

**选项设计**：
- 包含正确答案（视频中的实际对手）
- 包含其他常见对手（如：陈梦、王曼昱、伊藤美诚、王艺迪等）
- 确保选项具有迷惑性，增加难度

#### 3.2.2 比赛场次识别类问题

**问题格式**：
- "这是孙颖莎的哪场经典比赛？"
- "这段视频记录的是哪场比赛？"
- "这场比赛发生在什么时间？"

**选项设计**：
- 包含正确答案（如：2020东京奥运会女单半决赛）
- 包含其他重要比赛场次
- 可以包含时间、地点、赛事名称等信息

#### 3.2.3 其他扩展问题类型

- **比分问题**："在这场比赛中，孙颖莎的最终比分是多少？"
- **技术特点**："视频中孙颖莎主要使用了什么技术？"
- **比赛结果**："这场比赛孙颖莎的最终成绩是？"

### 3.3 游戏状态数据结构

```typescript
interface GameState {
  isPlaying: boolean           // 游戏是否进行中
  currentVideoId: number       // 当前视频ID
  currentQuestionIndex: number  // 当前问题索引
  score: number                // 当前得分
  totalQuestions: number       // 总题数
  correctAnswers: number        // 正确答案数
  startTime: number            // 游戏开始时间（时间戳）
  endTime?: number              // 游戏结束时间（时间戳）
  answeredQuestions: Set<number> // 已答题的问题ID集合
}

// 初始状态
const initialState: GameState = {
  isPlaying: false,
  currentVideoId: 0,
  currentQuestionIndex: -1,
  score: 0,
  totalQuestions: 0,
  correctAnswers: 0,
  startTime: 0,
  answeredQuestions: new Set()
}
```

### 3.4 视频数据结构

```typescript
interface VideoData {
  id: number
  name: string
  src: string
  duration: number            // 视频时长（秒）
  opponent: string            // 对手姓名
  matchInfo: string           // 比赛信息（如：2020东京奥运会女单半决赛）
  questions: Question[]        // 该视频关联的问题（视频播放完成后触发）
}

// 示例 - 孙颖莎比赛视频
const videoData: VideoData = {
  id: 1,
  name: '孙颖莎 vs 伊藤美诚',
  src: '/videos/sample1.mp4',
  duration: 30,
  opponent: '伊藤美诚',
  matchInfo: '2020东京奥运会女单半决赛',
  questions: [
    {
      id: 1,
      videoId: 1,
      question: "这段视频中，孙颖莎的对手是谁？",
      options: [
        "A. 陈梦",
        "B. 王曼昱",
        "C. 伊藤美诚",
        "D. 王艺迪"
      ],
      correctAnswer: 2,
      explanation: "这是孙颖莎与伊藤美诚的经典对决"
    },
    {
      id: 2,
      videoId: 1,
      question: "这是孙颖莎的哪场经典比赛？",
      options: [
        "A. 2020东京奥运会女单半决赛",
        "B. 2021世乒赛女单决赛",
        "C. 2022WTT世界杯女单决赛",
        "D. 2023世乒赛女单半决赛"
      ],
      correctAnswer: 0,
      explanation: "这是2020东京奥运会女单半决赛，孙颖莎4-0横扫伊藤美诚"
    }
  ]
}
```

---

## 四、UI/UX 设计

### 4.1 页面布局

```
┌─────────────────────────────────────────┐
│           游戏标题 / Logo                 │
├─────────────────────────────────────────┤
│                                          │
│      视频播放区域（粒子特效）              │
│                                          │
│                                          │
├─────────────────────────────────────────┤
│  得分: 5/10  |  时间: 01:23  |  进度    │
├─────────────────────────────────────────┤
│                                          │
│  问题弹窗（覆盖在视频上方）                │
│  ┌──────────────────────────────────┐   │
│  │  问题：视频中的人物在做什么动作？    │   │
│  │                                  │   │
│  │  [A. 挥手]  [B. 跳跃]            │   │
│  │  [C. 跑步]  [D. 静止不动]        │   │
│  │                                  │   │
│  │  反馈：回答正确！+1分             │   │
│  └──────────────────────────────────┘   │
│                                          │
└─────────────────────────────────────────┘
```

### 4.2 问题弹窗设计

**样式要求**：
- 半透明背景（遮罩层）
- 居中显示
- 圆角边框
- 阴影效果
- 动画效果（淡入淡出）

**布局**：
```
┌────────────────────────────────────┐
│  问题 1/10                         │
├────────────────────────────────────┤
│                                    │
│  视频中的人物在做什么动作？          │
│                                    │
│  ┌──────────┐  ┌──────────┐      │
│  │ A. 挥手  │  │ B. 跳跃  │      │
│  └──────────┘  └──────────┘      │
│  ┌──────────┐  ┌──────────┐      │
│  │ C. 跑步  │  │ D. 静止  │      │
│  └──────────┘  └──────────┘      │
│                                    │
│  [反馈信息区域]                     │
│                                    │
└────────────────────────────────────┘
```

### 4.3 总结页面设计

```
┌────────────────────────────────────┐
│          🎉 游戏结束 🎉            │
├────────────────────────────────────┤
│                                    │
│  总时长：05:23                      │
│  总得分：8/10                       │
│  正确率：80%                        │
│  等级：优秀 ⭐⭐⭐⭐                │
│                                    │
│  ┌──────────────────────────────┐  │
│  │       [重新开始游戏]          │  │
│  └──────────────────────────────┘  │
│                                    │
└────────────────────────────────────┘
```

---

## 五、技术架构

### 5.1 组件结构

```
app/game/quiz/
├── page.tsx                    # 主游戏页面
├── components/
│   ├── VideoQuizPlayer.tsx     # 视频播放器 + 粒子特效
│   ├── QuestionModal.tsx        # 问题弹窗组件
│   ├── ScoreBoard.tsx           # 得分面板组件
│   ├── SummaryModal.tsx         # 总结页面组件
│   └── GameControls.tsx         # 游戏控制组件
├── hooks/
│   ├── useGameState.ts          # 游戏状态管理
│   ├── useQuestions.ts          # 问题管理
│   └── useTimer.ts              # 计时器
└── data/
    └── questions.ts             # 问题数据
```

### 5.2 核心组件设计

#### 5.2.1 VideoQuizPlayer 组件

```typescript
interface VideoQuizPlayerProps {
  videoSrc: string
  questions: Question[]
  onQuestionTrigger: (question: Question) => void
  onVideoEnd: () => void
  isPaused: boolean
  onPause: () => void
  onResume: () => void
}
```

**功能**：
- 集成 `ShaderVideoParticle` 组件
- 监听视频播放时间
- 在指定时间点触发问题
- 控制视频播放/暂停

#### 5.2.2 QuestionModal 组件

```typescript
interface QuestionModalProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  isVisible: boolean
  onAnswer: (answerIndex: number) => void
  onClose: () => void
}
```

**功能**：
- 显示问题文本
- 显示4个选项
- 处理用户选择
- 显示正确答案和反馈
- 自动关闭或进入下一题

#### 5.2.3 ScoreBoard 组件

```typescript
interface ScoreBoardProps {
  score: number
  totalQuestions: number
  elapsedTime: number
}
```

**功能**：
- 显示当前得分
- 显示总题数
- 显示已用时间

#### 5.2.4 SummaryModal 组件

```typescript
interface SummaryModalProps {
  isVisible: boolean
  totalTime: number
  score: number
  totalQuestions: number
  correctAnswers: number
  onRestart: () => void
}
```

**功能**：
- 显示游戏总结信息
- 计算并显示正确率
- 显示等级评价
- 提供重新开始按钮

---

## 六、实现步骤

### 6.1 第一阶段：基础结构搭建

1. **创建游戏页面结构**
   ```bash
   app/game/quiz/page.tsx
   ```

2. **创建问题数据文件**
   ```bash
   data/questions.ts
   ```

3. **创建核心组件骨架**
   - `VideoQuizPlayer.tsx`
   - `QuestionModal.tsx`
   - `ScoreBoard.tsx`
   - `SummaryModal.tsx`

### 6.2 第二阶段：视频播放集成

1. **集成 ShaderVideoParticle 组件**
   - 在 `VideoQuizPlayer` 中使用现有组件
   - 添加视频播放控制

2. **实现时间监听**
   - 监听视频 `timeupdate` 事件
   - 检查是否到达问题触发时间

3. **实现问题触发逻辑**
   - 在指定时间点暂停视频
   - 显示问题弹窗

### 6.3 第三阶段：问答系统实现

1. **实现 QuestionModal 组件**
   - 显示问题和选项
   - 处理用户点击
   - 显示正确答案和反馈

2. **实现答题逻辑**
   - 判断答案是否正确
   - 更新得分
   - 记录答题状态

3. **实现自动进入下一题**
   - 2-3秒后自动关闭弹窗
   - 继续播放视频或进入下一题

### 6.4 第四阶段：计分和总结

1. **实现 ScoreBoard 组件**
   - 实时显示得分
   - 显示时间进度

2. **实现 SummaryModal 组件**
   - 计算游戏统计数据
   - 显示总结信息
   - 实现重新开始功能

### 6.5 第五阶段：优化和测试

1. **添加动画效果**
   - 弹窗淡入淡出
   - 选项点击反馈
   - 得分更新动画

2. **优化用户体验**
   - 添加加载状态
   - 添加错误处理
   - 优化响应式设计

3. **测试和调试**
   - 测试各种场景
   - 修复bug
   - 性能优化

---

## 七、核心代码示例

### 7.1 游戏状态管理 Hook

```typescript
// hooks/useGameState.ts
import { useState, useCallback } from 'react'

interface GameState {
  isPlaying: boolean
  currentQuestionIndex: number
  score: number
  totalQuestions: number
  correctAnswers: number
  startTime: number
  endTime?: number
  answeredQuestions: Set<number>
}

export function useGameState(totalQuestions: number) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
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
```

### 7.2 问题管理 Hook

```typescript
// hooks/useQuestions.ts
import { useState, useCallback, useEffect } from 'react'
import { Question } from '@/types'

export function useQuestions(questions: Question[]) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [isQuestionVisible, setIsQuestionVisible] = useState(false)
  const [answeredQuestionIds, setAnsweredQuestionIds] = useState<Set<number>>(new Set())

  // 视频结束后触发第一个问题
  const triggerQuestions = useCallback(() => {
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      const question = questions[currentQuestionIndex]
      if (!answeredQuestionIds.has(question.id)) {
        setCurrentQuestion(question)
        setIsQuestionVisible(true)
      }
    }
  }, [questions, currentQuestionIndex, answeredQuestionIds])

  const handleAnswer = useCallback((answerIndex: number) => {
    if (!currentQuestion) return false

    const isCorrect = answerIndex === currentQuestion.correctAnswer
    setAnsweredQuestionIds(prev => new Set([...prev, currentQuestion.id]))
    
    return isCorrect
  }, [currentQuestion])

  const closeQuestion = useCallback(() => {
    setIsQuestionVisible(false)
    
    // 进入下一题
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      // 延迟显示下一题，给用户反馈时间
      setTimeout(() => {
        const nextQuestion = questions[currentQuestionIndex + 1]
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
```

### 7.3 QuestionModal 组件

```typescript
// components/QuestionModal.tsx
'use client'

import { useState, useEffect } from 'react'
import { Question } from '@/types'

interface QuestionModalProps {
  question: Question
  questionIndex: number
  totalQuestions: number
  isVisible: boolean
  onAnswer: (answerIndex: number, isCorrect: boolean) => void
  onClose: () => void
}

export default function QuestionModal({
  question,
  questionIndex,
  totalQuestions,
  isVisible,
  onAnswer,
  onClose
}: QuestionModalProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    if (isVisible) {
      setSelectedAnswer(null)
      setShowFeedback(false)
    }
  }, [isVisible, question.id])

  const handleOptionClick = (index: number) => {
    if (selectedAnswer !== null) return // 已选择，禁用

    setSelectedAnswer(index)
    const correct = index === question.correctAnswer
    setIsCorrect(correct)
    setShowFeedback(true)
    
    // 通知父组件
    onAnswer(index, correct)

    // 2秒后自动关闭
    setTimeout(() => {
      onClose()
    }, 2000)
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 animate-fadeIn">
        <div className="text-sm text-gray-500 mb-2">
          问题 {questionIndex + 1}/{totalQuestions}
        </div>
        
        <h2 className="text-2xl font-bold mb-6">{question.question}</h2>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          {question.options.map((option, index) => {
            const isSelected = selectedAnswer === index
            const isCorrectAnswer = index === question.correctAnswer
            const isWrong = isSelected && !isCorrectAnswer
            
            let buttonClass = "p-4 border-2 rounded-lg text-left transition-all hover:bg-gray-50"
            
            if (showFeedback) {
              if (isCorrectAnswer) {
                buttonClass += " border-green-500 bg-green-50"
              } else if (isWrong) {
                buttonClass += " border-red-500 bg-red-50"
              } else {
                buttonClass += " border-gray-200 opacity-50"
              }
            } else {
              buttonClass += " border-gray-300 cursor-pointer"
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
              <p className="font-bold">✓ 回答正确！+1分</p>
            ) : (
              <p className="font-bold">✗ 回答错误，正确答案是：{question.options[question.correctAnswer]}</p>
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
```

### 7.4 SummaryModal 组件

```typescript
// components/SummaryModal.tsx
'use client'

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
  if (!isVisible) return null

  const correctRate = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100).toFixed(1) : 0
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const getRating = () => {
    const rate = parseFloat(correctRate)
    if (rate >= 90) return { text: '优秀', stars: '⭐⭐⭐⭐⭐', color: 'text-yellow-500' }
    if (rate >= 80) return { text: '良好', stars: '⭐⭐⭐⭐', color: 'text-blue-500' }
    if (rate >= 60) return { text: '一般', stars: '⭐⭐⭐', color: 'text-green-500' }
    return { text: '加油', stars: '⭐⭐', color: 'text-gray-500' }
  }

  const rating = getRating()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 animate-fadeIn">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-2">🎉 游戏结束 🎉</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between">
            <span className="text-gray-600">总时长：</span>
            <span className="font-bold">{formatTime(totalTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">总得分：</span>
            <span className="font-bold">{score}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">正确题数：</span>
            <span className="font-bold">{correctAnswers}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">正确率：</span>
            <span className="font-bold">{correctRate}%</span>
          </div>
          <div className="flex justify-between items-center pt-4 border-t">
            <span className="text-gray-600">等级：</span>
            <span className={`font-bold text-xl ${rating.color}`}>
              {rating.text} {rating.stars}
            </span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors"
        >
          重新开始游戏
        </button>
      </div>
    </div>
  )
}
```

### 7.5 主游戏页面

```typescript
// app/game/quiz/page.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import ShaderVideoParticle from '@/components/ShaderVideoParticle'
import QuestionModal from './components/QuestionModal'
import ScoreBoard from './components/ScoreBoard'
import SummaryModal from './components/SummaryModal'
import { useGameState } from './hooks/useGameState'
import { useQuestions } from './hooks/useQuestions'
import { videoData } from '@/data/questions'

export default function QuizGamePage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isVideoEnded, setIsVideoEnded] = useState(false)

  const questions = videoData.questions
  const { gameState, startGame, answerQuestion, endGame, resetGame } = useGameState(questions.length)
  const {
    currentQuestion,
    isQuestionVisible,
    handleAnswer,
    closeQuestion,
    triggerQuestions,
    allQuestionsAnswered
  } = useQuestions(questions)

  // 开始游戏
  useEffect(() => {
    startGame()
  }, [startGame])

  // 监听视频结束
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleEnded = () => {
      setIsVideoEnded(true)
      // 视频结束后触发第一个问题
      triggerQuestions()
    }

    video.addEventListener('ended', handleEnded)
    return () => video.removeEventListener('ended', handleEnded)
  }, [triggerQuestions])

  // 处理答题
  const handleQuestionAnswer = (answerIndex: number, isCorrect: boolean) => {
    if (!currentQuestion) return
    
    const correct = handleAnswer(answerIndex)
    answerQuestion(currentQuestion.id, correct)
  }

  // 关闭问题
  const handleQuestionClose = () => {
    closeQuestion()
    
    // 检查是否所有问题都答完了
    if (allQuestionsAnswered) {
      endGame()
    }
  }

  // 计算游戏时长
  const getElapsedTime = () => {
    if (!gameState.startTime) return 0
    const end = gameState.endTime || Date.now()
    return Math.floor((end - gameState.startTime) / 1000)
  }

  return (
    <div className="min-h-screen bg-black">
      {/* 得分面板 */}
      <ScoreBoard
        score={gameState.score}
        totalQuestions={gameState.totalQuestions}
        elapsedTime={getElapsedTime()}
      />

      {/* 视频播放器 */}
      <div className="relative">
        <ShaderVideoParticle
          videoSrc={videoData.src}
          width={320}
          height={180}
        />
        <video
          ref={videoRef}
          src={videoData.src}
          className="hidden"
          playsInline
        />
      </div>

      {/* 问题弹窗 */}
      {currentQuestion && (
        <QuestionModal
          question={currentQuestion}
          questionIndex={questions.findIndex(q => q.id === currentQuestion.id)}
          totalQuestions={questions.length}
          isVisible={isQuestionVisible}
          onAnswer={handleQuestionAnswer}
          onClose={handleQuestionClose}
        />
      )}

      {/* 视频信息显示 */}
      {!isVideoEnded && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-70 text-white p-4 rounded-lg">
          <h3 className="text-xl font-bold mb-2">{videoData.name}</h3>
          <p className="text-sm">{videoData.matchInfo}</p>
        </div>
      )}

      {/* 总结页面 */}
      <SummaryModal
        isVisible={!gameState.isPlaying && gameState.endTime !== undefined}
        totalTime={getElapsedTime()}
        score={gameState.score}
        totalQuestions={gameState.totalQuestions}
        correctAnswers={gameState.correctAnswers}
        onRestart={resetGame}
      />
    </div>
  )
}
```

---

## 八、数据文件示例

### 8.1 问题数据文件

```typescript
// data/questions.ts
import { VideoData, Question } from '@/types'

export const videoData: VideoData = {
  id: 1,
  name: '孙颖莎 vs 伊藤美诚',
  src: '/videos/sample1.mp4',
  duration: 30,
  opponent: '伊藤美诚',
  matchInfo: '2020东京奥运会女单半决赛',
  questions: [
    {
      id: 1,
      videoId: 1,
      question: "这段视频中，孙颖莎的对手是谁？",
      options: [
        "A. 陈梦",
        "B. 王曼昱",
        "C. 伊藤美诚",
        "D. 王艺迪"
      ],
      correctAnswer: 2,
      explanation: "这是孙颖莎与伊藤美诚的经典对决，孙颖莎以4-0横扫对手"
    },
    {
      id: 2,
      videoId: 1,
      question: "这是孙颖莎的哪场经典比赛？",
      options: [
        "A. 2020东京奥运会女单半决赛",
        "B. 2021世乒赛女单决赛",
        "C. 2022WTT世界杯女单决赛",
        "D. 2023世乒赛女单半决赛"
      ],
      correctAnswer: 0,
      explanation: "这是2020东京奥运会女单半决赛，孙颖莎4-0横扫伊藤美诚，展现了强大的实力"
    },
    {
      id: 3,
      videoId: 1,
      question: "在这场比赛中，孙颖莎的最终比分是多少？",
      options: [
        "A. 4-0",
        "B. 4-1",
        "C. 4-2",
        "D. 4-3"
      ],
      correctAnswer: 0,
      explanation: "孙颖莎以4-0的比分完胜伊藤美诚，四局比分分别为11-3、11-9、11-6、11-4"
    }
  ]
}

// 更多视频示例
export const videoData2: VideoData = {
  id: 2,
  name: '孙颖莎 vs 陈梦',
  src: '/videos/sample2.mp4',
  duration: 35,
  opponent: '陈梦',
  matchInfo: '2021世乒赛女单决赛',
  questions: [
    {
      id: 4,
      videoId: 2,
      question: "这段视频中，孙颖莎的对手是谁？",
      options: [
        "A. 陈梦",
        "B. 王曼昱",
        "C. 伊藤美诚",
        "D. 王艺迪"
      ],
      correctAnswer: 0,
      explanation: "这是孙颖莎与陈梦的对决"
    },
    {
      id: 5,
      videoId: 2,
      question: "这是孙颖莎的哪场经典比赛？",
      options: [
        "A. 2020东京奥运会女单半决赛",
        "B. 2021世乒赛女单决赛",
        "C. 2022WTT世界杯女单决赛",
        "D. 2023世乒赛女单半决赛"
      ],
      correctAnswer: 1,
      explanation: "这是2021休斯顿世乒赛女单决赛，孙颖莎与陈梦的精彩对决"
    }
  ]
}

export const allVideos: VideoData[] = [
  videoData,
  videoData2,
  // 可以添加更多视频
]
```

---

## 九、样式设计

### 9.1 Tailwind CSS 配置

在 `tailwind.config.ts` 中添加自定义动画：

```typescript
module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.3s ease-out'
      }
    }
  }
}
```

### 9.2 全局样式

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .quiz-button {
    @apply px-6 py-3 rounded-lg font-semibold transition-all duration-200;
  }
  
  .quiz-button-primary {
    @apply quiz-button bg-blue-500 text-white hover:bg-blue-600 active:scale-95;
  }
  
  .quiz-button-correct {
    @apply quiz-button bg-green-500 text-white border-2 border-green-600;
  }
  
  .quiz-button-wrong {
    @apply quiz-button bg-red-500 text-white border-2 border-red-600;
  }
}
```

---

## 十、测试计划

### 10.1 功能测试

1. **视频播放测试**
   - 视频正常播放
   - 粒子特效正常显示
   - 播放控制正常

2. **问题触发测试**
   - 在指定时间点正确触发问题
   - 视频结束后触发问题
   - 已答问题不再触发

3. **答题测试**
   - 选项点击正常
   - 正确答案判断正确
   - 得分更新正确
   - 反馈显示正确

4. **总结页面测试**
   - 统计数据正确
   - 等级评价正确
   - 重新开始功能正常

### 10.2 性能测试

1. **视频播放性能**
   - 粒子特效流畅（60 FPS）
   - 内存占用正常

2. **响应速度**
   - 问题弹窗响应及时
   - 选项点击反馈及时

### 10.3 兼容性测试

1. **浏览器兼容**
   - Chrome/Edge
   - Firefox
   - Safari

2. **设备兼容**
   - 桌面端
   - 移动端（响应式设计）

---

## 十一、开发时间估算

| 阶段 | 任务 | 预估时间 |
|------|------|----------|
| 第一阶段 | 基础结构搭建 | 2-3小时 |
| 第二阶段 | 视频播放集成 | 3-4小时 |
| 第三阶段 | 问答系统实现 | 4-5小时 |
| 第四阶段 | 计分和总结 | 2-3小时 |
| 第五阶段 | 优化和测试 | 3-4小时 |
| **总计** | | **14-19小时** |

---

## 十二、后续扩展方向

### 12.1 功能扩展

1. **多视频支持**
   - 视频列表选择
   - 多视频连续播放

2. **难度等级**
   - 简单、中等、困难
   - 不同难度对应不同问题

3. **排行榜系统**
   - 本地排行榜
   - 在线排行榜（需要后端）

4. **题目编辑**
   - 管理员后台
   - 自定义题目

### 12.2 技术优化

1. **性能优化**
   - 视频预加载
   - 问题数据懒加载

2. **用户体验优化**
   - 音效反馈
   - 动画效果增强
   - 主题切换

---

## 十三、总结

本文档详细规划了视频粒子特效问答游戏的开发，包括功能需求、数据结构、UI设计、技术架构、代码示例等。按照此文档进行开发，可以快速实现一个功能完整的问答游戏系统。

**关键要点**：
- 复用现有的 `ShaderVideoParticle` 组件
- 使用 React Hooks 管理游戏状态
- 在指定时间点触发问题
- 实现完整的计分和总结系统
- 注重用户体验和交互反馈

---

**文档版本**：v1.0  
**创建日期**：2024年  
**最后更新**：2024年
