import { parseIsoDate } from '@/lib/dates'

// Tibor's level is honest arithmetic: one level per full year of professional
// software work since `careerStart`. XP is the share of the current year done,
// so the bar fills in real time towards the next work anniversary.

export const XP_PER_LEVEL = 1000

export type LevelInfo = {
  level: number
  xp: number
  xpToNext: number
  /** 0..1 progress towards the next level. */
  progress: number
  nextLevelOn: Date
}

function addYears(date: Date, years: number) {
  const next = new Date(date)
  next.setUTCFullYear(date.getUTCFullYear() + years)
  return next
}

export function levelFromCareer(careerStart: string, now: Date): LevelInfo {
  const start = parseIsoDate(careerStart)
  if (now < start) {
    return { level: 0, xp: 0, xpToNext: XP_PER_LEVEL, progress: 0, nextLevelOn: start }
  }

  let level = now.getUTCFullYear() - start.getUTCFullYear()
  if (addYears(start, level) > now) level -= 1

  const levelStart = addYears(start, level)
  const nextLevelOn = addYears(start, level + 1)
  const progress =
    (now.getTime() - levelStart.getTime()) / (nextLevelOn.getTime() - levelStart.getTime())
  const xp = Math.floor(progress * XP_PER_LEVEL)

  return { level, xp, xpToNext: XP_PER_LEVEL - xp, progress, nextLevelOn }
}
