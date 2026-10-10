'use client'

import type { ReactNode } from 'react'
import { emitGameEvent } from '@/lib/game-events'
import { site } from '@/lib/site'
import { ButtonAnchor } from '@/ui'

type Props = {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md'
}

/** The CV download. A plain link that also tells the game the loot was taken. */
export function CvLink({ children = 'Download CV', variant = 'secondary', size = 'md' }: Props) {
  return (
    <ButtonAnchor
      href={site.cvPath}
      download
      variant={variant}
      size={size}
      onClick={() => emitGameEvent('cv:download')}
    >
      {children}
    </ButtonAnchor>
  )
}
