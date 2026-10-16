import { paymentHomePage } from '@/api/bi'
import type { OpsHomeDetailRow } from '@/types'
import { onScopeDispose, reactive, ref } from 'vue'

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
  const isLoading = ref(false)
  const loadError = ref('')
  let requestSerial = 0
  let scheduled = false
  let alive = true

  async function load(): Promise<void> {
    if (!alive) return
    const serial = ++requestSerial
    isLoading.value = true
    loadError.value = ''
    try {
      const res = await paymentHomePage({
        page: page.value,
        pageSize: pageSize.value,
        params: {
          ...rangeToTime(range.value),
          fundDirection: direction,
        },
      })
      if (!alive || serial !== requestSerial) return
      rows.value = res.data?.data ?? []
      total.value = res.data?.total ?? 0
    } catch {
      if (!alive || serial !== requestSerial) return
      loadError.value = '明细加载失败'
    } finally {
      if (alive && serial === requestSerial) isLoading.value = false
    }
  }

  function scheduleLoad(): void {
    if (!alive || scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      void load()
    })
  }

  function changePage(next: number): void {
    if (page.value === next) return
    page.value = next
    scheduleLoad()
  }

  function changePageSize(next: number): void {
    pageSize.value = next
    page.value = 1
    scheduleLoad()
  }

  function changeRange(next: HomeRange): void {
    if (range.value === next) return
    range.value = next
    page.value = 1
    scheduleLoad()
  }

  onScopeDispose(() => {
    alive = false
    requestSerial += 1
  })

  return reactive({
    rows,
    total,
    page,
    pageSize,
    range,
    isLoading,
    loadError,
    load,
    changePage,
    changePageSize,
    changeRange,
  })
}
