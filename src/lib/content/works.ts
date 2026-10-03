import type { ComponentType } from 'react'
import type { Locale } from '../i18n/locale'
import { lazyBody } from './body'
import type { WorkEntry, WorkFrontmatter } from './types'

// ?meta は本文とは別モジュールになり、名前付き export だけ読むので本文はメイン chunk に入らない
const frontmatters = import.meta.glob<WorkFrontmatter>(
  ['/src/content/works/*.mdx', '/src/content/en/works/*.mdx'],
  { eager: true, query: '?meta', import: 'frontmatter' },
)
const bodies = import.meta.glob<ComponentType>(
  ['/src/content/works/*.mdx', '/src/content/en/works/*.mdx'],
  { import: 'default' },
)

function slugFromPath(path: string): string {
  return path.replace(/^.*\/works\//, '').replace(/\.mdx$/, '')
}

function buildEntries(dir: string): WorkEntry[] {
  return Object.entries(frontmatters)
    .filter(([path]) => path.startsWith(dir))
    .map(([path, frontmatter]) => ({
      slug: slugFromPath(path),
      frontmatter,
      ...lazyBody(bodies[path]),
    }))
    .sort((a, b) => {
      const aDate = a.frontmatter.publishedAt
        ? Date.parse(a.frontmatter.publishedAt)
        : 0
      const bDate = b.frontmatter.publishedAt
        ? Date.parse(b.frontmatter.publishedAt)
        : 0
      return bDate - aDate
    })
}

const entriesByLocale: Record<Locale, WorkEntry[]> = {
  ja: buildEntries('/src/content/works/'),
  en: buildEntries('/src/content/en/works/'),
}

export function getAllWorks(locale: Locale = 'ja'): ReadonlyArray<WorkEntry> {
  return entriesByLocale[locale]
}

export function getWorkBySlug(
  slug: string,
  locale: Locale = 'ja',
): WorkEntry | undefined {
  return entriesByLocale[locale].find((entry) => entry.slug === slug)
}
