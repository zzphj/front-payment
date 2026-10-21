<script setup lang="ts">
import { Hide, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { displayText, displayTime } from '@/utils/time'
import {
  usefundPage
} from './fund'
import type { LedgerVO } from '@/types'
import { ledgerBizTypeLabel } from '@/types'

const isAmountHidden = ref(false)

const {
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
  handleSearch,
  handleReset,
  handleRefresh,
  handlePageChange,
  handleSizeChange,
  fundDirectionClass,
  fundDirectionLabel,
  fundAmountClass,
} = usefundPage()



function handleUnavailable(): void {
  ElMessage.info('接口尚未接入')
}
</script>

<template>
  <div class="fund-page">
    <h1 class="page-title">资金管理</h1>

    <div class="page-body" v-loading="isLoading" element-loading-text="加载中">
      <el-alert v-if="loadError" :title="loadError" type="error" show-icon :closable="false" />

      <section class="panel">
        <header class="panel-head">
          <h2 class="panel-title">基本信息</h2>
        </header>
        <div class="info-grid">
          <div class="info-item">
            <span class="info-label">账户ID：</span>
            <span>{{ displayText(account?.accountId) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">账户：</span>
            <span>{{ displayText(account?.accountNo) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">创建时间：</span>
            <span>{{ displayTime(account?.createTime?.toString()) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">状态：</span>
            <span>{{ displayText(account?.status) }}</span>
          </div>
        </div>
      </section>

      <section class="panel balance-panel">
        <div class="balance-main">
          <div class="balance-label">
            <span>总余额</span>
            <button type="button" class="eye" :aria-label="isAmountHidden ? '显示余额' : '隐藏余额'"
              @click="isAmountHidden = !isAmountHidden">
              <el-icon>
                <Hide v-if="isAmountHidden" />
                <View v-else />
              </el-icon>
            </button>
          </div>
          <strong class="balance-value">{{ displayText(account?.balance) }}</strong>
        </div>
        <div class="balance-actions">
          <el-button type="primary" @click="handleUnavailable">充值</el-button>
          <el-button type="primary" plain @click="handleUnavailable">提现</el-button>
        </div>
      </section>

      <section class="panel table-panel">
        <header class="panel-head">
          <h2 class="panel-title">资金明细</h2>
          <button type="button" class="more" @click="handleUnavailable">更多 &gt;</button>
        </header>

        <el-table v-loading="isLoading" :data="rows" row-key="flowNo" border>
          <el-table-column prop="ledgerId" label="流水号" min-width="120" />
          <el-table-column prop="accountNo" label="交易账户" min-width="150" show-overflow-tooltip />
          <el-table-column label="交易时间" min-width="190">
            <template #default="{ row }: { row: LedgerVO }">
              {{ displayTime(row.createTime?.toString()) }}
            </template>
          </el-table-column>
          <el-table-column label="收支类型" min-width="100">
            <template #default="{ row }: { row: LedgerVO }">
              <span class="direction" :class="fundDirectionClass(row.incomeExpenseType)">
                {{ fundDirectionLabel(row.incomeExpenseType) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="bizType" label="交易类型" min-width="160" show-overflow-tooltip>
            <template #default="{ row }: { row: LedgerVO }">
              <span>{{ ledgerBizTypeLabel(row.bizType) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="bizId" label="交易单号" min-width="130" show-overflow-tooltip />
          <el-table-column label="交易金额" min-width="110">
            <template #default="{ row }: { row: LedgerVO }">
              <span :class="fundAmountClass(row.amount)">{{ displayText(row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易后余额" min-width="120">
            <template #default="{ row }: { row: LedgerVO }">
              {{ displayText(row.balanceAfter) }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" fixed="right">
            <template #default>
              <el-button link type="primary" @click="handleUnavailable">详情</el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty :description="loadError || '暂无数据'" :image-size="72" />
          </template>
        </el-table>
      </section>
    </div>
  </div>
</template>

<style scoped src="./fund-page.css"></style>
