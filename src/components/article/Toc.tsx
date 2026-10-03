import { useEffect, useRef, useState } from 'react'
import type { MouseEvent } from 'react'
import type { TocItem } from '../../lib/toc/remark-toc'
import './toc.css'

export function Toc({
  items,
  label = '目次',
}: {
  items: ReadonlyArray<TocItem>
  label?: string
}) {
  const [activeId, setActiveId] = useState<string | null>(items[0]?.id ?? null)
  const [open, setOpen] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (items.length === 0) return
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
        if (visible?.target.id) setActiveId(visible.target.id)
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: [0, 1] },
    )

    headings.forEach((h) => observer.observe(h))
    return () => observer.disconnect()
  }, [items])

  function jumpAfterClose(e: MouseEvent<HTMLAnchorElement>, id: string) {
    const panel = panelRef.current
    if (!open || !panel) return
    // 開いたパネルを畳みながらスクロールすると、縮んだ高さの分だけ見出しを通り過ぎる
    e.preventDefault()
    setOpen(false)

    let jumped = false
    const jump = () => {
      if (jumped) return
      jumped = true
      panel.removeEventListener('transitionend', onEnd)
      if (window.location.hash === `#${id}`) {
        document.getElementById(id)?.scrollIntoView()
      } else {
        window.location.hash = id
      }
    }
    const onEnd = (ev: TransitionEvent) => {
      if (ev.target === panel && ev.propertyName === 'grid-template-rows') jump()
    }
    panel.addEventListener('transitionend', onEnd)
    window.setTimeout(jump, 400)
  }

  if (items.length === 0) return null

  return (
    <aside className="toc">
      <button
        type="button"
        className="toc__toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="article-toc"
      >
        <span className="toc__label">{label}</span>
        <span aria-hidden>{open ? '−' : '+'}</span>
      </button>
      <div
        id="article-toc"
        ref={panelRef}
        className="toc__panel"
        data-open={open ? 'true' : 'false'}
      >
        <ol className="toc__list">
          {items.map((item) => (
            <li
              key={item.id}
              data-depth={item.depth}
              data-active={item.id === activeId ? 'true' : 'false'}
            >
              <a
                href={`#${item.id}`}
                className="bare"
                onClick={(e) => jumpAfterClose(e, item.id)}
              >
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </aside>
  )
}
