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

/** 交易记录 */
export interface TransactionRecord {
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

/** 资金方向 */
export type FundDirection = 'CREDIT' | 'DEBIT'

/** 回调状态 */
export type CallbackStatus = 'PROCESSING' | 'SUCCESS' | 'FAILED'

/** 与后端交易状态枚举名一致。未收录的新值保留原样展示。 */
export const TransactionStatus = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED',
    CANCELED: 'CANCELED',
} as const

// 描述 TransactionStatus 类型，编译后会删除不会和TransactionStatus重名
export type TransactionStatus =
    (typeof TransactionStatus)[keyof typeof TransactionStatus] | (string & {})

// Record 定义键值对，键为 TransactionStatus，值为 { label: string; className: string }
const transactionStatusMeta: Record<string, { label: string; className: string }> = {
    [TransactionStatus.PENDING]: { label: '未开始', className: 'is-muted' },
    [TransactionStatus.PROCESSING]: { label: '进行中', className: 'is-warning' },
    [TransactionStatus.COMPLETED]: { label: '已完成', className: 'is-success' },
    [TransactionStatus.FAILED]: { label: '失败', className: 'is-danger' },
    [TransactionStatus.CANCELED]: { label: '已取消', className: 'is-muted' },
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
    'PENDING',
    'PROCESSING',
    'COMPLETED',
    'FAILED',
    'CANCELED',
].map((value) => ({
    value,
    label: transactionStatusMeta[value]?.label ?? value,
}))
