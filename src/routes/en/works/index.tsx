import { createFileRoute } from '@tanstack/react-router'
import { WorksIndexPage } from '../../../components/pages/WorksIndexPage'
import { getAllWorks } from '../../../lib/content/works'
import { buildHead } from '../../../lib/seo/meta'
import '../../works/works-index.css'

const LOCALE = 'en' as const

export const Route = createFileRoute('/en/works/')({
  head: () => {
    const { meta, links } = buildHead({
      title: 'works',
      description: 'projects and experiments by trasta.',
      url: '/en/works',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: WorksIndexEnRoute,
  loader: () => ({
    works: getAllWorks(LOCALE).map((w) => ({
      slug: w.slug,
      frontmatter: w.frontmatter,
    })),
  }),
})

function WorksIndexEnRoute() {
  const { works } = Route.useLoaderData()
  return <WorksIndexPage locale={LOCALE} works={works} />
}
