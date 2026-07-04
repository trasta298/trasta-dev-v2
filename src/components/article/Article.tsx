import { MDXProvider } from '@mdx-js/react'
import type { MDXComponents } from 'mdx/types'
import type { ReactNode } from 'react'
import { CodeBlock } from './CodeBlock'
import { LinkCard } from '../embeds/LinkCard'
import { XPost } from '../embeds/XPost'
import { Callout } from '../embeds/Callout'
import 'react-tweet/theme.css'
import './article.css'

function createHeading(Tag: 'h2' | 'h3') {
  return function Heading({
    children,
    ...props
  }: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
      <Tag {...props}>
        {children}
        {props.id ? (
          <a
            href={`#${props.id}`}
            className="heading-anchor bare"
            aria-label="permalink"
          >
            #
          </a>
        ) : null}
      </Tag>
    )
  }
}

const components: MDXComponents = {
  pre: (props) => <CodeBlock {...props} />,
  h2: createHeading('h2'),
  h3: createHeading('h3'),
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
