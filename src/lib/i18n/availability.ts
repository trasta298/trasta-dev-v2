import { getPostBySlug } from '../content/blog'
import { getWorkBySlug } from '../content/works'
import { stripLocale, type Locale } from './locale'

const DETAIL_PATTERN = /^\/(blog|works)\/([^/]+)\/?$/

export function hasLocaleVersion(pathname: string, locale: Locale): boolean {
  const m = DETAIL_PATTERN.exec(stripLocale(pathname))
  if (!m) return true
  const [, kind, rawSlug] = m
  let slug: string
  try {
    slug = decodeURIComponent(rawSlug)
  } catch {
    return false
  }
  if (kind === 'works') return Boolean(getWorkBySlug(slug, locale))
  const post = getPostBySlug(slug, locale)
  return Boolean(post && !post.frontmatter.externalUrl)
}
