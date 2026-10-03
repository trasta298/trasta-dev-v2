import { describe, expect, it } from 'vitest'
import { formatDate } from './date'

describe('formatDate', () => {
  it('formats per locale without shifting the day', () => {
    expect(formatDate('2026-05-09', 'ja')).toBe('2026.05.09')
    expect(formatDate('2026-05-09', 'en')).toBe('2026-05-09')
  })

  it('returns the input as-is when it is not an ISO date', () => {
    expect(formatDate('someday', 'ja')).toBe('someday')
  })
})
