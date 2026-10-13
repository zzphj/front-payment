import { getInfo, login, logOut } from '@/api/login'
import type { LoginForm } from '@/types'
import { getToken, removeToken, setToken } from '@/utils/auth'
import { defineStore } from 'pinia'

// 刷新页面后，Pinia 里的数据会清空，Token 还在 Cookie 里。
// profileLoaded 用来区分“这次打开页面后，有没有拉过用户资料”。
interface UserState {
    token: string | undefined
    memberId: string
    realName: string
    roleName: string
    resources: string[]
    isBindPhone: boolean
    profileLoaded: boolean
}

const useUserStore = defineStore('user', {
    state: (): UserState => ({
        token: getToken(),
        memberId: '',
        realName: '',
        roleName: '',
        resources: [],
        isBindPhone: false,
        profileLoaded: false,
    }),
    getters: {
        displayName: (state) => state.realName || state.memberId || '用户',
    },
    actions: {
        async login(userinfo: LoginForm) {
            const res = await login(userinfo.username.trim(), userinfo.password, userinfo.googleCode)
            const data = res.data
            if (!data?.token) {
                throw new Error('登录失败，未返回令牌')
            }
            this.token = data.token
            this.memberId = data.memberId
            this.resources = data.resources ?? []
            this.isBindPhone = data.isBindPhone
            setToken(data.token)
        },
        async getInfo() {
            const res = await getInfo()
            const data = res.data
            if (!data) {
                throw new Error('获取用户信息失败')
            }
            if (data.memberId) this.memberId = data.memberId
            this.realName = data.realName ?? ''
            this.roleName = data.roleName ?? ''
            if (Array.isArray(data.resources)) this.resources = data.resources
            this.profileLoaded = true
        },
        clearSession() {
            this.token = undefined
            this.memberId = ''
            this.realName = ''
            this.roleName = ''
            this.resources = []
            this.isBindPhone = false
            this.profileLoaded = false
            removeToken()
        },
        async logOut() {
            try {
                await logOut()
            } finally {
                this.clearSession()
            }
        },
    },
})

export default useUserStore
