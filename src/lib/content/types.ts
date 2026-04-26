import type { ComponentType } from 'react'

export type BlogFrontmatter = {
  title: string
  description: string
  publishedAt: string
  updatedAt?: string
  tags: ReadonlyArray<string>
  category?: string
  draft?: boolean
  ogImage?: string
  xEmbeds?: ReadonlyArray<string>
  externalUrl?: string
  externalSite?: string
}

export type WorkFrontmatter = {
  title: string
  description: string
  publishedAt?: string
  tags: ReadonlyArray<string>
  repositoryUrl?: string
  websiteUrl?: string
  image?: string
  featured?: boolean
}

export type MdxModule<F> = {
  default: ComponentType
  frontmatter: F
}

export type BlogEntry = {
  slug: string
  frontmatter: BlogFrontmatter
  Component: ComponentType
  readingMinutes: number
}

export type WorkEntry = {
  slug: string
  frontmatter: WorkFrontmatter
  Component: ComponentType
}
