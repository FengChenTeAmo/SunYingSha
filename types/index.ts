export interface CareerEvent {
  year: number
  title: string
  description: string
  image?: string
  video?: string
}

export interface MatchResult {
  id: string
  tournament: string
  date: string
  location: string
  result: string
  medal?: 'gold' | 'silver' | 'bronze'
  image?: string
}

export interface Statistic {
  label: string
  value: number
  unit?: string
  icon?: string
}

export interface MediaItem {
  id: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  title?: string
  description?: string
  category?: string
}

export interface NewsItem {
  id: string
  title: string
  summary: string
  date: string
  image?: string
  link?: string
  category?: string
}
