export type Language = 'en' | 'zh'

export type Localized<T> = Record<Language, T>

export type TextBlock = {
  title: string
  paragraphs?: string[]
  items?: string[]
}

export type EventArticle = TextBlock & {
  date?: string
  location?: string
  subtitle?: string
  highlights?: string[]
}

export type ImageKey =
  | 'heroStage'
  | 'mandateLesson'
  | 'eventsConcert'
  | 'youthPiano'
  | 'galleryPerformance'
  | 'choirHall'
