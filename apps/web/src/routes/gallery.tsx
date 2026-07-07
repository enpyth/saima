import { createFileRoute } from '@tanstack/react-router'
import { Camera, Images, Music } from 'lucide-react'

import { galleryMoments, siteImages } from '../lib/content'

export const Route = createFileRoute('/gallery')({ component: Gallery })

function Gallery() {
  return (
    <main className="public-page">
      <section className="gallery-hero">
        <img src={siteImages.galleryPerformance} alt="" aria-hidden="true" />
        <div className="hero-scrim" />
        <div>
          <span className="eyebrow">Gallery</span>
          <h1>Scenes from the SAIMA community.</h1>
          <p>
            A visual archive of concerts, rehearsals, teaching moments, and public gatherings across
            South Australia.
          </p>
        </div>
      </section>

      <section className="public-section gallery-strip">
        <div className="section-heading">
          <span className="eyebrow">Archive</span>
          <h2>Performance, learning, and collaboration.</h2>
        </div>
        <div className="masonry-grid">
          {galleryMoments.concat(galleryMoments.slice(0, 2)).map((moment, index) => (
            <article className="gallery-tile" data-size={index % 3 === 0 ? 'large' : 'default'} key={`${moment.title}-${index}`}>
              <img src={moment.image} alt="" />
              <span>{moment.category}</span>
              <h3>{moment.title}</h3>
            </article>
          ))}
        </div>
      </section>

      <section className="public-section gallery-stats">
        <div>
          <Camera size={28} aria-hidden="true" />
          <strong>Concerts</strong>
          <span>Public performances and seasonal showcases</span>
        </div>
        <div>
          <Music size={28} aria-hidden="true" />
          <strong>Workshops</strong>
          <span>Teaching rooms, rehearsals, and member-led sessions</span>
        </div>
        <div>
          <Images size={28} aria-hidden="true" />
          <strong>Community</strong>
          <span>Families, collaborators, and cultural exchange</span>
        </div>
      </section>
    </main>
  )
}
