import { describe, expect, it } from 'vitest'

import { aboutContent } from '../content/about'
import { choirContent } from '../content/choir'
import { contactContent } from '../content/contact'
import { coursesContent } from '../content/courses'
import { eventsContent } from '../content/events'
import { galleryContent } from '../content/gallery'
import { homeContent } from '../content/home'
import { membershipContent } from '../content/membership'
import { memberContent } from '../content/members'
import { sharedContent, siteImages, publicRoutePaths } from '../content/shared'
import { youthContent } from '../content/youth'

const implementedPublicRoutes = new Set([
  '/',
  '/about',
  '/about-details',
  '/events',
  '/events-details',
  '/youth',
  '/youth-details',
  '/choir',
  '/choir-details',
  '/gallery',
  '/gallery-details',
  '/courses',
  '/membership',
  '/membership-details',
  '/contact',
  '/partnership-details',
])

const pageContent = [
  homeContent,
  aboutContent,
  eventsContent,
  youthContent,
  choirContent,
  galleryContent,
  membershipContent,
  contactContent,
  coursesContent,
]

describe('public site content', () => {
  it('keeps each page content file bilingual', () => {
    for (const content of pageContent) {
      expect(content.en).toBeTruthy()
      expect(content.zh).toBeTruthy()
    }
  })

  it('keeps primary navigation localized and pointed at implemented public routes', () => {
    expect(sharedContent.en.navItems.map((item) => item.label)).toEqual([
      'Home',
      'About Us',
      'Events',
      'Youth',
      'Choir',
      'Gallery',
      'Courses',
      'Join',
      'Contact',
    ])

    expect(sharedContent.zh.navItems.map((item) => item.label)).toEqual([
      '首页',
      '关于我们',
      '活动',
      '青少年',
      '亲子合唱团',
      '照片与媒体',
      '课程',
      '加入我们',
      '联系我们',
    ])

    for (const language of ['en', 'zh'] as const) {
      for (const item of sharedContent[language].navItems) {
        expect(implementedPublicRoutes.has(item.to)).toBe(true)
      }
    }
  })

  it('keeps shared public route paths unique', () => {
    expect(new Set(publicRoutePaths).size).toBe(publicRoutePaths.length)
  })

  it('uses local image assets for public pages', () => {
    for (const path of Object.values(siteImages)) {
      expect(path).toMatch(/^\/images\/saima\/.+\.(jpg|png|webp)$/)
    }

    for (const group of galleryContent.en.groups) {
      expect(Object.values(siteImages)).toContain(group.image)
    }
  })

  it('keeps critical supplied page copy in the corresponding content files', () => {
    expect(homeContent.en.hero.title).toContain('South Australian International Musicians Association')
    expect(homeContent.zh.hero.title).toBe('南澳国际音乐协会')
    expect(aboutContent.en.sections[0]?.title).toBe('Founder & Artistic Director')
    expect(eventsContent.en.upcoming.events[0]?.title).toBe('A Dream for Every Child')
    expect(eventsContent.zh.past.sections[0]?.events?.[0]?.title).toContain('中国印象')
    expect(membershipContent.en.expression.title).toContain('Expression of Interest')
    expect(contactContent.zh.partner.title).toBe('为什么与我们合作')
  })

  it('keeps placeholder data bilingual for missing values', () => {
    expect(sharedContent.en.placeholders.tba).toBe('To be announced')
    expect(sharedContent.zh.placeholders.tba).toBe('待公布')
    expect(eventsContent.en.upcoming.events[1]?.date).toBe(sharedContent.en.placeholders.tba)
    expect(eventsContent.zh.upcoming.events[1]?.date).toBe(sharedContent.zh.placeholders.tba)
  })

  it('keeps long-form supplied content reachable through detail page actions', () => {
    const detailPaths = [
      '/about-details',
      '/events-details',
      '/youth-details',
      '/choir-details',
      '/gallery-details',
      '/membership-details',
      '/partnership-details',
    ]

    for (const path of detailPaths) {
      expect(implementedPublicRoutes.has(path)).toBe(true)
    }

    expect(aboutContent.en.detailAction).toContain('detailed')
    expect(eventsContent.en.labels.details).toContain('details')
    expect(membershipContent.zh.detailsAction).toContain('详情')
    expect(contactContent.zh.detailsAction).toContain('详情')
  })

  it('keeps member profiles connected to local images and personal pages', () => {
    expect(memberContent.en.members).toHaveLength(11)
    expect(memberContent.zh.members).toHaveLength(11)

    for (const language of ['en', 'zh'] as const) {
      for (const member of memberContent[language].members) {
        expect(member.order).toBeGreaterThan(0)
        expect(member.slug).toMatch(/^[a-z0-9-]+$/)
        expect(member.href).toBe(`/members/${member.slug}`)
        expect(member.image).toMatch(/^\/images\/saima\/members\/.+\.jpg$/)
        expect(member.name).toBeTruthy()
        expect(member.role).toBeTruthy()
        expect(member.summary).toBeTruthy()
        expect(member.bio.length).toBeGreaterThan(0)
      }
    }

    const orderedMemberSlugs = [...memberContent.en.members]
      .sort((left, right) => left.order - right.order)
      .map((member) => member.slug)

    expect(orderedMemberSlugs).toEqual([
      'elsa-yiyin-tian',
      'callum-mcging',
      'sonya-chong',
      'suraj-landge',
      'tina-zhao',
      'yifei-chong',
      'yueqi-queenie-li',
      'baoshan-wu',
      'yishan-teresa-chen',
      'bowen-huang',
      'harper-ou',
    ])
    expect([...memberContent.en.members].sort((left, right) => left.order - right.order).map((member) => member.order)).toEqual([
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
    ])
    expect(aboutContent.en.sections[2]?.title).toBe('Our Artists, Educators and Community Members')
    expect(JSON.stringify(aboutContent.en)).not.toContain('Meet the people behind the music')
  })
})
