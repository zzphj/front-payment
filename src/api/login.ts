import request from '@/utils/request'
import md5 from 'crypto-js/md5'
import type { LoginInfoResult, UserInfoResult } from '@/types/index'

// 登录方法
export function login(username: string, password: string, googleCode: string): Promise<LoginInfoResult> {
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

export function getInfo(): Promise<UserInfoResult> {
    return request({
        url: '/getInfo',
        method: 'get'
    })
}

export function logOut(): Promise<void> {
    return request({
        url: '/logOut',
        method: 'post'
    })
}