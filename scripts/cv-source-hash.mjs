// The fingerprint of everything the CV is printed from. scripts/generate-cv.mjs
// stores it next to the PDF; src/features/resume/cv-freshness.test.ts fails
// when content changed but the PDF was not regenerated.
import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const SOURCES = [
  'src/content',
  'src/features/resume',
  'src/lib/dates.ts',
  'src/lib/site.ts',
  'src/lib/redaction.ts',
]

function files(target) {
  const stat = fs.statSync(target)
  if (stat.isFile()) return [target]
  return fs
    .readdirSync(target, { withFileTypes: true })
    .flatMap((entry) => files(path.join(target, entry.name)))
}

export const CV_DIR = 'public/cv'
export const CV_PDF = `${CV_DIR}/Tibor_Balint_CV.pdf`
export const CV_HASH = `${CV_DIR}/cv.source-hash`

export function cvSourceHash(root = process.cwd()) {
  const hash = crypto.createHash('sha256')
  const list = SOURCES.flatMap((source) => files(path.join(root, source)))
    .filter((file) => /\.(ts|tsx|css)$/.test(file) && !/\.test\.tsx?$/.test(file))
    .map((file) => path.relative(root, file).split(path.sep).join('/'))
    .sort()
  for (const file of list) {
    // Line endings differ between Windows and CI; the content does not.
    hash
      .update(file)
      .update('\0')
      .update(fs.readFileSync(path.join(root, file), 'utf8').replace(/\r\n/g, '\n'))
  }
  return hash.digest('hex')
}
