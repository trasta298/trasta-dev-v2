import { createFileRoute } from '@tanstack/react-router'
import { BlogIndexPage } from '../../../components/pages/BlogIndexPage'
import { getAllPosts, getAllTags } from '../../../lib/content/blog'
import { buildHead } from '../../../lib/seo/meta'
import '../../blog/blog-index.css'

const LOCALE = 'en' as const

export const Route = createFileRoute('/en/blog/')({
  head: () => {
    const { meta, links } = buildHead({
      title: 'blog',
      description: "all blog posts by trasta.",
      url: '/en/blog',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: BlogIndexEnRoute,
  loader: () => ({
    posts: getAllPosts(LOCALE).map((p) => ({
      slug: p.slug,
      frontmatter: p.frontmatter,
      readingMinutes: p.readingMinutes,
    })),
    tags: getAllTags(LOCALE),
  }),
})

function BlogIndexEnRoute() {
  const { posts, tags } = Route.useLoaderData()
  return <BlogIndexPage locale={LOCALE} posts={posts} tags={tags} />
}
