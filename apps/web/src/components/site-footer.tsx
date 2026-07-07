import { Link } from '@tanstack/react-router'
import { Globe2, Mail, Phone } from 'lucide-react'

import { publicNavItems } from '../lib/content'

const programLinks = [
  { label: 'Youth Orchestra', to: '/youth' },
  { label: 'Parent-Child Choir', to: '/choir' },
  { label: 'Global Masterclasses', to: '/courses' },
  { label: 'Cultural Exchanges', to: '/events' },
] as const

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <Link to="/" className="footer-brand">
            SAIMA
          </Link>
          <p>Connecting cultures through the universal power of music in South Australia.</p>
          <div className="footer-socials" aria-label="SAIMA contact links">
            <Link to="/gallery" aria-label="View SAIMA gallery">
              <Globe2 size={18} aria-hidden="true" />
            </Link>
            <Link to="/contact" aria-label="Email SAIMA">
              <Mail size={18} aria-hidden="true" />
            </Link>
            <Link to="/contact" aria-label="Call SAIMA">
              <Phone size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div>
          <h2>Quick links</h2>
          <ul>
            {publicNavItems.filter((item) => ['About Us', 'Events', 'Join', 'Contact'].includes(item.label)).map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Programs</h2>
          <ul>
            {programLinks.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Visit us</h2>
          <p>
            Adelaide, SA 5000
            <br />
            Australia
          </p>
          <Link className="footer-action" to="/membership">
            Become a member
          </Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© 2026 South Australian International Musicians Association.</span>
        <span>All rights reserved.</span>
      </div>
    </footer>
  )
}
