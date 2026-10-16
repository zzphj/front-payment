<script setup lang="ts">
import { Hide, View } from '@element-plus/icons-vue'
import { ref } from 'vue'

defineProps<{
  title: string
  value: string | number
  lines: { label: string; value: string | number }[]
}>()

const isAmountHidden = ref(false)

function showAmount(value: string | number): string {
  return isAmountHidden.value ? '****' : String(value)
}
</script>

<template>
  <article class="stat-card">
    <header class="stat-head">
      <span>{{ title }}</span>
      <button
        type="button"
        class="eye"
        :aria-label="isAmountHidden ? '显示金额' : '隐藏金额'"
        @click="isAmountHidden = !isAmountHidden"
      >
        <el-icon>
          <Hide v-if="isAmountHidden" />
          <View v-else />
        </el-icon>
      </button>
    </header>
    <strong class="stat-value">{{ showAmount(value) }}</strong>
    <p v-for="line in lines" :key="line.label" class="stat-line">
      {{ line.label }}: {{ showAmount(line.value) }}
    </p>
  </article>
</template>

<style scoped>
.stat-card {
  padding: 16px 18px 14px;
  background: #fff;
  border: 1px solid #ebeef5;
  border-radius: 4px;
}

.stat-head {
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

.stat-value {
  display: block;
  margin: 12px 0 10px;
  color: #303133;
  font-size: 28px;
  font-weight: 650;
  line-height: 1.2;
}

.stat-line {
  margin: 0;
  color: #909399;
  font-size: 12px;
  line-height: 1.8;
}
</style>
