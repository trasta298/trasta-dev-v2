import { Link } from '@tanstack/react-router'
import type { Locale } from '../../lib/i18n/locale'
import { localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import type { BlogFrontmatter, WorkFrontmatter } from '../../lib/content/types'

export type HomePageProps = {
  locale: Locale
  posts: ReadonlyArray<{
    slug: string
    frontmatter: BlogFrontmatter
    readingMinutes: number
  }>
  works: ReadonlyArray<{ slug: string; frontmatter: WorkFrontmatter }>
}

export function HomePage({ locale, posts, works }: HomePageProps) {
  const dict = getDict(locale)
  const blogPath = localizePath('/blog', locale)
  const worksPath = localizePath('/works', locale)
  const aboutPath = localizePath('/about', locale)

  return (
    <>
      <section className="home-hero page-wrap">
        <div className="home-hero__copy rise-in">
          <p className="kicker">{dict.home.kicker}</p>
          <h1 className="home-hero__title">
            <span className="home-hero__title-en">trasta</span>
            <span className="home-hero__title-ja" aria-hidden>
              とらすた
            </span>
          </h1>
          <p className="home-hero__lead">
            {dict.home.leadEn}
            <br />
            <span className="muted">{dict.home.leadJa}</span>
          </p>
          <div className="home-hero__ctas">
            <Link to={blogPath} className="home-cta home-cta--primary">
              {dict.home.ctaPrimary}
            </Link>
            <Link to={aboutPath} className="home-cta home-cta--ghost">
              {dict.home.ctaGhost}
            </Link>
          </div>
        </div>

        <div className="home-hero__art" aria-hidden>
          <div className="home-hero__cat-wrap">
            <img
              src="/images/tiger-peeking-wall-effects.png"
              alt=""
              width={520}
              height={130}
              className="home-hero__tiger"
            />
            <span className="hero-eff hero-eff--yellow" />
            <span className="hero-eff hero-eff--mint" />
            <span className="hero-eff hero-eff--pink" />
            <span className="hero-eff hero-eff--lavender" />
            <span className="hero-eff hero-eff--orange" />
          </div>
        </div>
      </section>

      <section className="home-section page-wrap" aria-labelledby="latest-posts">
        <header className="home-section__head">
          <h2 id="latest-posts" className="home-section__title">
            <span className="kicker">{dict.home.latestKicker}</span>
            <span className="home-section__title-en">{dict.home.latestTitle}</span>
          </h2>
          <Link to={blogPath} className="home-section__more bare">
            {dict.home.latestMore}
          </Link>
        </header>

        <ul className="home-posts">
          {posts.map((post, idx) => {
            const isExternal = !!post.frontmatter.externalUrl
            const inner = (
              <>
                <p className="home-post__date">
                  {formatDate(post.frontmatter.publishedAt, locale)}
                </p>
                <h3 className="home-post__title">{post.frontmatter.title}</h3>
                <p className="home-post__desc">{post.frontmatter.description}</p>
                <div className="home-post__meta">
                  {post.frontmatter.tags.slice(0, 3).map((tag, i) => (
                    <span key={tag} className="tag" data-color={accentForIndex(i)}>
                      {tag}
                    </span>
                  ))}
                  <span className="home-post__time muted">
                    {isExternal
                      ? `${siteFromUrl(post.frontmatter.externalUrl) ?? 'external'} ↗`
                      : dict.blog.minSuffix(post.readingMinutes)}
                  </span>
                </div>
              </>
            )

            return (
              <li
                key={post.slug}
                className="home-posts__item rise-in"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                {isExternal ? (
                  <a
                    href={post.frontmatter.externalUrl}
                    className="home-post"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {inner}
                  </a>
                ) : (
                  <Link
                    to={localizePath('/blog/$slug', locale)}
                    params={{ slug: post.slug }}
                    className="home-post"
                  >
                    {inner}
                  </Link>
                )}
              </li>
            )
          })}
        </ul>
      </section>

      <section className="home-bottom page-wrap">
        <article className="home-bottom__works" aria-labelledby="works-preview">
          <header className="home-section__head">
            <h2 id="works-preview" className="home-section__title">
              <span className="kicker">{dict.home.worksKicker}</span>
              <span className="home-section__title-en">{dict.home.worksTitle}</span>
            </h2>
            <Link to={worksPath} className="home-section__more bare">
              {dict.home.worksMore}
            </Link>
          </header>
          <ul className="home-works">
            {works.map((work) => (
              <li key={work.slug} className="home-works__item">
                <Link
                  to={localizePath('/works/$slug', locale)}
                  params={{ slug: work.slug }}
                  className="home-work"
                >
                  <span className="home-work__dot" aria-hidden />
                  <span className="home-work__title">{work.frontmatter.title}</span>
                  <span className="home-work__desc muted">
                    {work.frontmatter.description}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </article>

        <article className="home-bottom__about" aria-labelledby="about-preview">
          <header className="home-section__head">
            <h2 id="about-preview" className="home-section__title">
              <span className="kicker">{dict.home.aboutKicker}</span>
              <span className="home-section__title-en">{dict.home.aboutTitle}</span>
            </h2>
            <Link to={aboutPath} className="home-section__more bare">
              {dict.home.aboutMore}
            </Link>
          </header>
          <p className="home-about__lead">{dict.home.aboutBody}</p>
        </article>
      </section>
    </>
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
