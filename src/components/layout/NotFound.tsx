import { Link } from '@tanstack/react-router'
import { useLocale, localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import './not-found.css'

export function NotFound() {
  const locale = useLocale()
  const dict = getDict(locale)
  const home = localizePath('/', locale)
  const blog = localizePath('/blog', locale)

  return (
    <div className="page-wrap not-found">
      <p className="kicker">{dict.notFound.kicker}</p>
      <h1 className="not-found__title">
        {locale === 'ja' ? (
          <>
            そのページは <span className="not-found__title-en">{dict.notFound.titleEn}</span>。
          </>
        ) : (
          <>
            this page is <span className="not-found__title-en">{dict.notFound.titleEn}</span>.
          </>
        )}
      </h1>
      <p className="not-found__lead">{dict.notFound.lead}</p>

      <div className="not-found__cta">
        <Link to={home} className="home-cta home-cta--primary">
          {dict.notFound.home}
        </Link>
        <Link to={blog} className="home-cta home-cta--ghost">
          {dict.notFound.blog}
        </Link>
      </div>

      <div className="not-found__tiger" aria-hidden>
        <img src="/images/tiger-peeking-wall.png" alt="" loading="lazy" />
      </div>
    </div>
  )
}
