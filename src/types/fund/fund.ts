import type { AccountStatus, IncomeExpenseType, InstitutionType, LedgerBizType } from '../enums'

export interface FundQuery {
  id?: string
  bizId?: string
  bizType?: LedgerBizType
  endTime?: string
  startTime?: string
  incomeExpenseType?: IncomeExpenseType
  keyword?: string
}

export interface LedgerVO {
  account: AccountInfoVO
  amount: string
  balanceAfter: string
  bizId: string
  bizType: LedgerBizType
  createTime: number
  incomeExpenseType: IncomeExpenseType
  ledgerId: string
}

export interface AccountInfoVO {
  accountId: string
  accountNo: string
  /** 余额，后端一般传字符串，单位通常是分 */
  balance: string
  /** 秒级时间戳，注意不是毫秒 */
  createTime: number
  enabled: boolean
  frozenBalance: string
  institutionId: string
  institutionName: string
  institutionType: InstitutionType
  isDeleted: boolean
  memberName: string
  paymentMemberId: string
  remark: string
  status: AccountStatus
}
