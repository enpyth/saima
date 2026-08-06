import { Link, useNavigate } from '@tanstack/react-router'
import { Globe2, LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { useMemo } from 'react'

import { useAuth } from './auth-provider'
import { useLanguage } from './language-provider'
import { sharedContent } from '../content/shared'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'

export function SiteHeader() {
  const navigate = useNavigate()
  const { loading, user, profile, signOut: authSignOut } = useAuth()
  const { language, setLanguage } = useLanguage()
  const content = sharedContent[language]

  const displayName = useMemo(() => {
    const metadata = user?.user_metadata
    const name = profile?.fullName ?? metadata?.full_name ?? metadata?.name ?? user?.email
    return typeof name === 'string' && name.trim() ? name : content.auth.fallbackUser
  }, [content.auth.fallbackUser, profile?.fullName, user])

  const avatarUrl = useMemo(() => {
    const metadata = user?.user_metadata
    const image = profile?.avatarUrl ?? metadata?.avatar_url ?? metadata?.picture
    return typeof image === 'string' && image.trim() ? image : undefined
  }, [profile?.avatarUrl, user])

  const initials = useMemo(() => {
    return displayName
      .split(/[\s@.]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join('')
  }, [displayName])

  async function signOut() {
    await authSignOut()
    await navigate({ to: '/' })
  }

  return (
    <header className="site-header">
      <Link to="/" className="brand" aria-label={content.brand.ariaHome}>
        <span className="brand-mark">
          <img src="/logo.jpg" alt="" aria-hidden="true" />
        </span>
        <span>
          <strong>{content.brand.name}</strong>
          <small>{content.brand.fullName}</small>
        </span>
      </Link>
      <nav aria-label="Primary navigation">
        {content.navItems.map((item) => (
          <Link key={item.to} to={item.to} className="nav-link" activeProps={{ className: 'active' }}>
            {item.label}
          </Link>
        ))}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="language-trigger" size="sm" variant="outline" aria-label={content.language.label}>
              <Globe2 size={16} aria-hidden="true" />
              {content.language.trigger}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{content.language.label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => setLanguage('en')}>
              <span className="language-check">{language === 'en' ? '✓' : ''}</span>
              {content.language.english}
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setLanguage('zh')}>
              <span className="language-check">{language === 'zh' ? '✓' : ''}</span>
              {content.language.chinese}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        {!loading && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full p-0" size="icon" variant="ghost" aria-label={content.auth.openUserMenu}>
                <Avatar>
                  <AvatarImage alt={displayName} src={avatarUrl} />
                  <AvatarFallback>{initials || 'S'}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <span className="block">{displayName}</span>
                {user.email ? <span className="block text-xs font-normal text-[#71665b]">{user.email}</span> : null}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard">
                  <LayoutDashboard size={16} aria-hidden="true" />
                  {content.auth.dashboard}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={signOut}>
                <LogOut size={16} aria-hidden="true" />
                {content.auth.signOut}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm">
            <Link to="/login">
              <LogIn size={16} aria-hidden="true" />
              {content.auth.login}
            </Link>
          </Button>
        )}
      </nav>
    </header>
  )
}
