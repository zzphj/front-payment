import { describe, expect, it } from 'vitest'
import { formatTimestamp, parseDateTime } from './time'

describe('parseDateTime', () => {
  it('parses a local date time with the numeric constructor', () => {
    expect(parseDateTime('2026-10-15 11:30:00')).toBe(
      new Date(2026, 9, 15, 11, 30, 0).getTime(),
    )
  })

  it('drops blank values and impossible dates', () => {
    expect(parseDateTime(null)).toBeUndefined()
    expect(parseDateTime('   ')).toBeUndefined()
    expect(parseDateTime('2026-02-31 00:00:00')).toBeUndefined()
    expect(parseDateTime('2026/10/15 11:30:00')).toBeUndefined()
  })
})

describe('formatTimestamp', () => {
  it('formats millisecond strings and keeps zero', () => {
    const millis = new Date(2026, 9, 15, 11, 30, 0).getTime()
    expect(formatTimestamp(String(millis))).toBe('2026-10-15 11:30:00')
    expect(formatTimestamp(0)).toBe(formatTimestamp(new Date(0).getTime()))
    expect(formatTimestamp(0)).not.toBe('')
  })

  it('returns empty text for missing or non-numeric values', () => {
    expect(formatTimestamp('')).toBe('')
    expect(formatTimestamp(null)).toBe('')
    expect(formatTimestamp('2026-10-15 11:30:00')).toBe('')
  })
})
