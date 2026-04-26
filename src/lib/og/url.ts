import type { Locale } from '../i18n/locale'

export function dynamicOgImage(
  kind: 'blog' | 'works',
  locale: Locale,
  slug: string,
): string {
  const localeSegment = locale === 'en' ? '/en' : ''
  return `/og${localeSegment}/${kind}/${encodeURIComponent(slug)}.png`
}

export function homeOgImage(locale: Locale): string {
  return locale === 'en' ? '/og/en/home.png' : '/og/home.png'
}
