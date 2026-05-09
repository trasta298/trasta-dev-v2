import { createFileRoute, notFound, redirect } from '@tanstack/react-router'
import { BlogPostPage } from '../../../components/pages/BlogPostPage'
import { getPostBySlug } from '../../../lib/content/blog'
import { dynamicOgImage } from '../../../lib/og/url'
import { buildHead } from '../../../lib/seo/meta'
import '../../blog/blog-post.css'

const LOCALE = 'en' as const

export const Route = createFileRoute('/en/blog/$slug')({
  loader: ({ params }) => {
    const post = getPostBySlug(params.slug, LOCALE)
    if (!post) {
      const jaPost = getPostBySlug(params.slug, 'ja')
      if (jaPost && !jaPost.frontmatter.externalUrl) {
        throw redirect({ to: '/blog/$slug', params: { slug: params.slug } })
      }
      throw notFound()
    }
    if (post.frontmatter.externalUrl) throw notFound()
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
      url: `/en/blog/${loaderData.slug}`,
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
  component: BlogPostEnRoute,
})

function BlogPostEnRoute() {
  const data = Route.useLoaderData()
  return <BlogPostPage locale={LOCALE} {...data} />
}
