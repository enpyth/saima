import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'

import { AuthProvider } from '../components/auth-provider'
import { SiteHeader } from '../components/site-header'
import appCss from '../styles.css?url'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'SAIMA | South Australian International Musicians Association',
      },
      {
        name: 'description',
        content:
          'SAIMA supports international musicians in South Australia through events, membership, courses, and community connection.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),
  component: App,
  shellComponent: RootDocument,
})

function App() {
  return (
    <AuthProvider>
      <SiteHeader />
      <Outlet />
    </AuthProvider>
  )
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
