import { Link } from '@tanstack/react-router'
import { Article } from '../article/Article'
import { ShareButtons } from '../article/ShareButtons'
import { Toc } from '../article/Toc'
import { Callout } from '../embeds/Callout'
import { Sparkle } from '../motion/Sparkle'
import type { Locale } from '../../lib/i18n/locale'
import { localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import { getPostBySlug } from '../../lib/content/blog'
import type { BlogFrontmatter } from '../../lib/content/types'
import type { TocItem } from '../../lib/toc/remark-toc'

export type BlogPostPageProps = {
  locale: Locale
  slug: string
  frontmatter: BlogFrontmatter
  readingMinutes: number
  toc: ReadonlyArray<TocItem>
}

export function BlogPostPage({
  locale,
  slug,
  frontmatter,
  readingMinutes,
  toc,
}: BlogPostPageProps) {
  const dict = getDict(locale)
  const post = getPostBySlug(slug, locale)
  if (!post) return null
  const Component = post.Component
  const blogIndex = localizePath('/blog', locale)
  const postPath = localizePath(`/blog/${slug}`, locale)

  return (
    <article className="post-page page-wrap">
      <div className="post-page__back">
        <Link to={blogIndex} className="bare">
          {dict.blog.backToAll}
        </Link>
      </div>

      <header className="post-page__head">
        <p className="post-page__meta">
          <time dateTime={frontmatter.publishedAt}>
            {formatDate(frontmatter.publishedAt, locale)}
          </time>
          {frontmatter.updatedAt ? (
            <span className="muted">
              {' '}· {dict.blog.updatedPrefix}{' '}
              {formatDate(frontmatter.updatedAt, locale)}
            </span>
          ) : null}
          <span className="muted"> · {dict.blog.minSuffix(readingMinutes)}</span>
        </p>
        <h1 className="post-page__title">
          <span className="post-page__title-text">{frontmatter.title}</span>
          <Sparkle
            color="yellow"
            size={18}
            top="-10px"
            right="-22px"
            delay={400}
            variant="bob-soft"
          />
        </h1>
        <p className="post-page__desc">{frontmatter.description}</p>
        <div className="post-page__tags">
          {frontmatter.tags.map((tag, i) => (
            <span key={tag} className="tag" data-color={accentForIndex(i)}>
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="post-page__layout">
        <aside className="post-page__sidebar">
          <Toc items={toc} label={dict.toc.label} />
        </aside>
        <div className="post-page__content">
          <Article>
            {locale === 'en' ? (
              <Callout type="note" title={dict.blog.translatedNoticeLabel}>
                <p>
                  {dict.blog.translatedNoticeBody}{' '}
                  <Link to="/blog/$slug" params={{ slug }}>
                    {dict.blog.translatedNoticeOriginal}
                  </Link>
                </p>
              </Callout>
            ) : null}
            <Component />
          </Article>
          <hr />
          <ShareButtons
            title={frontmatter.title}
            url={postPath}
            label={dict.share.label}
            copy={dict.share.copy}
            copied={dict.share.copied}
            copiedSr={dict.share.copiedSr}
            share={dict.share.share}
            xAria={dict.share.xAria}
          />
        </div>
      </div>
    </article>
  )
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
