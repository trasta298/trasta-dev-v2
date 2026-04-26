import { Link } from '@tanstack/react-router'
import { SiteMark } from './SiteMark'
import { ThemeToggle } from './ThemeToggle'
import { useLocale, localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import './header.css'

export function Header() {
  const locale = useLocale()
  const dict = getDict(locale)
  const blog = localizePath('/blog', locale)
  const works = localizePath('/works', locale)
  const about = localizePath('/about', locale)

  return (
    <header className="site-header">
      <div className="site-header__inner page-wrap">
        <SiteMark />
        <nav aria-label="primary" className="site-nav">
          <Link
            to={blog}
            className="site-nav__link"
            activeProps={{ className: 'site-nav__link is-active' }}
            activeOptions={{ exact: false }}
          >
            {dict.nav.blog}
          </Link>
          <Link
            to={works}
            className="site-nav__link"
            activeProps={{ className: 'site-nav__link is-active' }}
            activeOptions={{ exact: false }}
          >
            {dict.nav.works}
          </Link>
          <Link
            to={about}
            className="site-nav__link"
            activeProps={{ className: 'site-nav__link is-active' }}
            activeOptions={{ exact: false }}
          >
            {dict.nav.about}
          </Link>
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}
