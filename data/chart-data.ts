// 图表数据

export interface YearlyStats {
  year: string
  value: number
}

export interface MatchTypeStats {
  label: string
  value: number
  color: string
}

// 年度成绩趋势数据
export const yearlyStats: YearlyStats[] = [
  { year: '2019', value: 85 },
  { year: '2020', value: 88 },
  { year: '2021', value: 90 },
  { year: '2022', value: 92 },
  { year: '2023', value: 95 },
  { year: '2024', value: 87 },
]

// 比赛类型分布
export const matchTypeStats: MatchTypeStats[] = [
  { label: '单打', value: 45, color: '#DC143C' },
  { label: '双打', value: 30, color: '#FFD700' },
  { label: '混双', value: 25, color: '#00D9FF' },
]

// 对手类型分析
export const opponentStats: MatchTypeStats[] = [
  { label: '亚洲选手', value: 60, color: '#DC143C' },
  { label: '欧洲选手', value: 25, color: '#FFD700' },
  { label: '其他', value: 15, color: '#00D9FF' },
]
