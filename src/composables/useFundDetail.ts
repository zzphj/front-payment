import { paymentHomePage } from '@/api/bi'
import type { OpsHomeDetailRow } from '@/types'
import { reactive, ref } from 'vue'

export const homeRanges = ['近10分钟', '今日', '昨日', '本周', '本月'] as const
export type HomeRange = (typeof homeRanges)[number]

const PAKISTAN_TIME_ZONE = 'Asia/Karachi'
const PAKISTAN_UTC_OFFSET_HOURS = 5

const WEEKDAYS: Record<string, number> = {
  Sun: 0,
  Mon: 1,
  Tue: 2,
  Wed: 3,
  Thu: 4,
  Fri: 5,
  Sat: 6,
}

function pakistanDate(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: PAKISTAN_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
  }).formatToParts(date)
  const value: Record<string, string> = {}
  for (const part of parts) value[part.type] = part.value
  const weekday = value.weekday
  return {
    year: Number(value.year),
    month: Number(value.month),
    day: Number(value.day),
    weekday: weekday ? WEEKDAYS[weekday] ?? 0 : 0,
  }
}

function shiftDays(year: number, month: number, day: number, delta: number) {
  const next = new Date(Date.UTC(year, month - 1, day + delta))
  return { year: next.getUTCFullYear(), month: next.getUTCMonth() + 1, day: next.getUTCDate() }
}

function pakistanSeconds(year: number, month: number, day: number, hour: number, minute: number, second: number) {
  return Math.floor(Date.UTC(year, month - 1, day, hour - PAKISTAN_UTC_OFFSET_HOURS, minute, second) / 1000)
}

function dayRange(year: number, month: number, day: number) {
  return {
    startTime: pakistanSeconds(year, month, day, 0, 0, 0),
    endTime: pakistanSeconds(year, month, day, 23, 59, 59),
  }
}

export function rangeToTime(range: HomeRange, now = new Date()) {
  if (range === '近10分钟') {
    const endTime = Math.floor(now.getTime() / 1000)
    return { startTime: endTime - 10 * 60, endTime }
  }
  const current = pakistanDate(now)
  if (range === '昨日') {
    const yesterday = shiftDays(current.year, current.month, current.day, -1)
    return dayRange(yesterday.year, yesterday.month, yesterday.day)
  }
  if (range === '本周') {
    const day = current.weekday || 7
    const monday = shiftDays(current.year, current.month, current.day, 1 - day)
    const sunday = shiftDays(monday.year, monday.month, monday.day, 6)
    return {
      startTime: pakistanSeconds(monday.year, monday.month, monday.day, 0, 0, 0),
      endTime: pakistanSeconds(sunday.year, sunday.month, sunday.day, 23, 59, 59),
    }
  }
  if (range === '本月') {
    const lastDay = new Date(Date.UTC(current.year, current.month, 0)).getUTCDate()
    return {
      startTime: pakistanSeconds(current.year, current.month, 1, 0, 0, 0),
      endTime: pakistanSeconds(current.year, current.month, lastDay, 23, 59, 59),
    }
  }
  return dayRange(current.year, current.month, current.day)
}

export function useFundDetail(direction: 'CREDIT' | 'DEBIT') {
  const rows = ref<OpsHomeDetailRow[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const range = ref<HomeRange>('今日')
  const loading = ref(false)
  let requestSerial = 0
  let scheduled = false

  async function load() {
    const serial = ++requestSerial
    loading.value = true
    try {
      const res = await paymentHomePage({
        page: page.value,
        pageSize: pageSize.value,
        params: {
          ...rangeToTime(range.value),
          fundDirection: direction,
        },
      })
      if (serial !== requestSerial) return
      rows.value = res.data?.data ?? []
      total.value = res.data?.total ?? 0
    } catch {
      // 拦截器已经弹出错误提示，这里保留当前表格数据。
    } finally {
      if (serial === requestSerial) loading.value = false
    }
  }

  function scheduleLoad() {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      void load()
    })
  }

  function changePage(next: number) {
    if (page.value === next) return
    page.value = next
    scheduleLoad()
  }

  function changePageSize(next: number) {
    pageSize.value = next
    page.value = 1
    scheduleLoad()
  }

  function changeRange(next: HomeRange) {
    if (range.value === next) return
    range.value = next
    page.value = 1
    scheduleLoad()
  }

  return reactive({
    rows,
    total,
    page,
    pageSize,
    range,
    loading,
    load,
    changePage,
    changePageSize,
    changeRange,
  })
}
