import type { MetadataRoute } from 'next'
import { palette } from '@/lib/palette'
import { site } from '@/lib/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} — Character Sheet`,
    short_name: 'Tibor',
    description: site.description,
    start_url: '/',
    display: 'standalone',
    theme_color: palette['ink-900'],
    background_color: palette['ink-950'],
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
