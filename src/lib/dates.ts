// Dates in content are ISO calendar strings (YYYY-MM or YYYY-MM-DD). They are
// formatted in UTC so the server and the browser always print the same text.

const monthYear = new Intl.DateTimeFormat('en-GB', {
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function parseIsoDate(value: string) {
  const date = new Date(value.length === 7 ? `${value}-01T00:00:00Z` : `${value}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) throw new Error(`Invalid ISO date: ${value}`)
  return date
}

export function formatMonth(value: string) {
  return monthYear.format(parseIsoDate(value))
}

export function formatPeriod(start: string, end?: string) {
  if (end === start) return formatMonth(start)
  return `${formatMonth(start)} – ${end ? formatMonth(end) : 'present'}`
}
