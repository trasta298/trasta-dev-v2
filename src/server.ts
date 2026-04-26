import handler, { createServerEntry } from '@tanstack/react-start/server-entry'
import { handleOgRequest, isOgRequest } from './lib/og/handler'

const LANG_COOKIE = 'lang'
const SUPPORTED = ['ja', 'en'] as const
type Locale = (typeof SUPPORTED)[number]

function readLangCookie(cookieHeader: string | null): Locale | null {
  if (!cookieHeader) return null
  for (const part of cookieHeader.split(';')) {
    const [k, v] = part.trim().split('=')
    if (k === LANG_COOKIE && (v === 'ja' || v === 'en')) return v
  }
  return null
}

/**
 * Browser-language policy: japanese readers stay on `/`, everyone else gets `/en`.
 * The most-preferred (highest-q) language tag decides — if it isn't japanese,
 * we fall back to english regardless of which non-ja language it is.
 */
function preferredFromAcceptLanguage(header: string | null): Locale {
  if (!header) return 'en'
  const parts = header
    .split(',')
    .map((entry) => {
      const [tag, ...params] = entry.trim().split(';')
      const qParam = params.find((p) => p.trim().startsWith('q='))
      const q = qParam ? Number(qParam.trim().slice(2)) : 1
      return { tag: tag.toLowerCase(), q: Number.isFinite(q) ? q : 1 }
    })
    .filter((p) => p.tag && p.tag !== '*')
    .sort((a, b) => b.q - a.q)
  if (parts.length === 0) return 'en'
  return parts[0].tag.startsWith('ja') ? 'ja' : 'en'
}

function isLocalizedPath(pathname: string): boolean {
  return pathname === '/en' || pathname.startsWith('/en/')
}

export default createServerEntry({
  fetch(request) {
    const url = new URL(request.url)
    const { pathname } = url

    if (request.method === 'GET' && isOgRequest(pathname)) {
      return handleOgRequest(request)
    }

    if (
      request.method === 'GET' &&
      !isLocalizedPath(pathname) &&
      isHtmlNavigation(request) &&
      !isAssetPath(pathname)
    ) {
      const cookieLang = readLangCookie(request.headers.get('cookie'))
      const preferred =
        cookieLang ?? preferredFromAcceptLanguage(request.headers.get('accept-language'))

      if (preferred === 'en') {
        const target = pathname === '/' ? '/en' : `/en${pathname}`
        const location = `${target}${url.search}`
        return new Response(null, {
          status: 302,
          headers: {
            location,
            'set-cookie': `${LANG_COOKIE}=en; Path=/; Max-Age=31536000; SameSite=Lax`,
            vary: 'accept-language, cookie',
          },
        })
      }
    }

    return handler.fetch(request)
  },
})

function isHtmlNavigation(request: Request): boolean {
  const accept = request.headers.get('accept') ?? ''
  if (accept.includes('text/html')) return true
  const dest = request.headers.get('sec-fetch-dest')
  return dest === 'document' || dest === null
}

function isAssetPath(pathname: string): boolean {
  if (pathname.startsWith('/_build/')) return true
  if (pathname.startsWith('/assets/')) return true
  if (pathname.startsWith('/images/')) return true
  if (pathname.startsWith('/api/')) return true
  if (pathname.startsWith('/og/')) return true
  if (pathname === '/favicon.ico' || pathname === '/robots.txt' || pathname === '/sitemap.xml') {
    return true
  }
  return /\.[a-zA-Z0-9]{1,6}$/.test(pathname)
}
