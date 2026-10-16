<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { paymentHomeTotal } from '@/api/bi'
import HomeDetailPanel from '@/components/home/HomeDetailPanel.vue'
import HomeStatCard from '@/components/home/HomeStatCard.vue'
import { homeRanges, useFundDetail } from '@/composables/useFundDetail'
import type { OpsHomeTotalResp } from '@/types'

const isLoading = ref(false)
const loadError = ref('')
const merchantCredit = ref<OpsHomeTotalResp | null>(null)
const merchantDebit = ref<OpsHomeTotalResp | null>(null)
const collect = useFundDetail('CREDIT')
const pay = useFundDetail('DEBIT')

function createEmptyTotal(): OpsHomeTotalResp {
  return {
    failedAmount: '0',
    failedCount: 0,
    fundDirection: '',
    institutionType: '',
    successAmount: '0',
    successCount: 0,
    successRateByAmount: '0',
    successRateByCount: '0',
    totalAmount: '0',
    totalCount: 0,
  }
}

function amountLines(action: string, data: OpsHomeTotalResp) {
  return [
    { label: `今日成功${action}金额`, value: data.successAmount },
    { label: `今日总${action}金额`, value: data.totalAmount },
    { label: '金额成功率', value: `${data.successRateByAmount}%` },
  ]
}

function countLines(action: string, data: OpsHomeTotalResp) {
  return [
    { label: `今日成功${action}笔数`, value: data.successCount },
    { label: `今日总${action}笔数`, value: data.totalCount },
    { label: '笔数成功率', value: `${data.successRateByCount}%` },
  ]
}

const statCards = computed(() => {
  const cards = []
  if (merchantCredit.value) {
    cards.push(
      { key: 'collect-amount', title: '收款金额', value: merchantCredit.value.successAmount, lines: amountLines('收款', merchantCredit.value) },
      { key: 'collect-count', title: '收款笔数', value: merchantCredit.value.successCount, lines: countLines('收款', merchantCredit.value) },
    )
  }
  if (merchantDebit.value) {
    cards.push(
      { key: 'pay-amount', title: '付款金额', value: merchantDebit.value.successAmount, lines: amountLines('付款', merchantDebit.value) },
      { key: 'pay-count', title: '付款笔数', value: merchantDebit.value.successCount, lines: countLines('付款', merchantDebit.value) },
    )
  }
  return cards
})

async function loadTotal(): Promise<void> {
  isLoading.value = true
  loadError.value = ''
  try {
    const res = await paymentHomeTotal()
    merchantCredit.value = res.data?.merchantCredit ?? createEmptyTotal()
    merchantDebit.value = res.data?.merchantDebit ?? createEmptyTotal()
  } catch {
    loadError.value = '汇总加载失败'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  void loadTotal()
  void collect.load()
  void pay.load()
})
</script>

<template>
  <div class="home">
    <div class="page-head">首页</div>

    <div class="page-body">
      <el-alert v-if="loadError" :title="loadError" type="error" show-icon :closable="false" />

      <section class="stats" v-loading="isLoading" element-loading-text="加载中">
        <HomeStatCard
          v-for="card in statCards"
          :key="card.key"
          :title="card.title"
          :value="card.value"
          :lines="card.lines"
        />
      </section>

      <HomeDetailPanel
        title="收款详情"
        :ranges="homeRanges"
        :active-range="collect.range"
        :rows="collect.rows"
        :is-loading="collect.isLoading"
        :load-error="collect.loadError"
        :page="collect.page"
        :page-size="collect.pageSize"
        :total="collect.total"
        @range-change="collect.changeRange"
        @page-change="collect.changePage"
        @size-change="collect.changePageSize"
      />

      <HomeDetailPanel
        title="付款详情"
        :ranges="homeRanges"
        :active-range="pay.range"
        :rows="pay.rows"
        :is-loading="pay.isLoading"
        :load-error="pay.loadError"
        :page="pay.page"
        :page-size="pay.pageSize"
        :total="pay.total"
        @range-change="pay.changeRange"
        @page-change="pay.changePage"
        @size-change="pay.changePageSize"
      />
    </div>
  </div>
</template>

<style scoped>
.home {
  min-height: 100%;
}

.page-head {
  height: 42px;
  padding: 0 16px;
  color: #303133;
  font-size: 14px;
  line-height: 42px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

.page-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
  min-height: 148px;
}

@media (max-width: 1100px) {
  .stats {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
