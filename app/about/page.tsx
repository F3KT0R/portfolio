import Image from 'next/image'
import styles from './page.module.scss'
import { SectionHeader } from '@/components/SectionHeader'

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <SectionHeader
        title="About"
        subtitle="A quick story, plus what I optimize for when building products."
      />

      <div className={styles.grid}>
        <div className={styles.card}>
          <p>
            I’m a frontend developer with a strong focus on Angular and modern UI engineering.
            I care about clean architecture, reusability, accessibility, and performance.
          </p>
          <p>
            Outside of work, I’m into photography and music — both influence how I think about
            composition, rhythm, and polish in interfaces.
          </p>
        </div>

        <div className={styles.card}>
          <Image
            src="/OPT_3084.png"
            alt="Portrait"
            width={900}
            height={900}
            style={{ width: '100%', height: 'auto', borderRadius: '12px' }}
            priority
          />
        </div>
      </div>
    </div>
  )
}
