// Enforces the layer rules of src/ (see docs/architecture.md). Part of `npm run lint`.
//
//   app ──▶ features ──▶ ui ─┐
//    │         │   └──▶ game ─┼──▶ content ──▶ lib
//    └─────────┴──────────────┴──────────────▶ lib
//
// 1. Layers: a file may import only from the layers below it (table ALLOWED).
// 2. Purity: lib/, content/ and game/ never import React or Next.js at runtime
//    (`import type` is erased at compile time and allowed).
// 3. Feature boundaries: code outside a feature imports it only through its
//    index (`@/features/quests`), never a file inside it.
// 4. Client boundary: a file starting with 'use client' is named *.client.tsx/ts,
//    and every *.client.* file starts with 'use client'. Nothing in app/ is a
//    client component.
// 5. Every feature has an index.ts.
//
// Imports are read with a regex over static `import`/`export … from` and
// dynamic `import()`. It is a guard, not a bundler: it sees every specifier
// that starts with '@/' or '.'.
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const src = path.join(root, 'src')

const ALLOWED = {
  lib: ['lib'],
  content: ['lib', 'content'],
  game: ['lib', 'content', 'game'],
  ui: ['lib', 'ui'],
  features: ['lib', 'content', 'game', 'ui', 'features'],
  app: ['lib', 'content', 'game', 'ui', 'features', 'app', 'styles'],
  styles: ['styles'],
}
const PURE_LAYERS = new Set(['content', 'game', 'lib'])
const FRAMEWORK = /^(react|react-dom|next)(\/|$)/
const IMPORT =
  /(?:import|export)\s[^'"]*?from\s*['"]([^'"]+)['"]|import\s*\(\s*['"]([^'"]+)['"]\s*\)|import\s+['"]([^'"]+)['"]/g

const violations = []
const fail = (file, message) => violations.push(`${path.relative(root, file)}: ${message}`)

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return /\.(ts|tsx)$/.test(entry.name) ? [full] : []
  })
}

/** 'src/features/quests/QuestCard.tsx' → { layer: 'features', feature: 'quests' } */
function locate(file) {
  const [layer, feature] = path.relative(src, file).split(path.sep)
  return { layer, feature: layer === 'features' ? feature : undefined }
}

function resolve(fromFile, specifier) {
  if (specifier.startsWith('@/')) return path.join(src, specifier.slice(2))
  if (specifier.startsWith('.')) return path.resolve(path.dirname(fromFile), specifier)
  return null
}

const isTest = (file) => /\.test\.tsx?$/.test(file)

for (const file of walk(src)) {
  const source = fs.readFileSync(file, 'utf8')
  const from = locate(file)
  const allowed = ALLOWED[from.layer]
  if (!allowed) {
    fail(
      file,
      `unknown layer "${from.layer}" — add it to ALLOWED in scripts/check-architecture.mjs`,
    )
    continue
  }

  // 4. Client boundary
  const isClientFile = /\.client\.tsx?$/.test(file)
  const declaresClient = /^\s*['"]use client['"]/.test(source)
  if (declaresClient && !isClientFile) fail(file, "'use client' files must be named *.client.tsx")
  if (isClientFile && !declaresClient) fail(file, "*.client.* files must start with 'use client'")
  if (declaresClient && from.layer === 'app')
    fail(file, 'app/ must not contain client components; use a feature')

  for (const match of source.matchAll(IMPORT)) {
    const specifier = match[1] ?? match[2] ?? match[3]

    // 2. Purity
    const typeOnly = /^(import|export)\s+type\s/.test(match[0])
    if (PURE_LAYERS.has(from.layer) && FRAMEWORK.test(specifier) && !typeOnly) {
      fail(file, `${from.layer}/ is framework-free but imports "${specifier}"`)
    }

    const target = resolve(file, specifier)
    if (!target || !target.startsWith(src)) continue
    const to = locate(target)

    // 1. Layers
    if (!allowed.includes(to.layer) && !(isTest(file) && to.layer === from.layer)) {
      fail(file, `${from.layer}/ may not import ${to.layer}/ ("${specifier}")`)
    }

    // 3. Feature boundaries: crossing into a feature goes through its index only.
    if (to.layer === 'features' && to.feature !== from.feature) {
      const relative = path.relative(path.join(src, 'features', to.feature), target)
      if (relative !== '' && relative !== 'index') {
        fail(file, `import the "${to.feature}" feature through its index, not "${specifier}"`)
      }
    }
  }
}

// 5. Every feature exposes an index.ts
for (const entry of fs.readdirSync(path.join(src, 'features'), { withFileTypes: true })) {
  if (entry.isDirectory() && !fs.existsSync(path.join(src, 'features', entry.name, 'index.ts'))) {
    violations.push(`src/features/${entry.name}: missing index.ts (the feature's public API)`)
  }
}

if (violations.length > 0) {
  console.error(`Architecture check failed (${violations.length}):\n  ${violations.join('\n  ')}`)
  process.exit(1)
}
console.log('Architecture check passed.')
