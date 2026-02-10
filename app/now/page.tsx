import { SectionHeader } from '@/components/SectionHeader'

export const dynamic = 'force-static'

export default function NowPage() {
  return (
    <div style={{ width: 'min(900px, calc(100% - 2.5rem))', margin: '0 auto', padding: 'clamp(2.75rem, 6vw, 4.5rem) 0' }}>
      <SectionHeader title="Now" subtitle="A living snapshot of what I’m focused on." />
      <div
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          background: 'color-mix(in srgb, var(--bg-1) 78%, transparent)',
          boxShadow: 'var(--shadow)',
          padding: 'clamp(1.1rem, 2vw, 1.8rem)',
        }}
      >
        <p>
          Building UI systems at work (Angular) and shipping personal projects with Next.js.
          Improving performance fundamentals (LCP/CLS), and writing better case studies.
        </p>
        <p>
          If you’re reading this: I’m open to collaborations on design-forward web projects.
        </p>
      </div>
    </div>
  )
}
