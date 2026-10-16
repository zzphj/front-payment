export function formatPageRange(page: number, pageSize: number, total: number): string {
  if (total === 0) return '第0-0条/总共0条'
  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, total)
  return `第${start}-${end}条/总共${total}条`
}
