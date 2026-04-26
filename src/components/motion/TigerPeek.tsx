import './tiger-peek.css'

type Variant = 'plain' | 'effects'

export function TigerPeek({ variant = 'effects' }: { variant?: Variant }) {
  const src =
    variant === 'effects'
      ? '/images/tiger-peeking-wall-effects.png'
      : '/images/tiger-peeking-wall.png'

  return (
    <div className="tiger-peek" aria-hidden>
      <img src={src} alt="" loading="lazy" />
    </div>
  )
}
