import { Link, useRouter, type ErrorComponentProps } from '@tanstack/react-router'
import { useLocale, localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import './not-found.css'

export function SiteError({ reset }: ErrorComponentProps) {
  const router = useRouter()
  const locale = useLocale()
  const dict = getDict(locale)
  const home = localizePath('/', locale)

  function retry() {
    reset()
    void router.invalidate()
  }

  return (
    <div className="page-wrap not-found">
      <p className="kicker">{dict.error.kicker}</p>
      <h1 className="not-found__title">
        {locale === 'ja' ? (
          <>
            このページは <span className="not-found__title-en">{dict.error.titleEn}</span>。
          </>
        ) : (
          <>
            this page is <span className="not-found__title-en">{dict.error.titleEn}</span>.
          </>
        )}
      </h1>
      <p className="not-found__lead">{dict.error.lead}</p>

      <div className="not-found__cta">
        <button type="button" onClick={retry} className="home-cta home-cta--primary">
          {dict.error.retry}
        </button>
        <Link to={home} className="home-cta home-cta--ghost">
          {dict.notFound.home}
        </Link>
      </div>
    </div>
  )
}
