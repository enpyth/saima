export type Language = 'en' | 'zh'

export type Localized<T> = Record<Language, T>

export type TextBlock = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

export type EventArticle = TextBlock & {
  id: string
  href: string
  startDate: string
  date?: string
  location?: string
  subtitle?: string
  highlights?: string[]
  details?: Array<{
    label: string
    value: string
  }>
  galleryImages?: Array<{
    id: string
    img: string
    url: string
    height: number
  }>
  posterImage?: {
    label: string
    url: string
  }
  resources?: Array<{
    label: string
    type: 'pdf'
    url: string
  }>
}

export type ImageKey =
  | 'consulate'
  | 'dunhuangDance'
  | 'performersElderHall'
  | 'mandateLesson'
  | 'eventsConcert'
  | 'youthPiano'
  | 'instrumentalPerformance'
  | 'galleryPerformance'
  | 'choirHall'
