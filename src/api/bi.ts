import request from '@/utils/request'
import type { OpsHomeDetailQuery, OpsHomeDetailPage, OpsHomeTotalSumResp } from '@/types'
import type { AjaxResult } from '@/types/common'

export function paymentHomeTotal(): Promise<OpsHomeTotalSumResp> {
  return request({
    url: '/merchant/paymentHome/total',
    headers: {
      isToken: true,
      repeatSubmit: false,
    },
    method: 'get',
  })
}

export function paymentHomePage(data: OpsHomeDetailQuery): Promise<AjaxResult<OpsHomeDetailPage>> {
  return request({
    url: '/merchant/paymentHome/merchantDetail',
    headers: {
      isToken: true,
      repeatSubmit: false,
    },
    method: 'post',
    data,
  })
}