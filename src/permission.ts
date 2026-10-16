import { ElMessage } from 'element-plus'
import router from '@/router'
import useUserStore from '@/stores/user'
import { getToken } from '@/utils/auth'
import { isRelogin } from '@/utils/request'

const whiteList = ['/login']

function loginLocation(redirect: string) {
    return `/login?redirect=${encodeURIComponent(redirect)}`
}

function isUnauthorized(error: unknown) {
    if (typeof error === 'string' || error instanceof Error) {
        const message = typeof error === 'string' ? error : error.message
        return message.includes('重新登录') || message.includes('notLogin')
    }
    if (!error || typeof error !== 'object' || !('response' in error)) {
        return false
    }
    const response = (error as { response?: { status?: number; data?: { code?: number; msg?: string } } }).response
    return response?.status === 401 || response?.data?.code === 9 || response?.data?.msg === 'notLogin'
}

router.beforeEach(async (to) => {
    if (!getToken()) {
        if (whiteList.includes(to.path)) return true
        return loginLocation(to.fullPath)
    }

    if (to.path === '/login') {
        return { path: '/' }
    }

    const userStore = useUserStore()
    if (userStore.profileLoaded) return true

    isRelogin.show = true
    try {
        await userStore.getInfo()
        return true
    } catch (error) {
        if (isUnauthorized(error)) {
            ElMessage.warning('登录已过期，请重新登录')
            await userStore.logOut()
            return loginLocation(to.fullPath)
        }
        userStore.profileLoaded = true
        return true
    } finally {
        isRelogin.show = false
    }
})
