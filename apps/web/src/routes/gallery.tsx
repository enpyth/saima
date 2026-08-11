import { createFileRoute, redirect } from '@tanstack/react-router'
import { Camera, Images, Music } from 'lucide-react'

import { useLanguage } from '../components/language-provider'
import { galleryContent } from '../content/gallery'
import { isPublicRouteEnabled, siteImages } from '../content/shared'

export const Route = createFileRoute('/gallery')({
  beforeLoad: () => {
    if (!isPublicRouteEnabled('/gallery')) {
      throw redirect({ to: '/', replace: true })
    }
  },
  component: Gallery,
})

function Gallery() {
  const { language } = useLanguage()
  const content = galleryContent[language]
  const icons = [Camera, Music, Images]

  return (
    <main className="public-page">
      <section className="gallery-hero">
        <img src={siteImages.galleryPerformance} alt="" aria-hidden="true" />
        <div className="hero-scrim" />
        <div>
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h1>{content.hero.title}</h1>
          <p>{content.hero.paragraphs[0]}</p>
        </div>
      </section>

      <section className="public-section gallery-strip">
        <div className="section-heading">
          <span className="eyebrow">{content.hero.eyebrow}</span>
          <h2>{content.hero.paragraphs[1]}</h2>
          <a className="text-link" href="/gallery-details">
            {content.detailsAction}
          </a>
        </div>
        <div className="masonry-grid">
          {content.groups.concat(content.groups.slice(0, 1)).map((group, index) => (
            <article className="gallery-tile" data-size={index % 3 === 0 ? 'large' : 'default'} key={`${group.title}-${index}`}>
              <img src={group.image} alt="" />
              <span>{group.title}</span>
              <h3>{group.summary}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section gallery-stats">
        {content.stats.map((stat, index) => {
          const Icon = icons[index] ?? Camera
          return (
            <div key={stat.title}>
              <Icon size={28} aria-hidden="true" />
              <strong>{stat.title}</strong>
              <span>{stat.summary}</span>
            </div>
          )
        })}
      </section>
    </main>
  )
}
