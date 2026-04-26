import { createFileRoute, notFound } from '@tanstack/react-router'
import { WorkDetailPage } from '../../components/pages/WorkDetailPage'
import { getWorkBySlug } from '../../lib/content/works'
import { dynamicOgImage } from '../../lib/og/url'
import { buildHead } from '../../lib/seo/meta'
import './work-detail.css'

const LOCALE = 'ja' as const

export const Route = createFileRoute('/works/$slug')({
  loader: ({ params }) => {
    const work = getWorkBySlug(params.slug, LOCALE)
    if (!work) throw notFound()
    return { slug: work.slug, frontmatter: work.frontmatter }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { meta, links } = buildHead({
      title: loaderData.frontmatter.title,
      description: loaderData.frontmatter.description,
      url: `/works/${loaderData.slug}`,
      image:
        loaderData.frontmatter.image ??
        dynamicOgImage('works', LOCALE, loaderData.slug),
      type: 'article',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: WorkDetailRoute,
})

function WorkDetailRoute() {
  const data = Route.useLoaderData()
  return <WorkDetailPage locale={LOCALE} {...data} />
}
