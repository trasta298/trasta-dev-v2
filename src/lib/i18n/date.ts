import type { Locale } from './locale'

// new Date('YYYY-MM-DD') は UTC 0 時になり、UTC より西のブラウザでは前日に化けて hydration もずれる
export function formatDate(iso: string, locale: Locale): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso)
  if (!m) return iso
  const [, y, month, day] = m
  return locale === 'en' ? `${y}-${month}-${day}` : `${y}.${month}.${day}`
}
