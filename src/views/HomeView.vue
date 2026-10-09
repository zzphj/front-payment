<script setup lang="ts">
import { View, Hide } from '@element-plus/icons-vue'
import { ref } from 'vue'

const ranges = ['近10分钟', '今日', '昨日', '本周', '本月'] as const
type Range = (typeof ranges)[number]

const collectRange = ref<Range>('今日')
const payRange = ref<Range>('今日')

const cards = [
  {
    key: 'collect-amount',
    title: '收款金额',
    value: '0.00',
    lines: [
      ['今日成功收款金额', '0.00'],
      ['今日总收款金额', '0.00'],
      ['金额成功率', '%'],
    ],
  },
  {
    key: 'collect-count',
    title: '收款笔数',
    value: '0',
    lines: [
      ['今日成功收款笔数', '0'],
      ['今日总收款笔数', '0'],
      ['笔数成功率', '%'],
    ],
  },
  {
    key: 'pay-amount',
    title: '付款金额',
    value: '0.00',
    lines: [
      ['今日成功付款金额', '0.00'],
      ['今日总付款金额', '0.00'],
      ['金额成功率', '%'],
    ],
  },
  {
    key: 'pay-count',
    title: '付款笔数',
    value: '0',
    lines: [
      ['今日成功付款笔数', '0'],
      ['今日总付款笔数', '0'],
      ['笔数成功率', '%'],
    ],
  },
] as const

const hidden = ref<Record<string, boolean>>({})

function mask(key: string, value: string) {
  return hidden.value[key] ? '****' : value
}

const columns = [
  { prop: 'account', label: '账户', sortable: false, minWidth: 120 },
  { prop: 'successCount', label: '成功笔数', sortable: true, minWidth: 110 },
  { prop: 'totalCount', label: '总笔数', sortable: true, minWidth: 100 },
  { prop: 'countRate', label: '笔数成功率', sortable: true, minWidth: 120 },
  { prop: 'successAmount', label: '成功金额', sortable: true, minWidth: 110 },
  { prop: 'totalAmount', label: '总金额', sortable: true, minWidth: 100 },
  { prop: 'amountRate', label: '金额成功率', sortable: true, minWidth: 120 },
]
</script>

<template>
  <div class="home">
    <div class="page-head">首页</div>

    <div class="page-body">
      <section class="stats">
        <article v-for="card in cards" :key="card.key" class="stat-card">
          <header>
            <span>{{ card.title }}</span>
            <button
              type="button"
              class="eye"
              :aria-label="hidden[card.key] ? '显示金额' : '隐藏金额'"
              @click="hidden[card.key] = !hidden[card.key]"
            >
              <el-icon><Hide v-if="hidden[card.key]" /><View v-else /></el-icon>
            </button>
          </header>
          <strong>{{ mask(card.key, card.value) }}</strong>
          <p v-for="line in card.lines" :key="line[0]">
            {{ line[0] }}: {{ mask(card.key, line[1]) }}
          </p>
        </article>
      </section>

      <section class="panel">
        <header class="panel-head">
          <h2>收款详情</h2>
          <div class="ranges">
            <button
              v-for="item in ranges"
              :key="item"
              type="button"
              :class="{ active: collectRange === item }"
              @click="collectRange = item"
            >
              {{ item }}
            </button>
          </div>
        </header>
        <el-table :data="[]" height="260">
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :sortable="column.sortable"
            :min-width="column.minWidth"
          />
          <template #empty>
            <el-empty description="暂无数据" :image-size="72" />
          </template>
        </el-table>
      </section>

      <section class="panel">
        <header class="panel-head">
          <h2>付款详情</h2>
          <div class="ranges">
            <button
              v-for="item in ranges"
              :key="item"
              type="button"
              :class="{ active: payRange === item }"
              @click="payRange = item"
            >
              {{ item }}
            </button>
          </div>
        </header>
        <el-table :data="[]" height="260">
          <el-table-column
            v-for="column in columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :sortable="column.sortable"
            :min-width="column.minWidth"
          />
          <template #empty>
            <el-empty description="暂无数据" :image-size="72" />
          </template>
        </el-table>
      </section>
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
}

.stat-card {
  padding: 16px 18px 14px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.stat-card header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #606266;
  font-size: 14px;
}

.eye {
  display: inline-flex;
  padding: 0;
  color: #c0c4cc;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.eye:hover {
  color: #909399;
}

.stat-card strong {
  display: block;
  margin: 12px 0 10px;
  color: #303133;
  font-size: 28px;
  font-weight: 650;
  line-height: 1.2;
}

.stat-card p {
  margin: 0;
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
}

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

.panel-head h2 {
  margin: 0;
  color: #303133;
  font-size: 14px;
  font-weight: 600;
}

.ranges {
  display: flex;
  gap: 16px;
}

.ranges button {
  padding: 0;
  color: #909399;
  font-size: 13px;
  background: transparent;
  border: 0;
  cursor: pointer;
}

.ranges button.active {
  color: #303133;
  font-weight: 650;
}

.panel :deep(.el-table__empty-block) {
  min-height: 210px;
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

  .panel-head {
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px 16px;
  }
}
</style>
