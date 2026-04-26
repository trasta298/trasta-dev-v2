import { useRouterState } from '@tanstack/react-router'

export type Locale = 'ja' | 'en'

export const LOCALES = ['ja', 'en'] as const satisfies ReadonlyArray<Locale>
export const DEFAULT_LOCALE: Locale = 'ja'

export function detectLocaleFromPath(pathname: string): Locale {
  if (pathname === '/en' || pathname.startsWith('/en/')) return 'en'
  return 'ja'
}

export function useLocale(): Locale {
  return useRouterState({
    select: (s) => detectLocaleFromPath(s.location.pathname),
  })
}

export function localizePath(path: string, locale: Locale): string {
  if (locale === 'ja') return path
  if (path === '/') return '/en'
  return `/en${path.startsWith('/') ? path : `/${path}`}`
}

export function stripLocale(pathname: string): string {
  if (pathname === '/en') return '/'
  if (pathname.startsWith('/en/')) return pathname.slice(3)
  return pathname
}
