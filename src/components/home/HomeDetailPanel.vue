<script setup lang="ts">
import type { HomeRange } from '@/composables/useFundDetail'
import type { OpsHomeDetailRow } from '@/types'
import { formatPageRange } from '@/utils/pagination'
import { computed } from 'vue'

const props = defineProps<{
  title: string
  ranges: readonly HomeRange[]
  activeRange: HomeRange
  rows: OpsHomeDetailRow[]
  isLoading: boolean
  loadError: string
  page: number
  pageSize: number
  total: number
}>()

const pageText = computed(() => formatPageRange(props.page, props.pageSize, props.total))

const emit = defineEmits<{
  rangeChange: [range: HomeRange]
  pageChange: [page: number]
  sizeChange: [pageSize: number]
}>()

function selectRange(range: HomeRange): void {
  if (range === props.activeRange) return
  emit('rangeChange', range)
}
</script>

<template>
  <section class="panel">
    <header class="panel-head">
      <h2 class="panel-title">{{ title }}</h2>
      <div class="ranges">
        <button
          v-for="item in ranges"
          :key="item"
          type="button"
          class="range-button"
          :class="{ 'is-active': activeRange === item }"
          @click="selectRange(item)"
        >
          {{ item }}
        </button>
      </div>
    </header>
    <el-alert
      v-if="loadError && rows.length > 0"
      class="load-error"
      :title="loadError"
      type="error"
      show-icon
      :closable="false"
    />
    <el-table v-loading="isLoading" :data="rows" row-key="accountId" border>
      <el-table-column label="账户" min-width="160">
        <template #default="{ row }">{{ row.account?.accountNo }}</template>
      </el-table-column>
      <el-table-column prop="successCount" label="成功笔数" sortable min-width="110" />
      <el-table-column prop="totalCount" label="总笔数" sortable min-width="100" />
      <el-table-column prop="successRateByCount" label="笔数成功率" sortable min-width="120">
        <template #default="{ row }">{{ row.successRateByCount }}%</template>
      </el-table-column>
      <el-table-column prop="successAmount" label="成功金额" sortable min-width="110" />
      <el-table-column prop="totalAmount" label="总金额" sortable min-width="100" />
      <el-table-column prop="successRateByAmount" label="金额成功率" sortable min-width="120">
        <template #default="{ row }">{{ row.successRateByAmount }}%</template>
      </el-table-column>
      <template #empty>
        <el-empty :description="loadError || '暂无数据'" :image-size="72" />
      </template>
    </el-table>
    <div class="pager">
      <span>{{ pageText }}</span>
      <el-pagination
        :current-page="page"
        :page-size="pageSize"
        :total="total"
        :page-sizes="[10, 20, 50, 100]"
        layout="prev, pager, next, sizes"
        @current-change="emit('pageChange', $event)"
        @size-change="emit('sizeChange', $event)"
      />
    </div>
  </section>
</template>

<style scoped>
.panel {
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 48px;
  padding: 0 16px;
  border-bottom: 1px solid #ebeef5;
}

.panel-title {
  margin: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.ranges {
  display: flex;
  gap: 16px;
}

.range-button {
  padding: 0;
  color: #909399;
  font-size: 13px;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.range-button.is-active {
  color: #303133;
  font-weight: 650;
}

.load-error {
  margin: 12px 16px 0;
}

.panel :deep(.el-table__empty-block) {
  min-height: 160px;
}

.pager {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  padding: 12px 16px;
  color: #606266;
  font-size: 13px;
}

.pager :deep(.el-pager li.is-active) {
  color: var(--el-color-primary);
  background: #fff;
  border: 1px solid var(--el-color-primary);
  border-radius: 50%;
}

@media (max-width: 640px) {
  .panel-head {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
  }
}
</style>
