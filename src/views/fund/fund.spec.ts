import { describe, expect, it } from 'vitest'
import { fundAmountClass, fundDirectionClass, fundDirectionLabel, showFundTime } from './fund'

describe('fund display', () => {
  it('maps direction codes and keeps unknown text', () => {
    expect(fundDirectionLabel('INCOME')).toBe('收入')
    expect(fundDirectionLabel('EXPENSE')).toBe('支出')
    expect(fundDirectionLabel('调账')).toBe('调账')
    expect(fundDirectionClass('收入')).toBe('is-income')
    expect(fundDirectionClass('EXPENSE')).toBe('is-expense')
    expect(fundDirectionClass('调账')).toBe('')
  })

  it('colors a leading minus as expense and keeps the amount as text', () => {
    expect(fundAmountClass('-20')).toBe('is-expense')
    expect(fundAmountClass('20')).toBe('is-income')
    expect(fundAmountClass('')).toBe('')
  })

  it('shows a formatted clock time as-is, including milliseconds', () => {
    expect(showFundTime('2026-10-14 11:31:02.918')).toBe('2026-10-14 11:31:02.918')
    expect(showFundTime('')).toBe('-')
  })
})
