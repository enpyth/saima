import { Link, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, LogIn, LogOut } from 'lucide-react'
import { useMemo } from 'react'

import { useAuth } from './auth-provider'
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

  const displayName = useMemo(() => {
    const metadata = user?.user_metadata
    const name = profile?.full_name ?? metadata?.full_name ?? metadata?.name ?? user?.email
    return typeof name === 'string' && name.trim() ? name : 'SAIMA user'
  }, [profile?.full_name, user])

  const avatarUrl = useMemo(() => {
    const metadata = user?.user_metadata
    const image = profile?.avatar_url ?? metadata?.avatar_url ?? metadata?.picture
    return typeof image === 'string' && image.trim() ? image : undefined
  }, [profile?.avatar_url, user])

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
      <Link to="/" className="brand" aria-label="SAIMA home">
        <span className="brand-mark">
          <img src="/logo.jpg" alt="" aria-hidden="true" />
        </span>
        <span>
          <strong>SAIMA</strong>
          <small>South Australian International Musicians Association</small>
        </span>
      </Link>
      <nav aria-label="Primary navigation">
        <Link to="/events" className="nav-link">
          Events
        </Link>
        <Link to="/membership" className="nav-link">
          Membership
        </Link>
        <Link to="/courses" className="nav-link">
          Courses
        </Link>
        <Link to="/contact" className="nav-link">
          Contact
        </Link>
        {!loading && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="rounded-full p-0" size="icon" variant="ghost" aria-label="Open user menu">
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
                  Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={signOut}>
                <LogOut size={16} aria-hidden="true" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild size="sm">
            <Link to="/login">
              <LogIn size={16} aria-hidden="true" />
              Login
            </Link>
          </Button>
        )}
      </nav>
    </header>
  )
}
