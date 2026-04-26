import { createFileRoute } from '@tanstack/react-router'
import { WorksIndexPage } from '../../components/pages/WorksIndexPage'
import { getAllWorks } from '../../lib/content/works'
import { buildHead } from '../../lib/seo/meta'
import './works-index.css'

const LOCALE = 'ja' as const

export const Route = createFileRoute('/works/')({
  head: () => {
    const { meta, links } = buildHead({
      title: 'works',
      description: 'trasta が作ったもの・関わったものの一覧。',
      url: '/works',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: WorksIndexRoute,
  loader: () => ({
    works: getAllWorks(LOCALE).map((w) => ({
      slug: w.slug,
      frontmatter: w.frontmatter,
    })),
  }),
})

function WorksIndexRoute() {
  const { works } = Route.useLoaderData()
  return <WorksIndexPage locale={LOCALE} works={works} />
}
