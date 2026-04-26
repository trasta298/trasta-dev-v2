import { useEffect, useState } from 'react'
import './share-buttons.css'

type ShareButtonsProps = {
  title: string
  /** Path (e.g. "/blog/foo") or absolute URL. Resolved against the current origin. */
  url: string
  label?: string
  copy?: string
  copied?: string
  copiedSr?: string
  share?: string
  xAria?: string
}

export function ShareButtons({
  title,
  url: pathOrUrl,
  label = 'share',
  copy = 'copy url',
  copied: copiedText = 'copied!',
  copiedSr = 'URL をコピーしました',
  share: shareText = 'share',
  xAria = 'share on x',
}: ShareButtonsProps) {
  const [origin, setOrigin] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [canNativeShare, setCanNativeShare] = useState(false)

  useEffect(() => {
    setOrigin(window.location.origin)
    setCanNativeShare(typeof navigator !== 'undefined' && 'share' in navigator)
  }, [])

  const isAbsolute = /^https?:\/\//.test(pathOrUrl)
  const url = isAbsolute ? pathOrUrl : origin ? `${origin}${pathOrUrl}` : ''

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* noop */
    }
  }

  async function nativeShare() {
    if (!('share' in navigator)) return
    try {
      await navigator.share({ title, url, text: title })
    } catch {
      /* user cancelled */
    }
  }

  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  return (
    <div className="share-buttons" role="group" aria-label={label}>
      <span className="share-buttons__label" aria-hidden>
        {label}
      </span>
      <a
        className="share-buttons__icon bare"
        href={xUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={xAria}
        title={xAria}
        data-kind="x"
      >
        <XIcon />
      </a>
      <button
        type="button"
        className="share-buttons__icon"
        onClick={copyToClipboard}
        data-state={copied ? 'copied' : 'idle'}
        aria-label={copied ? copiedText : copy}
        title={copied ? copiedText : copy}
        data-kind="copy"
      >
        {copied ? <CheckIcon /> : <LinkIcon />}
      </button>
      <span
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="share-buttons__status"
      >
        {copied ? copiedSr : ''}
      </span>
      {canNativeShare ? (
        <button
          type="button"
          className="share-buttons__icon"
          onClick={nativeShare}
          aria-label={shareText}
          title={shareText}
          data-kind="share"
        >
          <ShareIcon />
        </button>
      ) : null}
    </div>
  )
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="currentColor"
        d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <rect
        x="8"
        y="8"
        width="12"
        height="12"
        rx="2.2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 12.5l4.5 4.5L19 7.5"
      />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3v12M12 3l-4 4M12 3l4 4M5 13v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"
      />
    </svg>
  )
}
