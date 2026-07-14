import { Link } from '@tanstack/react-router'
import { Globe2, Mail, Phone } from 'lucide-react'

import { useLanguage } from './language-provider'
import { sharedContent } from '../content/shared'

export function SiteFooter() {
  const { language } = useLanguage()
  const content = sharedContent[language]
  const quickLinkPaths = new Set(['/about', '/events', '/membership', '/contact'])

  return (
    <footer className="site-footer">
      <div className="site-footer-grid">
        <div>
          <Link to="/" className="footer-brand">
            {content.brand.name}
          </Link>
          <p>{content.footer.summary}</p>
          <div className="footer-socials" aria-label={content.footer.socialsLabel}>
            <Link to="/gallery" aria-label={content.footer.galleryLabel}>
              <Globe2 size={18} aria-hidden="true" />
            </Link>
            <Link to="/contact" aria-label={content.footer.emailLabel}>
              <Mail size={18} aria-hidden="true" />
            </Link>
            <Link to="/contact" aria-label={content.footer.phoneLabel}>
              <Phone size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
        <div>
          <h2>{content.footer.quickLinksHeading}</h2>
          <ul>
            {content.navItems.filter((item) => quickLinkPaths.has(item.to)).map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{content.footer.programsHeading}</h2>
          <ul>
            {content.footer.programs.map((item) => (
              <li key={item.to}>
                <Link to={item.to}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2>{content.footer.visitHeading}</h2>
          <p>
            {content.footer.location.map((line) => (
              <span key={line}>
                {line}
                <br />
              </span>
            ))}
          </p>
          <Link className="footer-action" to="/membership">
            {content.footer.action}
          </Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>© 2026 {content.brand.fullName}.</span>
        <span>{content.footer.rights}</span>
      </div>
    </footer>
  )
}
