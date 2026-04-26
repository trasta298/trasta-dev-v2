import { Link } from '@tanstack/react-router'
import { useMemo, useState } from 'react'
import { Sparkle } from '../motion/Sparkle'
import type { Locale } from '../../lib/i18n/locale'
import { localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import type { BlogFrontmatter } from '../../lib/content/types'

export type BlogIndexPageProps = {
  locale: Locale
  posts: ReadonlyArray<{
    slug: string
    frontmatter: BlogFrontmatter
    readingMinutes: number
  }>
  tags: ReadonlyArray<string>
}

export function BlogIndexPage({ locale, posts, tags }: BlogIndexPageProps) {
  const dict = getDict(locale)
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (!activeTag) return posts
    return posts.filter((p) => p.frontmatter.tags.includes(activeTag))
  }, [posts, activeTag])

  return (
    <div className="page-wrap blog-index">
      <header className="blog-index__head">
        <p className="kicker">{dict.blog.kicker}</p>
        <h1 className="blog-index__title">
          <span className="blog-index__title-en">{dict.blog.titleEn}</span>
          <span className="blog-index__title-ja muted" aria-hidden>
            {dict.blog.titleJa}
          </span>
          <Sparkle color="yellow" size={22} top="-12px" right="-26px" />
        </h1>
        <p className="blog-index__lead">{dict.blog.lead}</p>

        <div className="blog-index__tags" role="group" aria-label="filter by tag">
          <button
            type="button"
            className="blog-index__tag"
            data-active={activeTag === null ? 'true' : 'false'}
            onClick={() => setActiveTag(null)}
          >
            {dict.blog.filterAll}
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              className="blog-index__tag"
              data-active={activeTag === tag ? 'true' : 'false'}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </header>

      <ul className="blog-list">
        {filtered.map((post, idx) => (
          <li
            key={post.slug}
            className="blog-list__item rise-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <BlogCard post={post} locale={locale} dict={dict} />
          </li>
        ))}
        {filtered.length === 0 ? (
          <li className="blog-list__empty muted">{dict.blog.empty}</li>
        ) : null}
      </ul>
    </div>
  )
}

type BlogCardPost = {
  slug: string
  frontmatter: BlogFrontmatter
  readingMinutes: number
}

function BlogCard({
  post,
  locale,
  dict,
}: {
  post: BlogCardPost
  locale: Locale
  dict: ReturnType<typeof getDict>
}) {
  const isExternal = !!post.frontmatter.externalUrl
  const externalSite =
    post.frontmatter.externalSite ?? siteFromUrl(post.frontmatter.externalUrl)

  const body = (
    <>
      <p className="blog-card__date">
        {formatDate(post.frontmatter.publishedAt, locale)}
        {post.frontmatter.updatedAt ? (
          <span className="muted">
            {' '}· {dict.blog.updatedPrefix}{' '}
            {formatDate(post.frontmatter.updatedAt, locale)}
          </span>
        ) : null}
        {isExternal ? (
          <span className="blog-card__external">
            {' '}· {externalSite ?? 'external'} ↗
          </span>
        ) : (
          <span className="muted">
            {' '}· {dict.blog.minSuffix(post.readingMinutes)}
          </span>
        )}
      </p>
      <h2 className="blog-card__title">{post.frontmatter.title}</h2>
      <p className="blog-card__desc">{post.frontmatter.description}</p>
      <div className="blog-card__tags">
        {post.frontmatter.tags.map((tag, i) => (
          <span key={tag} className="tag" data-color={accentForIndex(i)}>
            {tag}
          </span>
        ))}
      </div>
    </>
  )

  if (isExternal) {
    return (
      <a
        href={post.frontmatter.externalUrl}
        className="blog-card blog-card--external"
        target="_blank"
        rel="noopener noreferrer"
      >
        {body}
      </a>
    )
  }

  return (
    <Link
      to={localizePath('/blog/$slug', locale)}
      params={{ slug: post.slug }}
      className="blog-card"
    >
      {body}
    </Link>
  )
}

function siteFromUrl(url: string | undefined): string | undefined {
  if (!url) return undefined
  try {
    return new URL(url).host.replace(/^www\./, '')
  } catch {
    return undefined
  }
}

function formatDate(iso: string, locale: Locale): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return locale === 'en' ? `${y}-${m}-${day}` : `${y}.${m}.${day}`
}

function accentForIndex(i: number): 'yellow' | 'mint' | 'pink' | 'lavender' {
  return (['yellow', 'mint', 'pink', 'lavender'] as const)[i % 4]
}
