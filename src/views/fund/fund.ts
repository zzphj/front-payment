import { fundAccount, fundPage } from '@/api/fund'
import type { AccountInfoVO, FundQuery, LedgerVO } from '@/types'
import { incomeExpenseTypeClass, incomeExpenseTypeLabel } from '@/types'
import { onMounted, ref } from 'vue'

export function fundAmountClass(amount: string): string {
  const text = amount.trim()
  if (text.startsWith('-')) return 'is-expense'
  if (text === '') return ''
  return 'is-income'
}



export function createFundFilter(): FundQuery {
  return {
    id: '',
    bizId: '',
    bizType: '',
    startTime: '',
    endTime: '',
    incomeExpenseType: 'INCOME',
    keyword: '',
  }
}

export function usefundPage() {
  const account = ref<AccountInfoVO | null>(null)
  const isLoading = ref(false)
  const loadError = ref('')
  const rows = ref<LedgerVO[]>([])
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)
  const filter = ref<FundQuery>(createFundFilter())
  const startTime = ref<string | null>(null)
  const endTime = ref<string | null>(null)
  let requestSerial = 0
  let alive = true

  async function loadAccount(): Promise<void> {
    const result = await fundAccount()
    account.value = result.data?.[0] ?? null
  }

  async function loadList(): Promise<void> {
    if (!alive) return
    const serial = ++requestSerial
    isLoading.value = true
    loadError.value = ''
    try {
      // 调用列表接口
      const result = await fundPage({
        page: page.value,
        pageSize: pageSize.value,
        // 构建查询参数
        params: buildFundQuery(filter.value, startTime.value, endTime.value),
      })
      // 如果请求已经取消，则返回
      if (!alive || serial !== requestSerial) return
      rows.value = result.data?.data ?? []
      total.value = result.data?.total ?? 0
    } catch {
      if (!alive || serial !== requestSerial) return
      loadError.value = '资金加载失败'
    } finally {
      if (alive && serial === requestSerial) isLoading.value = false
    }
  }

  function buildFundQuery(
    filter: FundQuery,
    startTime: string | null,
    endTime: string | null,
  ): FundQuery {
    const query: FundQuery = {}
    assignText(query, 'id', filter.id)
    assignText(query, 'bizId', filter.bizId)
    assignText(query, 'bizType', filter.bizType)
    assignText(query, 'keyword', filter.keyword)
    if (filter.incomeExpenseType !== null) query.incomeExpenseType = filter.incomeExpenseType

    if (startTime !== null) query.startTime = startTime
    if (endTime !== null) query.endTime = endTime
    return query
  }


  function assignText(query: FundQuery, key: keyof FundQuery, value: string | undefined): void {
    if (value === undefined) return
    const text = value.trim()
    if (text !== '') query[key] = text
  }


  function handleSearch(): void {
    page.value = 1
    void loadList()
  }

  function handleReset(): void {
    filter.value = createFundFilter()
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
    if (pageSize.value === nextSize) return
    pageSize.value = nextSize
    void loadList()
  }

  onMounted(() => {
    void loadList()
    void loadAccount()
  })

  return {
    account,
    isLoading,
    loadError,
    rows,
    total,
    page,
    pageSize,
    filter,
    startTime,
    endTime,
    loadList,
    handleSearch,
    handleReset,
    handleRefresh,
    handlePageChange,
    handleSizeChange,
    fundDirectionClass: incomeExpenseTypeClass,
    fundDirectionLabel: incomeExpenseTypeLabel,
    fundAmountClass,
  }
}
