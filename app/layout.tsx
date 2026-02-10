import type { Metadata } from 'next'
import './globals.scss'

import { ThemeScript } from '@/ui/ThemeScript'
import { SiteHeader } from '@/ui/SiteHeader'
import { SiteFooter } from '@/ui/SiteFooter'

export const metadata: Metadata = {
  metadataBase: new URL('https://tibor-balint.netlify.app'),
  title: {
    default: 'Tibor Bálint — Frontend Developer',
    template: '%s · Tibor Bálint',
  },
  description:
    'Frontend developer portfolio: case studies, experience, and projects (Next.js / React).',
  applicationName: 'Tibor Bálint Portfolio',
  authors: [{ name: 'Tibor Bálint', url: 'https://github.com/F3KT0R' }],
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Tibor Bálint — Frontend Developer',
    description:
      'Case studies, experience, and projects. Built with Next.js and React.',
    url: '/',
    siteName: 'Tibor Bálint',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tibor Bálint — Frontend Developer',
    description:
      'Case studies, experience, and projects. Built with Next.js and React.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className="skipLink" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  )
}
