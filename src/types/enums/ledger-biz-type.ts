/**
 * 账务业务类型，与后端枚举名一致。
 * 构造参数中文说明：代付 / 代收 / 充值 / 提现等。
 */
export const LedgerBizType = {
  TransactionOut: 'TRANSACTION_OUT',
  TransactionOutRefund: 'TRANSACTION_OUT_REFUND',
  TransactionOutFee: 'TRANSACTION_OUT_FEE',
  TransactionOutFeeRefund: 'TRANSACTION_OUT_FEE_REFUND',
  TransactionIn: 'TRANSACTION_IN',
  TransactionInFee: 'TRANSACTION_IN_FEE',
  Recharge: 'RECHARGE',
  Withdrawal: 'WITHDRAWAL',
} as const

export type LedgerBizType =
  | (typeof LedgerBizType)[keyof typeof LedgerBizType]
  | (string & {})

const ledgerBizTypeMeta: Record<string, { label: string }> = {
  [LedgerBizType.TransactionOut]: { label: '代付' },
  [LedgerBizType.TransactionOutRefund]: { label: '代付-退款' },
  [LedgerBizType.TransactionOutFee]: { label: '代付-手续费' },
  [LedgerBizType.TransactionOutFeeRefund]: { label: '代付-手续费-退款' },
  [LedgerBizType.TransactionIn]: { label: '代收' },
  [LedgerBizType.TransactionInFee]: { label: '代收-手续费' },
  [LedgerBizType.Recharge]: { label: '充值' },
  [LedgerBizType.Withdrawal]: { label: '提现' },
}

function isKnownLedgerBizType(value: string): boolean {
  return Object.prototype.hasOwnProperty.call(ledgerBizTypeMeta, value)
}

export function ledgerBizTypeLabel(value: string): string {
  if (!isKnownLedgerBizType(value)) return value
  return ledgerBizTypeMeta[value]?.label ?? value
}

export const ledgerBizTypeOptions = [
  LedgerBizType.TransactionOut,
  LedgerBizType.TransactionOutRefund,
  LedgerBizType.TransactionOutFee,
  LedgerBizType.TransactionOutFeeRefund,
  LedgerBizType.TransactionIn,
  LedgerBizType.TransactionInFee,
  LedgerBizType.Recharge,
  LedgerBizType.Withdrawal,
].map((value) => ({
  value,
  label: ledgerBizTypeMeta[value]?.label ?? value,
}))
