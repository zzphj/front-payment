import request from '@/utils/request'
import md5 from 'crypto-js/md5'
import type { LoginInfoResult, UserInfoResult } from '@/types/index'
import type { AjaxResult } from '@/types/common'

// 登录方法
export function login(username: string, password: string, googleCode: string): Promise<AjaxResult<LoginInfoResult>> {
    const data = {
        username,
        password: md5(password).toString(),
        ...(googleCode ? { googleCode } : {}),
    }
    return request({
        url: '/member/signIn',
        headers: {
            isToken: false,
            repeatSubmit: false
        },
        method: 'post',
        data: data
    })
}

export function getInfo(): Promise<AjaxResult<UserInfoResult>> {
    return request({
        url: '/member/me',
        method: 'get',
    })
}

export function logOut(): Promise<AjaxResult<unknown>> {
    return request({
        url: '/member/signOut',
        method: 'get',
        headers: {
            skipErrorMessage: true,
        },
    })
}