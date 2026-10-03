import { describe, expect, it } from 'vitest'
import { LOCALES } from '../i18n/locale'
import { hasLocaleVersion } from '../i18n/availability'
import { getAllPosts, getPostBySlug } from './blog'
import { getAllWorks, getWorkBySlug } from './works'

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

describe.each(LOCALES)('content (%s)', (locale) => {
  it.each(getAllPosts(locale).map((p) => [p.slug, p] as const))(
    'blog/%s has valid frontmatter',
    (_, post) => {
      expect(post.frontmatter.title).toBeTruthy()
      expect(post.frontmatter.publishedAt).toMatch(ISO_DATE)
      if (post.frontmatter.updatedAt) expect(post.frontmatter.updatedAt).toMatch(ISO_DATE)
      expect(Array.isArray(post.frontmatter.tags)).toBe(true)
    },
  )

  it.each(getAllWorks(locale).map((w) => [w.slug, w] as const))(
    'works/%s has valid frontmatter',
    (_, work) => {
      expect(work.frontmatter.title).toBeTruthy()
      expect(Array.isArray(work.frontmatter.tags)).toBe(true)
    },
  )
})

describe('translations', () => {
  it('every en post and work has a ja original', () => {
    for (const post of getAllPosts('en')) expect(getPostBySlug(post.slug, 'ja')).toBeDefined()
    for (const work of getAllWorks('en')) expect(getWorkBySlug(work.slug, 'ja')).toBeDefined()
  })
})

describe('hasLocaleVersion', () => {
  it('treats static pages as available in every locale', () => {
    expect(hasLocaleVersion('/', 'en')).toBe(true)
    expect(hasLocaleVersion('/en/about', 'ja')).toBe(true)
  })

  it('follows content for detail pages', () => {
    const post = getAllPosts('ja').find((p) => !p.frontmatter.externalUrl)!
    expect(hasLocaleVersion(`/blog/${post.slug}`, 'ja')).toBe(true)
    expect(hasLocaleVersion('/blog/does-not-exist', 'en')).toBe(false)
    expect(hasLocaleVersion('/en/works/does-not-exist', 'ja')).toBe(false)
  })

  it('rejects malformed slugs instead of throwing', () => {
    expect(hasLocaleVersion('/blog/%E0%A4%A', 'ja')).toBe(false)
  })
})
