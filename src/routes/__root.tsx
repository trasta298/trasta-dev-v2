import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { NotFound } from '../components/layout/NotFound'
import { SITE } from '../lib/seo/site'
import globalCss from '../styles/global.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var s=window.localStorage.getItem('theme');var explicit=(s==='light'||s==='dark');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=explicit?s:(p?'dark':'light');var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);if(explicit){e.setAttribute('data-theme',r)}else{e.removeAttribute('data-theme')}e.style.colorScheme=r;var p2=location.pathname;e.lang=(p2==='/en'||p2.indexOf('/en/')===0)?'en':'ja';}catch(e){}})();`

const GA_MEASUREMENT_ID = 'G-60PX17XX9G'
const GA_INIT_SCRIPT = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { property: 'og:site_name', content: SITE.name },
      {
        property: 'og:image',
        content: new URL('/og/home.png', SITE.url).toString(),
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Zen+Kaku+Gothic+New:wght@300;400;500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap',
      },
      { rel: 'stylesheet', href: globalCss },
      { rel: 'icon', type: 'image/png', href: '/images/trasta.png' },
    ],
  }),
  shellComponent: RootDocument,
  component: () => <Outlet />,
  notFoundComponent: () => <NotFound />,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        {/* HeadContent は同名 meta を dedupe するため media 付きペアはここに直接置く */}
        <meta
          name="theme-color"
          media="(prefers-color-scheme: light)"
          content="#fffefd"
        />
        <meta
          name="theme-color"
          media="(prefers-color-scheme: dark)"
          content="#181512"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        {import.meta.env.PROD ? (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <script dangerouslySetInnerHTML={{ __html: GA_INIT_SCRIPT }} />
          </>
        ) : null}
        <HeadContent />
      </head>
      <body>
        <a href="#main" className="skip-link">skip to content</a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        {import.meta.env.DEV ? (
          <TanStackDevtools
            config={{ position: 'bottom-right' }}
            plugins={[
              { name: 'Tanstack Router', render: <TanStackRouterDevtoolsPanel /> },
            ]}
          />
        ) : null}
        <Scripts />
      </body>
    </html>
  )
}
