import axios, { type InternalAxiosRequestConfig } from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import router from '@/router'
import useUserStore from '@/stores/user'
import { getToken } from '@/utils/auth'
import errorCode from '@/utils/errorCode'
import { logger } from '@/utils/logger'
import { tansParams } from '@/utils/ruoyi'

export const isRelogin = { show: false }

const REQUEST_SIZE_LIMIT = 5 * 1024 * 1024

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000,
})

interface AjaxBody {
  code?: number
  msg?: string
}

interface AppRequestConfig extends InternalAxiosRequestConfig {
  skipErrorMessage?: boolean
}

function readHeader(config: InternalAxiosRequestConfig, key: string): unknown {
  const headers = config.headers as unknown as Record<string, unknown>
  return headers[key]
}

function isHeaderTrue(value: unknown): boolean {
  return value === true || value === 'true'
}

function isHeaderFalse(value: unknown): boolean {
  return value === false || value === 'false'
}

function isAjaxBody(value: unknown): value is AjaxBody {
  return typeof value === 'object' && value !== null
}

function resolveBusinessCode(body: AjaxBody): number {
  return typeof body.code === 'number' ? body.code : 1
}

function resolveBusinessMessage(body: AjaxBody, code: number): string {
  return errorCode[String(code)] ?? body.msg ?? errorCode.default ?? '系统未知错误，请反馈给管理员'
}

function handleUnauthorized(): void {
  if (isRelogin.show) return
  isRelogin.show = true
  useUserStore().clearSession()
  ElMessage.warning('登录已过期，请重新登录')
  const current = router.currentRoute.value
  if (current.path === '/login') {
    isRelogin.show = false
    return
  }
  const redirect = encodeURIComponent(current.fullPath || '/')
  router.push(`/login?redirect=${redirect}`).finally(() => {
    isRelogin.show = false
  })
}

function isLoginExpired(status: number | undefined, code: number | undefined, message: string | undefined): boolean {
  return status === 401 || (code === 9 && message === 'notLogin')
}

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const appConfig = config as AppRequestConfig
    appConfig.skipErrorMessage = isHeaderTrue(readHeader(config, 'skipErrorMessage'))
    const skipToken = isHeaderFalse(readHeader(config, 'isToken'))
    const skipRepeatSubmit = isHeaderFalse(readHeader(config, 'repeatSubmit'))

    if (getToken() && !skipToken) {
      config.headers.Authorization = `Bearer ${getToken()}`
    }

    if (config.method === 'get' && config.params) {
      const params = config.params as Record<string, unknown>
      let url = `${config.url}?${tansParams(params)}`
      url = url.slice(0, -1)
      config.params = {}
      config.url = url
    }

    if (!skipRepeatSubmit && (config.method === 'post' || config.method === 'put')) {
      const requestText = JSON.stringify({
        url: config.url,
        data: typeof config.data === 'object' ? JSON.stringify(config.data) : config.data,
        time: Date.now(),
      })
      if (requestText.length >= REQUEST_SIZE_LIMIT) {
        logger.warn(`[${config.url ?? ''}] 请求数据超过 5MB，已跳过防重复提交校验`)
      }
    }

    return config
  },
  (error: unknown) => {
    logger.error('请求未发出', error)
    return Promise.reject(error)
  },
)

service.interceptors.response.use(
  (response) => {
    const body: unknown = response.data
    const appConfig = response.config as AppRequestConfig
    if (
      response.request?.responseType === 'blob' ||
      response.request?.responseType === 'arraybuffer'
    ) {
      return response.data
    }

    const payload = isAjaxBody(body) ? body : {}
    const code = resolveBusinessCode(payload)
    const message = resolveBusinessMessage(payload, code)

    if (isLoginExpired(undefined, code, payload.msg) || code === 401) {
      if (appConfig.skipErrorMessage !== true) handleUnauthorized()
      return Promise.reject(new Error('无效的会话，或者会话已过期，请重新登录。'))
    }
    if (appConfig.skipErrorMessage === true && code !== 1) {
      return Promise.reject(new Error(message))
    }
    if (code === 500) {
      ElMessage({ message, type: 'error' })
      return Promise.reject(new Error(message))
    }
    if (code === 601) {
      ElMessage({ message, type: 'warning' })
      return Promise.reject(new Error(message))
    }
    if (code !== 1) {
      ElNotification.error({ title: message })
      return Promise.reject(new Error(message))
    }
    return response.data
  },
  (error: unknown) => {
    const detail = readHttpError(error)
    if (
      detail.skipErrorMessage !== true &&
      isLoginExpired(detail.status, detail.businessCode, detail.businessMsg)
    ) {
      handleUnauthorized()
      return Promise.reject(error)
    }
    if (detail.skipErrorMessage === true) {
      return Promise.reject(error)
    }

    let message = detail.message || '系统接口异常'
    if (message === 'Network Error') {
      message = '后端接口连接异常'
    } else if (message.includes('timeout')) {
      message = '系统接口请求超时'
    } else if (message.includes('Request failed with status code')) {
      message = `系统接口${message.slice(-3)}异常`
    }
    ElMessage({ message, type: 'error', duration: 5 * 1000 })
    return Promise.reject(error)
  },
)

function readHttpError(error: unknown): {
  message: string
  status?: number
  businessCode?: number
  businessMsg?: string
  skipErrorMessage?: boolean
} {
  if (typeof error !== 'object' || error === null) {
    return { message: '系统接口异常' }
  }

  const record = error as {
    message?: string
    config?: AppRequestConfig
    response?: { status?: number; data?: unknown }
  }
  const data = isAjaxBody(record.response?.data) ? record.response.data : undefined
  return {
    message: record.message ?? '系统接口异常',
    status: record.response?.status,
    businessCode: data?.code,
    businessMsg: data?.msg,
    skipErrorMessage: record.config?.skipErrorMessage,
  }
}

export default service
