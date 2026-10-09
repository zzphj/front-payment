<script setup lang="ts">
import { Bell, House, List, Setting, User, Wallet } from '@element-plus/icons-vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const watermarkFont = {
  color: 'rgba(0, 0, 0, 0.06)',
  fontSize: 16,
}

function onSelect(index: string) {
  if (index.startsWith('/')) router.push(index)
}
</script>

<template>
  <el-watermark class="layout-watermark" content="测试环境" :font="watermarkFont" :gap="[160, 120]">
    <el-container class="layout">
      <el-header class="layout-header" height="48px">
        <div class="brand">Merchant Client</div>
        <div class="header-actions">
          <span class="action">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18M12 3c2.5 2.8 3.8 5.8 3.8 9s-1.3 6.2-3.8 9c-2.5-2.8-3.8-5.8-3.8-9S9.5 5.8 12 3z" />
            </svg>
            中文
          </span>
          <el-badge is-dot class="action">
            <el-icon :size="16"><Bell /></el-icon>
          </el-badge>
          <el-icon class="action" :size="16"><Setting /></el-icon>
          <span class="action user">
            <el-icon :size="16"><User /></el-icon>
            admin
          </span>
        </div>
      </el-header>

      <el-container class="layout-body">
        <el-aside class="layout-aside" width="200px">
          <el-menu
            class="layout-menu"
            :default-active="route.path"
            @select="onSelect"
          >
            <el-menu-item index="/">
              <el-icon><House /></el-icon>
              <span>首页</span>
            </el-menu-item>
            <el-sub-menu index="orders">
              <template #title>
                <el-icon><List /></el-icon>
                <span>订单管理</span>
              </template>
            </el-sub-menu>
            <el-menu-item index="funds">
              <el-icon><Wallet /></el-icon>
              <span>资金管理</span>
            </el-menu-item>
            <el-menu-item index="settings">
              <el-icon><User /></el-icon>
              <span>个人设置</span>
            </el-menu-item>
          </el-menu>
        </el-aside>

        <el-main class="layout-main">
          <RouterView />
        </el-main>
      </el-container>
    </el-container>
  </el-watermark>
</template>

<style scoped>
.layout-watermark {
  display: block;
  height: 100vh;
}

.layout {
  height: 100%;
  background: #f5f6f8;
}

.layout-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #ebeef5;
}

.brand {
  color: #303133;
  font-size: 16px;
  font-weight: 650;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 18px;
  color: #606266;
  font-size: 13px;
}

.action {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
}

.action svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.user {
  color: #303133;
}

.layout-body {
  min-height: 0;
}

.layout-aside {
  background: #fff;
  border-right: 1px solid #ebeef5;
}

.layout-menu {
  border-right: 0;
  --el-menu-item-height: 44px;
  --el-menu-sub-item-height: 40px;
  --el-menu-active-color: #303133;
  --el-menu-hover-bg-color: #f5f7fa;
  --el-menu-bg-color: #fff;
}

.layout-menu :deep(.el-menu-item.is-active) {
  background: #f2f3f5;
}

.layout-main {
  padding: 0;
  background: #f5f6f8;
}

@media (max-width: 760px) {
  .layout-aside {
    width: 72px !important;
  }

  .layout-menu :deep(.el-menu-item span),
  .layout-menu :deep(.el-sub-menu__title span) {
    display: none;
  }
}
</style>
