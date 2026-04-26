import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../../components/pages/AboutPage'
import { buildHead } from '../../lib/seo/meta'
import '../about.css'

const LOCALE = 'en' as const

export const Route = createFileRoute('/en/about')({
  head: () => {
    const { meta, links } = buildHead({
      title: 'about',
      description:
        "about trasta — interests, current stack, and where to find me online.",
      url: '/en/about',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: () => <AboutPage locale={LOCALE} />,
})
