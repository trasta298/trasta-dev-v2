import { createFileRoute, notFound } from '@tanstack/react-router'
import { BlogPostPage } from '../../components/pages/BlogPostPage'
import { getPostBySlug } from '../../lib/content/blog'
import { dynamicOgImage } from '../../lib/og/url'
import { buildHead } from '../../lib/seo/meta'
import './blog-post.css'

const LOCALE = 'ja' as const

export const Route = createFileRoute('/blog/$slug')({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug, LOCALE)
    if (!post || post.frontmatter.externalUrl) throw notFound()
    return {
      slug: post.slug,
      frontmatter: post.frontmatter,
      readingMinutes: post.readingMinutes,
      toc: post.toc,
    }
  },
  head: ({ loaderData }) => {
    if (!loaderData) return {}
    const { meta, links } = buildHead({
      title: loaderData.frontmatter.title,
      description: loaderData.frontmatter.description,
      url: `/blog/${loaderData.slug}`,
      image:
        loaderData.frontmatter.ogImage ??
        dynamicOgImage('blog', LOCALE, loaderData.slug),
      type: 'article',
      publishedAt: loaderData.frontmatter.publishedAt,
      updatedAt: loaderData.frontmatter.updatedAt,
      tags: loaderData.frontmatter.tags,
      locale: LOCALE,
    })
    return { meta, links }
  },
  component: BlogPostRoute,
})

function BlogPostRoute() {
  const data = Route.useLoaderData()
  return <BlogPostPage locale={LOCALE} {...data} />
}
