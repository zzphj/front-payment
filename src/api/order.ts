import request from '@/utils/request'
import type { OrderQuery, TransactionVO } from '@/types'
import type { AjaxResult, PageDataResult, PageQuery } from '@/types/common'

export type TransactionPagePath = 'credit' | 'debit'

export function orderPage(
  path: TransactionPagePath,
  data: PageQuery<OrderQuery>,
): Promise<AjaxResult<PageDataResult<TransactionVO>>> {
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
