import { Link } from '@tanstack/react-router'
import { Sparkle } from '../motion/Sparkle'
import type { Locale } from '../../lib/i18n/locale'
import { localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import type { WorkFrontmatter } from '../../lib/content/types'

export type WorksIndexPageProps = {
  locale: Locale
  works: ReadonlyArray<{ slug: string; frontmatter: WorkFrontmatter }>
}

export function WorksIndexPage({ locale, works }: WorksIndexPageProps) {
  const dict = getDict(locale)

  return (
    <div className="page-wrap works-index">
      <header className="works-index__head">
        <p className="kicker">{dict.works.kicker}</p>
        <h1 className="works-index__title">
          {dict.works.title}
          <Sparkle color="mint" size={22} top="-12px" right="-26px" delay={150} />
        </h1>
        <p className="works-index__lead">{dict.works.lead}</p>
      </header>

      <ul className="works-grid">
        {works.map((work, idx) => (
          <li
            key={work.slug}
            className="works-grid__item rise-in"
            style={{ animationDelay: `${Math.min(idx, 6) * 70}ms` }}
          >
            <Link
              to={localizePath('/works/$slug', locale)}
              params={{ slug: work.slug }}
              className="work-card"
            >
              {work.frontmatter.image ? (
                <div className="work-card__thumb">
                  <img src={work.frontmatter.image} alt="" loading="lazy" />
                </div>
              ) : (
                <div className="work-card__thumb work-card__thumb--placeholder">
                  <span aria-hidden>{work.frontmatter.title.slice(0, 1)}</span>
                </div>
              )}
              <div className="work-card__body">
                <h2 className="work-card__title">{work.frontmatter.title}</h2>
                <p className="work-card__desc">{work.frontmatter.description}</p>
                <div className="work-card__tags">
                  {work.frontmatter.tags.slice(0, 4).map((tag, i) => (
                    <span key={tag} className="tag" data-color={accentForIndex(i)}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

function accentForIndex(i: number): 'yellow' | 'mint' | 'pink' | 'lavender' {
  return (['yellow', 'mint', 'pink', 'lavender'] as const)[i % 4]
}
