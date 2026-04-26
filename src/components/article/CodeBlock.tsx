import { useRef, useState } from 'react'
import './code-block.css'

type PreProps = {
  children?: React.ReactNode
  'data-language'?: string
  'data-meta'?: string
  'data-filename'?: string
} & React.HTMLAttributes<HTMLPreElement>

function getMetaValue(meta: string | undefined, key: string): string | undefined {
  if (!meta) return undefined
  const re = new RegExp(`${key}=["']([^"']+)["']`)
  return meta.match(re)?.[1]
}

export function CodeBlock(props: PreProps) {
  const ref = useRef<HTMLPreElement>(null)
  const [copied, setCopied] = useState(false)

  const lang = props['data-language']
  const metaString = props['data-meta'] ?? ''
  const filename =
    getMetaValue(metaString, 'filename') ??
    getMetaValue(metaString, 'file') ??
    getMetaValue(metaString, 'name') ??
    props['data-filename']

  async function copy() {
    const node = ref.current
    if (!node) return
    const text = node.innerText
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* fallback: text remains selectable */
    }
  }

  return (
    <div className="code-block">
      <div className="code-block__bar">
        <span className="code-block__meta">
          {filename ? (
            <span className="code-block__filename">
              <span className="code-block__icon" aria-hidden>
                ▸
              </span>
              {filename}
            </span>
          ) : null}
          {lang ? <span className="code-block__lang">{lang}</span> : null}
        </span>
        <button
          type="button"
          onClick={copy}
          className="code-block__copy"
          data-state={copied ? 'copied' : 'idle'}
          aria-label={copied ? 'コードをコピーしました' : 'コードをコピー'}
        >
          {copied ? 'copied!' : 'copy'}
        </button>
        <span
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="code-block__sr"
        >
          {copied ? 'コードをコピーしました' : ''}
        </span>
      </div>
      <pre ref={ref} {...props} />
    </div>
  )
}
