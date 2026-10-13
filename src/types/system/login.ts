import type { AjaxResult } from '../common'

export interface LoginForm {
    username: string
    password: string
    googleCode: string
}

export interface LoginInfoResult {
    isBindPhone: boolean
    memberId: string
    resources: string[]
    token: string
}

export interface UserInfoResult {
    realName?: string
    memberId?: string
    tenantId?: number
    roleId?: number
    roleName?: string
    resources?: string[]
}