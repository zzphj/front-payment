import type { AjaxResult } from '../common'

export interface OpsHomeTotalResp {
  failedAmount: string
  failedCount: number
  fundDirection: string
  institutionType: string
  successAmount: string
  successCount: number
  successRateByAmount: string
  successRateByCount: string
  totalAmount: string
  totalCount: number
}

export interface OpsHomeTotalSumResp extends AjaxResult<{
  merchantCredit: OpsHomeTotalResp
  merchantDebit: OpsHomeTotalResp
}> {}

export interface OpsHomeDetailRow {
  account: {
    accountNo: string
  }
  accountId: string
  failedAmount: string
  failedCount: number
  fundDirection: string
  successAmount: string
  successCount: number
  successRateByAmount: string
  successRateByCount: string
  totalAmount: string
  totalCount: number
}

export interface OpsHomeDetailPage {
  current: number
  data: OpsHomeDetailRow[]
  page: number
  pageSize: number
  pages: number
  total: number
  totalRecord: number
}

export interface OpsHomeDetailQuery {
  page: number
  pageSize: number
  params: {
    startTime: number
    endTime: number
    fundDirection: 'CREDIT' | 'DEBIT'
  }
}