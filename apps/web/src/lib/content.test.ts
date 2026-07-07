import { describe, expect, it } from 'vitest'

import {
  galleryMoments,
  participationPaths,
  publicNavItems,
  publicRoutePaths,
  siteImages,
} from './content'

const implementedPublicRoutes = new Set([
  '/',
  '/about',
  '/events',
  '/youth',
  '/choir',
  '/gallery',
  '/courses',
  '/membership',
  '/contact',
])

describe('public site content', () => {
  it('keeps primary navigation pointed at implemented public routes', () => {
    expect(publicNavItems.map((item) => item.label)).toEqual([
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

    for (const item of publicNavItems) {
      expect(implementedPublicRoutes.has(item.to)).toBe(true)
    }
  })

  it('keeps shared public route paths unique', () => {
    expect(new Set(publicRoutePaths).size).toBe(publicRoutePaths.length)
  })

  it('uses local image assets for public pages', () => {
    for (const path of Object.values(siteImages)) {
      expect(path).toMatch(/^\/images\/saima\/.+\.(jpg|png|webp)$/)
    }

    for (const moment of galleryMoments) {
      expect(Object.values(siteImages)).toContain(moment.image)
    }
  })

  it('keeps participation actions routed through public pages', () => {
    for (const path of participationPaths.map((item) => item.to)) {
      expect(implementedPublicRoutes.has(path)).toBe(true)
    }
  })
})
