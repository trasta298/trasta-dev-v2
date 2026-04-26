import { createFileRoute } from '@tanstack/react-router'
import { HomePage } from '../components/pages/HomePage'
import { getAllPosts } from '../lib/content/blog'
import { getAllWorks } from '../lib/content/works'
import { buildHead } from '../lib/seo/meta'
import './index.css'

const LOCALE = 'ja' as const

export const Route = createFileRoute('/')({
  head: () => {
    const { meta, links } = buildHead({ locale: LOCALE })
    return { meta, links }
  },
  component: HomeRoute,
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

function HomeRoute() {
  const { posts, works } = Route.useLoaderData()
  return <HomePage locale={LOCALE} posts={posts} works={works} />
}
