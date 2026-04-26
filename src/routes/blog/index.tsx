import { createFileRoute } from '@tanstack/react-router'
import { BlogIndexPage } from '../../components/pages/BlogIndexPage'
import { getAllPosts, getAllTags } from '../../lib/content/blog'
import { buildHead } from '../../lib/seo/meta'
import './blog-index.css'

const LOCALE = 'ja' as const

export const Route = createFileRoute('/blog/')({
  head: () => {
    const { meta, links } = buildHead({
      title: 'blog',
      description: 'trasta のブログ記事一覧。',
      url: '/blog',
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: BlogIndexRoute,
  loader: () => ({
    posts: getAllPosts(LOCALE).map((p) => ({
      slug: p.slug,
      frontmatter: p.frontmatter,
      readingMinutes: p.readingMinutes,
    })),
    tags: getAllTags(LOCALE),
  }),
})

function BlogIndexRoute() {
  const { posts, tags } = Route.useLoaderData()
  return <BlogIndexPage locale={LOCALE} posts={posts} tags={tags} />
}
