import { env } from 'cloudflare:workers'
import { ImageResponse, loadGoogleFont } from 'workers-og'
import { getPostBySlug } from '../content/blog'
import { getWorkBySlug } from '../content/works'
import type { Locale } from '../i18n/locale'
import {
  collectGlyphText,
  homeGlyphText,
  homeOgTemplate,
  ogTemplate,
  type OgTemplateInput,
} from './template'

const DETAIL_PATTERN = /^\/og\/(?:(en)\/)?(blog|works)\/([^/]+)\.png$/
const HOME_PATTERN = /^\/og\/(?:(en)\/)?home\.png$/

type Match = {
  locale: Locale
  kind: 'blog' | 'works'
  slug: string
}

function matchOgPath(pathname: string): Match | null {
  const m = DETAIL_PATTERN.exec(pathname)
  if (!m) return null
  const [, en, kind, slug] = m
  return {
    locale: en === 'en' ? 'en' : 'ja',
    kind: kind as 'blog' | 'works',
    slug: decodeURIComponent(slug),
  }
}

function matchHomePath(pathname: string): Locale | null {
  const m = HOME_PATTERN.exec(pathname)
  if (!m) return null
  return m[1] === 'en' ? 'en' : 'ja'
}

const HOME_TAGLINES: Record<Locale, string> = {
  ja: '新しくて面白そうなものを、ちょこちょこ作っています。',
  en: 'i make new and slightly weird things.',
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

const assetCache = new Map<string, string>()

async function fetchAssetDataUrl(request: Request, path: string): Promise<string> {
  const cached = assetCache.get(path)
  if (cached) return cached
  const url = new URL(path, request.url)
  const res = await env.ASSETS.fetch(url)
  if (!res.ok) throw new Error(`asset fetch failed (${path}): ${res.status}`)
  const buf = await res.arrayBuffer()
  const dataUrl = `data:image/png;base64,${arrayBufferToBase64(buf)}`
  assetCache.set(path, dataUrl)
  return dataUrl
}

async function getLogoDataUrl(request: Request): Promise<string> {
  return fetchAssetDataUrl(request, '/images/trasta.png')
}

async function getTigerDataUrl(request: Request): Promise<string> {
  return fetchAssetDataUrl(request, '/images/tiger-peeking-wall-effects.png')
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
  return DETAIL_PATTERN.test(pathname) || HOME_PATTERN.test(pathname)
}

const CACHE_HEADERS = {
  'Cache-Control': 'public, max-age=3600, s-maxage=86400, immutable',
}

const FONT_DEFS = [
  { family: 'Plus Jakarta Sans', weight: 800 as const, name: 'Jakarta', satoriWeight: 800 as const },
  { family: 'Plus Jakarta Sans', weight: 500 as const, name: 'Jakarta', satoriWeight: 500 as const },
  { family: 'Zen Kaku Gothic New', weight: 700 as const, name: 'ZenKaku', satoriWeight: 800 as const },
  { family: 'Zen Kaku Gothic New', weight: 500 as const, name: 'ZenKaku', satoriWeight: 500 as const },
]

async function loadFonts(text: string) {
  const buffers = await Promise.all(
    FONT_DEFS.map((f) =>
      loadGoogleFont({ family: f.family, weight: f.weight, text }),
    ),
  )
  return FONT_DEFS.map((f, i) => ({
    name: f.name,
    data: buffers[i],
    weight: f.satoriWeight,
    style: 'normal' as const,
  }))
}

export async function handleOgRequest(request: Request): Promise<Response> {
  const url = new URL(request.url)

  const homeLocale = matchHomePath(url.pathname)
  if (homeLocale) return renderHome(request, homeLocale)

  const match = matchOgPath(url.pathname)
  if (!match) return new Response('Not Found', { status: 404 })

  const input = buildInput(match)
  if (!input) return new Response('Not Found', { status: 404 })

  // workers-og の loadGoogleFont は text を URL エンコードせず連結するため、
  // '#' などフラグメント扱いされる文字を含むと以降のグリフが落ちる。
  const text = encodeURIComponent(collectGlyphText(input))
  const [fonts, logoDataUrl] = await Promise.all([loadFonts(text), getLogoDataUrl(request)])

  return new ImageResponse(ogTemplate({ ...input, logoDataUrl }), {
    width: 1200,
    height: 630,
    fonts,
    headers: CACHE_HEADERS,
  })
}

async function renderHome(request: Request, locale: Locale): Promise<Response> {
  const tagline = HOME_TAGLINES[locale]
  const text = encodeURIComponent(homeGlyphText(tagline))
  const [fonts, tigerDataUrl] = await Promise.all([loadFonts(text), getTigerDataUrl(request)])

  return new ImageResponse(homeOgTemplate({ locale, tagline, tigerDataUrl }), {
    width: 1200,
    height: 630,
    fonts,
    headers: CACHE_HEADERS,
  })
}
