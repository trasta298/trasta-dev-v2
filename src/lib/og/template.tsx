import type { ReactElement } from 'react'

export type OgTemplateInput = {
  title: string
  description?: string
  tags?: ReadonlyArray<string>
  publishedAt?: string
  kind: 'blog' | 'works'
  locale: 'ja' | 'en'
  logoDataUrl: string
}

const COLORS = {
  bg: '#fffefd',
  surface: '#ffffff',
  ink: '#111111',
  muted: '#6b6962',
  line: '#ded8cf',
  lineSoft: '#ece7dd',
  accent: '#f6c45b',
} as const

const FONT_LATIN = 'Jakarta'
const FONT_JP = 'ZenKaku'

function formatDate(iso: string | undefined, locale: 'ja' | 'en'): string {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  if (locale === 'ja') {
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(
      d.getDate(),
    ).padStart(2, '0')}`
  }
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export function ogTemplate({
  title,
  description,
  tags,
  publishedAt,
  locale,
  logoDataUrl,
}: OgTemplateInput): ReactElement {
  const dateLabel = formatDate(publishedAt, locale)
  const visibleTags = (tags ?? []).slice(0, 4)

  return (
    <div
      style={{
        width: '1200px',
        height: '630px',
        display: 'flex',
        flexDirection: 'column',
        padding: '72px 80px',
        background: COLORS.bg,
        color: COLORS.ink,
        fontFamily: `${FONT_LATIN}, ${FONT_JP}`,
        fontWeight: 500,
        position: 'relative',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <img
          src={logoDataUrl}
          width={72}
          height={72}
          style={{ display: 'block' }}
          alt=""
        />
        <span
          style={{
            fontSize: '34px',
            fontWeight: 800,
            letterSpacing: '-0.025em',
            color: COLORS.ink,
          }}
        >
          trasta.dev
        </span>
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          paddingTop: '32px',
          paddingBottom: '32px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'stretch',
            gap: '24px',
          }}
        >
          <div
            style={{
              width: '6px',
              background: COLORS.accent,
              borderRadius: '3px',
              display: 'flex',
            }}
          />
          <div
            style={{
              display: 'flex',
              flex: 1,
              fontSize: '68px',
              fontWeight: 800,
              lineHeight: 1.22,
              letterSpacing: '-0.025em',
              color: COLORS.ink,
            }}
          >
            {title}
          </div>
        </div>
        {description ? (
          <div
            style={{
              display: 'flex',
              marginTop: '28px',
              fontSize: '24px',
              lineHeight: 1.55,
              color: COLORS.muted,
              fontWeight: 500,
            }}
          >
            {description}
          </div>
        ) : null}
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingTop: '20px',
          borderTop: `1px solid ${COLORS.lineSoft}`,
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flex: 1, flexWrap: 'wrap' }}>
          {visibleTags.map((t) => (
            <div
              key={t}
              style={{
                display: 'flex',
                color: COLORS.muted,
                fontSize: '20px',
                fontWeight: 500,
              }}
            >
              #{t}
            </div>
          ))}
        </div>
        {dateLabel ? (
          <div
            style={{
              display: 'flex',
              fontSize: '20px',
              color: COLORS.muted,
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
          >
            {dateLabel}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export function collectGlyphText(input: Omit<OgTemplateInput, 'logoDataUrl'>): string {
  const parts = [
    input.title,
    input.description ?? '',
    ...(input.tags ?? []).slice(0, 4).map((t) => `#${t}`),
    'trasta.dev',
    formatDate(input.publishedAt, input.locale),
  ]
  return Array.from(new Set(parts.join(''))).join('')
}
