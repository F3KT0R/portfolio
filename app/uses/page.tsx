import { SectionHeader } from '@/components/SectionHeader'

export default function UsesPage() {
  return (
    <div style={{ width: 'min(900px, calc(100% - 2.5rem))', margin: '0 auto', padding: 'clamp(2.75rem, 6vw, 4.5rem) 0' }}>
      <SectionHeader title="Uses" subtitle="Tools and defaults I reach for." />
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'color-mix(in srgb, var(--bg-1) 78%, transparent)',
          boxShadow: 'var(--shadow)',
          padding: 'clamp(1.1rem, 2vw, 1.8rem)',
        }}
      >
        <h3>Editor</h3>
        <p>VS Code with tight linting and formatting.</p>
        <h3>Frontend</h3>
        <p>Angular and React, with Next.js for shipping.</p>
        <h3>Design</h3>
        <p>Small design systems: tokens, components, motion rules.</p>
      </div>
    </div>
  )
}
