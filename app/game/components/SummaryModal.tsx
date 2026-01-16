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

  const correctRate = totalQuestions > 0 ? (correctAnswers / totalQuestions * 100).toFixed(1) : '0'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4 shadow-2xl transform -translate-y-0">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-2">🎉 游戏结束 🎉</h2>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">总时长：</span>
            <span className="font-bold text-lg">{formatTime(totalTime)}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">总得分：</span>
            <span className="font-bold text-lg">{score}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">正确题数：</span>
            <span className="font-bold text-lg">{correctAnswers}/{totalQuestions}</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b">
            <span className="text-gray-600">正确率：</span>
            <span className="font-bold text-lg">{correctRate}%</span>
          </div>
          <div className="flex justify-between items-center pt-4">
            <span className="text-gray-600">等级：</span>
            <span className={`font-bold text-2xl ${rating.color}`}>
              {rating.text} {rating.stars}
            </span>
          </div>
        </div>

        <button
          onClick={onRestart}
          className="w-full py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors text-lg"
        >
          重新开始游戏
        </button>
      </div>
    </div>
  )
}
