// Redaction marks for classified content: `[[redacted:12]]` is drawn as a
// black bar 12 characters wide. Nothing is hidden under the bar — the real
// detail never enters the source, so the page cannot leak it.

const TOKEN = /\[\[redacted:(\d{1,2})\]\]/g
const ANY_MARK = /\[\[[^\]]*\]\]/g

export type Segment = { kind: 'text'; text: string } | { kind: 'redacted'; width: number }

export function splitRedactions(text: string): Segment[] {
  const segments: Segment[] = []
  let last = 0
  for (const match of text.matchAll(TOKEN)) {
    if (match.index > last) segments.push({ kind: 'text', text: text.slice(last, match.index) })
    segments.push({ kind: 'redacted', width: Number(match[1]) })
    last = match.index + match[0].length
  }
  if (last < text.length) segments.push({ kind: 'text', text: text.slice(last) })
  return segments
}

/** For places that only take plain text: meta descriptions, the résumé, search. */
export function plainText(text: string) {
  return text.replace(TOKEN, '[redacted]')
}

/** Marks that look like redactions but are not valid ones, e.g. `[[redacted]]`. */
export function malformedRedactions(text: string) {
  return [...text.matchAll(ANY_MARK)]
    .map((m) => m[0])
    .filter((m) => !/^\[\[redacted:\d{1,2}\]\]$/.test(m))
}
