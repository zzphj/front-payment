<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormRules } from 'element-plus'
import { Lock, User } from '@element-plus/icons-vue'
import useUserStore from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isLoading = ref(false)
const formRef = ref<FormInstance>()

function createLoginForm() {
  return {
    username: '',
    password: '',
    googleCode: '',
  }
}

const form = reactive(createLoginForm())

const codeLength = computed(() => form.googleCode.length)

const rules: FormRules = {
  username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  googleCode: [
    {
      validator: (_rule, value: string, callback) => {
        if (value && !/^\d{6}$/.test(value)) {
          callback(new Error('请输入6位数字验证码'))
          return
        }
        callback()
      },
      trigger: 'blur',
    },
  ],
}

function onGoogleInput(value: string) {
  form.googleCode = value.replace(/\D/g, '').slice(0, 6)
}

function safeRedirect(value: unknown) {
  if (typeof value === 'string' && value.startsWith('/') && !value.startsWith('//')) {
    return value
  }
  return '/'
}

async function handleSubmit(): Promise<void> {
  if (isLoading.value) return
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return
  isLoading.value = true
  try {
    await userStore.login(form)
    await router.push(safeRedirect(route.query.redirect))
  } catch (error: unknown) {
    if (error instanceof Error && error.message === '登录失败，未返回令牌') {
      ElMessage.error(error.message)
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <main class="login-page">
    <section class="login-card">
      <header class="login-header">
        <h1 class="login-title">Merchant Client</h1>
        <p class="login-subtitle">欢迎登录</p>
      </header>

      <el-form ref="formRef" class="login-form" :model="form" :rules="rules" @submit.prevent="handleSubmit">
        <el-form-item prop="username">
          <el-input v-model="form.username" :prefix-icon="User" autocomplete="username" placeholder="账号" />
        </el-form-item>

        <el-form-item prop="password">
          <el-input v-model="form.password" :prefix-icon="Lock" type="password" show-password
            autocomplete="current-password" placeholder="密码" />
        </el-form-item>

        <el-form-item prop="googleCode" class="code-item">
          <el-input :model-value="form.googleCode" maxlength="6" inputmode="numeric" autocomplete="one-time-code"
            placeholder="Google验证码" @update:model-value="onGoogleInput">
            <template #prefix>
              <span class="g-mark">G</span>
            </template>
            <template #suffix>
              <span class="counter">{{ codeLength }} / 6</span>
            </template>
          </el-input>
          <p class="hint">如果绑定了Google验证码，请输入Google验证码</p>
        </el-form-item>

        <el-form-item class="submit-item">
          <el-button class="submit" type="primary" round native-type="submit" :loading="isLoading">登录</el-button>
        </el-form-item>
      </el-form>
    </section>
  </main>
</template>

<style scoped>
.login-page {
  position: relative;
  min-height: 100vh;
  overflow: hidden;
  background: #fff4e0 url('../assets/login-sun.jpg') center / cover no-repeat;
}

.login-card {
  position: absolute;
  top: 50%;
  right: 48px;
  z-index: 1;
  width: 340px;
  padding: 28px 26px 22px;
  transform: translateY(-50%);
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 10px 32px rgba(120, 72, 20, 0.14);
}

.login-header {
  margin-bottom: 22px;
  text-align: center;
}

.login-title {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
}

.login-subtitle {
  margin: 8px 0 0;
  color: var(--el-text-color-placeholder);
  font-size: 13px;
  line-height: 1.4;
}

.login-form :deep(.el-form-item) {
  margin-bottom: 18px;
}

.login-form :deep(.el-form-item__content) {
  line-height: normal;
}

.code-item :deep(.el-form-item__content) {
  flex-direction: column;
  align-items: stretch;
}

.g-mark {
  color: var(--el-text-color-placeholder);
  font-size: 14px;
  font-weight: 600;
  line-height: 1;
}

.counter {
  color: var(--el-text-color-placeholder);
  font-size: 12px;
  line-height: 1;
}

.hint {
  margin: 8px 0 0;
  color: var(--el-text-color-placeholder);
  font-size: 12px;
  line-height: 1.4;
}

.submit-item {
  margin-top: 6px;
  margin-bottom: 0;
}

.submit {
  width: 100%;
  height: 38px;
  letter-spacing: 2px;
}

@media (max-width: 760px) {
  .login-card {
    right: 50%;
    width: min(340px, calc(100vw - 32px));
    transform: translate(50%, -50%);
  }
}
</style>
