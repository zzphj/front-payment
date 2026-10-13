import { describe, expect, it } from 'vitest'
import { rangeToTime } from './useFundDetail'

function unix(isoUtc: string) {
  return Math.floor(Date.parse(isoUtc) / 1000)
}

describe('rangeToTime in Pakistan', () => {
  const afternoon = new Date('2026-10-13T08:27:00Z')

  it('uses the Pakistan calendar day for 今日', () => {
    expect(rangeToTime('今日', afternoon)).toEqual({
      startTime: unix('2026-10-12T19:00:00Z'),
      endTime: unix('2026-10-13T18:59:59Z'),
    })
  })

  it('keeps 今日 on the previous Beijing date around midnight', () => {
    const stillPakistanYesterday = new Date('2026-10-13T17:00:00Z')
    expect(rangeToTime('今日', stillPakistanYesterday)).toEqual({
      startTime: unix('2026-10-12T19:00:00Z'),
      endTime: unix('2026-10-13T18:59:59Z'),
    })
  })

  it('shifts 昨日, 本周 and 本月 to Pakistan boundaries', () => {
    expect(rangeToTime('昨日', afternoon)).toEqual({
      startTime: unix('2026-10-11T19:00:00Z'),
      endTime: unix('2026-10-12T18:59:59Z'),
    })
    expect(rangeToTime('本周', afternoon)).toEqual({
      startTime: unix('2026-10-11T19:00:00Z'),
      endTime: unix('2026-10-18T18:59:59Z'),
    })
    expect(rangeToTime('本月', afternoon)).toEqual({
      startTime: unix('2026-09-30T19:00:00Z'),
      endTime: unix('2026-10-31T18:59:59Z'),
    })
  })

  it('keeps 本周 on the Pakistan week when Beijing is already Monday', () => {
    const pakistanSunday = new Date('2026-10-18T18:00:00Z')
    expect(rangeToTime('本周', pakistanSunday)).toEqual({
      startTime: unix('2026-10-11T19:00:00Z'),
      endTime: unix('2026-10-18T18:59:59Z'),
    })
  })

  it('keeps 近10分钟 as an absolute interval', () => {
    const endTime = unix('2026-10-13T08:27:00Z')
    expect(rangeToTime('近10分钟', afternoon)).toEqual({
      startTime: endTime - 10 * 60,
      endTime,
    })
  })
})
