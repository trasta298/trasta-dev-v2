import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'
import { LinkCard } from '../embeds/LinkCard'
import { XPost } from '../embeds/XPost'
import { Callout } from '../embeds/Callout'
import 'react-tweet/theme.css'
import './article.css'

const components: MDXComponents = {
  pre: (props) => <CodeBlock {...props} />,
  LinkCard,
  XPost,
  Callout,
}

export function Article({ children }: { children: ReactNode }) {
  return (
    <div className="article-prose">
      <MDXProvider components={components}>{children}</MDXProvider>
    </div>
  )
}
