import { ResumeView } from '@/features/resume'
import { pageMetadata } from '@/features/seo'
import { routes } from '@/lib/routes'

export const metadata = pageMetadata({
  title: 'TL;DR',
  description: 'Tibor Bálint on one page: role, stack, experience and selected work.',
  path: routes.tldr,
})

export default function TldrPage() {
  return <ResumeView />
}
