import fs from 'node:fs'
import { describe, expect, it } from 'vitest'
// Shared with scripts/generate-cv.mjs, which records the fingerprint.
import { CV_HASH, CV_PDF, cvSourceHash } from '../../../scripts/cv-source-hash.mjs'

describe('the PDF CV', () => {
  it('exists', () => {
    expect(fs.existsSync(CV_PDF)).toBe(true)
  })

  it('was printed from the current content — run `npm run cv` if this fails', () => {
    const recorded = fs.existsSync(CV_HASH) ? fs.readFileSync(CV_HASH, 'utf8').trim() : 'none'
    expect(recorded).toBe(cvSourceHash())
  })
})
