// Colour ownership. Part of `npm run lint`.
//
// 1. Raw colours (hex, rgb()/hsl()/oklch() with numeric channels) exist only in
//    the primitive tier of src/styles/tokens.css and in src/lib/palette.ts.
// 2. Every component reads semantic tokens: no CSS Module names a primitive
//    (`var(--gold-400)`); themes map primitives to meaning in tokens.css.
// 3. tokens.css and palette.ts declare exactly the same primitives with the
//    same values, so Open Graph images match the site.
import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const src = path.join(root, 'src')
const TOKENS = path.join(src, 'styles', 'tokens.css')
const PALETTE = path.join(src, 'lib', 'palette.ts')

const literal = /#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|oklch|lab|lch)\(\s*[\d.]/gi
const primitiveRef = /var\(--((?:ink|bone|gold|ember|moss|tide|arcane|flame|ash)-\d+)\)/g

const violations = []

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}

const stripComments = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '))

for (const file of walk(src)) {
  if (
    !/\.(css|tsx?)$/.test(file) ||
    file === TOKENS ||
    file === PALETTE ||
    /\.test\.tsx?$/.test(file)
  )
    continue
  const lines = stripComments(fs.readFileSync(file, 'utf8')).split(/\r?\n/)
  lines.forEach((line, i) => {
    const where = `${path.relative(root, file)}:${i + 1}`
    // Hex in TS is only checked inside strings that look like colours, to skip ids such as `#main`.
    const hits = file.endsWith('.css')
      ? line.match(literal)
      : line.match(/['"`]#[0-9a-f]{6}\b|\brgba?\(\s*\d/gi)
    if (hits) violations.push(`${where} raw colour ${hits.join(', ')} — use a token`)
    if (file.endsWith('.css')) {
      for (const m of line.matchAll(primitiveRef)) {
        violations.push(`${where} primitive var(--${m[1]}) in a component — use a semantic token`)
      }
    }
  })
}

// 3. tokens.css ⇔ palette.ts
const cssPrimitives = new Map(
  [
    ...stripComments(fs.readFileSync(TOKENS, 'utf8')).matchAll(
      /--([a-z]+-\d+):\s*(#[0-9a-f]{6});/gi,
    ),
  ].map((m) => [m[1], m[2].toLowerCase()]),
)
const tsPrimitives = new Map(
  [...fs.readFileSync(PALETTE, 'utf8').matchAll(/'([a-z]+-\d+)':\s*'(#[0-9a-f]{6})'/gi)].map(
    (m) => [m[1], m[2].toLowerCase()],
  ),
)
for (const [name, value] of cssPrimitives) {
  if (!tsPrimitives.has(name)) violations.push(`palette.ts is missing --${name}`)
  else if (tsPrimitives.get(name) !== value) {
    violations.push(
      `--${name} is ${value} in tokens.css but ${tsPrimitives.get(name)} in palette.ts`,
    )
  }
}
for (const name of tsPrimitives.keys()) {
  if (!cssPrimitives.has(name))
    violations.push(`tokens.css is missing --${name} (declared in palette.ts)`)
}

if (violations.length > 0) {
  console.error(`Colour token check failed (${violations.length}):\n  ${violations.join('\n  ')}`)
  process.exit(1)
}
console.log(`Colour token check passed (${cssPrimitives.size} primitives in sync).`)
