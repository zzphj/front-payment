import type { n } from 'vue-router/dist/index-D7ja2BKs.js'
import type { AjaxResult } from '../common'

export interface LoginInfoResult extends AjaxResult {
    isBindPhone: boolean
    memberId: number
    resources: []
    /** 令牌 */
    token: string
}

export interface UserInfoResult extends AjaxResult {
    realName: string
    memberId: number
    tenantId: number
    roleId: number
    roleName: string
    permissions: []
}