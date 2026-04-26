import { HeadContent, Outlet, Scripts, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { NotFound } from '../components/layout/NotFound'
import { SITE } from '../lib/seo/site'
import globalCss from '../styles/global.css?url'

const THEME_INIT_SCRIPT = `(function(){try{var s=window.localStorage.getItem('theme');var explicit=(s==='light'||s==='dark');var p=window.matchMedia('(prefers-color-scheme: dark)').matches;var r=explicit?s:(p?'dark':'light');var e=document.documentElement;e.classList.remove('light','dark');e.classList.add(r);if(explicit){e.setAttribute('data-theme',r)}else{e.removeAttribute('data-theme')}e.style.colorScheme=r;var p2=location.pathname;e.lang=(p2==='/en'||p2.indexOf('/en/')===0)?'en':'ja';}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'theme-color', content: '#fffefd' },
      { property: 'og:site_name', content: SITE.name },
      {
        property: 'og:image',
        content: new URL('/og/home.png', SITE.url).toString(),
      },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
    links: [
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
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
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
