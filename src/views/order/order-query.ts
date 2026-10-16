import type { OrderQuery, TransactionStatus } from '@/types'
import { parseDateTime } from '@/utils/time'

export interface OrderFilter {
  id: string
  customerAccountNo: string
  channelTransactionId: string
  status: TransactionStatus | null
  keyword: string
}

export function createOrderFilter(): OrderFilter {
  return {
    id: '',
    customerAccountNo: '',
    channelTransactionId: '',
    status: null,
    keyword: '',
  }
}

function assignText(query: OrderQuery, key: 'id' | 'customerAccountNo' | 'channelTransactionId' | 'keyword', value: string): void {
  const text = value.trim()
  if (text !== '') query[key] = text
}

/** 空字符串和空白不传给后端，数字 0 不在这组条件里。 */
export function buildOrderQuery(
  filter: OrderFilter,
  startTime: string | null,
  endTime: string | null,
): OrderQuery {
  const query: OrderQuery = {}
  assignText(query, 'id', filter.id)
  assignText(query, 'customerAccountNo', filter.customerAccountNo)
  assignText(query, 'channelTransactionId', filter.channelTransactionId)
  assignText(query, 'keyword', filter.keyword)
  if (filter.status !== null) query.status = filter.status

  const start = parseDateTime(startTime)
  if (start !== undefined) query.startTime = start
  const end = parseDateTime(endTime)
  if (end !== undefined) query.endTime = end
  return query
}
