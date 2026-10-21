/** 资金方向（收款 / 付款） */
export const FundDirection = {
  Credit: 'CREDIT',
  Debit: 'DEBIT',
} as const

export type FundDirection = (typeof FundDirection)[keyof typeof FundDirection]
