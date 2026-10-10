import { IBM_Plex_Mono, IBM_Plex_Sans, Pixelify_Sans } from 'next/font/google'

// Self-hosted at build time. latin-ext covers Hungarian and Serbian Latin (ő, ű, č, ć, š, ž, đ).

export const pixel = Pixelify_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: 'variable',
  variable: '--font-pixel',
  display: 'swap',
})

export const sans = IBM_Plex_Sans({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
})

export const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})
