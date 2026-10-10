import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'
import '@/styles/tokens.css'
import '@/styles/base.css'

import { EasterEggs } from '@/features/easter-eggs'
import { SiteFooter, SiteHeader } from '@/features/hud'
import { ProgressTracker } from '@/features/progress'
import { ThemeScript } from '@/features/theme'
import { cx } from '@/lib/cx'
import { palette } from '@/lib/palette'
import { site } from '@/lib/site'
import { mono, pixel, sans } from './fonts'
import styles from './layout.module.css'

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.links.github }],
  alternates: { canonical: '/' },
  openGraph: {
    title: site.title,
    description: site.description,
    url: '/',
    siteName: site.name,
    type: 'profile',
  },
  twitter: { card: 'summary_large_image', title: site.title, description: site.description },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: palette['ink-900'] },
    { media: '(prefers-color-scheme: light)', color: palette['bone-100'] },
  ],
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={cx(pixel.variable, sans.variable, mono.variable)}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body>
        <a className={styles.skip} href="#main">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className={styles.main}>
          {children}
        </main>
        <SiteFooter />
        <ProgressTracker />
        <EasterEggs />
      </body>
    </html>
  )
}
