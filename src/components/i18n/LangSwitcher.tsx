import { Link, useRouterState } from '@tanstack/react-router'
import {
  detectLocaleFromPath,
  localizePath,
  stripLocale,
  type Locale,
} from '../../lib/i18n/locale'
import { getDict } from '../../lib/i18n/dict'
import './lang-switcher.css'

const OPTIONS: ReadonlyArray<{ value: Locale; short: string }> = [
  { value: 'ja', short: 'JA' },
  { value: 'en', short: 'EN' },
]

export function LangSwitcher() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const current = detectLocaleFromPath(pathname)
  const dict = getDict(current)
  const base = stripLocale(pathname)

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={dict.langSwitcher.label}
    >
      {OPTIONS.map((opt) => {
        const target = localizePath(base, opt.value)
        const isActive = current === opt.value
        return (
          <Link
            key={opt.value}
            to={target}
            className="lang-switcher__btn bare"
            data-active={isActive ? 'true' : 'false'}
            aria-current={isActive ? 'true' : undefined}
            preload={false}
            onClick={() => {
              if (typeof document === 'undefined') return
              document.cookie = `lang=${opt.value}; path=/; max-age=31536000; samesite=lax`
            }}
          >
            {opt.short}
          </Link>
        )
      })}
    </div>
  )
}
