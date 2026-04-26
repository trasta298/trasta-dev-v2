import { Link } from '@tanstack/react-router'
import { useLocale, localizePath } from '../../lib/i18n/locale'
import './site-mark.css'

export function SiteMark() {
  const locale = useLocale()
  const home = localizePath('/', locale)
  return (
    <Link to={home} className="site-mark bare" aria-label="trasta home">
      <span className="site-mark__title">trasta</span>
      <span className="site-mark__sub" aria-hidden>
        とらすた
      </span>
    </Link>
  )
}
