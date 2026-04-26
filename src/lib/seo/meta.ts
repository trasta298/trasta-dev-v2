import type { Locale } from '../i18n/locale'
import { localizePath } from '../i18n/locale'
import { homeOgImage } from '../og/url'
import { SITE, siteCopy } from './site'

type MetaArgs = {
  title?: string
  description?: string
  url?: string
  image?: string
  type?: 'website' | 'article'
  publishedAt?: string
  updatedAt?: string
  tags?: ReadonlyArray<string>
  locale?: Locale
}

type MetaTag = Record<string, string>
type LinkTag = Record<string, string>

export function buildMeta(args: MetaArgs): MetaTag[] {
  return buildHead(args).meta
}

export function buildHead({
  title,
  description,
  url,
  image,
  type = 'website',
  publishedAt,
  updatedAt,
  tags,
  locale = 'ja',
}: MetaArgs): { meta: MetaTag[]; links: LinkTag[] } {
  const copy = siteCopy(locale)
  const fullTitle = title
    ? `${title} — ${SITE.name}`
    : `${SITE.name} / ${SITE.nameJa}`
  const desc = description ?? copy.description
  const canonicalPath = url ?? localizePath('/', locale)
  const canonical = new URL(canonicalPath, SITE.url).toString()
  const ogImage = image ?? homeOgImage(locale)

  const altLocale: Locale = locale === 'ja' ? 'en' : 'ja'
  const altCopy = siteCopy(altLocale)
  const stripped =
    canonicalPath === '/en'
      ? '/'
      : canonicalPath.startsWith('/en/')
        ? canonicalPath.slice(3)
        : canonicalPath
  const altPath = localizePath(stripped, altLocale)
  const altUrl = new URL(altPath, SITE.url).toString()

  const tagMeta = (tags ?? []).map((t) => ({ property: 'article:tag', content: t }))

  const meta: MetaTag[] = [
    { title: fullTitle },
    { name: 'description', content: desc },
    { property: 'og:title', content: fullTitle },
    { property: 'og:description', content: desc },
    { property: 'og:url', content: canonical },
    { property: 'og:type', content: type },
    { property: 'og:site_name', content: SITE.name },
    { property: 'og:image', content: new URL(ogImage, SITE.url).toString() },
    { property: 'og:locale', content: copy.ogLocale },
    { property: 'og:locale:alternate', content: altCopy.ogLocale },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: fullTitle },
    { name: 'twitter:description', content: desc },
    { name: 'twitter:image', content: new URL(ogImage, SITE.url).toString() },
    ...(publishedAt
      ? [{ property: 'article:published_time', content: publishedAt }]
      : []),
    ...(updatedAt
      ? [{ property: 'article:modified_time', content: updatedAt }]
      : []),
    ...tagMeta,
  ]

  const links: LinkTag[] = [
    { rel: 'canonical', href: canonical },
    { rel: 'alternate', hrefLang: copy.htmlLang, href: canonical },
    { rel: 'alternate', hrefLang: altCopy.htmlLang, href: altUrl },
    {
      rel: 'alternate',
      hrefLang: 'x-default',
      href: new URL(stripped, SITE.url).toString(),
    },
  ]

  return { meta, links }
}
