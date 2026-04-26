declare module '*.mdx' {
  import type { ComponentType } from 'react'
  import type { BlogFrontmatter, WorkFrontmatter } from './lib/content/types'

  export const frontmatter: BlogFrontmatter | WorkFrontmatter
  const Component: ComponentType
  export default Component
}
