const DATE_TIME_PATTERN = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/

function pad(value: number): string {
  return String(value).padStart(2, '0')
}

/** 只接受数字年月日时分秒，避免 new Date(字符串) 在不同浏览器结果不一致。 */
export function parseDateTime(value: string | null): number | undefined {
  if (value === null) return undefined
  const text = value.trim()
  if (text === '') return undefined

  const matched = DATE_TIME_PATTERN.exec(text)
  if (!matched) return undefined

  const year = Number(matched[1])
  const month = Number(matched[2])
  const day = Number(matched[3])
  const hour = Number(matched[4])
  const minute = Number(matched[5])
  const second = Number(matched[6])
  const date = new Date(year, month - 1, day, hour, minute, second)
  const isSame =
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    date.getHours() === hour &&
    date.getMinutes() === minute &&
    date.getSeconds() === second

  return isSame ? date.getTime() : undefined
}

/** 展示毫秒时间戳。入参是数字或纯数字字符串，0 会格式化成纪元时间，不会当成空值。 */
export function formatTimestamp(value: string | number | null | undefined): string {
  if (value === null || value === undefined || value === '') return ''

  const text = String(value).trim()
  if (!/^\d+$/.test(text)) return ''

  const millis = Number(text)
  if (!Number.isFinite(millis)) return ''

  const date = new Date(millis)
  if (Number.isNaN(date.getTime())) return ''

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}

export function displayText(value: string | null | undefined): string {
  if (value === null || value === undefined || value.trim() === '') return '-'
  return value
}
