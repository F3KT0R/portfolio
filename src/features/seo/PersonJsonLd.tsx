import { character, chronicle, skillIds, skills } from '@/content'
import { site } from '@/lib/site'

/** schema.org Person, so search engines read the sheet as a person, not a game. */
export function PersonJsonLd() {
  const current = chronicle.find((entry) => entry.kind === 'work' && !entry.end)
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: character.name,
    url: site.url,
    email: `mailto:${site.email}`,
    jobTitle: character.className,
    image: `${site.url}/media/portrait.webp`,
    address: { '@type': 'PostalAddress', addressLocality: 'Novi Bečej', addressCountry: 'RS' },
    worksFor: current
      ? { '@type': 'Organization', name: current.org, url: current.url }
      : undefined,
    alumniOf: chronicle
      .filter((entry) => entry.kind === 'education')
      .map((entry) => ({ '@type': 'CollegeOrUniversity', name: entry.org })),
    knowsAbout: skillIds
      .filter((id) => skills[id].rarity !== 'common')
      .map((id) => skills[id].name),
    knowsLanguage: character.languages.map((l) => l.name),
    sameAs: [site.links.github, site.links.linkedin],
  }

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output with "<" escaped cannot break out of the script element.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
