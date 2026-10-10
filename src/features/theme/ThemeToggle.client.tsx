'use client'

import { useSyncExternalStore } from 'react'
import { Button, PixelIcon } from '@/ui'
import { themeLabels, toggleTheme, type Theme } from './theme'

function readTheme(): Theme {
  return document.documentElement.dataset.theme === 'parchment' ? 'parchment' : 'dungeon'
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })
  return () => observer.disconnect()
}

export function ThemeToggle() {
  // The server cannot know the theme; null renders a neutral label until hydration.
  const theme = useSyncExternalStore(subscribe, readTheme, () => null)
  const next: Theme = theme === 'parchment' ? 'dungeon' : 'parchment'

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme ? `Switch to ${themeLabels[next]} theme` : 'Switch theme'}
      title={theme ? `Switch to ${themeLabels[next]}` : 'Switch theme'}
    >
      <PixelIcon name={theme === 'parchment' ? 'scroll' : 'skull'} size={18} />
    </Button>
  )
}
