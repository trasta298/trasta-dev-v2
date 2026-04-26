import type { Locale } from '../i18n/locale'
import type { MdxModule, WorkEntry, WorkFrontmatter } from './types'

const jaModules = import.meta.glob<MdxModule<WorkFrontmatter>>(
  '/src/content/works/*.mdx',
  { eager: true },
)
const enModules = import.meta.glob<MdxModule<WorkFrontmatter>>(
  '/src/content/en/works/*.mdx',
  { eager: true },
)

function slugFromPath(path: string): string {
  return path.replace(/^.*\/works\//, '').replace(/\.mdx$/, '')
}

function buildEntries(
  modules: Record<string, MdxModule<WorkFrontmatter>>,
): WorkEntry[] {
  return Object.entries(modules)
    .map(([path, mod]) => ({
      slug: slugFromPath(path),
      frontmatter: mod.frontmatter,
      Component: mod.default,
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
  ja: buildEntries(jaModules),
  en: buildEntries(enModules),
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
