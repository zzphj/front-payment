/**
 * 通用参数序列化，来自 RuoYi。
 * 空字符串、null、undefined 不传递；数字 0 和 false 会保留。
 */
function isPresent(value: unknown): boolean {
  return value !== null && value !== undefined && value !== ''
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function tansParams(params: Record<string, unknown>): string {
  let result = ''
  for (const propName of Object.keys(params)) {
    const value = params[propName]
    if (!isPresent(value)) continue

    if (isRecord(value)) {
      for (const key of Object.keys(value)) {
        const child = value[key]
        if (!isPresent(child)) continue
        const nestedName = `${propName}[${key}]`
        result += `${encodeURIComponent(nestedName)}=${encodeURIComponent(String(child))}&`
      }
      continue
    }

    result += `${encodeURIComponent(propName)}=${encodeURIComponent(String(value))}&`
  }
  return result
}
