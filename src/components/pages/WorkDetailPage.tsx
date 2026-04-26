import { Link } from '@tanstack/react-router'
import { Article } from '../article/Article'
import type { Locale } from '../../lib/i18n/locale'
import { localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import { getWorkBySlug } from '../../lib/content/works'
import type { WorkFrontmatter } from '../../lib/content/types'

export type WorkDetailPageProps = {
  locale: Locale
  slug: string
  frontmatter: WorkFrontmatter
}

export function WorkDetailPage({
  locale,
  slug,
  frontmatter,
}: WorkDetailPageProps) {
  const dict = getDict(locale)
  const work = getWorkBySlug(slug, locale)
  if (!work) return null
  const Component = work.Component
  const worksIndex = localizePath('/works', locale)

  return (
    <article className="page-wrap work-page">
      <div className="work-page__back">
        <Link to={worksIndex} className="bare">
          {dict.works.backToAll}
        </Link>
      </div>

      <header className="work-page__head">
        <p className="kicker">{dict.works.workKicker}</p>
        <h1 className="work-page__title">{frontmatter.title}</h1>
        <p className="work-page__desc">{frontmatter.description}</p>
        <div className="work-page__meta">
          {frontmatter.tags.map((tag, i) => (
            <span key={tag} className="tag" data-color={accentForIndex(i)}>
              {tag}
            </span>
          ))}
        </div>
        <div className="work-page__links">
          {frontmatter.websiteUrl ? (
            <a className="bare work-page__link" href={frontmatter.websiteUrl} target="_blank" rel="noopener noreferrer">
              {dict.works.siteLink}
            </a>
          ) : null}
          {frontmatter.repositoryUrl ? (
            <a className="bare work-page__link" href={frontmatter.repositoryUrl} target="_blank" rel="noopener noreferrer">
              {dict.works.repoLink}
            </a>
          ) : null}
        </div>
      </header>

      {frontmatter.image ? (
        <figure className="work-page__hero">
          <img src={frontmatter.image} alt={frontmatter.title} loading="lazy" />
        </figure>
      ) : null}

      <Article>
        <Component />
      </Article>
    </article>
  )
}

function accentForIndex(i: number): 'yellow' | 'mint' | 'pink' | 'lavender' {
  return (['yellow', 'mint', 'pink', 'lavender'] as const)[i % 4]
}
