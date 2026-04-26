import { ImageResponse, loadGoogleFont } from 'workers-og'
import { getPostBySlug } from '../content/blog'
import { getWorkBySlug } from '../content/works'
import type { Locale } from '../i18n/locale'
import { collectGlyphText, ogTemplate, type OgTemplateInput } from './template'

const OG_PATTERN = /^\/og\/(?:(en)\/)?(blog|works)\/([^/]+)\.png$/

type Match = {
  locale: Locale
  kind: 'blog' | 'works'
  slug: string
}

function matchOgPath(pathname: string): Match | null {
  const m = OG_PATTERN.exec(pathname)
  if (!m) return null
  const [, en, kind, slug] = m
  return {
    locale: en === 'en' ? 'en' : 'ja',
    kind: kind as 'blog' | 'works',
    slug: decodeURIComponent(slug),
  }
}

type TemplateInputBase = Omit<OgTemplateInput, 'logoDataUrl'>

function buildInput(match: Match): TemplateInputBase | null {
  if (match.kind === 'blog') {
    const post = getPostBySlug(match.slug, match.locale)
    if (!post || post.frontmatter.externalUrl) return null
    return {
      kind: 'blog',
      locale: match.locale,
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      tags: post.frontmatter.tags,
      publishedAt: post.frontmatter.publishedAt,
    }
  }
  const work = getWorkBySlug(match.slug, match.locale)
  if (!work) return null
  return {
    kind: 'works',
    locale: match.locale,
    title: work.frontmatter.title,
    description: work.frontmatter.description,
    tags: work.frontmatter.tags,
    publishedAt: work.frontmatter.publishedAt,
  }
}

let logoCache: string | null = null

async function getLogoDataUrl(request: Request): Promise<string> {
  if (logoCache) return logoCache
  const url = new URL('/images/trasta.png', request.url)
  const res = await fetch(url, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
  })
  if (!res.ok) throw new Error(`logo fetch failed: ${res.status}`)
  const buf = await res.arrayBuffer()
  logoCache = `data:image/png;base64,${arrayBufferToBase64(buf)}`
  return logoCache
}

function arrayBufferToBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  const chunkSize = 0x8000
  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length))
    binary += String.fromCharCode(...chunk)
  }
  return btoa(binary)
}

export function isOgRequest(pathname: string): boolean {
  return OG_PATTERN.test(pathname)
}

export async function handleOgRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const match = matchOgPath(url.pathname)
  if (!match) return new Response('Not Found', { status: 404 })

  const input = buildInput(match)
  if (!input) return new Response('Not Found', { status: 404 })

  // workers-og の loadGoogleFont は text を URL エンコードせず連結するため、
  // '#' などフラグメント扱いされる文字を含むと以降のグリフが落ちる。
  const text = encodeURIComponent(collectGlyphText(input))
  const [latinBold, latinBody, jpBold, jpBody, logoDataUrl] = await Promise.all([
    loadGoogleFont({ family: 'Plus Jakarta Sans', weight: 800, text }),
    loadGoogleFont({ family: 'Plus Jakarta Sans', weight: 500, text }),
    loadGoogleFont({ family: 'Zen Kaku Gothic New', weight: 700, text }),
    loadGoogleFont({ family: 'Zen Kaku Gothic New', weight: 500, text }),
    getLogoDataUrl(request),
  ])

  return new ImageResponse(ogTemplate({ ...input, logoDataUrl }), {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Jakarta', data: latinBody, weight: 500, style: 'normal' },
      { name: 'Jakarta', data: latinBold, weight: 800, style: 'normal' },
      { name: 'ZenKaku', data: jpBody, weight: 500, style: 'normal' },
      { name: 'ZenKaku', data: jpBold, weight: 800, style: 'normal' },
    ],
    headers: {
      'Cache-Control': 'public, max-age=3600, s-maxage=86400, immutable',
    },
  })
}
