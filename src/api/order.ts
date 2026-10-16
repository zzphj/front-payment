import request from '@/utils/request'
import type { OrderQuery, TransactionRecord } from '@/types'
import type { PageDataResult, PageQuery } from '@/types/common'

export type TransactionPagePath = 'credit' | 'debit'

export function orderPage(
  path: TransactionPagePath,
  data: PageQuery<OrderQuery>,
): Promise<PageDataResult<TransactionRecord>> {
  return request({
    url: `/merchant/paymentTransaction/${path}/page`,
    headers: {
      isToken: true,
      repeatSubmit: false,
    },
    method: 'post',
    data,
  })
}
