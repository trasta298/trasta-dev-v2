import type { ComponentType } from 'react'
import type { Locale } from '../i18n/locale'
import type { TocItem } from '../toc/remark-toc'
import type { BlogFrontmatter } from './types'

type BlogModule = {
  default: ComponentType
  frontmatter: BlogFrontmatter
  toc?: ReadonlyArray<TocItem>
  readingMinutes?: number
}

const jaModules = import.meta.glob<BlogModule>('/src/content/blog/*.mdx', {
  eager: true,
})
const enModules = import.meta.glob<BlogModule>('/src/content/en/blog/*.mdx', {
  eager: true,
})

function slugFromPath(path: string): string {
  return path.replace(/^.*\/blog\//, '').replace(/\.mdx$/, '')
}

export type BlogEntry = {
  slug: string
  frontmatter: BlogFrontmatter
  Component: ComponentType
  toc: ReadonlyArray<TocItem>
  readingMinutes: number
}

function buildEntries(modules: Record<string, BlogModule>): BlogEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => ({
      slug: slugFromPath(path),
      frontmatter: mod.frontmatter,
      Component: mod.default,
      toc: mod.toc ?? [],
      readingMinutes: mod.readingMinutes ?? 1,
    }))
    .filter((entry) => !entry.frontmatter.draft)
    .sort(
      (a, b) =>
        Date.parse(b.frontmatter.publishedAt) -
        Date.parse(a.frontmatter.publishedAt),
    )
}

const rawEntries: Record<Locale, BlogEntry[]> = {
  ja: buildEntries(jaModules),
  en: buildEntries(enModules),
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
  const seen = new Set<string>()
  for (const entry of entriesByLocale[locale]) {
    for (const tag of entry.frontmatter.tags) seen.add(tag)
  }
  return [...seen].sort((a, b) => a.localeCompare(b))
}
