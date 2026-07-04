import { useEffect, useState } from 'react'
import './theme-toggle.css'

type Resolved = 'light' | 'dark'

function applyResolved(resolved: Resolved, isExplicit: boolean) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.remove('light', 'dark')
  root.classList.add(resolved)
  if (isExplicit) root.setAttribute('data-theme', resolved)
  else root.removeAttribute('data-theme')
  root.style.colorScheme = resolved
}

export function ThemeToggle() {
  const [explicit, setExplicit] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    setExplicit(stored === 'light' || stored === 'dark')
  }, [])

  useEffect(() => {
    if (explicit) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      applyResolved(media.matches ? 'dark' : 'light', false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [explicit])

  function toggle() {
    const isDark = document.documentElement.classList.contains('dark')
    const next: Resolved = isDark ? 'light' : 'dark'
    setExplicit(true)
    applyResolved(next, true)
    window.localStorage.setItem('theme', next)
  }

  // アイコン/ラベルは両方描画して root のクラスで CSS 切替 (hydration 前の light フラッシュ防止)
  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label="toggle theme"
      title="toggle theme"
    >
      <span
        className="theme-toggle__icon theme-toggle__icon--sun"
        aria-hidden="true"
      >
        <SunIcon />
      </span>
      <span
        className="theme-toggle__icon theme-toggle__icon--moon"
        aria-hidden="true"
      >
        <MoonIcon />
      </span>
      <span className="theme-toggle__text theme-toggle__text--light" aria-hidden="true">
        light
      </span>
      <span className="theme-toggle__text theme-toggle__text--dark" aria-hidden="true">
        dark
      </span>
    </button>
  )
}

function SunIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="14"
      height="14"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
      <path d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.2 5.2l1.55 1.55M17.25 17.25l1.55 1.55M5.2 18.8l1.55-1.55M17.25 6.75l1.55-1.55" />
    </svg>
  )
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
      <path d="M20.5 14.2A8 8 0 1 1 9.8 3.5a.9.9 0 0 1 1.05 1.2A6.4 6.4 0 0 0 19.3 13.15a.9.9 0 0 1 1.2 1.05z" />
    </svg>
  )
}
