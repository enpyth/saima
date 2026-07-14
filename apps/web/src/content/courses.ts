import type { Localized } from './types'

type CoursesContent = {
  hero: {
    eyebrow: string
    title: string
    titleAccent: string
    text: string
    browseAction: string
    dashboardAction: string
    imageAlt: string
  }
  filter: string
  filterAriaLabel: string
  states: {
    loadFailed: string
    selectRequired: string
    bookedSuffix: string
    loading: string
    empty: string
    confirmSignedIn: string
    confirmSignedOut: string
    hostFallback: string
    hostLabel: string
  }
}

export const coursesContent: Localized<CoursesContent> = {
  en: {
    hero: {
      eyebrow: 'Courses',
      title: 'Refine your art with',
      titleAccent: 'global maestros.',
      text: 'Browse published courses from SAIMA members. Sign in to reserve an available time and manage your booking history from the visitor dashboard.',
      browseAction: 'Browse courses',
      dashboardAction: 'Dashboard',
      imageAlt: 'Member-led music lesson',
    },
    filter: 'Filter by instrument, level, host, or available time from the live booking board.',
    filterAriaLabel: 'Course search preview',
    states: {
      loadFailed: 'Could not load courses.',
      selectRequired: 'Select at least one slot before confirming.',
      bookedSuffix: 'bookings confirmed. You can review them in your dashboard.',
      loading: 'Loading courses...',
      empty: 'No published courses are available yet.',
      confirmSignedIn: 'Confirm selected bookings',
      confirmSignedOut: 'Sign in to book',
      hostFallback: 'SAIMA member',
      hostLabel: 'Host',
    },
  },
  zh: {
    hero: {
      eyebrow: '课程',
      title: '与',
      titleAccent: '国际音乐导师精进艺术。',
      text: '浏览 SAIMA 会员发布的课程。登录后可以预约可用时间，并在访客控制台管理预约记录。',
      browseAction: '浏览课程',
      dashboardAction: '控制台',
      imageAlt: '会员主导的音乐课程',
    },
    filter: '可按乐器、程度、教师或可预约时间筛选。',
    filterAriaLabel: '课程搜索预览',
    states: {
      loadFailed: '无法加载课程。',
      selectRequired: '请至少选择一个时间段后再确认。',
      bookedSuffix: '个预约已确认。您可以在控制台查看。',
      loading: '正在加载课程...',
      empty: '暂时没有已发布课程。',
      confirmSignedIn: '确认所选预约',
      confirmSignedOut: '登录后预约',
      hostFallback: 'SAIMA 会员',
      hostLabel: '教师',
    },
  },
}
