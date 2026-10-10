// Prints the TL;DR page to the CV PDF, so the CV and the site never disagree.
// Run with `npm run cv` (builds first). Writes public/cv/Tibor_Balint_CV.pdf and
// its source fingerprint; commit both.
import { spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { chromium } from '@playwright/test'
import { CV_HASH, CV_PDF, cvSourceHash } from './cv-source-hash.mjs'

const PORT = 3200
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://tibor-balint.netlify.app'
const MAX_PAGES = 2

const nextBin = path.join('node_modules', 'next', 'dist', 'bin', 'next')
const server = spawn(process.execPath, [nextBin, 'start', '--port', String(PORT)], {
  stdio: 'ignore',
})

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      if ((await fetch(`http://localhost:${PORT}/tldr`)).ok) return
    } catch {
      // not up yet
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`The site did not start on port ${PORT}. Run \`npm run build\` first.`)
}

try {
  await waitForServer()
  const browser = await chromium.launch()
  const page = await browser.newPage()
  // Paper wants the light theme.
  await page.addInitScript(() => localStorage.setItem('portfolio.theme', 'parchment'))
  await page.goto(`http://localhost:${PORT}/tldr`, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  // Links in the PDF must point at the live site, not at this local server.
  await page.evaluate(
    ({ local, live }) => {
      for (const a of document.querySelectorAll('a[href]')) {
        if (a.href.startsWith(local)) a.href = live + a.href.slice(local.length)
      }
    },
    { local: `http://localhost:${PORT}`, live: SITE_URL },
  )
  await page.emulateMedia({ media: 'print' })
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: false,
    margin: { top: '14mm', bottom: '14mm', left: '14mm', right: '14mm' },
  })
  await browser.close()

  // The page tree's /Count is the PDF's own page total.
  const counts = [...pdf.toString('latin1').matchAll(/\/Count\s+(\d+)/g)].map((m) => Number(m[1]))
  const pages = Math.max(0, ...counts)
  if (pages > MAX_PAGES) throw new Error(`The CV runs to ${pages} pages; keep it to ${MAX_PAGES}.`)

  fs.writeFileSync(CV_PDF, pdf)
  fs.writeFileSync(CV_HASH, `${cvSourceHash()}\n`)
  console.log(
    `Wrote ${CV_PDF} (${pages} page${pages === 1 ? '' : 's'}, ${Math.round(pdf.length / 1024)} KB).`,
  )
} finally {
  server.kill()
}
