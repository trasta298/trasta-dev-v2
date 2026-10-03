import { getAllPosts } from '../content/blog'
import { getAllWorks } from '../content/works'
import { hasLocaleVersion } from '../i18n/availability'
import { LOCALES, localizePath } from '../i18n/locale'
import { SITE, siteCopy } from './site'

type Page = { path: string; lastmod?: string }

const STATIC_PATHS = ['/', '/blog', '/works', '/about']

function collectPages(): Page[] {
  const pages = new Map<string, Page>()
  for (const path of STATIC_PATHS) pages.set(path, { path })
  for (const locale of LOCALES) {
    for (const post of getAllPosts(locale)) {
      if (post.frontmatter.externalUrl) continue
      const path = `/blog/${post.slug}`
      const lastmod = post.frontmatter.updatedAt ?? post.frontmatter.publishedAt
      const prev = pages.get(path)?.lastmod
      pages.set(path, { path, lastmod: prev && prev > lastmod ? prev : lastmod })
    }
    for (const work of getAllWorks(locale)) {
      const path = `/works/${work.slug}`
      if (!pages.has(path)) pages.set(path, { path, lastmod: work.frontmatter.publishedAt })
    }
  }
  return [...pages.values()]
}

function absolute(path: string): string {
  return new URL(encodeURI(path), SITE.url).toString()
}

export function buildSitemap(): string {
  const urls = collectPages().flatMap(({ path, lastmod }) => {
    const available = LOCALES.filter((locale) => hasLocaleVersion(path, locale))
    const alternates = available
      .map(
        (locale) =>
          `<xhtml:link rel="alternate" hreflang="${siteCopy(locale).htmlLang}" href="${absolute(localizePath(path, locale))}"/>`,
      )
      .join('')
    return available.map(
      (locale) =>
        `<url><loc>${absolute(localizePath(path, locale))}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}${available.length > 1 ? alternates : ''}</url>`,
    )
  })

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`
}

export function sitemapResponse(): Response {
  return new Response(buildSitemap(), {
    headers: {
      'content-type': 'application/xml; charset=utf-8',
      'cache-control': 'public, max-age=3600',
    },
  })
}
