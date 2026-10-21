/** 收支类型 */
export const IncomeExpenseType = {
  Income: 'INCOME',
  Expense: 'EXPENSE',
} as const

export type IncomeExpenseType =
  | (typeof IncomeExpenseType)[keyof typeof IncomeExpenseType]
  | (string & {})

const incomeExpenseTypeMeta: Record<string, { label: string; className: string }> = {
  [IncomeExpenseType.Income]: { label: '收入', className: 'is-income' },
  [IncomeExpenseType.Expense]: { label: '支出', className: 'is-expense' },
}

function isKnownIncomeExpenseType(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(incomeExpenseTypeMeta, value)
}

export function incomeExpenseTypeLabel(value: string): string {
  if (!isKnownIncomeExpenseType(value)) return value
  return incomeExpenseTypeMeta[value]?.label ?? value
}

export function incomeExpenseTypeClass(value: string): string {
  if (!isKnownIncomeExpenseType(value)) return ''
  return incomeExpenseTypeMeta[value]?.className ?? ''
}

export const incomeExpenseTypeOptions = [
  IncomeExpenseType.Income,
  IncomeExpenseType.Expense,
].map((value) => ({
  value,
  label: incomeExpenseTypeMeta[value]?.label ?? value,
}))
