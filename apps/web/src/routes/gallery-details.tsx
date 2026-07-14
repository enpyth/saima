import { createFileRoute } from '@tanstack/react-router'

import { useLanguage } from '../components/language-provider'
import { galleryContent } from '../content/gallery'

export const Route = createFileRoute('/gallery-details')({ component: GalleryDetails })

function GalleryDetails() {
  const { language } = useLanguage()
  const content = galleryContent[language]

  return (
    <main className="public-page">
      <section className="public-title">
        <span className="eyebrow">{content.hero.eyebrow}</span>
        <h1>{content.hero.title}</h1>
        {content.hero.paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </section>
      <section className="public-section">
        <div className="gallery-grid">
          {content.groups.map((group) => (
            <article className="gallery-tile" key={group.title}>
              <img src={group.image} alt="" />
              <span>{group.title}</span>
              <h3>{group.summary}</h3>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}
