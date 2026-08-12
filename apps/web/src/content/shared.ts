import type { ImageKey, Localized } from './types'

export const temporarilyDisabledPublicRoutes = ['/gallery', '/courses'] as const

export function isPublicRouteEnabled(path: string) {
  return !(temporarilyDisabledPublicRoutes as readonly string[]).includes(path)
}

export const siteImages: Record<ImageKey, string> = {
  consulate: '/images/saima/consulate.jpg',
  dunhuangDance: '/images/saima/dunhuang-dance.jpg',
  performersElderHall: '/images/saima/performers-elder-hall.jpg',
  mandateLesson: '/images/saima/mandate-lesson.jpg',
  eventsConcert: '/images/saima/events-concert.jpg',
  youthPiano: '/images/saima/youth-piano.jpg',
  instrumentalPerformance: '/images/saima/instrumental_performance.jpeg',
  galleryPerformance: '/images/saima/gallery-performance.jpg',
  choirHall: '/images/saima/choir-hall.jpg',
}

export const sharedContent = {
  en: {
    brand: {
      name: 'SAIMA',
      fullName: 'South Australian International Musicians Association',
      ariaHome: 'SAIMA home',
    },
    navItems: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Events', to: '/events' },
      { label: 'Youth', to: '/youth' },
      { label: 'Choir', to: '/choir' },
      ...(isPublicRouteEnabled('/gallery') ? [{ label: 'Gallery', to: '/gallery' }] : []),
      ...(isPublicRouteEnabled('/courses') ? [{ label: 'Courses', to: '/courses' }] : []),
      { label: 'Join', to: '/membership' },
      { label: 'Contact', to: '/contact' },
    ],
    auth: {
      fallbackUser: 'SAIMA user',
      openUserMenu: 'Open user menu',
      dashboard: 'Dashboard',
      login: 'Login',
      signOut: 'Sign out',
    },
    language: {
      trigger: 'Language',
      english: 'English',
      chinese: '中文',
      label: 'Choose language',
    },
    footer: {
      summary: 'Connecting cultures through the universal power of music in South Australia.',
      socialsLabel: 'SAIMA contact links',
      galleryLabel: 'View SAIMA gallery',
      emailLabel: 'Email SAIMA',
      phoneLabel: 'Call SAIMA',
      quickLinksHeading: 'Quick links',
      programsHeading: 'Programs',
      visitHeading: 'Visit us',
      location: ['Adelaide, SA 5000', 'Australia'],
      action: 'Become a member',
      rights: 'All rights reserved.',
      programs: [
        { label: 'Young Artist Showcase', to: '/youth' },
        { label: 'Parent-Child Choir', to: '/choir' },
        { label: 'Cultural Exchanges', to: '/events' },
      ],
    },
    placeholders: {
      tba: 'To be announced',
      email: 'Email to be confirmed',
      social: 'Social media to be confirmed',
    },
  },
  zh: {
    brand: {
      name: 'SAIMA',
      fullName: '南澳国际音乐协会',
      ariaHome: 'SAIMA 首页',
    },
    navItems: [
      { label: '首页', to: '/' },
      { label: '关于我们', to: '/about' },
      { label: '活动', to: '/events' },
      { label: '青少年', to: '/youth' },
      { label: '亲子合唱团', to: '/choir' },
      ...(isPublicRouteEnabled('/gallery') ? [{ label: '照片与媒体', to: '/gallery' }] : []),
      ...(isPublicRouteEnabled('/courses') ? [{ label: '课程', to: '/courses' }] : []),
      { label: '加入我们', to: '/membership' },
      { label: '联系我们', to: '/contact' },
    ],
    auth: {
      fallbackUser: 'SAIMA 用户',
      openUserMenu: '打开用户菜单',
      dashboard: '控制台',
      login: '登录',
      signOut: '退出登录',
    },
    language: {
      trigger: '语言',
      english: 'English',
      chinese: '中文',
      label: '选择语言',
    },
    footer: {
      summary: '通过音乐连接南澳不同文化、社区与世代。',
      socialsLabel: 'SAIMA 联系链接',
      galleryLabel: '查看 SAIMA 照片与媒体',
      emailLabel: '联系 SAIMA 邮箱',
      phoneLabel: '联系 SAIMA 电话',
      quickLinksHeading: '快速链接',
      programsHeading: '项目',
      visitHeading: '地址',
      location: ['Adelaide, SA 5000', 'Australia'],
      action: '成为会员',
      rights: '版权所有。',
      programs: [
        { label: '优秀青年艺术学员展演', to: '/youth' },
        { label: '亲子合唱团', to: '/choir' },
        { label: '文化交流', to: '/events' },
      ],
    },
    placeholders: {
      tba: '待公布',
      email: '邮箱待确认',
      social: '社交媒体待确认',
    },
  },
} as const satisfies Localized<{
  brand: {
    name: string
    fullName: string
    ariaHome: string
  }
  navItems: Array<{ label: string; to: string }>
  auth: Record<'fallbackUser' | 'openUserMenu' | 'dashboard' | 'login' | 'signOut', string>
  language: Record<'trigger' | 'english' | 'chinese' | 'label', string>
  footer: {
    summary: string
    socialsLabel: string
    galleryLabel: string
    emailLabel: string
    phoneLabel: string
    quickLinksHeading: string
    programsHeading: string
    visitHeading: string
    location: string[]
    action: string
    rights: string
    programs: Array<{ label: string; to: string }>
  }
  placeholders: Record<'tba' | 'email' | 'social', string>
}>

export const publicRoutePaths = sharedContent.en.navItems.map((item) => item.to)
