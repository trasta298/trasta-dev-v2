import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { WorkDetailPage } from '../../../components/pages/WorkDetailPage'
import { getWorkBySlug } from '../../../lib/content/works'
import { dynamicOgImage } from '../../../lib/og/url'
import { buildHead } from '../../../lib/seo/meta'
import '../../works/work-detail.css'

const LOCALE = 'en' as const

export const Route = createFileRoute('/en/works/$slug')({
  loader: ({ params }) => {
    const work = getWorkBySlug(params.slug, LOCALE)
    if (!work) {
      const jaWork = getWorkBySlug(params.slug, 'ja')
      if (jaWork) {
        throw redirect({ to: '/works/$slug', params: { slug: params.slug } })
      }
      throw notFound()
    }
    return { slug: work.slug, frontmatter: work.frontmatter }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { meta, links } = buildHead({
      title: loaderData.frontmatter.title,
      description: loaderData.frontmatter.description,
      url: `/en/works/${loaderData.slug}`,
      image:
        loaderData.frontmatter.image ??
        dynamicOgImage('works', LOCALE, loaderData.slug),
      type: 'article',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: WorkDetailEnRoute,
})

function WorkDetailEnRoute() {
  const data = Route.useLoaderData()
  return <WorkDetailPage locale={LOCALE} {...data} />
}
