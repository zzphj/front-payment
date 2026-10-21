import request from '@/utils/request'
import type { AccountInfoVO, FundQuery, LedgerVO } from '@/types'
import type { AjaxResult, PageDataResult, PageQuery } from '@/types/common'

export type TransactionPagePath = 'credit' | 'debit'

export function fundPage(
    data: PageQuery<FundQuery>,
): Promise<AjaxResult<PageDataResult<LedgerVO>>> {
    return request({
        url: `merchant/paymentLedger/available/page`,
        headers: {
            isToken: true,
            repeatSubmit: false,
        },
        method: 'post',
        data,
    })
}


export function fundAccount(): Promise<AjaxResult<AccountInfoVO[]>> {
    return request({
        url: `merchant/paymentAccount/list`,
        headers: {
            isToken: true,
            repeatSubmit: false,
        },
        method: 'get',
    })
}
