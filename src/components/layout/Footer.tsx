import { Link } from '@tanstack/react-router'
import { LangSwitcher } from '../i18n/LangSwitcher'
import { useLocale, localizePath } from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import './footer.css'

export function Footer() {
  const year = new Date().getFullYear()
  const locale = useLocale()
  const dict = getDict(locale)
  const blog = localizePath('/blog', locale)
  const works = localizePath('/works', locale)
  const about = localizePath('/about', locale)

  return (
    <footer className="site-footer">
      <div className="site-footer__divider" aria-hidden>
        <img
          src="/images/tiger-peeking-wall.png"
          alt=""
          width={520}
          height={130}
          loading="lazy"
          className="site-footer__tiger"
        />
      </div>
      <div className="site-footer__inner page-wrap">
        <p className="site-footer__copy">© {year} trasta · trasta.dev</p>
        <nav aria-label="footer" className="site-footer__nav">
          <Link to={blog} className="bare">{dict.footer.blog}</Link>
          <Link to={works} className="bare">{dict.footer.works}</Link>
          <Link to={about} className="bare">{dict.footer.about}</Link>
        </nav>
        <LangSwitcher />
      </div>
    </footer>
  )
}
