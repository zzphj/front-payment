import { displayText, formatTimestamp } from '@/utils/time'

/**
 * 页面上能看到的展示结构。
 * 接口字段还没对齐，接入时只在加载处做映射，不要把这些名字当成后端协议。
 */
export interface FundAccountView {
  accountId: string
  accountNo: string
  createTime: string
  statusLabel: string
  balance: string
}

export interface FundFlowView {
  flowNo: string
  accountNo: string
  tradeTime: string
  direction: string
  tradeType: string
  orderNo: string
  amount: string
  balanceAfter: string
}

export function showFundTime(value: string | null | undefined): string {
  const formatted = formatTimestamp(value)
  if (formatted !== '') return formatted
  return displayText(value)
}

export function fundDirectionLabel(direction: string): string {
  if (direction === 'INCOME') return '收入'
  if (direction === 'EXPENSE') return '支出'
  return direction
}

export function fundDirectionClass(direction: string): string {
  const label = fundDirectionLabel(direction)
  if (label === '收入') return 'is-income'
  if (label === '支出') return 'is-expense'
  return ''
}

export function fundAmountClass(amount: string): string {
  const text = amount.trim()
  if (text.startsWith('-')) return 'is-expense'
  if (text === '') return ''
  return 'is-income'
}
