import './callout.css'

type CalloutType = 'note' | 'tip' | 'warn' | 'kitten'

const META: Record<CalloutType, { label: string }> = {
  note: { label: 'note' },
  tip: { label: 'tip' },
  warn: { label: 'warn' },
  kitten: { label: 'とらすた' },
}

type CalloutProps = {
  type?: CalloutType
  title?: string
  children: React.ReactNode
}

export function Callout({ type = 'note', title, children }: CalloutProps) {
  const meta = META[type]
  return (
    <aside className={`callout callout--${type}`}>
      <span className="callout__sticker" aria-hidden />
      <p className="callout__label">{title ?? meta.label}</p>
      <div className="callout__body">{children}</div>
    </aside>
  )
}
