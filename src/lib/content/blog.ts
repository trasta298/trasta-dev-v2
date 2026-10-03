import type { ComponentType } from 'react'
import type { Locale } from '../i18n/locale'
import type { TocItem } from '../toc/remark-toc'
import { lazyBody, type LazyBody } from './body'
import type { BlogFrontmatter } from './types'

// ?meta は本文とは別モジュールになり、名前付き export だけ読むので本文はメイン chunk に入らない
const frontmatters = import.meta.glob<BlogFrontmatter>(
  ['/src/content/blog/*.mdx', '/src/content/en/blog/*.mdx'],
  { eager: true, query: '?meta', import: 'frontmatter' },
)
const tocs = import.meta.glob<ReadonlyArray<TocItem>>(
  ['/src/content/blog/*.mdx', '/src/content/en/blog/*.mdx'],
  { eager: true, query: '?meta', import: 'toc' },
)
const minutes = import.meta.glob<number>(
  ['/src/content/blog/*.mdx', '/src/content/en/blog/*.mdx'],
  { eager: true, query: '?meta', import: 'readingMinutes' },
)
const bodies = import.meta.glob<ComponentType>(
  ['/src/content/blog/*.mdx', '/src/content/en/blog/*.mdx'],
  { import: 'default' },
)

function slugFromPath(path: string): string {
  return path.replace(/^.*\/blog\//, '').replace(/\.mdx$/, '')
}

export type BlogEntry = {
  slug: string
  frontmatter: BlogFrontmatter
  toc: ReadonlyArray<TocItem>
  readingMinutes: number
} & LazyBody

function buildEntries(dir: string): BlogEntry[] {
  return Object.entries(frontmatters)
    .filter(([path]) => path.startsWith(dir))
    .map(([path, frontmatter]) => ({
      slug: slugFromPath(path),
      frontmatter,
      ...lazyBody(bodies[path]),
      toc: tocs[path] ?? [],
      readingMinutes: minutes[path] ?? 1,
    }))
    .filter((entry) => !entry.frontmatter.draft)
    .sort(
      (a, b) =>
        Date.parse(b.frontmatter.publishedAt) -
        Date.parse(a.frontmatter.publishedAt),
    )
}

const rawEntries: Record<Locale, BlogEntry[]> = {
  ja: buildEntries('/src/content/blog/'),
  en: buildEntries('/src/content/en/blog/'),
}

// Sync reading time across translation pairs so the same article shows
// the same number of minutes in both locales (use the larger estimate).
const syncedMinutes = new Map<string, number>()
for (const entry of [...rawEntries.ja, ...rawEntries.en]) {
  const prev = syncedMinutes.get(entry.slug) ?? 0
  if (entry.readingMinutes > prev) syncedMinutes.set(entry.slug, entry.readingMinutes)
}

const entriesByLocale: Record<Locale, BlogEntry[]> = {
  ja: rawEntries.ja.map((e) => ({ ...e, readingMinutes: syncedMinutes.get(e.slug) ?? e.readingMinutes })),
  en: rawEntries.en.map((e) => ({ ...e, readingMinutes: syncedMinutes.get(e.slug) ?? e.readingMinutes })),
}

export function getAllPosts(locale: Locale = 'ja'): ReadonlyArray<BlogEntry> {
  return entriesByLocale[locale]
}

export function getPostBySlug(
  slug: string,
  locale: Locale = 'ja',
): BlogEntry | undefined {
  return entriesByLocale[locale].find((entry) => entry.slug === slug)
}

export function getAllTags(locale: Locale = 'ja'): ReadonlyArray<string> {
  const counts = new Map<string, number>()
  for (const entry of entriesByLocale[locale]) {
    for (const tag of entry.frontmatter.tags) counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  return [...counts.keys()].sort(
    (a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b),
  )
}
