import { createFileRoute } from '@tanstack/react-router'
import { AboutPage } from '../components/pages/AboutPage'
import { buildHead } from '../lib/seo/meta'
import './about.css'

const LOCALE = 'ja' as const

export const Route = createFileRoute('/about')({
  head: () => {
    const { meta, links } = buildHead({
      title: 'about',
      description: 'trasta / とらすた のプロフィール、興味、活動リンク。',
      url: '/about',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: () => <AboutPage locale={LOCALE} />,
})
