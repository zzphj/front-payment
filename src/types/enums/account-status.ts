/** 账户状态，与后端枚举名一致 */
export const AccountStatus = {
  Normal: 'Normal',
  Freeze: 'Freeze',
  Closed: 'Closed',
} as const

export type AccountStatus =
  | (typeof AccountStatus)[keyof typeof AccountStatus]
  | (string & {})

const accountStatusMeta: Record<string, { label: string }> = {
  [AccountStatus.Normal]: { label: '正常' },
  [AccountStatus.Freeze]: { label: '冻结' },
  [AccountStatus.Closed]: { label: '关闭' },
}

function isKnownAccountStatus(status: string): boolean {
  return Object.prototype.hasOwnProperty.call(accountStatusMeta, status)
}

export function accountStatusLabel(status: string): string {
  if (!isKnownAccountStatus(status)) return status
  return accountStatusMeta[status]?.label ?? status
}

export const accountStatusOptions = [
  AccountStatus.Normal,
  AccountStatus.Freeze,
  AccountStatus.Closed,
].map((value) => ({
  value,
  label: accountStatusMeta[value]?.label ?? value,
}))
