'use client'

interface ScoreBoardProps {
  score: number
  totalQuestions: number
  elapsedTime: number
}

export default function ScoreBoard({
  score,
  totalQuestions,
  elapsedTime
}: ScoreBoardProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="absolute top-4 right-4 z-30 bg-black/70 backdrop-blur-md rounded-lg p-4 text-white">
      <div className="flex items-center gap-6">
        <div>
          <div className="text-xs text-gray-400 mb-1">得分</div>
          <div className="text-2xl font-bold">
            {score}<span className="text-sm text-gray-400">/{totalQuestions}</span>
          </div>
        </div>
        <div className="h-12 w-px bg-white/20"></div>
        <div>
          <div className="text-xs text-gray-400 mb-1">时间</div>
          <div className="text-xl font-bold">{formatTime(elapsedTime)}</div>
        </div>
      </div>
    </div>
  )
}
