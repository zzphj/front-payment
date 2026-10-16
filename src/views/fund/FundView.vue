<script setup lang="ts">
import { Hide, View } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { computed, ref } from 'vue'
import { displayText } from '@/utils/time'
import {
  fundAmountClass,
  fundDirectionClass,
  fundDirectionLabel,
  showFundTime,
  type FundAccountItem,
  type FundFlowItem,
} from './fund'

const isLoading = ref(false)
const loadError = ref('')
const isAmountHidden = ref(false)
const account = ref<FundAccountItem | null>(null)
const flows = ref<FundFlowItem[]>([])

const balanceText = computed(() => {
  if (isAmountHidden.value) return '****'
  return displayText(account.value?.balance)
})

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
            <span>{{ showFundTime(account?.createTime) }}</span>
          </div>
          <div class="info-item">
            <span class="info-label">状态：</span>
            <span>{{ displayText(account?.statusLabel) }}</span>
          </div>
        </div>
      </section>

      <section class="panel balance-panel">
        <div class="balance-main">
          <div class="balance-label">
            <span>总余额</span>
            <button
              type="button"
              class="eye"
              :aria-label="isAmountHidden ? '显示余额' : '隐藏余额'"
              @click="isAmountHidden = !isAmountHidden"
            >
              <el-icon>
                <Hide v-if="isAmountHidden" />
                <View v-else />
              </el-icon>
            </button>
          </div>
          <strong class="balance-value">{{ balanceText }}</strong>
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

        <el-table v-loading="isLoading" :data="flows" row-key="flowNo" border>
          <el-table-column prop="flowNo" label="流水号" min-width="120" />
          <el-table-column prop="accountNo" label="交易账户" min-width="150" show-overflow-tooltip />
          <el-table-column label="交易时间" min-width="190">
            <template #default="{ row }: { row: FundFlowItem }">
              {{ showFundTime(row.tradeTime) }}
            </template>
          </el-table-column>
          <el-table-column label="收支类型" min-width="100">
            <template #default="{ row }: { row: FundFlowItem }">
              <span class="direction" :class="fundDirectionClass(row.direction)">
                {{ fundDirectionLabel(row.direction) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="tradeType" label="交易类型" min-width="160" show-overflow-tooltip />
          <el-table-column prop="orderNo" label="交易单号" min-width="130" show-overflow-tooltip />
          <el-table-column label="交易金额" min-width="110">
            <template #default="{ row }: { row: FundFlowItem }">
              <span :class="fundAmountClass(row.amount)">{{ displayText(row.amount) }}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易后余额" min-width="120">
            <template #default="{ row }: { row: FundFlowItem }">
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
