import { describe, expect, it } from 'vitest'
import { buildOrderQuery, createOrderFilter } from './order-query'

describe('buildOrderQuery', () => {
  it('omits blank text and keeps a selected status', () => {
    const filter = createOrderFilter()
    filter.id = '  '
    filter.keyword = ' ali '
    filter.status = 'PENDING'

    expect(buildOrderQuery(filter, null, '   ')).toEqual({
      keyword: 'ali',
      status: 'PENDING',
    })
  })

  it('converts a valid time range and drops an invalid end', () => {
    const query = buildOrderQuery(createOrderFilter(), '2026-10-15 00:00:00', '2026-02-31 23:59:59')
    expect(query.startTime).toBe(new Date(2026, 9, 15, 0, 0, 0).getTime())
    expect(query.endTime).toBeUndefined()
  })
})
