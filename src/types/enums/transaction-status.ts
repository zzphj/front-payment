/** 与后端交易状态枚举名一致。未收录的新值保留原样展示。 */
export const TransactionStatus = {
  Pending: 'PENDING',
  Processing: 'PROCESSING',
  Completed: 'COMPLETED',
  Failed: 'FAILED',
  Canceled: 'CANCELED',
} as const

export type TransactionStatus =
  | (typeof TransactionStatus)[keyof typeof TransactionStatus]
  | (string & {})

export const transactionStatusMeta: Record<string, { label: string; className: string }> = {
  [TransactionStatus.Pending]: { label: '未开始', className: 'is-muted' },
  [TransactionStatus.Processing]: { label: '进行中', className: 'is-warning' },
  [TransactionStatus.Completed]: { label: '已完成', className: 'is-success' },
  [TransactionStatus.Failed]: { label: '失败', className: 'is-danger' },
  [TransactionStatus.Canceled]: { label: '已取消', className: 'is-muted' },
}

function isKnownTransactionStatus(status: string): boolean {
  return Object.prototype.hasOwnProperty.call(transactionStatusMeta, status)
}

export function transactionStatusLabel(status: string): string {
  if (!isKnownTransactionStatus(status)) return status
  return transactionStatusMeta[status]?.label ?? status
}

export function transactionStatusClass(status: string): string {
  if (!isKnownTransactionStatus(status)) return ''
  return transactionStatusMeta[status]?.className ?? ''
}

export const transactionStatusOptions = [
  TransactionStatus.Pending,
  TransactionStatus.Processing,
  TransactionStatus.Completed,
  TransactionStatus.Failed,
  TransactionStatus.Canceled,
].map((value) => ({
  value,
  label: transactionStatusMeta[value]?.label ?? value,
}))
