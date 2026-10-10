import { ImageResponse } from 'next/og'
import { character } from '@/content'
import { levelFromCareer } from '@/game'
import { palette } from '@/lib/palette'
import { site } from '@/lib/site'

export const ogSize = { width: 1200, height: 630 }

const rivet = (position: Record<string, number>) => (
  <div
    style={{
      position: 'absolute',
      width: 16,
      height: 16,
      background: palette['gold-400'],
      ...position,
    }}
  />
)

/** The social card: the site's frame, a title and the character line. */
export function ogCard({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string
  title: string
  subtitle: string
}) {
  const { level } = levelFromCareer(character.careerStart, new Date())

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        padding: 40,
        background: palette['ink-950'],
      }}
    >
      <div
        style={{
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '56px 64px',
          border: `6px solid ${palette['ink-600']}`,
          background: palette['ink-900'],
          color: palette['bone-100'],
        }}
      >
        {rivet({ top: -6, left: -6 })}
        {rivet({ top: -6, right: -6 })}
        {rivet({ bottom: -6, left: -6 })}
        {rivet({ bottom: -6, right: -6 })}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: 4,
              color: palette['gold-400'],
              textTransform: 'uppercase',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                background: palette['gold-400'],
                transform: 'rotate(45deg)',
              }}
            />
            {eyebrow}
          </div>
          <div style={{ fontSize: 76, fontWeight: 700, lineHeight: 1.05 }}>{title}</div>
          <div style={{ fontSize: 34, color: palette['bone-200'], lineHeight: 1.3 }}>
            {subtitle}
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 26,
            color: palette['ink-400'],
          }}
        >
          <span>{`${character.name} · LV ${level} ${character.className}`}</span>
          <span>{new URL(site.url).host}</span>
        </div>
      </div>
    </div>,
    ogSize,
  )
}
