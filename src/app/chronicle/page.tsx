import { Timeline } from '@/features/chronicle'
import { CvLink } from '@/features/resume'
import { pageMetadata } from '@/features/seo'
import { routes } from '@/lib/routes'
import { PageHeader } from '@/ui'

export const metadata = pageMetadata({
  title: 'Chronicle',
  description:
    'Career history: PaySpot, freelance client work, QA at Zeto, and the University of Szeged.',
  path: routes.chronicle,
})

export default function ChroniclePage() {
  return (
    <>
      <PageHeader
        icon="map"
        eyebrow="Chronicle · newest first"
        title="Chronicle"
        lead="The road so far: from translating ads and testing tools to building a fintech front end and shipping client sites."
        aside={<CvLink size="sm" />}
      />
      <Timeline />
    </>
  )
}
