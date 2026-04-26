import GithubSlugger from 'github-slugger'
import type { Plugin } from 'unified'
import { valueToEstree } from 'estree-util-value-to-estree'
import { visit } from 'unist-util-visit'
import { toString } from 'mdast-util-to-string'
import type { Root } from 'mdast'

export type TocItem = {
  id: string
  text: string
  depth: 2 | 3
}

const ASCII_WORDS_PER_MIN = 240
const CJK_CHARS_PER_MIN = 500

function namedConstExportNode(name: string, value: unknown) {
  return {
    type: 'mdxjsEsm',
    value: '',
    data: {
      estree: {
        type: 'Program',
        sourceType: 'module',
        body: [
          {
            type: 'ExportNamedDeclaration',
            specifiers: [],
            attributes: [],
            source: null,
            declaration: {
              type: 'VariableDeclaration',
              kind: 'const',
              declarations: [
                {
                  type: 'VariableDeclarator',
                  id: { type: 'Identifier', name },
                  init: valueToEstree(value),
                },
              ],
            },
          },
        ],
      },
    },
  } as never
}

function estimateReadingMinutes(text: string): number {
  const asciiWords = (text.match(/[A-Za-z0-9][A-Za-z0-9'-]*/g) ?? []).length
  const cjkChars = (text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]/gu) ?? []).length
  const minutes = asciiWords / ASCII_WORDS_PER_MIN + cjkChars / CJK_CHARS_PER_MIN
  return Math.max(1, Math.round(minutes))
}

const remarkInjectToc: Plugin<[], Root> = () => (tree) => {
  const slugger = new GithubSlugger()
  const items: TocItem[] = []

  visit(tree, 'heading', (node) => {
    if (node.depth === 2 || node.depth === 3) {
      const text = toString(node).trim()
      if (!text) return
      items.push({ depth: node.depth as 2 | 3, text, id: slugger.slug(text) })
    }
  })

  const fullText = toString(tree)
  const readingMinutes = estimateReadingMinutes(fullText)

  tree.children.unshift(
    namedConstExportNode('toc', items),
    namedConstExportNode('readingMinutes', readingMinutes),
  )
}

export default remarkInjectToc
