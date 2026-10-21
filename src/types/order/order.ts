import type { CallbackStatus, FundDirection, TransactionStatus } from '../enums'

export interface OrderQuery {
  id?: string
  customerAccountNo?: string
  channelTransactionId?: string
  status?: TransactionStatus
  startTime?: number
  endTime?: number
  keyword?: string
}

/** 渠道信息 */
export interface ChannelInfo {
  channelId: string
  fundDirection: FundDirection
  name: string
}

/** 目标账户信息 */
export interface TargetAccountInfo {
  accountId: string
  accountNo: string
  institutionId: string
  institutionName: string
  institutionType: string
  memberName: string
  paymentMemberId: string
}

/** 交易业务数据（接口返回） */
export interface TransactionVO {
  /** 金额，后端返回字符串 */
  amount: string
  channel: ChannelInfo
  /** 创建时间戳，毫秒，字符串 */
  createTime: string
  /** 执行结果描述，失败时可能是错误原因 */
  executionResult: string
  /** 执行时间戳，毫秒，字符串 */
  executionTime: string
  /** 手续费 */
  fee: string
  fundDirection: FundDirection
  /** 商户回调次数 */
  merchantCallbackCount: number
  /** 商户回调状态 */
  merchantCallbackStatus: CallbackStatus
  remark: string
  sourceAccountHolderName: string
  sourceAccountNo: string
  /** 交易状态 */
  status: TransactionStatus
  targetAccount: TargetAccountInfo
  sourceAccount: TargetAccountInfo
  transactionId: string
}
