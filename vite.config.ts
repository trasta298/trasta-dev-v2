import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import { cloudflare } from '@cloudflare/vite-plugin'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import remarkInjectToc from './src/lib/toc/remark-toc'
import rehypeSlug from 'rehype-slug'
import rehypeShiki from '@shikijs/rehype'

const config = defineConfig({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    cloudflare({ viteEnvironment: { name: 'ssr' } }),
    {
      enforce: 'pre',
      ...mdx({
        jsxImportSource: 'react',
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [
          remarkGfm,
          remarkBreaks,
          remarkFrontmatter,
          [remarkMdxFrontmatter, { name: 'frontmatter' }],
          remarkInjectToc,
        ],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypeShiki,
            {
              themes: { light: 'github-light', dark: 'github-dark-dimmed' },
              defaultColor: false,
              parseMetaString(meta: string) {
                return { __raw: meta }
              },
              transformers: [
                {
                  name: 'trasta:preserve-lang-meta',
                  pre(node: { properties?: Record<string, unknown> }) {
                    const ctx = this as unknown as {
                      options?: { lang?: string; meta?: { __raw?: string } }
                    }
                    const props = (node.properties ??= {})
                    const lang = ctx.options?.lang
                    const meta = ctx.options?.meta?.__raw
                    if (lang) props['data-language'] = lang
                    if (meta) props['data-meta'] = meta
                  },
                },
              ],
            },
          ],
        ],
      }),
    },
    tanstackStart(),
    viteReact(),
  ],
})

export default config
