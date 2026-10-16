<script setup lang="ts">
import { Download, FullScreen, Grid, Refresh, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import {
  transactionStatusClass,
  transactionStatusLabel,
  transactionStatusOptions,
  type TransactionVO,
} from '@/types'
import { displayText, formatTimestamp } from '@/utils/time'
import { useTransactionPage } from './useTransactionPage'

const {
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
} = useTransactionPage('credit')

function handleExport(): void {
  ElMessage.info('导出接口尚未接入')
}

function statusClass(row: TransactionVO): string {
  return transactionStatusClass(row.status)
}

function statusLabel(row: TransactionVO): string {
  return transactionStatusLabel(row.status)
}
</script>

<template>
  <div class="order-page">
    <div class="crumb">
      <span>订单管理</span>
      <span> / </span>
      <span class="current">收款订单</span>
    </div>

    <div class="page-body">
      <section class="panel">
        <el-form class="filter-grid" :model="filter" label-width="112px" @submit.prevent="handleSearch">
          <el-form-item label="订单ID：">
            <el-input v-model="filter.id" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="客户账户：">
            <el-input v-model="filter.customerAccountNo" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="网关收款ID：">
            <el-input v-model="filter.channelTransactionId" placeholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="订单状态：">
            <el-select v-model="filter.status" placeholder="请选择" clearable>
              <el-option
                v-for="item in transactionStatusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="时间：">
            <el-date-picker
              v-model="startTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
              clearable
            />
            <el-date-picker
              v-model="endTime"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="请选择时间"
              clearable
            />
          </el-form-item>
          <el-form-item label="关键词：">
            <el-input v-model="filter.keyword" placeholder="请输入" clearable />
          </el-form-item>
          <div class="filter-actions">
            <el-button native-type="button" :disabled="isLoading" @click="handleReset">重置</el-button>
            <el-button type="primary" native-type="submit" :loading="isLoading">查询</el-button>
          </div>
        </el-form>
      </section>

      <section class="panel table-panel">
        <div class="toolbar">
          <el-button type="primary" :icon="Download" :disabled="isLoading" @click="handleExport">导出</el-button>
          <el-button :icon="Refresh" text title="刷新" :disabled="isLoading" @click="handleRefresh" />
          <el-button :icon="Grid" text title="密度" />
          <el-button :icon="Setting" text title="列设置" />
          <el-button :icon="FullScreen" text title="全屏" />
        </div>

        <el-alert
          v-if="loadError && rows.length > 0"
          class="load-error"
          :title="loadError"
          type="error"
          show-icon
          :closable="false"
        />

        <el-table v-loading="isLoading" :data="rows" row-key="transactionId">
          <el-table-column prop="transactionId" label="订单ID" min-width="140" />
          <el-table-column prop="createTime" label="创建时间" min-width="170" sortable>
            <template #default="{ row }: { row: TransactionVO }">
              {{ displayText(formatTimestamp(row.createTime)) }}
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="收款金额" min-width="110" sortable />
          <el-table-column label="付款机构对象" min-width="140" show-overflow-tooltip>
            <template #default="{ row }: { row: TransactionVO }">
              {{ displayText(row.channel?.name) }}
            </template>
          </el-table-column>
          <el-table-column label="付款客户" min-width="110" show-overflow-tooltip>
            <template #default="{ row }: { row: TransactionVO }">
              {{ displayText(row.sourceAccountHolderName) }}
            </template>
          </el-table-column>
          <el-table-column label="付款客户账户" min-width="140" show-overflow-tooltip>
            <template #default="{ row }: { row: TransactionVO }">
              {{ displayText(row.sourceAccountNo) }}
            </template>
          </el-table-column>
          <el-table-column prop="executionTime" label="执行时间" min-width="170" sortable>
            <template #default="{ row }: { row: TransactionVO }">
              {{ displayText(formatTimestamp(row.executionTime)) }}
            </template>
          </el-table-column>
          <el-table-column label="订单状态" min-width="100">
            <template #default="{ row }: { row: TransactionVO }">
              <span :class="statusClass(row)">{{ statusLabel(row) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="执行结果" min-width="180" show-overflow-tooltip>
            <template #default="{ row }: { row: TransactionVO }">
              {{ displayText(row.executionResult) }}
            </template>
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
            @current-change="handlePageChange"
            @size-change="handleSizeChange"
          />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped src="./order-page.css"></style>
