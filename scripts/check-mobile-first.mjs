// Mobile first. Part of `npm run lint`.
//
// Base styles are the phone layout; wider screens only add to them through
// `(width >= …)` queries. A `max-width` or `width <` / `width <=` query means a
// desktop layout being undone for phones, so it fails here.
// Feature queries that are not about width (print, hover, reduced motion,
// colour scheme) are unaffected.
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const src = path.join(root, 'src')
const desktopFirst = /@media[^{]*(max-width|max-inline-size|\bwidth\s*<=?|\binline-size\s*<=?)/

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return entry.name.endsWith('.css') ? [full] : []
  })
}

const violations = []
for (const file of walk(src)) {
  const source = fs
    .readFileSync(file, 'utf8')
    .replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))
  source.split(/\r?\n/).forEach((line, i) => {
    if (desktopFirst.test(line)) {
      violations.push(
        `${path.relative(root, file)}:${i + 1} ${line.trim()} — style phones first, then add (width >= …)`,
      )
    }
  })
}

if (violations.length > 0) {
  console.error(`Mobile-first check failed (${violations.length}):\n  ${violations.join('\n  ')}`)
  process.exit(1)
}
console.log('Mobile-first check passed.')
