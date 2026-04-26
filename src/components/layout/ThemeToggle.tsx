import { useEffect, useState } from 'react'
import './theme-toggle.css'

type Resolved = 'light' | 'dark'

function readResolved(): Resolved {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

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
  const [resolved, setResolved] = useState<Resolved>('light')
  const [explicit, setExplicit] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = window.localStorage.getItem('theme')
    const isExplicit = stored === 'light' || stored === 'dark'
    const r = readResolved()
    setResolved(r)
    setExplicit(isExplicit)
    applyResolved(r, isExplicit)
    setMounted(true)
  }, [])

  useEffect(() => {
    if (explicit) return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => {
      const next: Resolved = media.matches ? 'dark' : 'light'
      setResolved(next)
      applyResolved(next, false)
    }
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [explicit])

  function toggle() {
    const next: Resolved = resolved === 'light' ? 'dark' : 'light'
    setResolved(next)
    setExplicit(true)
    applyResolved(next, true)
    window.localStorage.setItem('theme', next)
  }

  const label = `theme: ${resolved}`

  return (
    <button
      type="button"
      className="theme-toggle"
      onClick={toggle}
      aria-label={label}
      title={label}
      data-mounted={mounted ? 'true' : 'false'}
    >
      <span className="theme-toggle__icon" aria-hidden="true">
        {resolved === 'dark' ? <MoonIcon /> : <SunIcon />}
      </span>
      <span className="theme-toggle__text">{resolved}</span>
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
