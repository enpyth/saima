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
  seoTitle?: string
  seoDescription?: string
  highlights?: string[]
  details?: Array<{
    label: string
    value: string
  }>
  videos?: Array<{
    embedId: string
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
  programImage?: {
    label: string
    url: string
  }
  performers?: {
    eyebrow: string
    title: string
    subtitle: string
    note?: string
    quote?: {
      heading: string
      subheading: string
      footer: string
    }
    list: Array<{
      name: string
      achievements: string[]
      songs: string[]
    }>
  }
  programSchedule?: {
    eyebrow: string
    title: string
    subtitle?: string
    sections: Array<{
      part: string
      theme?: string
      items: Array<{
        number?: number
        work: string
        song: string
        performer: string
        notes?: string
      }>
    }>
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
