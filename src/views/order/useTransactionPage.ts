import { orderPage, type TransactionPagePath } from '@/api/order'
import type { TransactionVO } from '@/types'
import { formatPageRange } from '@/utils/pagination'
import { computed, onMounted, onScopeDispose, ref } from 'vue'
import { buildOrderQuery, createOrderFilter, type OrderFilter } from './order-query'

export function useTransactionPage(path: TransactionPagePath) {
  // 定义属性
  const isLoading = ref(false)
  const loadError = ref('')
  const rows = ref<TransactionVO[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const filter = ref<OrderFilter>(createOrderFilter())
  const startTime = ref<string | null>(null)
  const endTime = ref<string | null>(null)
  let requestSerial = 0
  let alive = true

  // 计算文本
  const pageText = computed(() => formatPageRange(page.value, pageSize.value, total.value))


  async function loadList(): Promise<void> {
    if (!alive) return
    const serial = ++requestSerial
    isLoading.value = true
    loadError.value = ''
    try {
      // 调用列表接口
      const result = await orderPage(path, {
        page: page.value,
        pageSize: pageSize.value,
        // 构建查询参数
        params: buildOrderQuery(filter.value, startTime.value, endTime.value),
      })
      // 如果请求已经取消，则返回
      if (!alive || serial !== requestSerial) return
      rows.value = result.data?.data ?? []
      total.value = result.data?.total ?? 0
    } catch {
      if (!alive || serial !== requestSerial) return
      loadError.value = '订单加载失败'
    } finally {
      if (alive && serial === requestSerial) isLoading.value = false
    }
  }

  function handleSearch(): void {
    page.value = 1
    void loadList()
  }

  function handleReset(): void {
    filter.value = createOrderFilter()
    startTime.value = null
    endTime.value = null
    page.value = 1
    void loadList()
  }

  function handleRefresh(): void {
    void loadList()
  }

  function handlePageChange(nextPage: number): void {
    if (page.value === nextPage) return
    page.value = nextPage
    void loadList()
  }

  function handleSizeChange(nextSize: number): void {
    pageSize.value = nextSize
    page.value = 1
    void loadList()
  }

  onMounted(() => {
    void loadList()
  })

  onScopeDispose(() => {
    alive = false
    requestSerial += 1
  })

  return {
    isLoading,
    loadError,
    rows,
    total,
    page,
    pageSize,
    filter,
    startTime,
    endTime,
    pageText,
    handleSearch,
    handleReset,
    handleRefresh,
    handlePageChange,
    handleSizeChange,
  }
}
