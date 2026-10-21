import { describe, expect, it } from 'vitest'
import { incomeExpenseTypeClass, incomeExpenseTypeLabel, ledgerBizTypeLabel } from '@/types'
import { fundAmountClass } from './fund'

describe('fund display', () => {
  it('maps income expense codes and keeps unknown text', () => {
    expect(incomeExpenseTypeLabel('INCOME')).toBe('收入')
    expect(incomeExpenseTypeLabel('EXPENSE')).toBe('支出')
    expect(incomeExpenseTypeLabel('调账')).toBe('调账')
    expect(incomeExpenseTypeClass('INCOME')).toBe('is-income')
    expect(incomeExpenseTypeClass('EXPENSE')).toBe('is-expense')
    expect(incomeExpenseTypeClass('调账')).toBe('')
  })

  it('maps ledger biz types to Chinese labels', () => {
    expect(ledgerBizTypeLabel('TRANSACTION_OUT')).toBe('代付')
    expect(ledgerBizTypeLabel('TRANSACTION_OUT_FEE_REFUND')).toBe('代付-手续费-退款')
    expect(ledgerBizTypeLabel('UNKNOWN')).toBe('UNKNOWN')
  })

  it('colors a leading minus as expense and keeps the amount as text', () => {
    expect(fundAmountClass('-20')).toBe('is-expense')
    expect(fundAmountClass('20')).toBe('is-income')
    expect(fundAmountClass('')).toBe('')
  })
})
