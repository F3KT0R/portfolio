// Call windows are fixed in Tibor's time zone; visitors see them in their own.

export const HOME_TIME_ZONE = 'Europe/Belgrade'

export const callWindows = [
  { value: 'morning', label: 'Morning', from: 9, to: 12 },
  { value: 'afternoon', label: 'Afternoon', from: 13, to: 17 },
] as const

export type CallWindow = (typeof callWindows)[number]['value']

export const callDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] as const

/** Minutes the zone is ahead of UTC at `date`. */
export function zoneOffsetMinutes(timeZone: string, date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(date)
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value)
  const asUtc = Date.UTC(get('year'), get('month') - 1, get('day'), get('hour'), get('minute'))
  return Math.round((asUtc - date.getTime()) / 60_000)
}

/**
 * A home-time window shown in another zone, e.g. "08:00–11:00" in London for
 * 09:00–12:00 in Belgrade. Returns null when both zones agree on the time.
 */
export function windowIn(timeZone: string, from: number, to: number, now: Date): string | null {
  const shift = zoneOffsetMinutes(timeZone, now) - zoneOffsetMinutes(HOME_TIME_ZONE, now)
  if (shift === 0) return null
  const format = (hour: number) => {
    const minutes = (((hour * 60 + shift) % 1440) + 1440) % 1440
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`
  }
  return `${format(from)}–${format(to)}`
}
