import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../../components/pages/HomePage'
import { getAllPosts } from '../../lib/content/blog'
import { getAllWorks } from '../../lib/content/works'
import { homeOgImage } from '../../lib/og/url'
import { buildHead } from '../../lib/seo/meta'
import '../index.css'

const LOCALE = 'en' as const

export const Route = createFileRoute('/en/')({
  head: () => {
    const { meta, links } = buildHead({
      url: '/en',
      locale: LOCALE,
      image: homeOgImage(LOCALE),
    })
    return { meta, links }
  },
  component: HomeEnRoute,
  loader: () => ({
    posts: getAllPosts(LOCALE)
      .slice(0, 3)
      .map((p) => ({
        slug: p.slug,
        frontmatter: p.frontmatter,
        readingMinutes: p.readingMinutes,
      })),
    works: getAllWorks(LOCALE)
      .slice(0, 3)
      .map((w) => ({ slug: w.slug, frontmatter: w.frontmatter })),
  }),
})

function HomeEnRoute() {
  const { posts, works } = Route.useLoaderData()
  return <HomePage locale={LOCALE} posts={posts} works={works} />
}
