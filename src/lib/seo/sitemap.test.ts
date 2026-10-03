import { describe, expect, it } from 'vitest'
import { hasLocaleVersion } from '../i18n/availability'
import { stripLocale } from '../i18n/locale'
import { buildSitemap } from './sitemap'
import { SITE } from './site'

const locs = [...buildSitemap().matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])

describe('sitemap', () => {
  it('lists each URL once', () => {
    expect(new Set(locs).size).toBe(locs.length)
  })

  it('only lists pages that exist in that locale', () => {
    for (const loc of locs) {
      const pathname = decodeURI(new URL(loc).pathname)
      const locale = pathname === '/en' || pathname.startsWith('/en/') ? 'en' : 'ja'
      expect(hasLocaleVersion(stripLocale(pathname), locale), loc).toBe(true)
    }
  })

  it('includes the home page in both locales', () => {
    expect(locs).toContain(`${SITE.url}/`)
    expect(locs).toContain(`${SITE.url}/en`)
  })
})
