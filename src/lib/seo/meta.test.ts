import { describe, expect, it } from 'vitest'
import { buildHead } from './meta'

describe('buildHead', () => {
  it('emits BlogPosting JSON-LD with tags as keywords for articles', () => {
    const { scripts } = buildHead({
      title: 'a </script><script>alert(1)</script>',
      url: '/blog/x',
      type: 'article',
      publishedAt: '2026-05-09',
      tags: ['Go', 'Codex'],
    })
    expect(scripts).toHaveLength(1)
    expect(scripts[0].children).not.toContain('</script>')
    const ld = JSON.parse(scripts[0].children)
    expect(ld['@type']).toBe('BlogPosting')
    expect(ld.keywords).toEqual(['Go', 'Codex'])
    expect(ld.headline).toBe('a </script><script>alert(1)</script>')
  })

  it('does not emit JSON-LD for non-article pages', () => {
    expect(buildHead({ url: '/blog' }).scripts).toEqual([])
  })
})
