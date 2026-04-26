import './sparkle.css'

type Color = 'yellow' | 'mint' | 'lavender' | 'pink' | 'orange'

const SRC: Record<Color, string> = {
  yellow: '/images/effect-yellow-sparkle.png',
  mint: '/images/effect-mint-sparkle.png',
  lavender: '/images/effect-lavender-sparkle.png',
  pink: '/images/effect-pink-wiggle.png',
  orange: '/images/effect-orange-bounce.png',
}

type SparkleProps = {
  color: Color
  size?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  delay?: number
  rotate?: number
  variant?: 'bob' | 'bob-soft'
  ariaHidden?: boolean
}

export function Sparkle({
  color,
  size = 30,
  top,
  left,
  right,
  bottom,
  delay = 0,
  rotate = 0,
  variant = 'bob',
}: SparkleProps) {
  return (
    <img
      src={SRC[color]}
      alt=""
      aria-hidden
      width={size}
      height={size}
      className={`sparkle ${variant}`}
      style={{
        top,
        left,
        right,
        bottom,
        animationDelay: `${delay}ms`,
        transform: `rotate(${rotate}deg)`,
      }}
    />
  )
}
