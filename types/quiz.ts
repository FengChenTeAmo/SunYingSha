// 问答游戏相关类型定义

export interface Question {
  id: number                    // 问题ID
  videoId: number              // 关联的视频ID
  question: string             // 问题文本
  options: string[]            // 选项数组（4个选项）
  correctAnswer: number        // 正确答案索引（0-3）
  explanation?: string         // 答案解析（可选）
}

export interface VideoData {
  id: number
  name: string
  src: string
  duration: number            // 视频时长（秒）
  opponent: string            // 对手姓名
  matchInfo: string           // 比赛信息（如：2020东京奥运会女单半决赛）
  questions: Question[]        // 该视频关联的问题（视频播放完成后触发）
}

export interface GameState {
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
